import { TransportRoute, TransportStation } from '@core';
import { uniqBy } from 'lodash';

export const routesToStatiosn = (routes: TransportRoute[]): TransportStation[] => {
  const stations: TransportStation[] = [];
  routes.forEach(route => {
    stations.push(...route.stations);
  });
  return uniqBy(stations, station => station.sid);
};
