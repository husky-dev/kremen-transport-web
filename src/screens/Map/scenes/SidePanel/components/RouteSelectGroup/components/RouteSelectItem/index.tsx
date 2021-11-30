import { Checkbox, View } from '@components/Common';
import { clearRouteNumber, routeToColor } from '@core';
import { TransportRoute } from '@core/api';
import React, { FC } from 'react';
import { m, Styles, ViewStyleProps } from '@styles';

interface Props extends ViewStyleProps {
  checked?: boolean;
  route: TransportRoute;
  onChange: (route: TransportRoute, val: boolean) => void;
}

export const RouteSelectItem: FC<Props> = ({ style, checked, route, onChange }) => (
  <View style={m(styles.container, style)} row={true}>
    <Checkbox checked={checked} color={routeToColor(route).light} onChange={(val: boolean) => onChange(route, val)} />
    <div style={styles.title}>{clearRouteNumber(route.number)}</div>
  </View>
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
