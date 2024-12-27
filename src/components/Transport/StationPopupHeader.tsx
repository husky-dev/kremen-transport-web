import { TransportRoute, TransportStation } from '@/types';
import { colors, mc, StyleProps, Styles } from '@/utils';
import React, { FC } from 'react';

import { ArrowDown, ArrowUp } from '../Icons';
import RouteCircle from './RouteCircle';

interface Props extends StyleProps {
  station: TransportStation;
  route?: TransportRoute;
}

const StationPopupHeader: FC<Props> = ({ style, className, station, route }) => (
  <div style={style} className={mc('flex flex-row justify-start items-center', className)}>
    {route && <RouteCircle style={styles.circle} route={route} size={20} />}
    <div style={styles.direction}>
      {station.directionForward ? (
        <ArrowDown className="w-4 h-4" style={styles.iconDown} />
      ) : (
        <ArrowUp className="w-4 h-4" style={styles.iconUp} />
      )}
    </div>
    <div style={styles.title} className="flex-1">
      {station.name}
    </div>
  </div>
);

const styles: Styles = {
  circle: {
    marginRight: 3,
  },
  direction: {
    fontSize: '20px',
    marginRight: 3,
    fontWeight: 'bold',
  },
  iconUp: {
    color: colors.green,
  },
  iconDown: {
    color: colors.blue,
  },
  title: {
    fontWeight: 'bold',
  },
  loading: {
    marginTop: 6,
    height: 20,
    overflow: 'hidden',
  },
  predictions: {
    marginTop: 6,
  },
  err: {
    marginTop: 3,
  },
};

export default StationPopupHeader;
