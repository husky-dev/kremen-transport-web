import { isArr, isNull, isNum, isStr, isUndef, isUnknownDict } from '@utils';

import { TransportBus, TransportRoute } from './types';

interface HttpReqParams {
  [key: string]: undefined | string | number;
}

type HttpReqMethod = 'get' | 'delete' | 'head' | 'options' | 'post' | 'put' | 'patch';

export interface ApiReqOpt {
  method?: HttpReqMethod;
  path: string;
  params?: HttpReqParams;
}

export interface ApiRespErr {
  error: string;
}

export interface ApiErr {
  status: number;
  msg: string;
}

export const isApiRespErr = (val: unknown): val is ApiRespErr => isUnknownDict(val) && typeof val.error === 'string';

export const getErrFromResp = <T>(status: number, data: T): ApiErr | undefined => {
  if (status === 200) {
    return undefined;
  }
  if (isApiRespErr(data)) {
    return { status, msg: data.error };
  }
  if (status > 299) {
    return { status, msg: `Status code ${status}` };
  }
  return undefined;
};

// Guards

export const isTransportRoute = (val: unknown): val is TransportRoute => isUnknownDict(val) && isNum(val.rid);

export const isTransportRouteArr = (val: unknown): val is TransportRoute[] =>
  isArr(val) && val.reduce<boolean>((memo, itm) => memo && isTransportRoute(itm), true);

export const isTransportRouteArrOrUndef = (val: unknown): val is TransportRoute[] | undefined =>
  isTransportRouteArr(val) || isUndef(val);

export const isTransportBus = (val: unknown): val is TransportBus => isUnknownDict(val) && isStr(val.tid);

export const isTransportBusArr = (val: unknown): val is TransportBus[] =>
  isArr(val) && val.reduce<boolean>((memo, itm) => memo && isTransportBus(itm), true);

export const isTransportBusArrOrUndef = (val: unknown): val is TransportBus[] | undefined =>
  isTransportBusArr(val) || isUndef(val);
