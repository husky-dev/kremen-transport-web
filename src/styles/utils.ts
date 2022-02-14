import { isArr, isBool } from '@utils';

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
  for (const rawItem of arr) {
    const item = isArr(rawItem) ? m(...rawItem) : rawItem;
    if (isBool(item)) continue;
    if (!item) continue;
    style = { ...style, ...item };
  }
  return style;
};

export const px = (val: number) => `${val}px`;
