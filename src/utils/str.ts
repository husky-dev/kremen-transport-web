import { isErr, isFunc, isNum, isStr, isUnknownDict } from './types';

export const pad = (val: number | string, max: number): string => {
  const str = val.toString();
  return str.length < max ? pad(`0${str}`, max) : str;
};

export const capitalizeFirstLetter = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const monthNumberToStr = (val: number): string => {
  switch (val) {
    case 0:
      return 'Янв';
    case 1:
      return 'Фев';
    case 2:
      return 'Мар';
    case 3:
      return 'Апр';
    case 4:
      return 'Май';
    case 5:
      return 'Июн';
    case 6:
      return 'Июл';
    case 7:
      return 'Авг';
    case 8:
      return 'Сен';
    case 9:
      return 'Окт';
    case 10:
      return 'Ноя';
    case 11:
      return 'Дек';
    default:
      return '';
  }
};

export const numbersArrToStr = (arr: number[]) => arr.reduce((memo, val) => (memo ? `${memo},${val}` : `${val}`), '');

/**
 * Convert unknown error to string
 * @param err - Error, string, number or an object with `toString()` property
 */
export const errToStr = (err: unknown): string | undefined => {
  if (!err) {
    return undefined;
  }
  if (isErr(err)) {
    return err.message;
  }
  if (isStr(err)) {
    return err;
  }
  if (isNum(err)) {
    return `${err}`;
  }
  if (isUnknownDict(err) && isStr(err.message)) {
    return err.message;
  }
  if (isUnknownDict(err) && isFunc(err.toString)) {
    // eslint-disable-next-line @typescript-eslint/no-base-to-string
    return err.toString();
  }
  return undefined;
};
