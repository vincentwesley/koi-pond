> Update at the end of any session that changed state. Keep it lean.

Continue work on **Koi Pond** (public repo github.com/vincentwesley/koi-pond, live at https://vincentwesley.github.io/koi-pond/ via gh-pages).
Finish pass done 2026-10-26: typecheck, unit tests (16), e2e + axe (one spec at a time) and build green; screenshots read. Only do what the owner asks.

## Before anything
1. Path: `C:\Coding Projects\koi-pond`. Read this file and `CLAUDE.md`.
2. Node 24 (`.nvmrc`).

## How to work here
- Commit locally with the vincentwesley noreply identity; run `_house/check-identity.sh` before any push. No visibility change without the owner's OK.
- Checks: `npm run typecheck && npm test && npm run build`, then `npm run e2e` (builds, runs one spec at a time with `--workers=1`) and `npm run shots`. Headless only, one browser run at a time.
- Deploy: `MSYS_NO_PATHCONV=1 npx vite build --base=/koi-pond/`, publish `dist/` to the `gh-pages` branch. Never move the URL (the portfolio CSP allow-lists `https://vincentwesley.github.io`). GH Pages ignores `public/_headers`.
- No CI (Actions minutes are limited): verify locally.

## Current state
- Standalone page (title, sound + theme pills, credits card) and `?embed=1` (canvas only, DPR cap 1.5, pauses hidden/off-screen, reduced motion = one still frame, `touch-action: pan-y`, message without WebGL2).
- Ripples work without float render targets (packed RGBA8 fallback; `new Renderer(gl, dpr, { forceNoFloat: true })` forces it). Calm water only if nothing is renderable.
- Petals drift and pads are nudged by taps, drags, hover wake and koi wakes (`Pond.nudge`); a tap makes 1-3 nearby koi circle the spot for a few seconds.
- WebGL context loss pauses quietly and rebuilds on restore.

## Known gaps / ideas
1. Context restore and `pointercancel` have no e2e coverage.
2. The packed-ripple test forces the path by hiding `EXT_color_buffer_*`; it does not assert which path ran.
3. Owner step: OK to push `main` and deploy gh-pages (not done yet).
