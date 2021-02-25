import { Injectable } from '@angular/core';
import { ApiService } from '../../../services/api.service';

@Injectable()
export class DebtService {
  constructor(private api: ApiService) {
  }

/**
 * get debt list
 */
  getDebtList(body) {
    const obj = {
      url: 'customer/getDebtList',
      body
    };
    return this.api.postWithoutDOmain(obj);
  }

  getDebtDetails(body) {
    const obj = {
      url: 'customer/getTotalDebt',
      body
    };
    return this.api.postWithoutDOmain(obj);
  }

}
