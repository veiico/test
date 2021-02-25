import { Injectable } from '@angular/core';
import { ApiService } from '../../../services/api.service';

// import { Headers } from '@angular/http';

@Injectable()
export class LogisticsPublicService {
  constructor(private api: ApiService) {
  }

  register(data) {
    const obj = {
      'url': 'tookanApi/vendor_signup',
      'body': data,
    };
    return this.api.postWithoutDOmain(obj);
  }

  fieldsRegister(data) {
    const obj = {
      'url': 'submit_signup_template',
      'body': data,
    };
    return this.api.post(obj);
  }

  uploadImage(data) {
    const obj = {
      'url': 'upload_images',
      'body': data,
    };
    return this.api.post(obj);
  }

  otpVerify(data) {
    const obj = {
      'url': 'marketplace_vendor_verify_otp',
      'body': data,
    };
    return this.api.post(obj);
  }

  otpDualVerify(data) {
    const obj = {
      'url': 'dualUser_otp_verification',
      'body': data,
    };
    return this.api.post(obj);
  }

  otpResend(data) {
    const obj = {
      'url': 'marketplace_vendor_resend_otp',
      'body': data,
    };
    return this.api.post(obj);
  }

  otpDualResend(data) {
    const obj = {
      'url': 'dualUser_resend_otp',
      'body': data,
    };
    return this.api.post(obj);
  }

  changeNumberHit(data) {
    const obj = {
      'url': 'marketplace_vendor_change_phone',
      'body': data,
    };
    return this.api.post(obj);
  }

  registerUsingFacebook(data) {
    const obj = {
      'url': 'marketplace_vendor_facebook_register',
      'body': data,
    };
    return this.api.post(obj);
  }

  registerUsingFacebookDual(data) {
    const obj = {
      'url': 'dualUserFacebookSignup',
      'body': data,
    };
    return this.api.post(obj);
  }

  login(data) {
    const obj = {
      'url': 'tookanApi/vendor_login',
      'body': data,
    };
    return this.api.postWithoutDOmain(obj);
  }

  loginDual(data) {
    const obj = {
      'url': 'dualuserlogin',
      'body': data,
    };
    return this.api.post(obj);
  }

  loginUsingFacebook(data) {
    const obj = {
      'url': 'marketplace_vendor_facebook_login',
      'body': data,
    };
    return this.api.post(obj);
  }

  loginUsingFacebookDual(data) {
    const obj = {
      'url': 'dualUserFacebookLogin',
      'body': data,
    };
    return this.api.post(obj);
  }

  forgot(data) {
    const obj = {
      'url': 'tookanApi/vendor_forgot_password',
      'body': data,
    };
    return this.api.postWithoutDOmain(obj);
  }
  getTermAndConditionOpen(data) {
    const obj = {
      'url': 'termAndCondition/getTermAndConditionOpen',
      'body': { ...data, source: 0 },
    };
    return this.api.get(obj);
  }
}
