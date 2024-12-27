import { pad } from './str';

export const secMs = 1000;
export const minMs = secMs * 60;
export const hourMs = minMs * 60;
export const dayMs = hourMs * 24;
export const weekMs = dayMs * 7;
export const monthMs = weekMs * 4;
export const yearMs = dayMs * 365;

export const getDayBeginning = (val: number) => (val % dayMs === 0 ? val : Math.floor(val / dayMs) * dayMs);

export const getDayEnding = (val: number) => (val % dayMs === 0 ? val + dayMs - 1 : Math.ceil(val / dayMs) * dayMs - 1);

export const getFullYearsBetweenDates = (start: number, end: number): number => Math.floor((end - start) / yearMs);

export const strToTs = (val: string) => new Date(val).getTime();

export const ts = () => new Date().getTime();

export const tsToStr = (val: number) => {
  const d = new Date(val);
  return `${pad(d.getDate(), 2)}.${pad(d.getMonth() + 1, 2)}.${pad(d.getFullYear(), 2)}`;
};
