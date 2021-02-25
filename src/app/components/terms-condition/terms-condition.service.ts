/**
 * Created by cl-macmini-51 on 01/05/18.
 */
import { Injectable } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { SessionService } from '../../services/session.service';

@Injectable()
export class TermsConditionService {
  constructor(private api: ApiService, private sessionService: SessionService) {
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
}
