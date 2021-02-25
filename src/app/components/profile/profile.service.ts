import { Injectable } from '@angular/core';

import { ApiService } from '../../services/api.service';

// import { Headers } from '@angular/http';

@Injectable()
export class ProfileService {
  constructor(private api: ApiService) {
  }

  saveEdits(data) {
    // const headers = new Headers();
    const obj = {
      'url': 'edit_vendor_profile',
      'body': data,
      // 'headers': headers
    };
    return this.api.post(obj);
  }
  getPaymentInfo(data){
  const obj = {
    'url': 'payment/getAdditionalPaymentStatus',
    'body': data,
    // 'headers': headers
  };
  return this.api.post(obj);
}
  changePassword(data) {
    // const headers = new Headers();
    const obj = {
      'url': 'marketplace_change_vendor_password',
      'body': data,
      // 'headers': headers
    };
    return this.api.post(obj);
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

  uploadImage(data) {
    const obj = {
      'url': 'upload_images',
      'body': data,
    };
    return this.api.post(obj);
  }

  editSignupTemplate(data) {
    const obj = {
      'url': 'edit_vendor_profile',
      'body': data,
    };
    return this.api.post(obj);
  }


}



