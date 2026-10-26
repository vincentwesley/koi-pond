> Update at the end of any session that changed state. Keep it lean.

Continue work on **Koi Pond** (public repo github.com/vincentwesley/koi-pond, live at https://vincentwesley.github.io/koi-pond/ via gh-pages).
Built 2026-10-21; typecheck, unit tests and build green. Only do what the owner asks.

## Before anything
1. Path: `C:\Coding Projects\koi-pond`. Read this file and `CLAUDE.md`.
2. Node 24 (`.nvmrc`).

## How to work here
- Commit locally with the vincentwesley noreply identity; no repo, push or visibility change without the owner's OK.
- Checks: `npm run typecheck && npm test && npm run build && npm run shots` (headless only, one run at a time).

## Current state
- Standalone page (title, sound + theme pills, credits card) and `?embed=1` (canvas only, DPR cap 1.5, pauses hidden/off-screen, reduced motion = one still frame, CSS gradient + message without WebGL2).
- CSP in `public/_headers` allows framing only by `'self'` and `https://vwesley.dev` (for the embed).

## Known gaps / ideas
1. Ripples need `EXT_color_buffer_float`; without it the water stays calm (rest still renders).
2. Petals and pads only bob with ripples (vertex shader); they are not pushed along by them.
3. No e2e/axe suite yet; `npm run shots` is the visual check.
4. Owner steps: create a private repo, then Cloudflare Pages deploy, if wanted.
