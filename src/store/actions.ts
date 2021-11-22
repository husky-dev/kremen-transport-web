import { TransportBus, TransportRoute } from 'core/api';
import { Action } from 'redux';

export enum ActionType {
  TransportRoutesSet = 'transport/RoutesSet',
  TransportBusesSet = 'transport/BusesSet',
  TransportBusesMod = 'transport/BusesMod',
}

export type StoreAction =
  | (Action<ActionType.TransportRoutesSet> & { routes: TransportRoute[] })
  | (Action<ActionType.TransportBusesSet> & { buses: TransportBus[] })
  | (Action<ActionType.TransportBusesMod> & { data: Partial<TransportBus>[] });
