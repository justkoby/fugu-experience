// Verifies each spring has settled (|1 - v| < 0.002) by the frame where its scene swaps to the pristine artwork.
import {spring} from 'remotion';
import {FPS, SCENES, SPRING, ARCHITECTURE, LETTERS, SPARKS, DIGITS, TAMALE, IMPACT, UNDERLINE} from '../src/config/animation.ts';

const at = (cfg, f) => spring({frame: f, fps: FPS, config: cfg});
const rows = [
  ['sun (fade)', 130, 130], // time-based, no spring
  ['architecture (last col)', SCENES.architecture.end, SCENES.architecture.start + 4 * ARCHITECTURE.stagger, SPRING.building],
  ['tree', SCENES.tree.end, SCENES.tree.start, SPRING.tree],
  ['fabric', SCENES.fabric.end, SCENES.fabric.start, SPRING.fabric],
  ['sparks (last)', SCENES.accents.end, SCENES.accents.start + 2 * SPARKS.stagger, SPRING.spark],
  ['letter F', SCENES.letters.end, LETTERS.F.start, SPRING.letterF],
  ['letter U1', SCENES.letters.end, LETTERS.U1.start, SPRING.letterU1],
  ['letter G', SCENES.letters.end, LETTERS.G.start, SPRING.letterG],
  ['letter U2', SCENES.letters.end, LETTERS.U2.start, SPRING.letterU2],
  ['tamale (last)', SCENES.tamale.end, SCENES.tamale.start + 5 * TAMALE.stagger, SPRING.tamale],
  ['digits (last)', SCENES.digits.end, SCENES.digits.start + 3 * DIGITS.stagger, SPRING.digit],
  ['impact release', IMPACT.start + 60, IMPACT.start + IMPACT.riseFrames, SPRING.impactRelease],
];
let bad = 0;
for (const [name, endFrame, start, cfg] of rows) {
  if (!cfg) continue;
  const v = at(cfg, endFrame - start);
  const ok = Math.abs(1 - v) < 0.002;
  if (!ok) bad++;
  console.log(`${ok ? 'ok ' : 'BAD'} ${name.padEnd(26)} frames=${endFrame - start}  value=${v.toFixed(5)}`);
}
console.log('lock ring at letters.end:', Math.exp(-(SCENES.letters.end - LETTERS.lock.start) * LETTERS.lock.decay).toFixed(4));
process.exit(bad ? 1 : 0);
