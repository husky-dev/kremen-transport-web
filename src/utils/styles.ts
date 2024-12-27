import { CSSProperties } from 'react';
import { isArr, isBool } from './types';
import color from 'color';

export interface StyleProps {
  style?: CSSProperties;
  className?: string;
}

export const mc = (...classNames: (string | boolean | undefined)[]) => classNames.filter(Boolean).join(' ');

export interface Styles {
  [key: string]: CSSProperties;
}
type MergeStyleVal = CSSProperties | null | undefined | boolean;
type MergeStyleVals = MergeStyleVal | MergeStyleVal[];

/**
 * Merge styles
 * @param {MergeStyleVals} arr - styles
 */
export const ms = (...arr: MergeStyleVals[]): CSSProperties => {
  if (!arr.length) {
    return {};
  }
  let style: CSSProperties = {};
  arr.forEach((rawItem: MergeStyleVals) => {
    const item = isArr(rawItem) ? ms(...rawItem) : rawItem;
    if (isBool(item)) {
      return;
    }
    if (!item) {
      return;
    }
    style = { ...style, ...item };
  });
  return style;
};

export interface ColorsSet {
  light: string;
  dark: string;
}

const colorsCache: Record<string, ColorsSet> = {};

export const colorSetFromColor = (val: string): ColorsSet => {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (colorsCache[val]) {
    return colorsCache[val];
  }
  colorsCache[val] = {
    light: val,
    dark: color(val).darken(0.5).toString(),
  };
  return colorsCache[val];
};

const base = {
  red: '#D8434E',
  green: '#4CAF50',
  blue: '#3E7FE8',
  white: '#fff',
  back: '#000',
  lightGrey: '#BDC3C7',
};

const named = {
  primary: '#3E7FE8',
};

export const withAlpha = (val: string, alpha: number) => color(val).alpha(alpha).toString();

export const colors = {
  ...base,
  ...named,
  withAlpha,
};
