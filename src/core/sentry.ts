import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';
import { Severity } from '@sentry/types';
import { UnknownDict } from '@utils';

import { config } from './config';

export const initSentry = () =>
  Sentry.init({
    dsn: config.sentry.dsn,
    environment: config.env,
    release: `${config.sentry.project}@${config.version}`,
    integrations: [new Integrations.BrowserTracing()],
    tracesSampleRate: 1.0,
    beforeSend: async event => (config.env === 'prd' ? event : null),
  });

export const captureSentryMessage = (msg: string, level: Severity, meta?: UnknownDict) => {
  if (meta) Sentry.setContext('meta', meta);
  Sentry.captureMessage(msg, level);
};

export const addSentryBreadcumb = (message: string, level: Severity, data?: UnknownDict) => {
  Sentry.addBreadcrumb({ message, level, data });
};

export { Severity as SentrySeverity };
