# CAD pipeline: STEP to web GLB

Source: `source/reference-pump.step` (the supplied file, SolidWorks 2023, STEP AP214, inch units).
It contains 7 solid bodies and describes the **exterior** of a compact submersible utility pump.
The housing is a single solid; no motor, shaft, impeller or seal geometry exists in the file.

## Steps

```bash
npm install
npm run all
```

1. `1-tessellate.mjs`: OpenCascade (occt-import-js, WASM) reads the STEP and tessellates each B-rep body in millimetres
   (bounding-box-relative deflection 0.0015, angular 0.25 rad).
2. `2-build-glb.mjs`: names the bodies, recentres the model (housing footprint centre, y = 0 at housing base),
   converts to metres, welds, simplifies with meshoptimizer (error budget 0.0004), and writes a meshopt-compressed GLB.
   Copies the result to `public/models/reference-pump.glb`.
3. `3-measure.mjs`: prints body bounds and feature measurements used for the viewer annotations.

## Body identification

The STEP body names are lost in tessellation, so bodies were identified by their bounds:

| GLB node | STEP body | Bounds (mm, W × H × D) |
|---|---|---|
| `housing` | `Fillet7` | 112.5 × 139 × 124.5 |
| `pump_end` | `Thread1` (pump end with threaded spigot) | 90 × 113 × 63 |
| `cord` | `<Cord>-<Imported1>` | 67.5 × 120 × 244 |
| `screw_1..4` | `Sketch-Pattern1[1..3]`, truss head screw | 6.5 × 4.8 × 6.5 each |

## Measurements used in the site

- Housing: 112.5 W × 139 H × 124.5 D mm
- Housing plus pump end length: 188 mm
- Intake face: 70 × 70 mm
- Discharge spigot: Ø21.6 mm across the thread (thread standard not specified in the file)
- Output: about 52,000 triangles, 420 KB compressed

Note on GLB loading: meshopt quantisation stores a dequantisation transform on each node.
The viewer applies each node's position, rotation and scale; using the geometry alone renders the model at the wrong scale.
