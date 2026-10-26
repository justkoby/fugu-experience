import React from 'react';
import {SOURCE_PATHS} from '../assets/logoSource';

/** Renders original source paths (by index) with their original fills and coordinates. */
export const PathGroup: React.FC<{ids: readonly number[]}> = React.memo(({ids}) => (
  <>
    {ids.map((id) => {
      const p = SOURCE_PATHS[id];
      return <path key={id} d={p.d} fill={p.fill} />;
    })}
  </>
));
PathGroup.displayName = 'PathGroup';
