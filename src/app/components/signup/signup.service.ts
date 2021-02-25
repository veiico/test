import { Injectable } from '@angular/core';

import { ApiService } from '../../services/api.service';
import { SessionService } from '../../services/session.service';

// import { Headers } from '@angular/http';

@Injectable()
export class SignupService {
  constructor(private api: ApiService, private sessionService: SessionService) {
  }

  register(data) {
    // const headers = new Headers();
    const obj = {
      'url': 'marketplace_vendor_signup',
      'body': data,
      // 'headers': headers
    };
    return this.api.post(obj);
  }
  registerDual(data) {
    // const headers = new Headers();
    const obj = {
      'url': 'dualusersignup',
      'body': data,
      // 'headers': headers
    };
    return this.api.post(obj);
  }
  fieldsRegister(data) {
    // const headers = new Headers();
    const obj = {
      'url': 'submit_signup_template',
      'body': data,
      // 'headers': headers
    };
    return this.api.post(obj);
  }

  uploadImage(data) {
    // const headers = new Headers();
    // headers.set('Content-Type', 'application/octet-stream');
    // headers.set('Upload-Content-Type', data.ref_image.type)
    const obj = {
      'url': 'upload_images',
      'body': data,
      // 'headers': headers
    };
    return this.api.post(obj);
  }

  otpVerify(data) {
    // const headers = new Headers();
    const obj = {
      'url': 'marketplace_vendor_verify_otp',
      'body': data,
      // 'headers': headers
    };
    return this.api.post(obj);
  }

  otpDualVerify(data) {
    // const headers = new Headers();
    const obj = {
      'url': 'dualUser/otpVerification',
      'body': data,
      // 'headers': headers
    };
    return this.api.post(obj);
  }

  otpResend(data) {
    // const headers = new Headers();
    const obj = {
      'url': 'marketplace_vendor_resend_otp',
      'body': data,
      // 'headers': headers
    };
    return this.api.post(obj);
  }

  otpDualResend(data) {
    // const headers = new Headers();
    const obj = {
      'url': 'dualUser/resendOtp',
      'body': data,
      // 'headers': headers
    };
    return this.api.post(obj);
  }

  mailResend(data) {
    const obj = {
      'url': 'vendor/resendEmail',
      'body': data
    };
    return this.api.post(obj);
  }

  mailDualResend(data) {
    const obj = {
      'url': 'vendor/resendEmail',
      'body': data
    };
    return this.api.post(obj);
  }

  changeEmailApi(data) {
    const obj = {
      'url': 'vendor/changeEmail',
      'body': data
    };
    return this.api.post(obj);
  }

  changeEmailDualApi(data) {
    const obj = {
      'url': 'vendor/changeEmail',
      'body': data
    };
    return this.api.post(obj);
  }

  changeNumberHit(data) {
    // const headers = new Headers();
    const obj = {
      'url': 'marketplace_vendor_change_phone',
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

  registerUsingInstagramDual(data) {
    // const headers = new Headers();
    const obj = {
      'url': 'dualUserInstagramSignup',
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

  registerUsingFacebookDual(data) {
    // const headers = new Headers();
    const obj = {
      'url': 'dualUserFacebookSignup',
      'body': data,
      // 'headers': headers
    };
    return this.api.post(obj);
  }

  getPoliciesData(data) {
    // const headers = new Headers();
    const obj = {
      'url': 'termAndCondition/getTermAndConditionOpen',
      'body': data,
      // 'headers': headers
    };
    // if (this.sessionService.isPlatformServer())
      obj.body['source'] = '0';
    return this.api.get(obj);
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


  registerUsingGoogle(data) {
    const obj = {
      'url': 'vendor/googleRegister',
      'body': data,
    };
    return this.api.post(obj);
  }

  registerUsingGoogleDual(data) {
    const obj = {
      'url': 'dualUserGoogleSignup',
      'body': data,
    };
    return this.api.post(obj);
  }

}
