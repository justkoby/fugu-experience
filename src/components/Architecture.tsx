import React from 'react';
import {LAYERS} from '../assets/layers';
import {ARCHITECTURE, SCENES, SPRING} from '../config/animation';
import {PathGroup} from '../lib/PathGroup';
import {springAt} from '../lib/anim';

const edges = [0, ...ARCHITECTURE.cuts, 1080];

/**
 * Scene 2 — each structure rises on its own (left → right) from behind the hill baseline,
 * through a masked vertical reveal, with an upward overshoot.
 *
 * `part="back"` is the one white ledge highlight that paints beneath the black outline path.
 */
export const Architecture: React.FC<{frame: number; part?: 'back' | 'front'}> = ({frame, part = 'front'}) => {
  const ids = part === 'back' ? LAYERS.architectureBack : LAYERS.architecture;
  const {start, end} = SCENES.architecture;
  if (frame >= end) return <PathGroup ids={ids} />;
  if (frame < start) return null;

  return (
    <>
      <defs>
        {edges.slice(0, -1).map((x0, i) => (
          <clipPath id={`arch-${part}-${i}`} key={i}>
            {/* +1px overlap so adjacent columns never leave a hairline seam */}
            <rect x={x0} y={0} width={edges[i + 1] - x0 + 1} height={ARCHITECTURE.baselineY} />
          </clipPath>
        ))}
      </defs>
      {edges.slice(0, -1).map((_, i) => {
        const s = springAt(frame, start + i * ARCHITECTURE.stagger, SPRING.building);
        if (s <= 0) return null;
        const dy = (1 - s) * ARCHITECTURE.riseDistance;
        return (
          <g key={i} clipPath={`url(#arch-${part}-${i})`}>
            <g transform={`translate(0 ${dy})`}>
              <PathGroup ids={ids} />
            </g>
          </g>
        );
      })}
    </>
  );
};
