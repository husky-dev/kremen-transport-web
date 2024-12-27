import { TransportRoute, TransportStation } from '@/types';
import { colors, colorSetFromColor, uniqBy } from '@/utils';

const defRouteColors = colorSetFromColor(colors.back);

export const defRoutePathColors = colorSetFromColor(colors.primary);
export const defRouteStationColors = colorSetFromColor(colors.primary);

export const offlineColors = colorSetFromColor(colors.lightGrey);

export const routeToColor = (route?: TransportRoute) => (route && route.color ? colorSetFromColor(route.color) : defRouteColors);

export const routeIdToColor = (rid: number, routes: TransportRoute[]) => {
  const route = routes.find(itm => itm.rid === rid);
  return route ? routeToColor(route) : defRouteColors;
};

export const clearRouteNumber = (val: string): string =>
  val
    .replace(/[ТтTt-\s]/g, '')
    .trim()
    .toUpperCase();

export const sortRoutes = (arr: TransportRoute[]): TransportRoute[] =>
  arr.sort((a, b) => getRouteSortWeight(a) - getRouteSortWeight(b));

const getRouteSortWeight = (route: TransportRoute): number => {
  const match = /(\d+)(-([\w\W]+))*/g.exec(route.number);
  const base = 1000;
  if (!match) {
    return base * 100;
  }
  if (!match[3]) {
    return parseInt(match[0], 10) * base;
  }
  return parseInt(match[0], 10) * base + match[3].charCodeAt(0);
};

export const findRouteWithId = (itms: TransportRoute[], rid: number) => itms.find(itm => itm.rid === rid);

export const routesToStatiosn = (routes: TransportRoute[]): TransportStation[] => {
  const stations: TransportStation[] = [];
  routes.forEach(route => {
    stations.push(...route.stations);
  });
  return uniqBy(stations, 'sid');
};
