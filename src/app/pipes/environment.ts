// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  beta: false,
  // api_url: 'https://test-payment-gateway.yelo.red/',
  api_url: 'https://test-api-3002.yelo.red',
  socket_url: 'https://test-api-3013.yelo.red',
  api_url2: 'https://ipconfig.tookanapp.com',
  stripeKey: 'pk_test_lBHsebfROM5GuExOJ7mmt9xb',
  stripe_key : 'pk_test_lBHsebfROM5GuExOJ7mmt9xb',
  hippoKey: '17a55e44776d2dc3c6dd6a38184d8879',
  angular1_url: 'https://dev-dashboard.yelo.red',
  tookan_link: 'https://dev5.tookanapp.com/#/page/admin?access_token=',
  hippo_link: 'https://dev-admin.fuguchat.com/#/dashboard?access_token=',
  chat_link: 'https://dev-admin.fuguchat.com/en/#/dashboard/all/chats/',
  xero_url: 'https://api-test-xero.tookanapp.com'
};
