import React from 'react';
import {LAYERS} from '../assets/layers';
import {LANDSCAPE, SCENES} from '../config/animation';
import {EASE, lerp, progress} from '../lib/anim';
import {PathGroup} from '../lib/PathGroup';

/** Scene 2 — the black landscape/horizon line is swept in left → right with a softly curved leading edge. */
export const Landscape: React.FC<{frame: number}> = ({frame}) => {
  const {start, end} = SCENES.landscape;
  if (frame >= end) return <PathGroup ids={LAYERS.landscape} />;
  if (frame < start) return null;

  const t = progress(frame, start, end - 8, EASE.inOut);
  const sweepX = lerp(LANDSCAPE.sweepFrom, LANDSCAPE.sweepTo, t);
  const pts: string[] = [`-200,100`];
  for (let y = 100; y <= 400; y += 10) {
    const k = (y - 100) / 300;
    pts.push(`${sweepX + LANDSCAPE.curve * Math.sin(k * Math.PI) - k * 40},${y}`);
  }
  pts.push('-200,400');

  return (
    <>
      <defs>
        <clipPath id="landscape-sweep">
          <polygon points={pts.join(' ')} />
        </clipPath>
      </defs>
      <g clipPath="url(#landscape-sweep)">
        <PathGroup ids={LAYERS.landscape} />
      </g>
    </>
  );
};
