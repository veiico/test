import { Injectable } from '@angular/core';

import { ApiService } from '../../services/api.service';

// import { Headers } from '@angular/http';

@Injectable()
export class ReferService {
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
}
