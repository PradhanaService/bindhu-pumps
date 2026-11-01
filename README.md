# Industrial pump company website

Next.js 15 (App Router) + React 19 + TypeScript, with a real-time 3D pump explorer built on
React Three Fiber, using geometry converted from the supplied STEP file.

> **Before launch, read `CONTENT-AUDIT.md`.** The reference site could not be reached from the build
> environment, so all business-specific facts are marked "To be confirmed" rather than invented.
> "Ferrovane" is a temporary working name, defined once in `src/content/site.ts`.

## Run

```bash
npm install
npm run dev          # http://localhost:3000
npm run build && npm start
npm run typecheck
```

Copy `.env.example` to `.env.local` and configure enquiry delivery (webhook or Resend email).

## Structure

```
src/
  content/            All site content as typed data (edit here, not in components)
    site.ts           Brand, contact details, company facts
    products.ts       Five categories: overview, construction, features, specs, applications
    applications.ts   Sectors, applications, category mapping
    services.ts       Service offerings
    pump-model.ts     3D model parts, hotspots, camera views, measured dimensions
  components/
    viewer/           PumpViewer (shell: lazy-load, fallback, controls, panel) + PumpScene (R3F)
    schematics/       SVG installation schematics per category
    EnquiryForm.tsx   Validated form with real submission states
  lib/enquiry.ts      Shared client/server validation
  app/                Routes, global design system (globals.css, chrome.css), page CSS modules
    api/enquiry/      POST endpoint: validates, rate-limits, delivers via webhook or Resend
scripts/cad/          Reproducible STEP to GLB pipeline (see its README)
public/models/        reference-pump.glb (meshopt-compressed, 420 KB)
public/images/        Static fallback render of the model
```

## Pages

`/` home · `/products` · `/products/[slug]` (5 categories, one template) · `/applications` · `/company` ·
`/service` · `/contact` (accepts `?product=` and `?application=` to prefill) · `/privacy` · `/terms` ·
`sitemap.xml` · `robots.txt`

## 3D explorer

- Geometry: 7 solids from the supplied STEP file (housing, pump end, cord, 4 cover screws). No invented internals.
- Drag or touch to rotate, wheel or pinch to zoom, arrow keys and +/- on a focused model.
- Hotspots and a component list with engineering descriptions and dimensions measured from the CAD.
- Assembled, exploded (bodies separated along assembly directions) and section (clipping plane with capped cut faces).
- Five camera views, reset, zoom buttons, full screen.
- Performance: the viewer code is split out of the main bundle and mounts only when near the viewport.
  It stops rendering when off-screen or when the tab is hidden, and caps device pixel ratio at 1.75.
- Fallbacks: a static render shows while loading and replaces the canvas if WebGL is unavailable or errors.
- Touch: on coarse pointers the model needs a "Tap to rotate and zoom" activation, so page scrolling is never trapped.
- `prefers-reduced-motion`: camera and explode transitions become instant.

## Enquiries

`POST /api/enquiry` validates input with the same rules as the client, rejects bots with a honeypot,
and rate-limits by IP (in memory; use a shared store if running several instances).
Success is shown only after the configured delivery target accepts the enquiry. With no delivery configured,
it returns `503 not_configured` and the form says plainly that the enquiry was not sent.

## Search

Pages have metadata, canonical URLs, Organization JSON-LD, a sitemap and robots rules.
While `brand.isPlaceholder` is `true`, the site sends `noindex` and robots disallows crawling.
