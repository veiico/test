/**
 * Created by socomo on 4/4/18.
 */
import { environment } from './environments/environment';
declare var FB: any;
let fb_app_id: any;
if (JSON.parse(localStorage.getItem('config')).facebook_app_id) {
  fb_app_id = JSON.parse(localStorage.getItem('config')).facebook_app_id;
} else {
  fb_app_id = '';
}
  (<any>window).fbAsyncInit = () => {
    FB.init({
      appId: fb_app_id,
      // autoLogAppEvents : true,
      xfbml: false,
      version: 'v3.2'
    });
    FB.AppEvents.logPageView();
  };

  (function (d, s, id) {
    let js; const fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {
      return;
    }
    js = d.createElement(s);
    js.id = id;
    js.src = '//connect.facebook.net/en_US/sdk.js';
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));

