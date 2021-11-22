import { api, TransportBus } from 'core';
import { Dispatch } from 'react';
import { useDispatch } from 'react-redux';
import { Log } from 'utils';

import { ActionType, StoreAction } from './actions';

const log = Log('store.Manager');

export const useStoreManager = () => {
  const dispatch = useDispatch<Dispatch<StoreAction>>();

  const updateRoutes = async () => {
    log.debug('getting routes');
    log.start('getRoutes');
    const routes = await api.transport.routes();
    log.end('getRoutes');
    log.debug('getting routes done');
    dispatch({ type: ActionType.TransportRoutesSet, routes });
  };

  const updateBusses = async () => {
    log.debug('getting buses');
    log.start('getBuses');
    const buses = await api.transport.buses();
    log.end('getBuses');
    log.debug('getting buses done');
    dispatch({ type: ActionType.TransportBusesSet, buses });
  };

  const modBuses = (data: Partial<TransportBus>[]) => dispatch({ type: ActionType.TransportBusesMod, data });

  const updateCommonData = async () => Promise.all([updateRoutes(), updateBusses()]);

  return {
    updateRoutes,
    updateBusses,
    modBuses,
    updateCommonData,
  };
};
