'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import { Component, useCallback, useEffect, useRef, useState, type ReactNode, type KeyboardEvent } from 'react';
import { hotspots, modelFacts, notModelled, parts, views, type ViewId } from '@/content/pump-model';
import type { SceneApi, ViewerMode } from './PumpScene';
import styles from './PumpViewer.module.css';

const PumpScene = dynamic(() => import('./PumpScene'), { ssr: false, loading: () => null });

type Props = {
  variant: 'hero' | 'full';
  /** Accessible name for the viewer region. */
  label: string;
  className?: string;
};

type Status = 'idle' | 'loading' | 'ready' | 'unsupported' | 'error';

const FALLBACK = {
  hero: '/images/reference-pump-iso.webp',
  full: '/images/reference-pump-iso.webp',
};

const MODES: { id: ViewerMode; label: string }[] = [
  { id: 'assembled', label: 'Assembled' },
  { id: 'exploded', label: 'Exploded' },
  { id: 'section', label: 'Section' },
];

function hasWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

class SceneBoundary extends Component<{ onError: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: unknown) {
    console.error('3D viewer failed', error);
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export default function PumpViewer({ variant, label, className }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const apiRef = useRef<SceneApi | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [mounted, setMounted] = useState(false);
  const [inView, setInView] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [coarse, setCoarse] = useState(false);
  const [touchActive, setTouchActive] = useState(false);
  const [mode, setMode] = useState<ViewerMode>('assembled');
  const [view, setView] = useState<{ id: ViewId; nonce: number; focus?: [number, number, number] }>({ id: 'iso', nonce: 0 });
  const [selected, setSelected] = useState<string | null>(null);
  const [fullscreen, setFullscreen] = useState(false);

  // Environment checks and lazy mounting.
  useEffect(() => {
    const rm = window.matchMedia('(prefers-reduced-motion: reduce)');
    const cp = window.matchMedia('(pointer: coarse)');
    const sync = () => {
      setReducedMotion(rm.matches);
      setCoarse(cp.matches);
    };
    sync();
    rm.addEventListener('change', sync);
    cp.addEventListener('change', sync);
    if (!hasWebGL()) setStatus('unsupported');
    const onVis = () => setPageVisible(document.visibilityState === 'visible');
    document.addEventListener('visibilitychange', onVis);
    const onFs = () => setFullscreen(document.fullscreenElement === root.current);
    document.addEventListener('fullscreenchange', onFs);
    return () => {
      rm.removeEventListener('change', sync);
      cp.removeEventListener('change', sync);
      document.removeEventListener('visibilitychange', onVis);
      document.removeEventListener('fullscreenchange', onFs);
    };
  }, []);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting) setMounted(true);
      },
      { rootMargin: '200px 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (mounted && status === 'idle') setStatus('loading');
  }, [mounted, status]);

  const onReady = useCallback(() => setStatus((s) => (s === 'loading' || s === 'idle' ? 'ready' : s)), []);
  const onError = useCallback(() => setStatus('error'), []);

  const select = useCallback(
    (id: string | null) => {
      setSelected(id);
      if (!id) return;
      const h = hotspots.find((x) => x.id === id);
      if (!h) return;
      const off = mode === 'exploded' ? parts.find((p) => p.id === h.part)?.explode ?? [0, 0, 0] : [0, 0, 0];
      const focus: [number, number, number] = [h.anchor[0] + off[0], h.anchor[1] + off[1], h.anchor[2] + off[2]];
      if (mode === 'section') setMode('assembled');
      setView((v) => ({ id: h.view, nonce: v.nonce + 1, focus }));
    },
    [mode],
  );

  const changeMode = (m: ViewerMode) => {
    setMode(m);
    setSelected(null);
    setView((v) => ({ id: m === 'section' ? 'side' : 'iso', nonce: v.nonce + 1 }));
  };

  const reset = () => {
    setSelected(null);
    setMode('assembled');
    setView((v) => ({ id: 'iso', nonce: v.nonce + 1 }));
  };

  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await root.current?.requestFullscreen();
    } catch {
      /* Fullscreen not permitted; the viewer keeps working inline. */
    }
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return;
    const api = apiRef.current;
    if (!api) return;
    const step = 0.12;
    const map: Record<string, () => void> = {
      ArrowLeft: () => api.rotate(-step, 0),
      ArrowRight: () => api.rotate(step, 0),
      ArrowUp: () => api.rotate(0, -step),
      ArrowDown: () => api.rotate(0, step),
      '+': () => api.zoom(0.88),
      '=': () => api.zoom(0.88),
      '-': () => api.zoom(1.14),
      Escape: () => select(null),
    };
    const fn = map[e.key];
    if (fn) {
      e.preventDefault();
      fn();
    }
  };

  const showCanvas = mounted && status !== 'unsupported' && status !== 'error';
  const ready = status === 'ready';
  const interactive = !coarse || touchActive;
  const sel = hotspots.find((h) => h.id === selected) ?? null;
  const isFull = variant === 'full';

  const stage = (
    <div
      className={styles.stage}
      tabIndex={ready ? 0 : -1}
      role="application"
      aria-label={`${label}. Use arrow keys to rotate, plus and minus to zoom.`}
      aria-describedby={isFull ? 'viewer-help' : undefined}
      onKeyDown={onKeyDown}
    >
      <Image
        src={FALLBACK[variant]}
        alt="Rendered view of the reference submersible pump model: tapered housing, black pump end with perforated intake and threaded outlet, and coiled power cord."
        fill
        sizes={isFull ? '(min-width: 1100px) 66vw, 100vw' : '(min-width: 1100px) 55vw, 100vw'}
        className={`${styles.fallback} ${ready ? styles.fallbackHidden : ''}`}
        priority={variant === 'hero'}
      />
      {showCanvas && (
        <SceneBoundary onError={onError}>
          <PumpScene
            variant={variant}
            mode={mode}
            view={view}
            selected={selected}
            onSelect={select}
            reducedMotion={reducedMotion}
            active={interactive}
            running={inView && pageVisible}
            onReady={onReady}
            apiRef={apiRef}
            overlayRef={overlayRef}
            labelled={variant === 'hero' ? ['discharge', 'intake', 'housing'] : undefined}
          />
        </SceneBoundary>
      )}

      <div ref={overlayRef} className={styles.overlay} />

      {status === 'loading' && (
        <div className={styles.loading} role="status">
          <span className={styles.loadingBar} />
          <span>Loading 3D model</span>
        </div>
      )}
      {(status === 'unsupported' || status === 'error') && (
        <p className={styles.notice} role="status">
          {status === 'unsupported'
            ? '3D view needs WebGL, which this browser has disabled. Showing a rendered image of the model.'
            : 'The 3D model could not be displayed. Showing a rendered image of the model.'}
        </p>
      )}

      {ready && coarse && (
        <button type="button" className={`${styles.touchToggle} ${touchActive ? styles.touchOn : ''}`} onClick={() => setTouchActive((a) => !a)} aria-pressed={touchActive}>
          {touchActive ? 'Done' : 'Tap to rotate and zoom'}
        </button>
      )}

      {ready && (
        <div className={styles.tools} aria-label="Camera controls" role="toolbar">
          <button type="button" onClick={() => apiRef.current?.zoom(0.85)} aria-label="Zoom in" title="Zoom in">
            <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 3v10M3 8h10" /></svg>
          </button>
          <button type="button" onClick={() => apiRef.current?.zoom(1.18)} aria-label="Zoom out" title="Zoom out">
            <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h10" /></svg>
          </button>
          <button type="button" onClick={reset} aria-label="Reset view" title="Reset view">
            <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 6.5A5 5 0 1 1 3 9" /><path d="M3 3v3.5h3.5" /></svg>
          </button>
          {isFull && (
            <button type="button" onClick={toggleFullscreen} aria-label={fullscreen ? 'Exit full screen' : 'Full screen'} title={fullscreen ? 'Exit full screen' : 'Full screen'}>
              <svg viewBox="0 0 16 16" aria-hidden="true">
                {fullscreen ? <path d="M6 2v4H2M10 2v4h4M6 14v-4H2M10 14v-4h4" /> : <path d="M2 6V2h4M14 6V2h-4M2 10v4h4M14 10v4h-4" />}
              </svg>
            </button>
          )}
        </div>
      )}

      <p className={styles.caption}>
        <span className={styles.captionTag}>Reference CAD model</span>
        <span>{mode === 'section' ? 'Section through supplied solids' : 'Geometry from supplied STEP file'}</span>
      </p>

      {!isFull && sel && (
        <div className={styles.heroCard} role="status">
          <p className={styles.heroCardTitle}>{sel.label}</p>
          <p>{sel.summary}</p>
          <a href="#explorer">Open in explorer</a>
        </div>
      )}
    </div>
  );

  if (!isFull) {
    return (
      <div ref={root} className={`${styles.viewer} ${styles.hero} ${className ?? ''}`} role="group" aria-label={label}>
        {stage}
      </div>
    );
  }

  return (
    <div ref={root} className={`${styles.viewer} ${styles.full} ${fullscreen ? styles.isFullscreen : ''} ${className ?? ''}`} role="group" aria-label={label}>
      <div className={styles.bar}>
        <div className={styles.segment} role="radiogroup" aria-label="Model state">
          {MODES.map((m) => (
            <button key={m.id} type="button" role="radio" aria-checked={mode === m.id} onClick={() => changeMode(m.id)} disabled={!ready}>
              {m.label}
            </button>
          ))}
        </div>
        <div className={styles.segment} role="radiogroup" aria-label="Camera view">
          {(Object.keys(views) as ViewId[]).map((id) => (
            <button key={id} type="button" role="radio" aria-checked={view.id === id} onClick={() => setView((v) => ({ id, nonce: v.nonce + 1 }))} disabled={!ready}>
              {views[id].label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.body}>
        {stage}

        <aside className={styles.panel} aria-label="Model components">
          <ol className={styles.parts}>
            {hotspots.map((h, i) => (
              <li key={h.id}>
                <button type="button" className={styles.part} aria-pressed={selected === h.id} onClick={() => select(selected === h.id ? null : h.id)}>
                  <span className={styles.partNo}>{String(i + 1).padStart(2, '0')}</span>
                  <span className={styles.partName}>{h.label}</span>
                  {h.measure && <span className={styles.partMeasure}>{h.measure}</span>}
                </button>
              </li>
            ))}
          </ol>

          <div className={styles.detail} aria-live="polite">
            {sel ? (
              <>
                <h3>{sel.label}</h3>
                <p className={styles.detailLead}>{sel.summary}</p>
                <p>{sel.detail}</p>
              </>
            ) : mode === 'section' ? (
              <>
                <h3>Section view</h3>
                <p>
                  The model is cut on its vertical centre plane and the cut faces are shown flat. In the supplied STEP file the housing is a single solid body, so its section is solid:
                  the file describes the exterior of the pump, not its internals. The parts listed below are described but not drawn.
                </p>
              </>
            ) : mode === 'exploded' ? (
              <>
                <h3>Exploded view</h3>
                <p>The four bodies defined in the CAD are separated along their assembly directions: pump end forward, cover screws upward, power cord to the rear.</p>
              </>
            ) : (
              <>
                <h3>Select a component</h3>
                <p>Choose a numbered marker on the model or an item in the list to see what it does and where it sits.</p>
              </>
            )}
          </div>

          <div className={styles.hidden}>
            <h4>Internal parts, not in the CAD</h4>
            <ul>
              {notModelled.map((n) => (
                <li key={n.name}>
                  <span>{n.name}</span>
                  <span>{n.note}</span>
                </li>
              ))}
            </ul>
          </div>

          <dl className={styles.facts}>
            {modelFacts.map((f) => (
              <div key={f.label}>
                <dt>{f.label}</dt>
                <dd>{f.value}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </div>
      <p id="viewer-help" className={styles.help}>
        Drag to rotate. Scroll or pinch to zoom. Keyboard: focus the model, then use the arrow keys to rotate and plus or minus to zoom.
      </p>
    </div>
  );
}
