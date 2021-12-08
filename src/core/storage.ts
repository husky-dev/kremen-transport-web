import { errToStr, isStr, TypeGuard } from '@utils';
import { Log } from './log';

const log = Log('core.storage');

export const getStorageParam = <T = unknown>(key: string, guard?: TypeGuard<T>) => {
  const fullKey = `kremen:transport:${key}`;

  const get = (): T | undefined => {
    const valStr = localStorage.getItem(fullKey);
    if (!isStr(valStr)) {
      return undefined;
    }
    try {
      const val = JSON.parse(valStr);
      if (guard) {
        if (guard(val)) {
          return val;
        } else {
          log.err(`wrong storage value format`, { key, val });
          return undefined;
        }
      } else {
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        return (val as unknown) as T;
      }
    } catch (err: unknown) {
      log.err(`getting data err`, { err: errToStr(err) });
      return undefined;
    }
  };

  const set = (val: T) => {
    const valStr = JSON.stringify(val);
    localStorage.setItem(fullKey, valStr);
  };

  const remove = () => {
    localStorage.removeItem(fullKey);
  };

  return { get, set, remove };
};
