import { genId, isStrOrUndef } from '@utils';

import getUserLocale, { getUserLocales } from './locales';
import { getStorageParam } from './storage';
import { config } from './config';
import { Log } from './log';

const log = Log('core.analytics');

const enabled = config.env !== 'dev';
// const enabled = true;

// User

const uidStorage = getStorageParam('uid', isStrOrUndef);

const getUID = (): string => {
  const storedUid = uidStorage.get();
  if (storedUid) {
    return storedUid;
  }
  const newUid = genId();
  uidStorage.set(newUid);
  return newUid;
};

/**
 * Unique User ID
 */
export const uid = getUID();

const initUser = () => {
  if (!enabled) {
    return;
  }
  const locale = getUserLocale();
  const locales = getUserLocales();
  log.debug('locales', { locale, locales });
};

initUser();

/**
 * Track event
 * @param {MetricEvent} event - event name
 * @param {Dict?} params - event additional data
 */
export const track = (event: string, params?: Record<string, string | number | number[]>) => {
  if (!enabled) {
    return;
  }
  log.debug('track', { event });
};
