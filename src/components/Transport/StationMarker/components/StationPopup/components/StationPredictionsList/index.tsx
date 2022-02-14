import { View } from '@components/Common';
import { RouteCircle } from '@components/Transport';
import { findRouteWithId, TransportRoute } from '@core';
import { TransportPrediction, TransportStation } from '@core/api';
import { m, Styles, ViewStyleProps } from '@styles';
import { sortBy } from 'lodash';
import React, { FC } from 'react';

import { getItemsSplitByRows, numToTimeStr } from './utils';

interface Props extends ViewStyleProps {
  routes: TransportRoute[];
  station: TransportStation;
  predictions: TransportPrediction[];
}

const StationPredictionsTwoColumn: FC<Props> = ({ style, predictions: predictionsRaw, station, routes }) => {
  const stationPrediction = predictionsRaw.filter(item => item.reverse !== station.directionForward);
  const predictions = sortBy(stationPrediction, item => item.prediction);

  const renderPrediction = (item: TransportPrediction, index: number) => {
    const route = findRouteWithId(routes, item.rid);
    if (!route) {
      return null;
    }
    const { numStr, metric } = numToTimeStr(item.prediction);
    return (
      <View key={index} style={styles.item} row={true} alignItems="center">
        <RouteCircle style={styles.rowCircle} route={route} size={20} />
        <View style={styles.rowVal} row={true} alignItems="center">
          {`${numStr} ${metric}.`}
        </View>
      </View>
    );
  };

  const rows: TransportPrediction[][] = getItemsSplitByRows(predictions);

  return (
    <View style={m(styles.container, style)}>
      {rows.map((row, index) => (
        <View key={index} style={m(styles.row, index !== 0 && styles.rowIndent)} row={true} alignItems="center">
          {row.map(renderPrediction)}
        </View>
      ))}
    </View>
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

export default StationPredictionsTwoColumn;
