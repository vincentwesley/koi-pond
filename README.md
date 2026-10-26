# Koi Pond

A living koi pond in the browser. The water, light and season follow your own clock and calendar: sandy and warm in the morning, amber at golden hour, lavender at dusk, a firefly night with a moon streak, autumn leaves, spring blossom, summer lotus and dragonflies, winter ice. Tap or drag to make ripples; koi swim over to investigate and eat the food you drop.

Live: https://vincentwesley.github.io/koi-pond/ (embeddable canvas-only mode: `?embed=1`).

- Ripple height-field simulation on the GPU with refraction, soft shadows and bloom. Works without float render targets (falls back to packed RGBA8).
- Ink-outlined koi (kohaku, asagi, ogon, showa, shusui, sanke, tancho, kumonryu, doitsu, chagoi) with long butterfly-style fins, swimming alone or in loose pairs.
- Mood engine (`src/mood.ts`): time of day and season from the local clock, no network. Override with `?time=dawn|day|golden|dusk|night` and `?season=spring|summer|autumn|winter`.
- Lotus leaves and blooms, dragonflies, drifting leaves and petals, fireflies at dusk and night, floating food pellets.
- Optional sound, synthesised in code, off until you turn it on; the ambience (water, wind, crickets) follows the mood.
- `?embed=1`: canvas only, fills the viewport, pauses when hidden or off-screen, one still frame under reduced motion, vertical swipes scroll the host page.
- Adaptive resolution and a device-pixel-ratio cap (1.5 embedded, 2 standalone) keep it smooth on phones.

Built from scratch with Vite, TypeScript and raw WebGL2. No libraries at runtime.

## Run

```bash
npm ci --ignore-scripts
npm run dev        # local dev server
npm run typecheck
npm test           # unit tests (spine, ripple, drift)
npm run build      # static site in dist/
npm run e2e        # Playwright + axe (builds first; needs Playwright's Chromium)
npm run shots      # headless screenshots into qa-output/ (after build)
```

Requires Node 24 (`.nvmrc`).

## Deploy (GitHub Pages)

The site is served from the `gh-pages` branch under `/koi-pond/`:

```bash
MSYS_NO_PATHCONV=1 npx vite build --base=/koi-pond/
# publish the contents of dist/ to the gh-pages branch
```

GitHub Pages cannot set response headers, so `public/_headers` (a strict CSP for Cloudflare Pages) has no effect there.

## Privacy and network

No data is collected. No analytics, no cookies, no network calls, no camera or microphone. The only thing stored is your light/dark theme choice, in your own browser's `localStorage`. No secrets or environment variables are needed.

## Licence

Code is MIT (see `LICENSE`). Fonts are SIL OFL 1.1 (see `THIRD_PARTY_NOTICES.md`). The credits art `public/_house/creator.webp` is all rights reserved (see `NOTICE.md`).

Provided as is, without warranty of any kind.
