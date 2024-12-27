import { TransportRoute } from '@/types';
import { ColorsSet } from '@/utils';
import React, { FC, useMemo } from 'react';

import { Polyline } from './Polyline';

interface Props {
  route: TransportRoute;
  colors: ColorsSet;
  opacity?: number;
  zIndex?: number;
}

export const RoutePath: FC<Props> = ({ route, colors, opacity = 0.7, zIndex = 0 }) => {
  const path = route.path.map(([lat, lng]) => ({ lat, lng }));
  return useMemo(
    () => <Polyline path={path} strokeWeight={3} strokeColor={colors.light} strokeOpacity={opacity} zIndex={zIndex} />,
    [route.path, colors.light, colors.dark, opacity, zIndex],
  );
};

export default RoutePath;
