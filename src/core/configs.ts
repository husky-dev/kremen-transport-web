/* eslint-disable @typescript-eslint/no-explicit-any */
import { Log } from 'utils';
import { isString } from 'lodash';

const log = Log('core.configs');

const keyPrefix = 'kremen:transport';

const fkey = (key: string) => `${keyPrefix}:${key}`;

export const getConf = <T = any>(key: string): T | undefined => {
  const fullKey = fkey(key);
  const valStr = localStorage.getItem(fullKey);
  if (!isString(valStr)) {
    return undefined;
  }
  let val;
  try {
    val = JSON.parse(valStr);
  } catch (e) {
    log.err(e);
    return undefined;
  }
  return val;
};

export const setConf = <T = any>(key: string, val: T) => {
  const fullKey = fkey(key);
  const valStr = JSON.stringify(val);
  localStorage.setItem(fullKey, valStr);
};

export const removeConf = (key: string) => localStorage.removeItem(fkey(key));
