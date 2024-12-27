import { clearRouteNumber, routeToColor } from '@/core/transport';
import { TransportRoute } from '@/types';
import { colors, ColorsSet, ms, StyleProps, Styles } from '@/utils';
import React, { FC } from 'react';

interface Props extends StyleProps {
  route: TransportRoute;
  size?: number;
}

export const RouteCircle: FC<Props> = ({ className, style, route, size }) => {
  const text = clearRouteNumber(route.number);
  const colorsSet = routeToColor(route);
  const fontSize = basicFontSize(text);
  const styles = getStyles(size, colorsSet, fontSize);
  return (
    <div className={className} style={ms(styles.container, style)}>
      {text}
    </div>
  );
};

const basicFontSize = (text: string): number => {
  if (text.length === 1) {
    return 14;
  }
  if (text.length === 2) {
    return 12;
  }
  if (text.length === 3) {
    return 10;
  }
  if (text.length === 4) {
    return 10;
  }
  return 10;
};

const getStyles = (size: number = 24, colorsSet: ColorsSet, fontSize: number): Styles => ({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: size,
    height: size,
    borderRadius: '50%',
    fontSize: `${fontSize * (size / 24)}px`,
    backgroundColor: colorsSet.light,
    color: colors.white,
  },
});

export default RouteCircle;
