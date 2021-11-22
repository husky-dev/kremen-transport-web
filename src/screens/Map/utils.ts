import { getConf, setConf } from 'core';
import { LatLng } from 'utils';

export const getSelectedRoutesConf = (def: number[]): number[] => {
  const val = getConf<number[]>('routes');
  return val || def;
};

export const setSelectedRoutesConf = (val: number[]) => {
  setConf('routes', val);
};

export const getMapCenterConf = (defVal: LatLng): LatLng => {
  const rawVal = getConf('center');
  return rawVal || defVal;
};

export const setMapCenterConf = (val: LatLng) => {
  setConf('center', val);
};

export const getMapZoomConf = (defVal: number): number => {
  const rawVal = getConf('zoom');
  return rawVal || defVal;
};

export const setMapZoomConf = (val: number) => {
  setConf('zoom', val);
};
