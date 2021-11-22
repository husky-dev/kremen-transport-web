import { isUnknowDict } from 'utils';

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

export const isApiRespErr = (val: unknown): val is ApiRespErr => isUnknowDict(val) && typeof val.error === 'string';

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
