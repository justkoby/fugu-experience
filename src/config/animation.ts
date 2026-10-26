/**
 * Central animation configuration — every timing, spring and distance lives here.
 * All values are in frames (30 fps) or SVG user units (1080 × 1080 space).
 */
export const FPS = 30;
export const DURATION_IN_FRAMES = 360; // 12 s
export const COMP_SIZE = 1080;
export const BACKGROUND = '#FFFFFF';

export type Range = {start: number; end: number};

/** Scene windows. `end` is the frame by which the element is fully settled (and rendered as the pristine original). */
export const SCENES = {
  sun: {start: 0, end: 130},
  birds: {start: 24, end: 92},
  architecture: {start: 45, end: 132},
  tree: {start: 70, end: 126},
  landscape: {start: 80, end: 122},
  fabric: {start: 105, end: 185},
  accents: {start: 128, end: 185},
  letters: {start: 145, end: 250},
  experience: {start: 225, end: 285},
  underline: {start: 268, end: 304},
  tamale: {start: 275, end: 325},
  digits: {start: 296, end: 352},
  impact: {start: 322, end: 352},
  hold: {start: 325, end: 360},
} satisfies Record<string, Range>;

/** Spring presets (damping / stiffness / mass). Lower damping = more overshoot. */
export const SPRING = {
  building: {damping: 10, stiffness: 95, mass: 0.9},
  tree: {damping: 14, stiffness: 70, mass: 1},
  fabric: {damping: 11, stiffness: 55, mass: 1.1},
  spark: {damping: 8, stiffness: 150, mass: 0.7},
  letterF: {damping: 11, stiffness: 120, mass: 1},
  letterU1: {damping: 7, stiffness: 130, mass: 0.9},
  letterG: {damping: 5, stiffness: 140, mass: 0.8},
  letterU2: {damping: 10, stiffness: 110, mass: 1},
  tamale: {damping: 13, stiffness: 140, mass: 0.8},
  digit: {damping: 7, stiffness: 170, mass: 0.6},
  impactRelease: {damping: 9, stiffness: 120, mass: 0.7},
} as const;

/** Final framing. The source art is shifted down so that, without the tagline, it sits optically centred. */
export const LAYOUT = {
  /** Vertical shift of the whole logo (source art occupies y≈119–876 of 1080). */
  offsetY: 43,
  baseScale: 1,
};

/** Slow push-in during the final hero hold. 0.03 = 3 %. Never crops (margins stay > 60 px). */
export const CAMERA = {
  pushStart: 336,
  pushEnd: 360,
  pushZoom: 0.03,
};

/** Full-composition impact once all text is visible. */
export const IMPACT = {
  start: 322,
  riseFrames: 4,
  amount: 0.028,
};

export const SUN = {
  riseDistance: 250,
  riseEnd: 52,
  anticipation: 7,
  expand: 0.045,
  expandRange: [38, 70] as const,
  origin: {x: 560, y: 262},
  /** Rising horizon clip (just below the sun's lowest point at y≈336). */
  horizonY: 346,
  glow: {opacity: 0.6, blur: 30, range: [6, 112] as const},
  /**
   * The source sun path has building-shaped knockouts. While the sun rises alone, a plain disc (fitted to the
   * sun's outer edge) fills them so it reads as a clean sunrise; it dissolves as the buildings take over.
   */
  underlay: {cx: 545, cy: 276.4, r: 157.9, fill: '#f5af1a', fadeRange: [98, 128] as const},
};

export const BIRDS = [
  {start: 30, from: {x: -110, y: 80}, bend: {x: -40, y: -40}, center: {x: 557, y: 170}, flaps: 3.5},
  {start: 40, from: {x: -130, y: 60}, bend: {x: -60, y: -30}, center: {x: 593, y: 206}, flaps: 3},
  {start: 52, from: {x: -90, y: 50}, bend: {x: -30, y: -25}, center: {x: 514, y: 195}, flaps: 4},
] as const;
export const BIRD_FLIGHT_FRAMES = 30;

export const ARCHITECTURE = {
  /** x-edges between the five structures (left hill, big tower, tower 3, tower 4, right tower). */
  cuts: [350, 458, 522, 590],
  /** Frames between consecutive buildings starting to rise (left → right). */
  stagger: 11,
  riseDistance: 215,
  /** Rise is masked at this baseline so buildings emerge from the hill. */
  baselineY: 372,
};

export const TREE = {
  origin: {x: 742, y: 345},
  base: {x: 745, y: 382},
  maxRadius: 270,
  startScale: 0.88,
  growFrames: 40,
};

export const LANDSCAPE = {sweepFrom: -80, sweepTo: 800, curve: 46};

export const FABRIC = {
  anchor: {x: 830, y: 330},
  enterDistance: 520,
  rotate: -16,
  skew: 14,
  startScaleX: 0.75,
  waveAmplitude: 36,
  waveCount: 1.4,
  waveSpeed: 0.32,
  /** Lower ribbon trails the upper flag by this wave phase (radians). */
  lowerPhase: 1.1,
  stripWidth: 10,
  stripCount: 20,
  stripX0: 810,
  settleLead: 10, // wave amplitude hits exactly 0 this many frames before scene end
};

export const SPARKS = {
  stagger: 6,
  rotate: -14,
  /** Inner (root) end of each spark — the point it scales out from. */
  origins: [
    {x: 188, y: 376}, // gold
    {x: 166, y: 388}, // red
    {x: 150, y: 412}, // green
  ],
};

export const LETTERS = {
  F: {start: 145, distance: 640, skew: 9, stretch: 0.016},
  U1: {start: 162, distance: 430, stretch: 0.02},
  G: {start: 178, fromScale: 0.85},
  U2: {start: 194, distance: 600, rotate: 14, stretch: 0.014},
  /** Frame at which the assembled word "locks" with an impact pulse. */
  lock: {start: 226, amount: 0.022, frequency: 0.7, decay: 0.2},
  blur: 0.35,
};

export const EXPERIENCE = {
  slideX: 26,
  edgeLag: 55,
  trailOpacity: 0.45,
  slant: 0.5,
  from: 20,
  to: 1010,
};

export const UNDERLINE = {
  stagger: 6,
  drawFrames: 18,
  maskWidth: 80,
};

export const TAMALE = {
  stagger: 3,
  rise: 40,
  baselineY: 880,
};

export const DIGITS = {
  stagger: 6,
  startScale: 0.35,
  drop: 16,
};
