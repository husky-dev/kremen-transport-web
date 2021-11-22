import { each, isArray, isBoolean } from 'lodash';

import { MergeStyleVals, Style } from './types';

/**
 * Merge styles
 * @param {MergeStyleVals} arr - styles
 */
export const m = (...arr: MergeStyleVals[]): Style => {
  if (!arr) {
    return {};
  }
  let style: Style = {};
  each(arr, (rawItem: MergeStyleVals) => {
    const item = isArray(rawItem) ? m(...rawItem) : rawItem;
    if (isBoolean(item)) {
      return;
    }
    if (!item) {
      return;
    }
    style = { ...style, ...item };
  });
  return style;
};

export const px = (val: number) => `${val}px`;
