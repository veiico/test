import { Injectable } from '@angular/core';

import { ApiService } from '../../services/api.service';

@Injectable()
export class LoyaltyPointsInfoService {
  constructor(private api: ApiService) {
  }

  fetchLoyaltyConfig(data) {
    const obj = {
      'url': '/loyaltyPoints/fetchCriteria',
      'body': data,
    };
    return this.api.postWithoutDOmain(obj);
  }

}
