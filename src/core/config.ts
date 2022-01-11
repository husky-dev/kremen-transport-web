import { isStr } from '@utils';

interface AppConifg {
  env: AppEnv;
  name: string;
  version: string;
  title?: string;
  company?: string;
  description?: string;
  api: {
    url: string;
    ws: string;
  };
  sentry: {
    dsn: string;
    project: string;
  };
  mixpanel: {
    token: string;
  };
}

type AppEnv = 'dev' | 'prd';

const isAppEnv = (val: unknown): val is AppEnv => isStr(val) && ['dev', 'prd'].includes(val);

export const config: AppConifg = {
  env: isAppEnv(APP_ENV) ? APP_ENV : 'prd',
  name: isStr(APP_NAME) ? APP_NAME : 'kremen-transport-web',
  version: isStr(APP_VERSION) ? APP_VERSION : '0.0.0',
  title: APP_TITLE,
  company: APP_COMPANY,
  description: APP_DESCRIPTION,
  api: {
    url: 'https://api.kremen.dev',
    ws: 'wss://api.kremen.dev',
  },
  sentry: {
    dsn: isStr(SENTRY_DSN) ? SENTRY_DSN : '',
    project: isStr(SENTRY_PROJECT) ? SENTRY_PROJECT : '',
  },
  mixpanel: {
    token: '8133cb5ad59bba7d4dff11d715b39147',
  },
};
