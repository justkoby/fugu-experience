import React from 'react';
import {Composition} from 'remotion';
import {COMP_SIZE, DURATION_IN_FRAMES, FPS} from './config/animation';
import {FuguLogoReveal, type FuguLogoRevealProps} from './compositions/FuguLogoReveal';

/** Single square (1:1) composition — 1080 × 1080, 30 fps, 12 s, silent. */
export const RemotionRoot: React.FC = () => (
  <Composition
    id="FuguExperienceSquare"
    component={FuguLogoReveal}
    durationInFrames={DURATION_IN_FRAMES}
    fps={FPS}
    width={COMP_SIZE}
    height={COMP_SIZE}
    defaultProps={{debugStaticCamera: false} satisfies FuguLogoRevealProps}
  />
);
