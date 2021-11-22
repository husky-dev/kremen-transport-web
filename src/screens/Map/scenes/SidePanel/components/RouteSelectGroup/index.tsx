import { Checkbox, View } from 'components/Common';
import { TransportRoute } from 'core/api';
import { includes, uniq } from 'lodash';
import React, { FC, ReactNode } from 'react';
import { m, Styles, ViewStyleProps } from 'styles';

import RouteSelectItem from './components/RouteSelectItem';

interface Props extends ViewStyleProps {
  title: string;
  routes: TransportRoute[];
  selected: number[];
  onSelectedChange: (selected: number[]) => void;
}

export const RouteSelectGroup: FC<Props> = ({ style, routes, selected, title, onSelectedChange }) => {
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
      <View key={index} style={styles.row} row={true}>
        {renderCheckboxesRow(group, 3)}
      </View>
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
            checked={includes(selected, items[i].rid)}
            onChange={onRouteSelectChange}
          />
        ) : (
          <View key={i} style={styles.checkbox} />
        ),
      );
    }
    return content;
  };

  const groupChecked: boolean = !!selected.find(rid => Boolean(routes.find(route => route.rid === rid)));

  return (
    <View style={m(styles.container, style)}>
      <View style={styles.titleWrap} row={true} justifyContent="flex-start" alignItems="center">
        <Checkbox checked={groupChecked} onChange={onGroupCheckboxChange} />
        <View style={styles.title}>{title}</View>
      </View>
      <View style={styles.rows}>{renderCheckboxes(routes)}</View>
    </View>
  );
};

const styles: Styles = {
  container: {},
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
