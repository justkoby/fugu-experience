import React from 'react';
import {LAYERS} from '../assets/layers';
import {EXPERIENCE, SCENES} from '../config/animation';
import {EASE, lerp, progress} from '../lib/anim';
import {PathGroup} from '../lib/PathGroup';

/** Slanted, bristly leading edge — a deterministic "dry brush" silhouette. */
const brushPolygon = (edgeX: number) => {
  const pts = ['-300,590'];
  for (let y = 590; y <= 850; y += 5) {
    const wobble = 13 * Math.sin(y * 0.33) + 8 * Math.sin(y * 0.91 + 1.3) + 5 * Math.sin(y * 2.1);
    pts.push(`${edgeX - (y - 720) * EXPERIENCE.slant + wobble},${y}`);
  }
  pts.push('-300,850');
  return pts.join(' ');
};

/** Scene 5 — EXPERIENCE is revealed by a directional brush wipe; the lettering itself is untouched. */
export const ExperienceText: React.FC<{frame: number}> = ({frame}) => {
  const {start, end} = SCENES.experience;
  if (frame >= end) return <PathGroup ids={LAYERS.experience} />;
  if (frame < start) return null;

  const t = progress(frame, start, end - 15, EASE.brush);
  const edge = lerp(EXPERIENCE.from, EXPERIENCE.to, t);
  const slide = (1 - t) * -EXPERIENCE.slideX;

  return (
    <>
      <defs>
        <clipPath id="exp-lead">
          <polygon points={brushPolygon(edge)} />
        </clipPath>
        <clipPath id="exp-body">
          <polygon points={brushPolygon(edge - EXPERIENCE.edgeLag)} />
        </clipPath>
      </defs>
      <g transform={`translate(${slide} 0)`}>
        {/* dry-brush leading fringe */}
        <g clipPath="url(#exp-lead)" opacity={EXPERIENCE.trailOpacity}>
          <PathGroup ids={LAYERS.experience} />
        </g>
        <g clipPath="url(#exp-body)">
          <PathGroup ids={LAYERS.experience} />
        </g>
      </g>
    </>
  );
};
