import React from 'react';
import {LAYERS} from '../assets/layers';
import {SCENES, SPRING, TREE} from '../config/animation';
import {EASE, around, progress, springAt} from '../lib/anim';
import {PathGroup} from '../lib/PathGroup';

/** Scene 2 — the acacia grows outward from its trunk: an expanding mask reveals branches and canopy progressively. */
export const Tree: React.FC<{frame: number}> = ({frame}) => {
  const {start, end} = SCENES.tree;
  if (frame >= end) return <PathGroup ids={LAYERS.tree} />;
  if (frame < start) return null;

  const grow = progress(frame, start, start + TREE.growFrames, EASE.inOut);
  const s = springAt(frame, start, SPRING.tree);
  const scale = TREE.startScale + (1 - TREE.startScale) * s;
  const r = grow * TREE.maxRadius;

  return (
    <>
      <defs>
        <clipPath id="tree-grow">
          <ellipse cx={TREE.origin.x} cy={TREE.origin.y} rx={r * 1.35} ry={r} />
        </clipPath>
      </defs>
      <g clipPath="url(#tree-grow)">
        <g transform={around(TREE.base.x, TREE.base.y, `scale(${scale})`)}>
          <PathGroup ids={LAYERS.tree} />
        </g>
      </g>
    </>
  );
};
