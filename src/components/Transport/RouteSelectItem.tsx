import { clearRouteNumber, routeToColor } from '@/core/transport';
import React, { FC } from 'react';
import { ms, Styles, StyleProps, mc } from '@/utils';
import { TransportRoute } from '@/types';
import { FormColoredCheckbox } from '../Forms';

interface Props extends StyleProps {
  checked?: boolean;
  route: TransportRoute;
  onChange: (route: TransportRoute, val: boolean) => void;
}

export const RouteSelectItem: FC<Props> = ({ style, className, checked, route, onChange }) => (
  <div className={mc('flex flex-row', className)} style={ms(styles.container, style)}>
    <FormColoredCheckbox checked={checked} color={routeToColor(route).light} onChange={(val: boolean) => onChange(route, val)} />
    <div style={styles.title}>{clearRouteNumber(route.number)}</div>
  </div>
);

const styles: Styles = {
  container: {
    alignItems: 'center',
  },
  title: {
    marginLeft: 10,
  },
};

export default RouteSelectItem;
