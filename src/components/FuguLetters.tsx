import React from 'react';
import {LAYERS} from '../assets/layers';
import {LETTERS, SCENES, SPRING} from '../config/animation';
import {EASE, around, clamp, progress, ring, springAt, springVelocity} from '../lib/anim';
import {PathGroup} from '../lib/PathGroup';

export type FuguLetterName = 'F' | 'U1' | 'G' | 'U2';

const IDS: Record<FuguLetterName, readonly number[]> = {
  F: LAYERS.letterF,
  U1: LAYERS.letterU1,
  G: LAYERS.letterG,
  U2: LAYERS.letterU2,
};

/** Pivot (centre of each letter's artwork) used for scale / rotation. */
const CENTER = {F: {x: 268, y: 510}, U1: {x: 406, y: 624}, G: {x: 592, y: 489}, U2: {x: 786, y: 505}} as const;

/** Directional motion blur — restrained, only while the letter is moving fast. */
const MotionBlur: React.FC<{id: string; bx: number; by: number}> = ({id, bx, by}) => (
  <filter id={id} filterUnits="userSpaceOnUse" x={-900} y={-900} width={2880} height={2880}>
    <feGaussianBlur stdDeviation={`${bx} ${by}`} />
  </filter>
);

/**
 * Scene 4 — one letter of FUGU. Rendered individually so each can sit at its original z-order
 * (G < fabric < F < U < U) while moving on its own path:
 *  F sweeps in from the left, U rises with a bounce, G scales up elastically from 85 %, last U enters from the right.
 * After the last letter lands, the word "locks" with a small impact pulse.
 */
export const FuguLetter: React.FC<{frame: number; letter: FuguLetterName}> = ({frame, letter}) => {
  const ids = IDS[letter];
  const cfg = LETTERS[letter];
  if (frame < cfg.start) return null;

  const c = CENTER[letter];
  const lock = LETTERS.lock;
  const pulse = 1 + lock.amount * ring(frame, lock.start, lock.frequency, lock.decay);
  const lockTransform = around(540, 500, `scale(${pulse})`);

  if (frame >= SCENES.letters.end) return <g transform={lockTransform}><PathGroup ids={ids} /></g>;

  let transform = '';
  let blur: [number, number] = [0, 0];
  let opacity = 1;

  if (letter === 'F') {
    const t = LETTERS.F;
    const s = springAt(frame, t.start, SPRING.letterF);
    const v = springVelocity(frame, t.start, SPRING.letterF);
    const stretch = clamp(1 + t.stretch * v, 0.9, 1.18);
    transform =
      `translate(${(1 - s) * -t.distance} 0) ` +
      around(c.x, c.y, `skewX(${(1 - s) * -t.skew}) scale(${stretch} ${2 - stretch})`);
    blur = [Math.abs(v) * LETTERS.blur, 0];
  } else if (letter === 'U1') {
    const t = LETTERS.U1;
    const s = springAt(frame, t.start, SPRING.letterU1);
    const v = springVelocity(frame, t.start, SPRING.letterU1);
    // Stretch while travelling up, squash when the bounce lands (velocity flips sign).
    const stretch = clamp(1 + t.stretch * v, 0.88, 1.16);
    transform = `translate(0 ${(1 - s) * t.distance}) ` + around(c.x, c.y, `scale(${2 - stretch} ${stretch})`);
    blur = [0, Math.abs(v) * LETTERS.blur];
  } else if (letter === 'G') {
    const t = LETTERS.G;
    const s = springAt(frame, t.start, SPRING.letterG);
    const k = t.fromScale + (1 - t.fromScale) * s;
    opacity = progress(frame, t.start, t.start + 5, EASE.linear);
    transform = around(c.x, c.y, `scale(${k})`);
  } else {
    const t = LETTERS.U2;
    const s = springAt(frame, t.start, SPRING.letterU2);
    const v = springVelocity(frame, t.start, SPRING.letterU2);
    const stretch = clamp(1 + t.stretch * v, 0.9, 1.18);
    transform =
      `translate(${(1 - s) * t.distance} 0) ` +
      around(c.x, c.y, `rotate(${(1 - s) * t.rotate}) scale(${stretch} ${2 - stretch})`);
    blur = [Math.abs(v) * LETTERS.blur, 0];
  }

  const blurId = `fugu-blur-${letter}`;
  const useBlur = blur[0] > 0.4 || blur[1] > 0.4;

  return (
    <g transform={lockTransform}>
      {useBlur && (
        <defs>
          <MotionBlur id={blurId} bx={blur[0]} by={blur[1]} />
        </defs>
      )}
      <g opacity={opacity} filter={useBlur ? `url(#${blurId})` : undefined}>
        <g transform={transform}>
          <PathGroup ids={ids} />
        </g>
      </g>
    </g>
  );
};
