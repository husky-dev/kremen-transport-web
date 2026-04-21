import { TransportRoute, TransportStation } from '@/types';
import { mc, StyleProps } from '@/utils';
import React, { FC } from 'react';

import { ArrowDown, ArrowUp } from '../Icons';
import RouteCircle from './RouteCircle';

interface Props extends StyleProps {
  readonly station: TransportStation;
  readonly route?: TransportRoute;
}

const StationPopupHeader: FC<Props> = ({ style, className, station, route }) => (
  <div style={style} className={mc('flex flex-row justify-start items-center text-gray-900', className)}>
    {route && <RouteCircle className="mr-1" route={route} size={20} />}
    <div className="mr-1 flex items-center">
      {station.directionForward ? (
        <ArrowDown className="w-4 h-4 text-blue-500" />
      ) : (
        <ArrowUp className="w-4 h-4 text-green-500" />
      )}
    </div>
    <div className="flex-1 font-semibold text-sm">{station.name}</div>
  </div>
);

export default StationPopupHeader;
