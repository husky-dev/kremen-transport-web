import { isNum, isUndef, isUnknownDict } from '@/utils';

export interface LatLng {
  lat: number;
  lng: number;
}

export const isLatLng = (val: unknown): val is LatLng => isUnknownDict(val) && isNum(val.lat) && isNum(val.lng);

export const isLatLngOrUndef = (val: unknown): val is LatLng | undefined => isLatLng(val) || isUndef(val);

export const coordinates = {
  kremen: { lat: 49.07041247214882, lng: 33.42281959697266 },
};
