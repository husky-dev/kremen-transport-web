import { Log } from '@core/log';
import axios from 'axios';

import { TransportBus, TransportPrediction, TransportRoute } from './types';
import { ApiReqOpt, getErrFromResp } from './utils';

const log = Log('core.api');

export const getApiRoot = () => ({
  api: 'https://api.kremen.dev',
  ws: 'wss://api.kremen.dev',
});

const getApi = () => {
  const apiRoot = getApiRoot();

  const apiReq = async <T>(opt: ApiReqOpt): Promise<T> => {
    const { path, method = 'get', params } = opt;
    const reqUrl = `${apiRoot.api}/${path}`;
    log.debug('api req', { url: reqUrl, params });
    const resp = await axios({ method, url: reqUrl, params });
    log.debug(`api req done`);
    const { status } = resp;
    const data = resp.data as unknown as T;
    const err = getErrFromResp(status, data);
    if (err) {
      throw err;
    }
    return data;
  };

  return {
    transport: {
      routes: async (): Promise<TransportRoute[]> => apiReq<TransportRoute[]>({ path: `transport/routes` }),
      buses: async (): Promise<TransportBus[]> => apiReq<TransportBus[]>({ path: `transport/buses` }),
      stationPrediction: async (sid: number): Promise<TransportPrediction[]> =>
        apiReq<TransportPrediction[]>({ path: `transport/stations/${sid}/prediction` }),
    },
  };
};

export const api = getApi();

export * from './types';
