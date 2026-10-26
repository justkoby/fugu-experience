# FUGU EXPERIENCE — TAMALE 2026 · Cinematic Logo Reveal

A choreographed, frame-deterministic logo animation built with **Remotion + React + TypeScript + native SVG**.
Source artwork: `logo-with landmark.svg` (never modified). Output: **1080 × 1080, 30 fps, 12 s (360 frames), silent, solid black**.

```bash
npm install
npm run dev          # Remotion Studio → http://localhost:3000  (composition: FuguExperienceSquare)
npm run render       # high-quality H.264 MP4 → out/fugu-experience-tamale-2026.mp4
```

Other scripts: `npm run render:draft` (fast preview MP4), `npm run still` (PNG of the final frame),
`npm run typecheck`, `npm run extract` (regenerate paths from the SVG), `npm run check:layers`, `npm run check:settle`.

Render preset: H.264, CRF 14, `x264-preset=slow`, `yuv420p`, no audio track (`--muted`).

## How the logo was taken apart

The SVG is an Illustrator export: 167 flat `<path>`s with CSS-class fills and no groups. Paths are in **paint order**, so
`scripts/extract-svg.mjs` reads the file, resolves each class to its literal fill, and writes `src/assets/logoSource.ts`
(same 1080 × 1080 coordinates). `src/assets/layers.ts` then maps path indices onto layers — derived from each path's fill
colour and bounding box. `npm run check:layers` asserts every path belongs to exactly one layer.

| Layer | Paths | Layer | Paths |
|---|---|---|---|
| Sun | 117 | Fabric (upper flag / lower ribbon) | 17–31 / 32–42 |
| Birds (3) | 118, 119, 120 | F | 44–46 |
| Architecture | 121, 130–166 | Gold U | 47–56 |
| Tree (+ ground, sun gaps) | 122–128 | Green G | 16 |
| Black landscape / outlines | 129 | Red U | 43, 57–106 |
| Left sparks (gold, red, green) | 11, 12, 0 | EXPERIENCE | 107–116 |
| Underline (red, gold, green) | 15, 14, 13 | TAMALE / 2·0·2·6 | 7,9,5,10,8,6 / 1,3,2,4 |

Layers are composited in the same order as the original paths, so the assembled logo stacks exactly like the source.

**Tagline:** the supplied landmark SVG contains no tagline geometry (nothing exists below TAMALE 2026), so none is drawn.
The artwork is shifted down 43 px (`LAYOUT.offsetY`) so the logo is optically centred in the square once the tagline space is gone;
relative positions between elements are untouched.

**Exact final frame:** once a layer finishes, it is rendered as its untouched original paths (no clip/transform), so the
final frame equals the source art. Compared to the original SVG on black (same offset, push-in disabled via
`debugStaticCamera`), only sub-pixel anti-aliasing differs.

## Timeline (frames @ 30 fps) — all editable in `src/config/animation.ts`

| Scene | Frames | What happens |
|---|---|---|
| 1 Sunrise | 0–80 | Sun rises from behind the horizon with a tiny anticipation dip, warm glow and gentle swell; 3 birds glide in on curved arcs with wing-flap squash. |
| 2 Heritage | 45–132 | Five structures rise left→right through masked vertical reveals with spring overshoot; acacia grows outward from its trunk (expanding elliptical mask + scale); black landscape swept in on a curved edge. |
| 3 Fugu fabric | 105–185 | Fabric slides in from off-canvas with rotation/skew/unfold; travelling sine wave (20 sheared clip strips) decays to zero as it settles. Left sparks burst out with elastic stagger. |
| 4 FUGU | 145–250 | F sweeps from left (overshoot, motion blur) · U rises with bounce + stretch/squash · G scales from 85 % elastically · red U enters from right with rotation. All lock with an impact pulse at frame 226. |
| 5 EXPERIENCE | 225–304 | Slanted dry-brush wipe reveals the lettering; red → gold → green strokes draw on via stroke-dashoffset masks. |
| 6 TAMALE 2026 | 275–352 | TAMALE rises letter-by-letter from its baseline; digits pop with staggered scale/opacity bounces. Full-logo impact swell at frame 322. |
| 7 Hero hold | 325–360 | Complete logo, slow 3 % push-in (never crops; margins > 60 px). Everything is fully visible from frame ~330 on. |

A temporary "sun underlay" disc fills the building-shaped knockouts in the sun path during the sunrise so it reads as a clean disc;
it dissolves (frames 98–128) as the buildings arrive and is gone before the end.

## Tuning

Everything lives in `src/config/animation.ts`: `DURATION_IN_FRAMES`, `SCENES` (start/end), `SPRING` presets
(damping / stiffness / mass), stagger intervals (`ARCHITECTURE.stagger`, `SPARKS.stagger`, `DIGITS.stagger`…), `CAMERA`,
`IMPACT`, `FABRIC` (distance, rotation, skew, wave amplitude/speed), and per-letter timings in `LETTERS`.
After changing springs or scene ends, run `npm run check:settle` to confirm each spring has settled before its scene hands
over to the pristine artwork.

## Project structure

```
src/
  index.ts · Root.tsx                 registers the single composition FuguExperienceSquare (1080×1080, 30 fps, 360 f)
  compositions/FuguLogoReveal.tsx     z-ordered layer stack + camera (impact + push-in)
  components/                         Sun, Birds, Architecture, Tree, Landscape, FuguFabric, Accents,
                                      FuguLetters, ExperienceText, Underline, Tamale2026
  config/animation.ts                 central timing / spring / motion configuration
  assets/logoSource.ts                GENERATED: original paths + gradient (from the SVG)
  assets/layers.ts                    path-index → layer mapping
  lib/anim.ts · lib/PathGroup.tsx     easing / spring helpers · path renderer
scripts/                              extract-svg · check-layers · check-settle
```

## Audio (later)

None in this version — no audio files or dependencies. The timeline is modular: scene start frames in `SCENES` / `LETTERS` /
`IMPACT` are the natural cue points (sun 0, buildings 45+, fabric 105, FUGU letters 145/162/178/194, lock 226, EXPERIENCE 225,
underline 268/274/280, TAMALE 275, digits 296+, impact 322), so sound can be added with Remotion's `<Audio>` + `<Sequence>`
without restructuring.
