import { isNum, isUnknownDict, TypeGuard } from './types';

interface StorageData {
  version: number;
  data: unknown;
}

const isStorageData = (val: unknown): val is StorageData => isUnknownDict(val) && isNum(val.version) && val.data !== undefined;

interface StorageOpt<D> {
  key: string;
  version?: number;
  guard?: TypeGuard<D>;
}

export const getStorage = <D>(opt: StorageOpt<D>) => {
  const { key: storageKey, version: storageVer = 1, guard } = opt;

  const get = (): D | undefined => {
    const storageVal = localStorage.getItem(storageKey);
    if (!storageVal) return undefined;
    try {
      const storageData = JSON.parse(storageVal);
      if (!isStorageData(storageData)) return undefined;
      const { version, data } = storageData;
      if (version !== storageVer) return undefined;
      if (guard) {
        return guard(data) ? data : undefined;
      }
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      return data as unknown as D;
    } catch (err: unknown) {
      return undefined;
    }
  };

  const set = (data: D) => {
    localStorage.setItem(storageKey, JSON.stringify({ version: storageVer, data }));
  };

  const remove = () => {
    localStorage.removeItem(storageKey);
  };

  return { get, set, remove };
};
