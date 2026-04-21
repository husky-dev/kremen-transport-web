import { ThemeSwitchBtn } from '@/components/Buttons';
import { RouteCircle } from '@/components/Transport';
import RouteSelectGroup from '@/components/Transport/RouteSelectGroup';
import { sortRoutes } from '@/core/transport';
import { routes as appRoutes } from '@/pages/routes';
import { TransportRoute } from '@/types';
import { compact, groupBy, mc, ms, StyleProps } from '@/utils';
import React, { FC } from 'react';
import { Link } from 'react-router-dom';

interface Props extends StyleProps {
  readonly routes: TransportRoute[];
  readonly selected: number[];
  readonly activeBusCount?: number;
  readonly onSelectedChange: (selected: number[]) => void;
}

export const RoutesPanel: FC<Props> = ({ style, className, routes, selected, activeBusCount, onSelectedChange }) => {
  const { troutes = [], broutes = [] } = groupBy(routes, route => (route.number.indexOf('Т') === -1 ? 'broutes' : 'troutes'));
  const selectedRoutes = sortRoutes(compact(selected.map(rid => routes.find(item => item.rid === rid))));

  return (
    <div style={ms(style)} className={mc('bg-base-100 rounded-lg', className)}>
      <div className="flex flex-row items-center justify-between px-3 pt-2 pb-1">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-base">{'#Кремінь.Транспорт'}</span>
          {activeBusCount !== undefined && activeBusCount > 0 && (
            <span className="badge badge-primary badge-sm tabular-nums">{activeBusCount}</span>
          )}
        </div>
        <ThemeSwitchBtn className="btn btn-square btn-ghost btn-sm" />
      </div>
      <div className={mc('collapse collapse-arrow')}>
        <input type="checkbox" />
        <div className={mc('collapse-title', 'flex flex-row flex-wrap items-center min-h-10')}>
          {selectedRoutes.length > 0 ? (
            selectedRoutes.map(route => <RouteCircle key={route.rid} className="mr-1.5 mb-1.5" route={route} />)
          ) : (
            <span className="text-sm text-base-content/50 italic">{'Оберіть маршрути...'}</span>
          )}
        </div>
        <div className={mc('collapse-content')}>
          <RouteSelectGroup title="Тролейбуси" routes={troutes} selected={selected} onSelectedChange={onSelectedChange} />
          <RouteSelectGroup title="Маршрутки" routes={broutes} selected={selected} onSelectedChange={onSelectedChange} />
          <div className="flex flex-row justify-end gap-2 pt-1 border-t border-base-300 mt-1">
            <button type="button" className="btn btn-xs btn-ghost" onClick={() => onSelectedChange(routes.map(r => r.rid))}>
              {'Всі'}
            </button>
            <button type="button" className="btn btn-xs btn-ghost" onClick={() => onSelectedChange([])}>
              {'Жодного'}
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-row gap-4 px-3 py-2 border-t border-base-300">
        <Link to={appRoutes.about} className="text-xs text-base-content/60 hover:text-base-content transition-colors">
          {'Про додаток'}
        </Link>
        <Link to={appRoutes.privacy} className="text-xs text-base-content/60 hover:text-base-content transition-colors">
          {'Політика конфіденційності'}
        </Link>
      </div>
    </div>
  );
};
