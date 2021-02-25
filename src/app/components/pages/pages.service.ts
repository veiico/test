import { Injectable } from '@angular/core';

import { ApiService } from '../../services/api.service';
import { SessionService } from '../../services/session.service';

// import { Headers } from '@angular/http';

@Injectable()
export class PagesService {
  constructor(private api: ApiService) {
  }
  getPageData(obj) {
    // const headers = new Headers();
    const payload = {
      'url': 'userPages/get',
      'body': obj,
    };
    return this.api.get(payload);
  }

}
