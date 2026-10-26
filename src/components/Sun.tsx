import React from 'react';
import {LAYERS} from '../assets/layers';
import {SCENES, SUN} from '../config/animation';
import {EASE, bell, progress} from '../lib/anim';
import {PathGroup} from '../lib/PathGroup';

/** Scene 1 — the golden sun rises from behind the horizon, glows warmly and settles with a gentle swell. */
export const Sun: React.FC<{frame: number}> = ({frame}) => {
  const {end} = SCENES.sun;
  if (frame >= end) return <PathGroup ids={LAYERS.sun} />;

  const rise = progress(frame, 0, SUN.riseEnd, EASE.cinematic);
  const anticipation = SUN.anticipation * bell(frame, 0, 10);
  const dy = (1 - rise) * SUN.riseDistance + anticipation;
  const swell = 1 + SUN.expand * bell(frame, SUN.expandRange[0], SUN.expandRange[1]);
  const glow = SUN.glow.opacity * bell(frame, SUN.glow.range[0], SUN.glow.range[1]);
  const {x, y} = SUN.origin;
  const u = SUN.underlay;
  const underlay = 1 - progress(frame, u.fadeRange[0], u.fadeRange[1], EASE.inOut);

  return (
    <>
      <defs>
        <clipPath id="sun-horizon">
          <rect x={0} y={0} width={1080} height={SUN.horizonY} />
        </clipPath>
        <filter id="sun-glow" filterUnits="userSpaceOnUse" x={-100} y={-100} width={1280} height={1280}>
          <feGaussianBlur stdDeviation={SUN.glow.blur} />
        </filter>
      </defs>
      <g clipPath="url(#sun-horizon)">
        {glow > 0.005 && (
          <g
            filter="url(#sun-glow)"
            opacity={glow}
            transform={`translate(0 ${dy}) translate(${x} ${y}) scale(${swell * 1.12}) translate(${-x} ${-y})`}
          >
            <PathGroup ids={LAYERS.sun} />
          </g>
        )}
        <g transform={`translate(0 ${dy}) translate(${x} ${y}) scale(${swell}) translate(${-x} ${-y})`}>
          {underlay > 0.002 && <circle cx={u.cx} cy={u.cy} r={u.r} fill={u.fill} opacity={underlay} />}
          <PathGroup ids={LAYERS.sun} />
        </g>
      </g>
    </>
  );
};
