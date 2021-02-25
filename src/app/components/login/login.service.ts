import { Injectable } from '@angular/core';

import {ApiService} from '../../services/api.service';

// import { Headers } from '@angular/http';

@Injectable()
export class LoginService {
  constructor(private api: ApiService) {
  }

  login(data) {
    // const headers = new Headers();
    const obj = {
      'url': 'marketplace_vendor_login',
      'body': data,
      // 'headers': headers
    };
    return this.api.post(obj);
  }
  verifyOtp(data)
  {
    const obj=
    {
      'url': 'customer/send_login_otp',
      'body': data,
    }
    return this.api.post(obj);
  }
  loginViaOtp(data)
  {
    const obj=
    {
      'url': 'customer/verifyOtp',
      'body': data,
    }
    return this.api.post(obj);
  }

  loginDual(data) {
    // const headers = new Headers();
    const obj = {
      'url': 'dualuserlogin',
      'body': data,
      // 'headers': headers
    };
    return this.api.post(obj);
  }

  loginUsingFacebook(data) {
    // const headers = new Headers();
    const obj = {
      'url': 'marketplace_vendor_facebook_login',
      'body': data,
      // 'headers': headers
    };
    return this.api.post(obj);
  }

  loginUsingFacebookDual(data) {
    // const headers = new Headers();
    const obj = {
      'url': 'dualUserFacebookLogin',
      'body': data,
      // 'headers': headers
    };
    return this.api.post(obj);
  }

  registerUsingFacebook(data) {
    // const headers = new Headers();
    const obj = {
      'url': 'marketplace_vendor_facebook_register',
      'body': data,
      // 'headers': headers
    };
    return this.api.post(obj);
  }
  loginUsingInstagram(data) {
    // const headers = new Headers();
    const obj = {
      'url': 'vendor/instagramLogin',
      'body': data,
      // 'headers': headers
    };
    return this.api.post(obj);
  }

  loginUsingInstagramDual(data) {
    // const headers = new Headers();
    const obj = {
      'url': 'dualUserInstagramLogin',
      'body': data,
      // 'headers': headers
    };
    return this.api.post(obj);
  }

  registerUsingInstagram(data) {
    // const headers = new Headers();
    const obj = {
      'url': 'vendor/instagramRegister',
      'body': data,
      // 'headers': headers
    };
    return this.api.post(obj);
  }

  forgot(data) {
     // const headers = new Headers();
     const obj = {
      'url': 'marketplace_vendor_forgot_password',
      'body': data,
      // 'headers': headers
    };
    return this.api.post(obj);
  }

  forgotNew(data) {
      const obj = {
        // 'url': 'marketplace_vendor_forgot_password',
        'url': 'customer/forgotPassword',
        'body': data,
      };
      return this.api.postWithoutDOmain(obj);
  }
  accessTokenLogin(data) {
    // const headers = new Headers();
    const obj = {
      'url': 'marketplace_vendor_login_via_access_token',
      'body': data,
      // 'headers': headers
    };
    return this.api.get(obj);
  }
  //regsiter as a guest
  registerGuest(data) {
    // const headers = new Headers();
    const obj = {
      'url': 'marketplace_vendor_signup',
      'body': data,
      // 'headers': headers
    };
    return this.api.post(obj);
  }
}
