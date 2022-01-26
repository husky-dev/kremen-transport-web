import { TransportRoute } from '@core/api';
import { sortBy } from 'lodash';
import { colors, colorSetFromColor } from '@styles';

const defRouteColors = colorSetFromColor(colors.back);

export const defRoutePathColors = colorSetFromColor(colors.primary);
export const defRouteStationColors = colorSetFromColor(colors.primary);

export const offlineColors = colorSetFromColor(colors.lightGrey);

export const routeToColor = (route?: TransportRoute) =>
  route && route.color ? colorSetFromColor(route.color) : defRouteColors;

export const routeIdToColor = (rid: number, routes: TransportRoute[]) => {
  const route = routes.find(itm => itm.rid === rid);
  return route ? routeToColor(route) : defRouteColors;
};

export const clearRouteNumber = (val: string): string => {
  let mod = val.replace(/[ТтTt-]/g, '');
  mod = mod.trim();
  mod = mod.toUpperCase();
  return mod;
};

export const sortRoutes = (arr: TransportRoute[]): TransportRoute[] =>
  sortBy(arr, route => {
    const match = /(\d+)(-([\w\W]+))*/g.exec(route.number);
    const base = 1000;
    if (!match) {
      return base * 100;
    }
    if (!match[3]) {
      return parseInt(match[0], 10) * base;
    }
    return parseInt(match[0], 10) * base + match[3].charCodeAt(0);
  });

export const findRouteWithId = (itms: TransportRoute[], rid: number) => itms.find(itm => itm.rid === rid);
