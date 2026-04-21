import { findRouteWithId } from '@/core/transport';
import React, { FC } from 'react';

import { sortBy, StyleProps } from '@/utils';
import { TransportPrediction, TransportRoute, TransportStation } from '@/types';
import RouteCircle from './RouteCircle';

interface Props extends StyleProps {
  readonly routes: TransportRoute[];
  readonly station: TransportStation;
  readonly predictions: TransportPrediction[];
}

const numToTimeStr = (val: number): { numStr: string; metric: string } => {
  if (val < 60) {
    return { numStr: `${val}`, metric: 'с' };
  }
  const mins = Math.ceil(val / 60);
  return { numStr: `${mins}`, metric: 'хв' };
};

export const StationPredictionsList: FC<Props> = ({ className, predictions: predictionsRaw, station, routes }) => {
  const stationPrediction = predictionsRaw.filter(item => item.reverse !== station.directionForward);
  const predictions = sortBy(stationPrediction, 'prediction');

  return (
    <div className={`grid grid-cols-2 gap-x-3 gap-y-1 ${className ?? ''}`}>
      {predictions.map(item => {
        const route = findRouteWithId(routes, item.rid);
        if (!route) return null;
        const { numStr, metric } = numToTimeStr(item.prediction);
        return (
          <div key={item.tid} className="flex flex-row items-center gap-1.5">
            <RouteCircle route={route} size={18} />
            <div className="flex flex-row items-center">
              <span className="font-semibold tabular-nums">{numStr}</span>
              <span className="text-xs text-gray-500 ml-0.5">
                {metric}
                {'.'}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StationPredictionsList;
