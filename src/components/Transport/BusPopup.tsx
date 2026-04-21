import { TransportBus, TransportRoute } from '@/types';
import { mc, StyleProps } from '@/utils';
import React, { FC } from 'react';

import RouteCircle from './RouteCircle';

interface Props extends StyleProps {
  readonly bus: TransportBus;
  readonly route?: TransportRoute;
}

export const BusPopup: FC<Props> = ({ className, style, bus, route }) => (
  <div className={mc('flex flex-col gap-0.5 min-w-[120px] text-gray-900', className)} style={style}>
    <div className="flex flex-row items-center gap-2">
      {!!route && <RouteCircle route={route} size={20} />}
      <div className="flex-1 text-xs font-semibold">{bus.name}</div>
    </div>
    {(bus.speed > 0 || bus.offline) && (
      <div className="flex flex-row items-center gap-2 pl-0.5">
        {bus.speed > 0 && (
          <span className="text-xs text-gray-500">
            {Math.round(bus.speed)}
            {' км/год'}
          </span>
        )}
        {bus.offline && <span className="badge badge-xs badge-warning">{'офлайн'}</span>}
      </div>
    )}
  </div>
);

export default BusPopup;
