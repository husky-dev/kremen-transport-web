import { RouteCircle } from '@/components/Transport';
import RouteSelectGroup from '@/components/Transport/RouteSelectGroup';
import { sortRoutes } from '@/core/transport';
import { TransportRoute } from '@/types';
import { compact, groupBy, mc, ms, StyleProps } from '@/utils';
import React, { FC } from 'react';

interface Props extends StyleProps {
  routes: TransportRoute[];
  selected: number[];
  onSelectedChange: (selected: number[]) => void;
}

export const RoutesPanel: FC<Props> = ({ style, className, routes, selected, onSelectedChange }) => {
  const { troutes = [], broutes = [] } = groupBy(routes, route => (route.number.indexOf('Т') === -1 ? 'broutes' : 'troutes'));
  const selectedRoutes = sortRoutes(compact(selected.map(rid => routes.find(item => item.rid === rid))));

  return (
    <div style={ms(style)} className={mc('bg-base-100 rounded-lg', className)}>
      <div className={mc('collapse collapse-arrow')}>
        <input type="checkbox" />
        <div className={mc('collapse-title', 'flex flex-row flex-wrap')}>
          {selectedRoutes.map(route => (
            <RouteCircle key={route.rid} className="mr-1.5 mb-1.5" route={route} />
          ))}
        </div>
        <div className={mc('collapse-content')}>
          <RouteSelectGroup title="Тролейбуси" routes={troutes} selected={selected} onSelectedChange={onSelectedChange} />
          <RouteSelectGroup title="Маршрутки" routes={broutes} selected={selected} onSelectedChange={onSelectedChange} />
        </div>
      </div>
    </div>
  );
};
