import React from 'react';
import {LAYERS} from '../assets/layers';
import {FABRIC, SCENES, SPRING} from '../config/animation';
import {EASE, progress, springAt} from '../lib/anim';
import {PathGroup} from '../lib/PathGroup';

/**
 * Scene 3 — the Fugu fabric enters from outside the frame with a soft wave, then unfolds into place.
 *
 * Deformation: the artwork is sliced into narrow vertical clip strips, each offset along a travelling sine wave
 * (amplitude decays to exactly zero), inside a group that carries a spring-driven slide + rotation + skew + unfold.
 */
export const FuguFabric: React.FC<{frame: number}> = ({frame}) => {
  const {start, end} = SCENES.fabric;
  const plain = (
    <>
      <PathGroup ids={LAYERS.fabricUpper} />
      <PathGroup ids={LAYERS.fabricLower} />
    </>
  );
  if (frame >= end) return plain;
  if (frame < start) return null;

  const P = springAt(frame, start, SPRING.fabric);
  const inv = 1 - P;
  const {anchor} = FABRIC;
  const envelope = 1 - progress(frame, start, end - FABRIC.settleLead, EASE.inOut);
  const amp = FABRIC.waveAmplitude * envelope;
  const phase = frame * FABRIC.waveSpeed;

  const outer = [
    `translate(${anchor.x + inv * FABRIC.enterDistance} ${anchor.y})`,
    `rotate(${inv * FABRIC.rotate})`,
    `skewY(${inv * FABRIC.skew})`,
    `scale(${FABRIC.startScaleX + (1 - FABRIC.startScaleX) * P} 1)`,
    `translate(${-anchor.x} ${-anchor.y})`,
  ].join(' ');

  const strips = Array.from({length: FABRIC.stripCount}, (_, i) => i);
  // Travelling sine wave y(x). Each strip is sheared along the wave's local slope (skewY about the strip's centre)
  // so neighbouring strips join continuously and the fabric bends smoothly instead of stepping.
  const k = (Math.PI * 2 * FABRIC.waveCount) / (FABRIC.stripCount * FABRIC.stripWidth);
  const stripTransform = (i: number, lag: number) => {
    const xc = FABRIC.stripX0 + (i + 0.5) * FABRIC.stripWidth;
    const a = k * (xc - FABRIC.stripX0) - phase + lag;
    const dy = amp * Math.sin(a);
    const slope = amp * k * Math.cos(a);
    return `translate(${xc} ${dy}) matrix(1 ${slope} 0 1 0 0) translate(${-xc} 0)`;
  };

  return (
    <>
      <defs>
        {strips.map((i) => (
          <clipPath id={`fabric-strip-${i}`} key={i}>
            <rect x={FABRIC.stripX0 + i * FABRIC.stripWidth} y={230} width={FABRIC.stripWidth + 1} height={560} />
          </clipPath>
        ))}
      </defs>
      <g transform={outer}>
        {([
          [LAYERS.fabricUpper, 0],
          [LAYERS.fabricLower, FABRIC.lowerPhase],
        ] as const).map(([ids, lag], k) => (
          <g key={k}>
            {strips.map((i) => (
              <g key={i} clipPath={`url(#fabric-strip-${i})`}>
                <g transform={stripTransform(i, lag)}>
                  <PathGroup ids={ids} />
                </g>
              </g>
            ))}
          </g>
        ))}
      </g>
    </>
  );
};
