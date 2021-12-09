/* eslint-disable no-console */
import { config } from './config';
import { select } from '@utils';

import { captureSentryMessage } from './sentry';

type LogLevel = 'none' | 'err' | 'warn' | 'info' | 'debug' | 'trace';

const logLevelToNum = (val: LogLevel): number =>
  select(val, {
    none: -1,
    err: 0,
    warn: 1,
    info: 2,
    debug: 3,
    trace: 4,
  });

const logLevelToSymbol = (val: LogLevel): string =>
  select(val, {
    none: '',
    err: 'x',
    warn: '!',
    info: '+',
    debug: '-',
    trace: '*',
  });

export const Log = (m?: string) => {
  const level = logLevelToNum(config.env === 'production' ? 'none' : 'debug');

  interface LogOpt {
    level: LogLevel;
    msg: string;
    meta?: unknown;
  }

  const logWithOpt = (opt: LogOpt) => {
    if (level < logLevelToNum(opt.level)) return;
    const levelPrefix = `[${logLevelToSymbol(opt.level)}]`;
    const prefix = m ? `${levelPrefix}[${m}]` : levelPrefix;
    const msg = `${prefix}: ${opt.msg}`;
    switch (opt.level) {
      case 'info':
        return opt.meta ? console.info(msg, JSON.stringify(opt.meta)) : console.info(msg);
      case 'err':
        return opt.meta ? console.error(msg, JSON.stringify(opt.meta)) : console.error(msg);
      case 'warn':
        return opt.meta ? console.warn(msg, JSON.stringify(opt.meta)) : console.warn(msg);
      default:
        return opt.meta ? console.log(msg, JSON.stringify(opt.meta)) : console.log(msg);
    }
  };

  return {
    err: (msg: string, meta?: unknown) => {
      captureSentryMessage(msg, 'error', meta);
      logWithOpt({ msg, meta, level: 'err' });
    },
    warn: (msg: string, meta?: unknown) => {
      captureSentryMessage(msg, 'warning', meta);
      logWithOpt({ msg, meta, level: 'warn' });
    },
    info: (msg: string, meta?: unknown) => logWithOpt({ msg, meta, level: 'info' }),
    debug: (msg: string, meta?: unknown) => logWithOpt({ msg, meta, level: 'debug' }),
    trace: (msg: string, meta?: unknown) => logWithOpt({ msg, meta, level: 'trace' }),
    simple: (...args: unknown[]) => console.log(...args),
  };
};

export const log = Log();
