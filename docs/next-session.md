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
- Deployed (2026-10-26) is the finish pass; the identity revamp below is committed on local `main` and NOT pushed/deployed (awaiting owner OK).
- Revamp (so it does not read as a copy of the reference pond): mood engine (clock + season, `?time=`/`?season=` overrides), sandy floor with river stones and sky/moon reflection, ink-outline koi with butterfly fins and new varieties, lotus leaves, seasonal dressing, fireflies, visible food pellets, mood-driven audio ambience.
- Standalone page and `?embed=1` unchanged in behaviour (DPR cap 1.5 embed, pause hidden/off-screen, reduced motion = one still frame, `touch-action: pan-y`, WebGL2 fallback message, packed-RGBA8 ripple fallback, context restore).
- Seasons use the northern-hemisphere calendar.

## Known gaps / ideas
1. Owner step: OK to push `main` and redeploy gh-pages (build with `--base=/koi-pond/`, publish `dist/` to `gh-pages`).
2. Audio ambience (crickets, wind, water) has never been listened to; tune gains by ear.
3. `e2e/mood.spec.ts` night+winter test is slow on software GL and flaked once under load.
