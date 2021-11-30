import React, { FC, useMemo } from 'react';
import { Polyline } from 'react-google-maps';
import { ColorsSet } from '@styles';
import { TransportRoute } from '@core/api';

interface Props {
  route: TransportRoute;
  colors: ColorsSet;
  opacity?: number;
  zIndex?: number;
}

export const RoutePath: FC<Props> = ({ route, colors, opacity = 0.7, zIndex = 0 }) => {
  const path = route.path.map(([lat, lng]) => ({ lat, lng }));
  return useMemo(
    () => (
      <Polyline path={path} options={{ strokeWeight: 5, strokeColor: colors.light, strokeOpacity: opacity, zIndex }} />
    ),
    [route.path, colors.light, colors.dark, opacity, zIndex],
  );
};

export default RoutePath;
