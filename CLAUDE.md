# Koi Pond

Interactive WebGL2 koi pond (standalone page + `?embed=1` canvas-only mode). Follows `../CLAUDE.md` house rules.

- Stack: Vite + TypeScript, raw WebGL2 (no three.js), no runtime deps, no network calls.
- Code: `src/spine.ts` (koi motion, pure), `src/ripple.ts` (CPU reference of the ripple step), `src/scene.ts` (pond contents + geometry), `src/renderer.ts` (GL passes), `src/shaders.ts` (all GLSL), `src/audio.ts` (WebAudio, off by default), `src/main.ts` (page wiring).
- Checks: `npm run typecheck`, `npm test`, `npm run build`, then `npm run shots` (headless, writes `qa-output/`).
- Reference look only: koi-pond-play.vercel.app. Never copy its code or shaders.
- Read `docs/next-session.md` first.
