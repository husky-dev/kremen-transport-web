import { config } from './config';
import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';
import { CaptureContext } from '@sentry/types';

export const initSentry = () =>
  Sentry.init({
    dsn: config.sentry.dsn,
    environment: config.env,
    release: `${config.name.replace('@kremen/', 'kremen-')}@${config.version}`,
    integrations: [new Integrations.BrowserTracing()],
    tracesSampleRate: 1.0,
  });

type SentryEventLevel = 'info' | 'warning' | 'error';

export const captureSentryMessage = (msg: string, level: SentryEventLevel, meta?: unknown) => {
  const metaStr = meta ? `, ${JSON.stringify(meta)}` : '';
  Sentry.captureMessage(`${msg}${metaStr}`, level as CaptureContext);
};
