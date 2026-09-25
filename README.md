# Unsource Engine 6

A browser-based 3D scene editor built with React, TypeScript, Three.js, React Three Fiber, Drei, and Zustand.

## What's implemented (Phase 1 foundation)

- Project manager: create, open, duplicate, delete, import/export projects as JSON, saved to `localStorage`
- Real Three.js viewport (React Three Fiber) with orbit camera, grid, axes
- Lightweight preview lighting (no real-time shadow maps) so the viewport reads as a modeling preview rather than a game-engine render — full lit/shadowed output is the job of the render pipeline (next phase)
- Scene hierarchy: select, rename, duplicate, hide/show, delete
- Add menu: Cube, Sphere, Plane, Cylinder, Cone, Torus, Point Light, Sun
- Transform gizmos (move / rotate / scale) with optional snapping, synced live to the Inspector
- Inspector: transform fields + PBR material controls (color, metalness, roughness) or light controls (color, intensity)
- Keyboard shortcuts: `W` move, `E` rotate, `R` scale, `F` focus selected, `Delete` remove, `Ctrl/Cmd+S` save
- Resizable, closable Hierarchy/Inspector panels (drag the edge to resize, ✕ to hide, click the thin edge tab to bring back)
- Responsive layout: on phone-width screens the side panels become "Objects" / "Properties" bottom sheets instead of sidebars
- PNG snapshot of the current view (fixed: canvas now renders with `preserveDrawingBuffer` so the download isn't blank), project export/import as JSON

**Not yet built** (see the original spec's Phase 12–20): animation timeline, Three.js path tracer, Babylon.js PBR renderer, render window (resolution/samples/output format), video export, undo/redo, GLTF import, command palette. These are the next planned phases.

## Local development

```bash
npm install
npm run dev
```

## Deploying to Cloudflare Pages via GitHub

1. Push this project to a new GitHub repository (see below).
2. In the Cloudflare dashboard: **Workers & Pages → Create → Pages → Connect to Git**, and pick the repo.
3. Framework preset: **Vite**. Cloudflare should fill these in automatically — confirm they match:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
4. Deploy. Cloudflare will run `npm install && npm run build` and serve the `dist/` folder on every push.

### Pushing to GitHub from this folder

```bash
git init
git add .
git commit -m "Unsource Engine 6 — Phase 1 foundation"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

No environment variables or secrets are required — everything runs client-side and persists to the browser's `localStorage`.
