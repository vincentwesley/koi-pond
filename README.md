# Koi Pond

An interactive koi pond in the browser. Drag across the water to make ripples; the koi swim around you.

- Ripple height-field simulation on the GPU, refraction, caustics, soft fish shadows, bloom.
- Spine-driven koi in six varieties (kohaku, asagi, ogon, showa, shusui, sanke), all procedural.
- Lily pads, flowers, drifting petals and water plants that bob with the ripples.
- Optional sound, synthesised in code, off until you turn it on.
- `?embed=1`: canvas only, fills the viewport, pauses when hidden or off-screen, one still frame under reduced motion.

Built from scratch with Vite, TypeScript and raw WebGL2. No libraries at runtime.

## Run

```bash
npm ci --ignore-scripts
npm run dev        # local dev server
npm run typecheck
npm test           # unit tests (spine maths, ripple step)
npm run build      # static site in dist/
npm run shots      # headless screenshots into qa-output/ (after build; needs Playwright's Chromium)
```

Requires Node 24 (`.nvmrc`).

## Privacy and network

No data is collected. No analytics, no cookies, no network calls, no camera or microphone. The only thing stored is your light/dark theme choice, in your own browser's `localStorage`. No secrets or environment variables are needed.

## Licence

Code is MIT (see `LICENSE`). Fonts are SIL OFL 1.1 (see `THIRD_PARTY_NOTICES.md`). The credits art `public/_house/creator.webp` is all rights reserved (see `NOTICE.md`).

Provided as is, without warranty of any kind.
