import { TransportRoute } from '@/types';
import { mc, StyleProps, uniq } from '@/utils';
import { ms, Styles } from '@/utils';
import React, { FC, ReactNode } from 'react';
import RouteSelectItem from './RouteSelectItem';
import { FormColoredCheckbox } from '../Forms';

interface Props extends StyleProps {
  title: string;
  routes: TransportRoute[];
  selected: number[];
  onSelectedChange: (selected: number[]) => void;
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

  const renderCheckboxes = (items: TransportRoute[]) => {
    const groups: TransportRoute[][] = [[]];
    items.forEach((item, index) => {
      if (index % 3 === 0) {
        groups.push([]);
      }
      groups[groups.length - 1].push(item);
    });
    return groups.map((group, index) => (
      // eslint-disable-next-line react/no-array-index-key
      <div key={`${index}`} className={mc('flex flex-row')} style={styles.row}>
        {renderCheckboxesRow(group, 3)}
      </div>
    ));
  };

  const renderCheckboxesRow = (items: TransportRoute[], count: number) => {
    const content: ReactNode[] = [];
    for (let i = 0; i < count; i++) {
      content.push(
        items[i] ? (
          <RouteSelectItem
            key={items[i].rid}
            style={styles.checkbox}
            route={items[i]}
            checked={selected.includes(items[i].rid)}
            onChange={onRouteSelectChange}
          />
        ) : (
          <div key={i} style={styles.checkbox} />
        ),
      );
    }
    return content;
  };

  const groupChecked: boolean = !!selected.find(rid => Boolean(routes.find(route => route.rid === rid)));

  return (
    <div style={style} className={mc(className)}>
      <div style={styles.titleWrap} className="flex flex-row items-center justify-start">
        <FormColoredCheckbox checked={groupChecked} onChange={onGroupCheckboxChange} />
        <div style={styles.title}>{title}</div>
      </div>
      <div style={styles.rows}>{renderCheckboxes(routes)}</div>
    </div>
  );
};

const styles: Styles = {
  checkbox: {
    flex: 1,
  },
  titleWrap: {
    marginBottom: 5,
  },
  title: {
    fontWeight: 'bold',
    paddingTop: 5,
    paddingBottom: 5,
    marginLeft: 10,
  },
  rows: {
    marginBottom: 5,
  },
  row: {
    paddingTop: 2,
    paddingBottom: 2,
  },
};

export default RouteSelectGroup;
