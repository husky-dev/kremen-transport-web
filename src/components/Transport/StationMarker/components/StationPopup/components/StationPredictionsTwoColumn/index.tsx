import { View } from '@components/Common';
import { RouteCircle } from '@components/Transport';
import { findRouteWithId, sortRoutes } from '@core';
import { TransportPrediction, TransportRoute, TransportStation } from '@core/api';
import { compact, sortBy, uniq } from 'lodash';
import React, { FC } from 'react';
import { m, Styles, ViewStyleProps } from '@styles';

interface Props extends ViewStyleProps {
  routes: TransportRoute[];
  station: TransportStation;
  predictions: TransportPrediction[];
}

const numToTimeStr = (val: number): string => {
  if (val < 60) {
    return `${val} с.`;
  }
  const mins = Math.ceil(val / 60);
  return `${mins} хв.`;
};

const StationPredictionsTwoColumn: FC<Props> = ({ style, predictions, station, routes }) => {
  const rids = uniq(predictions.map(item => item.rid));
  const predictionRoutes = sortRoutes(compact(rids.map(rid => findRouteWithId(routes, rid))));

  const timesForRoute = (route: TransportRoute): number[] => {
    const items = predictions.filter(item => item.rid === route.rid && item.reverse !== station.directionForward);
    if (!items.length) {
      return [];
    }
    if (items.length === 1) {
      return [items[0].prediction];
    }
    return sortBy(items, item => item.prediction).map(item => item.prediction);
  };

  const renderRoute = (route: TransportRoute, index: number) => {
    const [closest, next] = timesForRoute(route);
    return (
      <View key={route.rid} style={m(styles.row, index !== 0 && styles.rowIndent)} row={true} alignItems="center">
        <RouteCircle style={styles.rowCircle} route={route} size={20} />
        <View style={styles.rowVal}>{closest ? numToTimeStr(closest) : '-'}</View>
        <View style={styles.rowVal}>{next ? numToTimeStr(next) : '-'}</View>
      </View>
    );
  };

  return (
    <View style={m(styles.container, style)}>
      <View style={styles.header} row={true}>
        <View style={styles.rowVal}>{'Найближч.'}</View>
        <View style={styles.rowVal}>{'Наступ.'}</View>
      </View>
      {predictionRoutes.map(renderRoute)}
    </View>
  );
};

const styles: Styles = {
  container: {},
  row: {},
  header: {
    paddingLeft: 25,
    fontSize: '12px',
  },
  rowCircle: {
    marginRight: 5,
  },
  rowVal: {
    flex: 1,
  },
  rowIndent: {
    marginTop: 3,
  },
};

export default StationPredictionsTwoColumn;
