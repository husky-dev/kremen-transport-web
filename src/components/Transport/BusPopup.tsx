import { TransportBus, TransportRoute } from '@/types';
import { mc, StyleProps } from '@/utils';
import React, { FC } from 'react';

import RouteCircle from './RouteCircle';

interface Props extends StyleProps {
  bus: TransportBus;
  route?: TransportRoute;
}

export const BusPopup: FC<Props> = ({ className, style, bus, route }) => (
  <div className={mc('flex flex-row items-center justify-start', className)} style={style}>
    {!!route && <RouteCircle className="mr-2" route={route} size={20} />}
    <div className={mc('flex-1', 'text-xs font-semibold')}>{bus.name}</div>
  </div>
);

export default BusPopup;
