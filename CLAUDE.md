# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## About

Kremenchuk Public Transport — a React SPA that shows buses, trolleybuses, and other public transport on a Google Map in real time. Transport locations poll every 3 seconds; routes and bus lists are loaded once on mount.

## Commands

```bash
npm start          # Dev server (default port 8080, override with PORT or APP_PORT)
npm run dist       # Production build → dist/
npm run test       # Jest test suite
npm run lint       # Type check + ESLint --fix + Prettier --write (all three)
npm run lint:types # TypeScript type check only
npm run lint:eslint # ESLint --fix only
npm run lint:format # Prettier --write only
```

Run a single test file:
```bash
npx jest src/path/to/file.test.ts
```

## Architecture

### Build

Uses esbuild directly (no Vite/Webpack) via `esbuild.js`. The dev server is a custom HTTP proxy that serves `index.html` for all 404s (SPA fallback). Production output is a single `dist/app.js` with hash-based cache busting. PostCSS (Tailwind + Autoprefixer) is integrated as an esbuild plugin. Markdown and SVG files are loaded as raw text strings.

### Data flow

`src/core/api/` exports a single pre-configured Axios instance pointing to `https://api.husky-dev.me/`. All transport endpoints live under `transport/` (routes, buses, locations, station predictions) and equipment under `equipment/`.

The main `Map` page (`src/pages/Map/`) drives the whole data cycle:
- On mount: parallel fetch of routes + buses (`fullUpdate`)
- Every 3 s: fetch only bus locations (`locationsUpdate`) — locations are a sparse dict keyed by bus ID, merged into the buses array
- State is persisted to `localStorage` via `src/utils/storage.ts`, which uses type guards to validate data on read

### State management

No Redux or Zustand. All state lives in `useState`/`useContext` in the Map page and passed down as props. `ThemeProvider` (in `src/components/Layout/`) is the only context. `src/utils/storage.ts` wraps `localStorage` with versioned keys and type guards to prevent stale/invalid reads.

### Map rendering

Google Maps via `@vis.gl/react-google-maps`. POI and transit layers are hidden to keep the map clean. Bus markers are dynamically generated SVGs (base64-encoded data URIs) with per-route colors and rotation based on heading. Route paths are rendered as `Polyline` overlays. Clicking a station marker fetches real-time arrival predictions.

### Routing and content pages

Three routes (`/`, `/about`, `/privacy`) defined in `src/pages/routes.ts`. The About and Privacy pages import `.md` files as text strings, parse them with `marked`, and sanitize output with DOMPurify.

### Styling

Tailwind CSS v4 + DaisyUI. Helper utilities in `src/utils/styles.ts`: `mc()` merges conditional class names, `ms()` merges style objects. Color sets for routes come from the API; when a bus is offline, a `lightGrey` color set replaces the route color. Route sorting (`src/core/transport/`) extracts numeric prefixes for stable ordering and groups trolleybuses (Т prefix) separately.

### Path alias

`@/*` maps to `src/*` in both TypeScript and esbuild.

## Environment

`MAPS_API_KEY` env var is required for Google Maps. Set it in `.env`.

## Coding conventions

See `.claude/rules/react.md` and `.claude/rules/typescript.md` for enforced patterns. Key points:
- Arrow functions everywhere; no `function` declarations
- `interface` for props (not `type`), extending `StyleProps` and `TestIdProps` where applicable
- `undefined` over `null`; optional props (`?`) over `| undefined` unions
- PascalCase for module-level constants (`const PingIntervalMs = 3000`)
- Zod schemas derive their types via `z.infer` — never write a parallel interface for a Zod-validated shape
- `@typescript-eslint/consistent-type-assertions` is set to `assertionStyle: 'never'` — avoid type assertions
