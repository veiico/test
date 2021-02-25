// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  enable_ssr: false,
  beta: false,

  production: false,
  API_ENDPOINT: 'https://api.yelo.red/',
  // API_ENDPOINT: 'https://test-api-3003.yelo.red/',
  // API_ENDPOINT: 'https://beta-api.yelo.red/',
  SOCKET_ENDPOINT: 'https://test-api-3013.yelo.red/socket.io/',
  API_ENDPOINT_TOOKAN: 'https://ipconfig.tookanapp.com/',
  hippoAppSecretKey: 'kenwfdhwoiujGSDIUUHU82E8HD98',
  FB_APP_ID: '961465860684112', // live,
  dashboard_url: 'https://dev3.yelo.red/en/',
  tookan_whitelabeled_domain_for_logistics: 'logistics_test.tookan.io',
  maps_api_url: 'https://nominatim-api-live.jungleworks.com',
  // fm_token:'2e769c60-174c-11ea-acdf-896965e04014',
  //SSR
  DIST: 'dist',
  REDIS_PORT: 6379,
  REDIS_HOST: '127.0.0.1',
  SSR_PORT: 4000,
  // SSR_PORT: 4100, //for themes specifc at test
  SSR_API_ENDPOINT:'https://test-api-3004.yelo.red/',
  SSR_Langs: ['en', 'fr', 'ar', 'es', 'ms'],
  jungle_payment_url: 'https://dev-payments.jungleworks.com/',
  yelo_google_api_key: 'AIzaSyAdWwy8VFj2_KIoTCnk8AyO7Zi0tKuNCaU'
};
