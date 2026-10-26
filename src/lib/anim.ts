import {Easing, interpolate, spring, type SpringConfig} from 'remotion';
import {FPS} from '../config/animation';

export const EASE = {
  /** Smooth cinematic deceleration. */
  cinematic: Easing.bezier(0.22, 0.61, 0.36, 1),
  inOut: Easing.bezier(0.65, 0, 0.35, 1),
  out: Easing.bezier(0.16, 1, 0.3, 1),
  brush: Easing.bezier(0.3, 0, 0.12, 1),
  linear: (t: number) => t,
};

/** 0 → 1 between two frames (clamped). */
export const progress = (frame: number, start: number, end: number, easing: (t: number) => number = EASE.cinematic) =>
  interpolate(frame, [start, end], [0, 1], {easing, extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

/** Spring that starts at `start` (0 before, → 1 after). Can overshoot. */
export const springAt = (frame: number, start: number, config: Partial<SpringConfig>) => {
  const f = frame - start;
  return f <= 0 ? 0 : spring({frame: f, fps: FPS, config});
};

/** Spring speed in progress-units per second (positive while travelling toward 1). */
export const springVelocity = (frame: number, start: number, config: Partial<SpringConfig>) =>
  (springAt(frame, start, config) - springAt(frame - 1, start, config)) * FPS;

/** 0 → 1 → 0 sine bump between two frames. */
export const bell = (frame: number, start: number, end: number) =>
  Math.sin(Math.PI * progress(frame, start, end, EASE.linear));

/** Decaying oscillation — deterministic "impact" ring. */
export const ring = (frame: number, start: number, frequency: number, decay: number) => {
  const t = frame - start;
  return t < 0 ? 0 : Math.exp(-t * decay) * Math.sin(t * frequency);
};

export const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Rotate/scale around a pivot: returns an SVG transform string. */
export const around = (cx: number, cy: number, inner: string) => `translate(${cx} ${cy}) ${inner} translate(${-cx} ${-cy})`;
