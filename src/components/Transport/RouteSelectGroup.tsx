import { TransportRoute } from '@/types';
import { mc, StyleProps, uniq } from '@/utils';
import React, { FC } from 'react';
import RouteSelectItem from './RouteSelectItem';
import { FormColoredCheckbox } from '../Forms';

interface Props extends StyleProps {
  readonly title: string;
  readonly routes: TransportRoute[];
  readonly selected: number[];
  readonly onSelectedChange: (selected: number[]) => void;
}

export const RouteSelectGroup: FC<Props> = ({ style, className, routes, selected, title, onSelectedChange }) => {
  const onRouteSelectChange = ({ rid }: TransportRoute, val: boolean) => {
    const newSelected = val ? [...selected, rid] : selected.filter(id => id !== rid);
    onSelectedChange(newSelected);
  };

  const onGroupCheckboxChange = (checked: boolean) => {
    if (checked) {
      onSelectedChange(uniq([...selected, ...routes.map(item => item.rid)]));
    } else {
      onSelectedChange(selected.filter(rid => !routes.find(route => route.rid === rid)));
    }
  };

  const groupChecked: boolean = !!selected.find(rid => Boolean(routes.find(route => route.rid === rid)));

  return (
    <div style={style} className={mc(className)}>
      <div className="flex flex-row items-center mb-1.5">
        <FormColoredCheckbox checked={groupChecked} onChange={onGroupCheckboxChange} />
        <span className="font-semibold text-sm ml-2.5 py-1">{title}</span>
      </div>
      <div className="grid grid-cols-3 gap-y-0.5 mb-1">
        {routes.map(route => (
          <RouteSelectItem key={route.rid} route={route} checked={selected.includes(route.rid)} onChange={onRouteSelectChange} />
        ))}
      </div>
    </div>
  );
};

export default RouteSelectGroup;
