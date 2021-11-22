import color from 'color';

export interface ColorsSet {
  light: string;
  dark: string;
}

const colorsCache: Record<string, ColorsSet> = {};

export const colorSetFromColor = (val: string): ColorsSet => {
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
  blue: '#3273dc',
  white: '#fff',
  back: '#000',
  lightGrey: '#BDC3C7',
};

const named = {
  primary: '#5097D5',
};

export const withAlpha = (val: string, alpha: number) => color(val).alpha(alpha).toString();

export const colors = {
  ...base,
  ...named,
  withAlpha,
};
