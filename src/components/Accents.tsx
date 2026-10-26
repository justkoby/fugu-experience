import React from 'react';
import {LAYERS} from '../assets/layers';
import {SCENES, SPARKS, SPRING} from '../config/animation';
import {EASE, around, progress, springAt} from '../lib/anim';
import {PathGroup} from '../lib/PathGroup';

const SPARK_LIST = [LAYERS.sparks.gold, LAYERS.sparks.red, LAYERS.sparks.green];

/** Scene 3 — the three colour marks left of the F burst out in a rhythmic stagger with small elastic movements. */
export const Accents: React.FC<{frame: number}> = ({frame}) => {
  const {start, end} = SCENES.accents;
  if (frame >= end) return <>{SPARK_LIST.map((ids, i) => <PathGroup key={i} ids={ids} />)}</>;

  return (
    <>
      {SPARK_LIST.map((ids, i) => {
        const t0 = start + i * SPARKS.stagger;
        if (frame < t0) return null;
        const s = springAt(frame, t0, SPRING.spark);
        const o = SPARKS.origins[i];
        return (
          <g
            key={i}
            opacity={progress(frame, t0, t0 + 3, EASE.linear)}
            transform={around(o.x, o.y, `rotate(${(1 - s) * SPARKS.rotate}) scale(${Math.max(s, 0)})`)}
          >
            <PathGroup ids={ids} />
          </g>
        );
      })}
    </>
  );
};
