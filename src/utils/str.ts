import { reduce } from 'lodash';

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

export const numbersArrToStr = (arr: number[]) => reduce(arr, (memo, val) => (memo ? `${memo},${val}` : `${val}`), '');
