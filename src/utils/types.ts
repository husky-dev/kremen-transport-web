export interface UnknownDict {
  [index: string]: unknown;
}

export const isUnknownDict = (candidate: unknown): candidate is UnknownDict =>
  !isArr(candidate) && typeof candidate === 'object' && candidate !== null;

export const isStr = (val: unknown): val is string => typeof val === 'string';
export const isStrOrUndef = (val: unknown): val is string | undefined => isStr(val) || isUndef(val);
export const isStrArr = (val: unknown): val is string[] =>
  isArr(val) && val.reduce<boolean>((memo, itm) => memo && isStr(itm), true);
export const isNum = (val: unknown): val is number => typeof val === 'number';
export const isNumOrUndef = (val: unknown): val is number => typeof val === 'number' || isUndef(val);
export const isNumArr = (val: unknown): val is number[] =>
  isArr(val) && val.reduce<boolean>((memo, itm) => isNum(itm) && memo, true);
export const isNumArrOrUndef = (val: unknown): val is number[] | undefined => isNumArr(val) || isUndef(val);
export const isBool = (val: unknown): val is boolean => typeof val === 'boolean';
export const isBoolOrUndef = (val: unknown): val is boolean | undefined => isBool(val) || isUndef(val);
export const isNull = (val: unknown): val is null => val === null;
export const isUndef = (val: unknown): val is undefined => typeof val === 'undefined';
export const isArr = (val: unknown): val is unknown[] => Array.isArray(val);
export const isFunc = (val: unknown): val is () => void => !!val && {}.toString.call(val) === '[object Function]';
export const isDate = (val: unknown): val is Date => val instanceof Date;
export const isErr = (val: unknown): val is Error => val instanceof Error;

// Utils

export const last = <T = unknown>(val: T[]): T => val[val.length - 1];

export const select = <K extends string | number, T>(key: K, data: Record<K, T>) => data[key];

export const compact = <D>(arr: (D | null | undefined)[]): D[] => {
  const newArr: D[] = [];
  for (const itm of arr) {
    if (!isUndef(itm) && !isNull(itm) && itm !== '') newArr.push(itm);
  }
  return newArr;
};

export const dataOrUndef = <D>(val: D | null | undefined): D | undefined => (val ? val : undefined);

export const omit = <D extends object>(val: D, keys: (keyof D)[]): Partial<D> => {
  const res: Partial<D> = {};
  for (const key in val) {
    if (!keys.includes(key)) {
      res[key] = val[key];
    }
  }
  return res;
};

export const uniq = <D>(arr: D[]): D[] => Array.from(new Set(arr));

export const uniqBy = <D>(arr: D[], key: keyof D): D[] => {
  const seen = new Set();
  return arr.filter(itm => {
    const k = itm[key];
    return seen.has(k) ? false : seen.add(k);
  });
};

export const removeNullProps = <T>(obj: T): T => {
  if (isArr(obj)) {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    return obj.map(itm => removeNullProps(itm)) as unknown as T;
  }
  if (isNum(obj) || isStr(obj) || isBool(obj) || isDate(obj)) {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    return obj as unknown as T;
  }
  if (!isUnknownDict(obj)) {
    return obj;
  }
  const newObj: T = { ...obj };
  for (const key in newObj) {
    if (isNull(newObj[key])) {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete newObj[key];
    }
    if (isUnknownDict(newObj[key])) {
      newObj[key] = removeNullProps(newObj[key]);
    }
  }
  return newObj;
};

export const shallowCompareObjects = (o1: unknown, o2: unknown): boolean => {
  if (!isUnknownDict(o1)) return false;
  if (!isUnknownDict(o2)) return false;
  for (const p in o1) {
    // eslint-disable-next-line no-prototype-builtins
    if (o1.hasOwnProperty(p)) {
      if (o1[p] !== o2[p]) {
        return false;
      }
    }
  }
  for (const p in o2) {
    // eslint-disable-next-line no-prototype-builtins
    if (o2.hasOwnProperty(p)) {
      if (o1[p] !== o2[p]) {
        return false;
      }
    }
  }
  return true;
};

export const sortBy = <T>(arr: T[], key: keyof T): T[] => arr.sort((a, b) => (a[key] > b[key] ? 1 : -1));

export const sortByFn = <T>(arr: T[], fn: (a: T, b: T) => number): T[] => arr.sort(fn);

export const groupBy = <T, K extends string | number>(arr: T[], keyFn: (itm: T) => K): Record<K, T[]> => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  const res: Record<K, T[]> = {} as Record<K, T[]>;
  for (const itm of arr) {
    const key = keyFn(itm);
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!res[key]) {
      res[key] = [];
    }
    res[key].push(itm);
  }
  return res;
};

// Guards

/**
 * Basic template for the type guards
 * @returns Does the `val` is type of `T`
 */
export type TypeGuard<T> = (val: unknown) => val is T;
