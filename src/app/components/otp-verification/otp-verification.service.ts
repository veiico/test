import { Injectable } from "@angular/core";
import { ApiService } from '../../services/api.service';

@Injectable()
export class OtpVerificationService {
  constructor(private api: ApiService) {
  }

  otpVerify(data) {
    const obj = {
      'url': 'customer/verifyOtp',
      'body': data,
    };
    return this.api.postWithoutDOmain(obj);
  }

  otpDualVerify(data) {
    const obj = {
      'url': 'dualUser/otpVerification',
      'body': data,
    };
    return this.api.post(obj);
  }

  otpResend(data) {
    const obj = {
      'url': 'customer/forgotPassword',
      'body': data,
    };
    return this.api.postWithoutDOmain(obj);
  }

  otpDualResend(data) {
    const obj = {
      'url': 'dualUser/resendOtp',
      'body': data,
    };
    return this.api.post(obj);
  }
  changeNumberHit(data) {
    const obj = {
      'url': 'marketplace_vendor_change_phone',
      'body': data
    };
    return this.api.postWithoutDOmain(obj);
  }

  resetPassword(data){
    const obj = {
      'url': 'customer/resetPassword',
      'body': data
    };
    return this.api.postWithoutDOmain(obj);
  }
  
}
