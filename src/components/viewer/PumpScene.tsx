'use client';

import { Canvas, useFrame, useThree, type ThreeEvent } from '@react-three/fiber';
import { ContactShadows, Environment, Html, Lightformer, OrbitControls, useGLTF } from '@react-three/drei';
import { easing } from 'maath';
import { Suspense, useEffect, useMemo, useRef, type MutableRefObject } from 'react';
import * as THREE from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { MODEL_SCALE, MODEL_URL, hotspots, parts, views, type ViewId } from '@/content/pump-model';

export type ViewerMode = 'assembled' | 'exploded' | 'section';

export type SceneApi = {
  rotate: (azimuth: number, polar: number) => void;
  zoom: (factor: number) => void;
};

export type PumpSceneProps = {
  variant: 'hero' | 'full';
  mode: ViewerMode;
  view: { id: ViewId; nonce: number; focus?: [number, number, number] };
  selected: string | null;
  onSelect: (id: string | null) => void;
  reducedMotion: boolean;
  active: boolean;
  running: boolean;
  onReady: () => void;
  apiRef: MutableRefObject<SceneApi | null>;
  /** Stable DOM container for hotspot overlays, owned by the viewer shell. */
  overlayRef: MutableRefObject<HTMLDivElement | null>;
  /** Hotspot ids drawn with a visible text label. */
  labelled?: string[];
};

/** Flat colours for faces exposed by the section plane, one per material. */
const CAP_COLOR: Record<string, string> = { housing: '#8fa6ba', polymer: '#6d7177', rubber: '#55585c', steel: '#d9dde0' };

const materialSpec: Record<string, THREE.MeshPhysicalMaterialParameters> = {
  housing: { color: '#41586b', roughness: 0.42, metalness: 0.05, clearcoat: 0.35, clearcoatRoughness: 0.35 },
  polymer: { color: '#1d1f22', roughness: 0.58, metalness: 0 },
  rubber: { color: '#141516', roughness: 0.78, metalness: 0 },
  steel: { color: '#cfd4d8', roughness: 0.26, metalness: 1 },
};

export default function PumpScene(props: PumpSceneProps) {
  const { running, active, variant } = props;
  return (
    <Canvas
      frameloop={running ? 'always' : 'never'}
      dpr={[1, 1.75]}
      camera={{ position: views.iso.position, fov: 32, near: 0.1, far: 60 }}
      gl={{ antialias: true, localClippingEnabled: true, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
      }}
      style={{ touchAction: active ? 'none' : 'pan-y', pointerEvents: active ? 'auto' : 'none' }}
      data-variant={variant}
    >
      <Suspense fallback={null}>
        <Stage {...props} />
      </Suspense>
    </Canvas>
  );
}

function Stage(props: PumpSceneProps) {
  const { reducedMotion, view, apiRef, onReady, mode } = props;
  const controls = useRef<OrbitControlsImpl>(null);
  const { camera, invalidate, size } = useThree();
  // Narrow (portrait) viewports need the camera further back to keep the whole pump in frame.
  const aspectFit = THREE.MathUtils.clamp(1.45 / (size.width / Math.max(size.height, 1)), 1, 1.9);
  const anim = useRef<{ pos: THREE.Vector3; target: THREE.Vector3 } | null>(null);
  const first = useRef(true);

  // Animate the camera to a preset whenever a view is requested. A focus point
  // keeps the preset's viewing direction but centres on one component.
  useEffect(() => {
    const v = views[view.id];
    const presetPos = new THREE.Vector3(...v.position);
    const presetTarget = new THREE.Vector3(...v.target);
    const dir = presetPos.clone().sub(presetTarget);
    let target = presetTarget;
    let distance = dir.length();
    if (view.focus) {
      target = new THREE.Vector3(...view.focus);
      distance *= 0.78;
    } else if (mode === 'exploded') {
      target = presetTarget.clone().add(new THREE.Vector3(0, 0.15, -0.1));
      distance *= 1.38;
    }
    const pos = target.clone().add(dir.setLength(distance * aspectFit));
    if (first.current || reducedMotion) {
      camera.position.copy(pos);
      controls.current?.target.copy(target);
      controls.current?.update();
      anim.current = null;
      first.current = false;
    } else {
      anim.current = { pos, target };
    }
    invalidate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, camera, reducedMotion, invalidate, aspectFit]);

  useFrame((_, dt) => {
    const a = anim.current;
    const c = controls.current;
    if (!a || !c) return;
    easing.damp3(camera.position, a.pos, 0.32, dt);
    easing.damp3(c.target, a.target, 0.32, dt);
    c.update();
    if (camera.position.distanceTo(a.pos) < 0.005 && c.target.distanceTo(a.target) < 0.005) anim.current = null;
  });

  useEffect(() => {
    apiRef.current = {
      rotate: (az, po) => {
        const c = controls.current;
        if (!c) return;
        anim.current = null;
        const offset = camera.position.clone().sub(c.target);
        const s = new THREE.Spherical().setFromVector3(offset);
        s.theta += az;
        s.phi = THREE.MathUtils.clamp(s.phi + po, 0.05, Math.PI - 0.05);
        offset.setFromSpherical(s);
        camera.position.copy(c.target).add(offset);
        c.update();
      },
      zoom: (f) => {
        const c = controls.current;
        if (!c) return;
        anim.current = null;
        const offset = camera.position.clone().sub(c.target);
        const len = THREE.MathUtils.clamp(offset.length() * f, c.minDistance, c.maxDistance);
        camera.position.copy(c.target).add(offset.setLength(len));
        c.update();
      },
    };
    return () => {
      apiRef.current = null;
    };
  }, [apiRef, camera]);

  return (
    <>
      <color attach="background" args={['#0f1823']} />
      <fog attach="fog" args={['#0f1823', 9, 22]} />
      <ambientLight intensity={0.25} />
      <directionalLight position={[-4, 6, 4]} intensity={1.6} />
      <directionalLight position={[5, 2, -3]} intensity={0.6} color="#b9c9da" />
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={2.2} position={[0, 5, 1]} scale={[8, 3, 1]} rotation-x={Math.PI / 2} />
        <Lightformer form="rect" intensity={1.4} position={[-5, 1.5, 2]} scale={[2, 6, 1]} rotation-y={Math.PI / 2} />
        <Lightformer form="rect" intensity={0.9} position={[5, 1, -1]} scale={[2, 6, 1]} rotation-y={-Math.PI / 2} />
        <Lightformer form="rect" intensity={0.5} color="#e8a26c" position={[0, 1, -6]} scale={[6, 2, 1]} />
      </Environment>
      <Model {...props} onReady={onReady} />
      <ContactShadows key={mode} position={[0, -0.002, -0.6]} opacity={0.55} scale={7} blur={2.4} far={2} frames={1} resolution={512} color="#000000" />
      <gridHelper args={[12, 24, '#22344a', '#182634']} position={[0, -0.004, -0.6]} />
      <OrbitControls
        ref={controls}
        makeDefault
        enableDamping={!reducedMotion}
        dampingFactor={0.09}
        rotateSpeed={0.7}
        zoomSpeed={0.8}
        enablePan={false}
        minDistance={1.6}
        maxDistance={11}
        maxPolarAngle={Math.PI * 0.62}
        onStart={() => {
          anim.current = null;
        }}
      />
    </>
  );
}

type GLTFNodes = Record<string, THREE.Object3D & { geometry?: THREE.BufferGeometry }>;

function Model({ mode, selected, onSelect, reducedMotion, onReady, variant, labelled, overlayRef }: PumpSceneProps) {
  const gltf = useGLTF(MODEL_URL);
  const nodes = gltf.nodes as GLTFNodes;
  const clipPlane = useMemo(() => new THREE.Plane(new THREE.Vector3(1, 0, 0), 0.8), []);
  const groups = useRef<Record<string, THREE.Group | null>>({});

  const materials = useMemo(() => {
    const m: Record<string, { surface: THREE.MeshPhysicalMaterial; cap: THREE.MeshBasicMaterial }> = {};
    for (const p of parts) {
      const surface = new THREE.MeshPhysicalMaterial({ ...materialSpec[p.material], clippingPlanes: [clipPlane], side: THREE.FrontSide });
      const cap = new THREE.MeshBasicMaterial({ color: CAP_COLOR[p.material], side: THREE.BackSide, clippingPlanes: [clipPlane] });
      m[p.id] = { surface, cap };
    }
    return m;
  }, [clipPlane]);

  useEffect(() => {
    onReady();
    return () => {
      Object.values(materials).forEach(({ surface, cap }) => {
        surface.dispose();
        cap.dispose();
      });
    };
  }, [materials, onReady]);

  const selectedPart = selected ? hotspots.find((h) => h.id === selected)?.part ?? null : null;

  useFrame((_, dt) => {
    const k = reducedMotion ? 1 : Math.min(1, dt * 6);
    const exploded = mode === 'exploded' ? 1 : 0;
    for (const p of parts) {
      const g = groups.current[p.id];
      if (g) {
        const tx = p.explode[0] * exploded;
        const ty = p.explode[1] * exploded;
        const tz = p.explode[2] * exploded;
        g.position.x += (tx - g.position.x) * k;
        g.position.y += (ty - g.position.y) * k;
        g.position.z += (tz - g.position.z) * k;
      }
      const mat = materials[p.id].surface;
      const targetOpacity = selectedPart && selectedPart !== p.id ? 0.2 : 1;
      const o = mat.opacity + (targetOpacity - mat.opacity) * k;
      mat.opacity = Math.abs(o - targetOpacity) < 0.01 ? targetOpacity : o;
      const transparent = mat.opacity < 0.999;
      if (mat.transparent !== transparent) {
        mat.transparent = transparent;
        mat.depthWrite = !transparent;
        mat.needsUpdate = true;
      }
    }
    const targetC = mode === 'section' ? 0 : 0.8;
    clipPlane.constant += (targetC - clipPlane.constant) * k;
    if (Math.abs(clipPlane.constant - targetC) < 0.001) clipPlane.constant = targetC;
  });

  const handleClick = (partId: string) => (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (e.delta > 4) return; // a drag, not a click
    const first = hotspots.find((h) => h.part === partId);
    if (first) onSelect(first.id === selected ? null : first.id);
  };

  return (
    <group>
      {parts.map((p) => (
        <group key={p.id} ref={(g) => void (groups.current[p.id] = g)}>
          <group scale={MODEL_SCALE}>
            {p.nodes.map((n) =>
              nodes[n]?.geometry ? (
                // Node transforms carry the meshopt dequantisation (scale and offset), so keep them.
                <group key={n} position={nodes[n].position} quaternion={nodes[n].quaternion} scale={nodes[n].scale}>
                  <mesh geometry={nodes[n].geometry} material={materials[p.id].surface} onClick={handleClick(p.id)} />
                  {mode === 'section' && <mesh geometry={nodes[n].geometry} material={materials[p.id].cap} />}
                </group>
              ) : null,
            )}
          </group>
          {hotspots
            .filter((h) => h.part === p.id && (variant === 'full' || labelled?.includes(h.id)))
            .map((h) => {
              const index = hotspots.indexOf(h) + 1;
              const showLabel = variant === 'full' ? selected === h.id : true;
              return (
                <Html key={h.id} position={h.anchor} portal={overlayRef as MutableRefObject<HTMLElement>} zIndexRange={[20, 0]} center={false} style={{ pointerEvents: 'none' }}>
                  {/* Kept mounted in section view (drei Html must not unmount mid-render); hidden with CSS instead. */}
                  <div className={`hs ${selected === h.id ? 'is-selected' : ''} ${variant === 'hero' ? 'hs--hero' : ''}`} hidden={mode === 'section'}>
                    <button
                      type="button"
                      className="hs__dot"
                      style={{ pointerEvents: 'auto' }}
                      aria-label={`${h.label}: show details`}
                      aria-pressed={selected === h.id}
                      onClick={() => onSelect(selected === h.id ? null : h.id)}
                    >
                      {variant === 'full' ? index : ''}
                    </button>
                    {showLabel && (
                      <span className="hs__label">
                        <span className="hs__name">{h.label}</span>
                        {h.measure && <span className="hs__measure">{h.measure}</span>}
                      </span>
                    )}
                  </div>
                </Html>
              );
            })}
        </group>
      ))}
    </group>
  );
}
