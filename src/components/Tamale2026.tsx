import React from 'react';
import {LAYERS} from '../assets/layers';
import {DIGITS, SCENES, SPRING, TAMALE} from '../config/animation';
import {EASE, around, progress, springAt} from '../lib/anim';
import {PathGroup} from '../lib/PathGroup';

/** Horizontal centre of each digit's artwork and their shared baseline. */
const DIGIT_CENTERS = [616.5, 675, 732.5, 790];
const DIGIT_BASE = 875;

/**
 * Scene 6 — TAMALE rises cleanly from its baseline (letter by letter),
 * then 2·0·2·6 pop in with staggered scale/opacity bounces, like percussion hits.
 */
export const Tamale2026: React.FC<{frame: number}> = ({frame}) => {
  const tamale = SCENES.tamale;
  const digits = SCENES.digits;

  const tamaleDone = frame >= tamale.end;
  const digitsDone = frame >= digits.end;

  return (
    <>
      <defs>
        <clipPath id="tamale-baseline">
          <rect x={200} y={780} width={420} height={TAMALE.baselineY - 780} />
        </clipPath>
      </defs>

      {tamaleDone ? (
        LAYERS.tamale.map((ids, i) => <PathGroup key={i} ids={ids} />)
      ) : (
        <g clipPath="url(#tamale-baseline)">
          {LAYERS.tamale.map((ids, i) => {
            const t0 = tamale.start + i * TAMALE.stagger;
            if (frame < t0) return null;
            const s = springAt(frame, t0, SPRING.tamale);
            return (
              <g key={i} transform={`translate(0 ${(1 - s) * TAMALE.rise})`} opacity={progress(frame, t0, t0 + 4, EASE.linear)}>
                <PathGroup ids={ids} />
              </g>
            );
          })}
        </g>
      )}

      {digitsDone
        ? LAYERS.digits.map((ids, i) => <PathGroup key={i} ids={ids} />)
        : LAYERS.digits.map((ids, i) => {
            const t0 = digits.start + i * DIGITS.stagger;
            if (frame < t0) return null;
            const s = springAt(frame, t0, SPRING.digit);
            const k = DIGITS.startScale + (1 - DIGITS.startScale) * s;
            return (
              <g
                key={i}
                opacity={progress(frame, t0, t0 + 5, EASE.linear)}
                transform={`translate(0 ${(1 - s) * DIGITS.drop}) ${around(DIGIT_CENTERS[i], DIGIT_BASE, `scale(${k})`)}`}
              >
                <PathGroup ids={ids} />
              </g>
            );
          })}
    </>
  );
};
