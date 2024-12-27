declare const APP_VERSION: string | undefined;
declare const APP_NAME: string | undefined;
declare const APP_ENV: string | undefined;
declare const MAPS_API_KEY: string | undefined;

declare module '*.md' {
  const content: string;
  export default content;
}

declare module '*.svg' {
  const content: string;
  export default content;
}
