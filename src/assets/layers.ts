/**
 * Maps the 167 original paths of `logo-with landmark.svg` (by document index, which is
 * also their paint order) onto logical, independently animatable layers.
 *
 * Derived by inspecting each path's fill colour and bounding box (see README, "Layer map").
 * Every index 0..166 appears exactly once — `npm run check:layers` verifies this.
 *
 * NOTE: the source artwork contains NO tagline geometry (nothing exists below y≈876 except
 * TAMALE / 2026), so there is nothing to strip; no tagline path is referenced anywhere.
 */
const range = (a: number, b: number) => Array.from({length: b - a + 1}, (_, i) => a + i);

export const LAYERS = {
  /** Left "spark" accents, ordered as they burst out. */
  sparks: {gold: [11], red: [12], green: [0]},

  /** TAMALE letters, left → right. */
  tamale: [[7], [9], [5], [10], [8], [6]],
  /** 2 0 2 6 digits, left → right (red, gold, green, blue). */
  digits: [[1], [3], [2], [4]],

  /** Underline brush strokes. */
  underline: {red: [15], gold: [14], green: [13]},

  letterG: [16],
  /** Fugu fabric: the upper flag and the lower sweeping ribbon (path 22 uses the gradient). */
  fabricUpper: range(17, 31),
  fabricLower: range(32, 42),
  letterF: [44, 45, 46],
  letterU1: range(47, 56),
  /** Red patterned U (43 is a 6×1px sliver of its bottom edge). */
  letterU2: [43, ...range(57, 106)],

  experience: range(107, 116),

  sun: [117],
  birds: [[118], [119], [120]],
  /** Tree canopy + trunk + ground wedge (123–128 are the sun-lit gaps/highlights inside it). */
  tree: range(122, 128),
  /** Black outline/horizon path that frames every building and the hill. */
  landscape: [129],
  /** 121 is a white ledge highlight that paints *under* the black outline. */
  architectureBack: [121],
  architecture: range(130, 166),
} as const;

export const ALL_LAYER_IDS: number[] = [
  ...LAYERS.sparks.gold,
  ...LAYERS.sparks.red,
  ...LAYERS.sparks.green,
  ...LAYERS.tamale.flat(),
  ...LAYERS.digits.flat(),
  ...LAYERS.underline.red,
  ...LAYERS.underline.gold,
  ...LAYERS.underline.green,
  ...LAYERS.letterG,
  ...LAYERS.fabricUpper,
  ...LAYERS.fabricLower,
  ...LAYERS.letterF,
  ...LAYERS.letterU1,
  ...LAYERS.letterU2,
  ...LAYERS.experience,
  ...LAYERS.sun,
  ...LAYERS.birds.flat(),
  ...LAYERS.tree,
  ...LAYERS.landscape,
  ...LAYERS.architectureBack,
  ...LAYERS.architecture,
];
