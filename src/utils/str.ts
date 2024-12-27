import { isBool, isErr, isNull, isNum, isStr, isUndef } from './types';

export const pad = (val: number, length: number): string => {
  let str: string = `${val}`;
  while (str.length < length) {
    str = `0${str}`;
  }
  return str;
};

export const errToStr = (val: unknown): string => {
  if (isErr(val)) {
    return val.message;
  }
  if (isStr(val) || isNum(val)) {
    return `${val}`;
  }
  if (isBool(val)) {
    return val ? 'true' : 'false';
  }
  if (isNull(val) || isUndef(val)) {
    return '';
  }
  return '';
};

export const yearsNumToUkStr = (val: number) => {
  if (val >= 9 && val <= 20) return 'років';
  const rest = val % 10;
  const base = rest <= 4 ? 'рік' : 'років';
  return [2, 3, 4].includes(rest) ? `${base}и` : base;
};

export const daysNumToUkStr = (val: number) => {
  if (val >= 9 && val <= 20) return 'днів';
  const rest = val % 10;
  if (rest === 1) return 'день';
  return [2, 3, 4].includes(rest) ? `дня` : 'днів';
};

export const monthsNumToUkStr = (val: number) => {
  if (val >= 9 && val <= 20) return 'місяців';
  const rest = val % 10;
  if (rest === 1) return 'місяць';
  return [2, 3, 4].includes(rest) ? `місяця` : 'місяців';
};
