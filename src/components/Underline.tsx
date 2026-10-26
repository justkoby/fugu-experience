import React from 'react';
import {LAYERS} from '../assets/layers';
import {SCENES, UNDERLINE} from '../config/animation';
import {EASE, progress} from '../lib/anim';
import {PathGroup} from '../lib/PathGroup';

/**
 * Centre-lines that the brush "travels" along (original viewBox coordinates). Each original filled stroke is
 * revealed through a thick round-capped stroke-dashoffset mask following its line — red, then gold, then green.
 */
const STROKES = [
  {ids: LAYERS.underline.red, d: 'M258,808 Q420,748 600,734'},
  {ids: LAYERS.underline.gold, d: 'M330,804 Q510,752 706,735'},
  {ids: LAYERS.underline.green, d: 'M420,795 C520,760 640,742 705,746 S800,758 826,768'},
];

/** Scene 5 — red, gold, then green stroke sweep across the underline. */
export const Underline: React.FC<{frame: number}> = ({frame}) => {
  const {start, end} = SCENES.underline;
  if (frame >= end) return <>{STROKES.map((s, i) => <PathGroup key={i} ids={s.ids} />)}</>;

  return (
    <>
      {STROKES.map((s, i) => {
        const t0 = start + i * UNDERLINE.stagger;
        if (frame < t0) return null;
        const p = progress(frame, t0, t0 + UNDERLINE.drawFrames, EASE.brush);
        return (
          <g key={i} mask={`url(#underline-mask-${i})`}>
            <defs>
              <mask id={`underline-mask-${i}`} maskUnits="userSpaceOnUse" x={0} y={600} width={1080} height={300}>
                <path
                  d={s.d}
                  fill="none"
                  stroke="#fff"
                  strokeWidth={UNDERLINE.maskWidth}
                  strokeLinecap="round"
                  pathLength={1}
                  strokeDasharray={1}
                  strokeDashoffset={1 - p}
                />
              </mask>
            </defs>
            <PathGroup ids={s.ids} />
          </g>
        );
      })}
    </>
  );
};
