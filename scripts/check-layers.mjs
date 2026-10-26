// Verifies every source path is assigned to exactly one layer.
import {ALL_LAYER_IDS} from '../src/assets/layers.ts';
import {SOURCE_PATHS} from '../src/assets/logoSource.ts';
const seen = new Map();
for (const id of ALL_LAYER_IDS) seen.set(id, (seen.get(id) ?? 0) + 1);
const dup = [...seen].filter(([, n]) => n > 1).map(([id]) => id);
const missing = SOURCE_PATHS.filter((p) => !seen.has(p.id)).map((p) => p.id);
const unknown = [...seen.keys()].filter((id) => !SOURCE_PATHS[id]);
if (dup.length || missing.length || unknown.length) {
  console.error({dup, missing, unknown});
  process.exit(1);
}
console.log(`OK — all ${SOURCE_PATHS.length} paths assigned exactly once.`);
