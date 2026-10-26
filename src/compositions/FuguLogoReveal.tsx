import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {SOURCE_GRADIENTS} from '../assets/logoSource';
import {Accents} from '../components/Accents';
import {Architecture} from '../components/Architecture';
import {Birds} from '../components/Birds';
import {ExperienceText} from '../components/ExperienceText';
import {FuguFabric} from '../components/FuguFabric';
import {FuguLetter} from '../components/FuguLetters';
import {Landscape} from '../components/Landscape';
import {Sun} from '../components/Sun';
import {Tamale2026} from '../components/Tamale2026';
import {Tree} from '../components/Tree';
import {Underline} from '../components/Underline';
import {BACKGROUND, CAMERA, COMP_SIZE, IMPACT, LAYOUT, SPRING} from '../config/animation';
import {EASE, progress, springAt} from '../lib/anim';

export type FuguLogoRevealProps = {
  /** QA helper: disables the final-hold push-in so the last frame can be compared 1:1 with the source art. */
  debugStaticCamera?: boolean;
  /** QA helper: render this exact frame regardless of the timeline (useful for stills). */
  debugFrame?: number;
};

/** Whole-composition scale: impact swell (Scene 6) followed by the slow hero push-in (Scene 7). */
const useCameraScale = (frame: number, staticCamera: boolean) => {
  const rise = progress(frame, IMPACT.start, IMPACT.start + IMPACT.riseFrames, EASE.out);
  const release = springAt(frame, IMPACT.start + IMPACT.riseFrames, SPRING.impactRelease);
  const impact = IMPACT.amount * rise * (1 - release);
  const push = staticCamera ? 0 : CAMERA.pushZoom * progress(frame, CAMERA.pushStart, CAMERA.pushEnd, EASE.inOut);
  return LAYOUT.baseScale * (1 + impact + push);
};

/**
 * FUGU EXPERIENCE — TAMALE 2026 square logo reveal.
 *
 * Layers are drawn in the SAME order as the paths appear in the source SVG, so the fully assembled
 * logo is stacked exactly like the original artwork.
 */
export const FuguLogoReveal: React.FC<FuguLogoRevealProps> = ({debugStaticCamera = false, debugFrame}) => {
  const current = useCurrentFrame();
  const frame = debugFrame ?? current;
  const scale = useCameraScale(frame, debugStaticCamera);
  const c = COMP_SIZE / 2;

  return (
    <AbsoluteFill style={{backgroundColor: BACKGROUND}}>
      <svg
        width={COMP_SIZE}
        height={COMP_SIZE}
        viewBox={`0 0 ${COMP_SIZE} ${COMP_SIZE}`}
        style={{position: 'absolute', inset: 0, overflow: 'visible'}}
      >
        <defs dangerouslySetInnerHTML={{__html: SOURCE_GRADIENTS}} />
        <g transform={`translate(${c} ${c}) scale(${scale}) translate(${-c} ${-c + LAYOUT.offsetY})`}>
          <Tamale2026 frame={frame} />
          <Accents frame={frame} />
          <Underline frame={frame} />
          <FuguLetter frame={frame} letter="G" />
          <FuguFabric frame={frame} />
          <FuguLetter frame={frame} letter="F" />
          <FuguLetter frame={frame} letter="U1" />
          <FuguLetter frame={frame} letter="U2" />
          <ExperienceText frame={frame} />
          <Sun frame={frame} />
          <Birds frame={frame} />
          <Architecture frame={frame} part="back" />
          <Tree frame={frame} />
          <Landscape frame={frame} />
          <Architecture frame={frame} part="front" />
        </g>
      </svg>
    </AbsoluteFill>
  );
};
