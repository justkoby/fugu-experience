import React from 'react';
import {LAYERS} from '../assets/layers';
import {BIRDS, BIRD_FLIGHT_FRAMES, SCENES} from '../config/animation';
import {EASE, around, lerp, progress} from '../lib/anim';
import {PathGroup} from '../lib/PathGroup';

/** Scene 1 — three birds glide in sequentially along short curved arcs, flapping as they settle. */
export const Birds: React.FC<{frame: number}> = ({frame}) => {
  if (frame >= SCENES.birds.end) return <>{LAYERS.birds.map((ids, i) => <PathGroup key={i} ids={ids} />)}</>;

  return (
    <>
      {LAYERS.birds.map((ids, i) => {
        const b = BIRDS[i];
        if (frame < b.start) return null;
        const t = progress(frame, b.start, b.start + BIRD_FLIGHT_FRAMES, EASE.cinematic);
        // Quadratic Bézier from the offset start, bending through a control point, to the final position.
        const u = 1 - t;
        const x = u * u * b.from.x + 2 * u * t * b.bend.x;
        const y = u * u * b.from.y + 2 * u * t * b.bend.y;
        // Wing beat: vertical squash that decays to nothing as the bird lands.
        const flap = 1 - 0.5 * Math.abs(Math.sin(t * Math.PI * b.flaps)) * (1 - t);
        const scale = lerp(0.6, 1, t);
        const opacity = progress(frame, b.start, b.start + 8, EASE.linear);
        return (
          <g
            key={i}
            opacity={opacity}
            transform={`translate(${x} ${y}) ${around(b.center.x, b.center.y, `scale(${scale} ${scale * flap})`)}`}
          >
            <PathGroup ids={ids} />
          </g>
        );
      })}
    </>
  );
};
