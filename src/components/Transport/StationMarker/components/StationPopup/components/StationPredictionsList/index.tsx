import { View } from 'components/Common';
import { RouteCircle } from 'components/Transport';
import { findRouteWithId } from 'core';
import { TransportPrediction, TransportStation } from 'core/api';
import { sortBy } from 'lodash';
import React, { FC } from 'react';
import { useSelector } from 'store';
import { m, Styles, ViewStyleProps } from 'styles';

import { getItemsSplitByColumns, numToTimeStr } from './utils';

interface Props extends ViewStyleProps {
  station: TransportStation;
  predictions: TransportPrediction[];
}

const StationPredictionsTwoColumn: FC<Props> = ({ style, predictions: predictionsRaw, station }) => {
  const stationPrediction = predictionsRaw.filter(item => item.reverse !== station.directionForward);
  const predictions = sortBy(stationPrediction, item => item.prediction);

  const routes = useSelector(s => s.transport.routes);

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

  const rows: TransportPrediction[][] = getItemsSplitByColumns(predictions);

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
