                                                                                                                                                                                                                                                                                                                                                                                                                                          import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

let domain = window.location.hostname;
if (
  domain === 'localhost' ||
  domain === '35.154.18.171' ||
  domain === 'beta-webapp.yelo.red' ||
  domain === '127.0.0.1' ||
  domain === 'test-food-doppler.taxi-hawk.com'
) {

  // domain = "product-trazaar.taxi-hawk.com";
  domain = "shop.weezy.co.uk";
  localStorage.setItem('language', 'en');
} else {
  let language = localStorage.getItem('language');
  if (!language) {
    language = 'en';
  }
  localStorage.setItem('language', language);
}

localStorage.setItem('domain', domain);
console.log = (...args) => { };

if (environment.enable_ssr) {
  enableProdMode();
  document.addEventListener('DOMContentLoaded', () => {
    platformBrowserDynamic()
      .bootstrapModule(AppModule, { preserveWhitespaces: true })
      .catch(err => console.log(err));
  });
} else {
  platformBrowserDynamic()
    .bootstrapModule(AppModule, { preserveWhitespaces: true })
    .catch(err => console.log(err));
}
