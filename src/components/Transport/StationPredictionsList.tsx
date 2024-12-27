/* eslint-disable react/no-array-index-key */

import { findRouteWithId } from '@/core/transport';
import React, { FC } from 'react';

import { ms, sortBy, StyleProps, Styles } from '@/utils';
import { TransportPrediction, TransportRoute, TransportStation } from '@/types';
import RouteCircle from './RouteCircle';

interface Props extends StyleProps {
  routes: TransportRoute[];
  station: TransportStation;
  predictions: TransportPrediction[];
}

const numToTimeStr = (val: number): { numStr: string; metric: string } => {
  if (val < 60) {
    return { numStr: `${val}`, metric: 'с' };
  }
  const mins = Math.ceil(val / 60);
  return { numStr: `${mins}`, metric: 'хв' };
};

const getItemsSplitByRows = (items: TransportPrediction[]): TransportPrediction[][] => {
  const rows: TransportPrediction[][] = [[]];
  items.forEach((item, index) => {
    if (index % 2 === 0) {
      rows.push([]);
    }
    rows[rows.length - 1].push(item);
  });
  return rows;
};

export const StationPredictionsList: FC<Props> = ({ style, predictions: predictionsRaw, station, routes }) => {
  const stationPrediction = predictionsRaw.filter(item => item.reverse !== station.directionForward);
  const predictions = sortBy(stationPrediction, 'prediction');

  const renderPrediction = (item: TransportPrediction, index: number) => {
    const route = findRouteWithId(routes, item.rid);
    if (!route) {
      return null;
    }
    const { numStr, metric } = numToTimeStr(item.prediction);
    return (
      <div key={index} style={styles.item} className="flex flex-row items-center">
        <RouteCircle style={styles.rowCircle} route={route} size={20} />
        <div style={styles.rowVal} className="flex flex-row items-center">
          {`${numStr} ${metric}.`}
        </div>
      </div>
    );
  };

  const rows: TransportPrediction[][] = getItemsSplitByRows(predictions);

  return (
    <div style={ms(styles.container, style)}>
      {rows.map((row, index) => (
        <div key={index} style={ms(styles.row, index !== 0 && styles.rowIndent)} className="flex flex-row items-center">
          {row.map(renderPrediction)}
        </div>
      ))}
    </div>
  );
};

const styles: Styles = {
  container: {},
  row: {},
  rowCircle: {
    marginRight: 5,
  },
  rowVal: {
    flex: 1,
    textAlign: 'left',
  },
  rowIndent: {
    marginTop: 3,
  },
  item: {
    flex: 1,
  },
};

export default StationPredictionsList;
