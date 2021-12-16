import { delayMs, errToStr } from '@utils';
import React, { createContext, FC, useContext, useEffect, useState } from 'react';

import { api, isTransportBusArrOrUndef, isTransportRouteArrOrUndef, TransportBus, TransportRoute } from '../api';
import { Log } from '../log';
import { useWebScockets } from '../ws';
import { getStorageParam } from './utils';

const log = Log('core.storage');

interface StorageContext {
  buses: TransportBus[];
  routes: TransportRoute[];
}

const StorageContext = createContext<StorageContext>({
  buses: [],
  routes: [],
});

export const useStorage = () => useContext(StorageContext);

const busesStorage = getStorageParam('buses', isTransportBusArrOrUndef);
const routesStorage = getStorageParam('routes', isTransportRouteArrOrUndef);

export const StorageProvider: FC = ({ children }) => {
  const [buses, setBuses] = useState<TransportBus[]>(busesStorage.get() || []);
  const [routes, setRoutes] = useState<TransportRoute[]>(routesStorage.get() || []);

  // Data updates

  useEffect(() => {
    updateData();
  }, []);

  const updateData = async () => {
    try {
      log.debug('load data from local storage');
      const localLoaded = isLoadedFromLocalStorage();
      if (!localLoaded) {
        log.debug('local data not found, making full update');
        await makeFullUpdate();
      } else {
        log.debug('local data found, making partly update first');
        await makePartlyUpdate();
        log.debug('making a delay');
        await delayMs(3000);
        await makeFullUpdate();
      }
    } catch (err: unknown) {
      log.err('update data err', { err: errToStr(err) });
    }
  };

  const isLoadedFromLocalStorage = (): boolean => {
    let loaded: boolean = true;
    if (!busesStorage.isExist()) loaded = false;
    if (!routesStorage.isExist()) loaded = false;
    return loaded;
  };

  const makeFullUpdate = async () => {
    try {
      log.debug('updating data');
      const [routes, buses] = await Promise.all([api.transport.routes(), api.transport.buses()]);
      log.debug('updating data done', { routes, buses });
      setAndSaveRoutes(routes);
      setAndSaveBuses(buses);
    } catch (err: unknown) {
      log.err('updating data err', { err: errToStr(err) });
    }
  };

  const makePartlyUpdate = async () => {
    log.debug('get buses locations');
    const busesLocations = await api.transport.busesLocations();
    log.debug('get buses locations done');
    log.debug('updating buses locations');
    let newBuses = buses;
    for (const tid in busesLocations) {
      const [lat, lng, direction, speed] = busesLocations[tid];
      newBuses = newBuses.map(itm => (itm.tid === tid ? { ...itm, lat, lng, direction, speed } : itm));
    }
    setAndSaveBuses(newBuses);
    log.debug('updating buses locations done');
  };

  // WebSockets updates

  const [locationsUpdate, setLocationsUpdate] = useState<Partial<TransportBus>[] | undefined>(undefined);

  useEffect(() => {
    if (!locationsUpdate) return;
    const newBuses = buses.map(itm => {
      const update = locationsUpdate.find(uitem => uitem.tid === itm.tid);
      return update ? { ...itm, ...update } : itm;
    });
    setAndSaveBuses(newBuses);
  }, [locationsUpdate]);

  useWebScockets({
    onMessage: msg => {
      if (msg.type === 'buses') {
        log.debug('ws buses update');
        setLocationsUpdate(msg.data);
      }
    },
  });

  // Utils

  const setAndSaveRoutes = (val: TransportRoute[]) => {
    setRoutes(val);
    routesStorage.set(val);
  };

  const setAndSaveBuses = (val: TransportBus[]) => {
    setBuses(val);
    busesStorage.set(val);
  };

  return <StorageContext.Provider value={{ buses, routes }}>{children}</StorageContext.Provider>;
};
