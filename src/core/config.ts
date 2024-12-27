type AppEnv = 'production' | 'development';

const getAppEnv = (): AppEnv => {
  if (!APP_ENV) return 'production';
  const modStr = APP_ENV.toLocaleLowerCase().trim();
  if (['prd', 'prod', 'production'].includes(modStr)) return 'production';
  if (['dev', 'develop', 'development'].includes(modStr)) return 'development';
  return 'production';
};

export const config = {
  env: getAppEnv(),
  version: APP_VERSION || '0.0.0',
  name: APP_NAME || 'kremen-transport',
};
