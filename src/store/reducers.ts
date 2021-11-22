import { ReducersMapObject } from 'redux';
import { StoreAction } from './actions';
import { TransportState, reducer as transport } from './transport/reducer';

export interface StoreState {
  transport: TransportState;
}

export const reducers: ReducersMapObject<StoreState, StoreAction> = {
  transport,
};
