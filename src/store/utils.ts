import { useSelector as reduxUseSelector } from 'react-redux';
import { StoreState } from './reducers';

export function useSelector<TSelected = unknown>(
  selector: (state: StoreState) => TSelected,
  equalityFn?: (left: TSelected, right: TSelected) => boolean,
): TSelected {
  return reduxUseSelector(selector, equalityFn);
}
