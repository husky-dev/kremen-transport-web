import { compact } from '@utils';
import { once, uniq } from 'lodash';

const clearLocales = (arr: string[]): string[] => arr.map(item => item.toLowerCase());

export const getUserLocales = once(() => {
  const list: string[] = [];
  if (typeof window !== 'undefined') {
    if (window.navigator.language) {
      list.push(window.navigator.language);
    }
    if (window.navigator.languages) {
      list.push(...window.navigator.languages);
    }
    if (window.navigator.userLanguage) {
      list.push(window.navigator.userLanguage);
    }
    if (window.navigator.browserLanguage) {
      list.push(window.navigator.browserLanguage);
    }
    if (window.navigator.systemLanguage) {
      list.push(window.navigator.systemLanguage);
    }
  }
  list.push('en-US'); // Fallback
  return uniq(clearLocales(compact(list)));
});

export const getUserLocale = once(() => getUserLocales()[0]);

export default getUserLocale;
