import { Injectable } from '@angular/core';

import { ApiService } from '../../services/api.service';

@Injectable()
export class SubscriptionsService {
  constructor(private api: ApiService) {
  }


  getSubscriptions(data) {
    const obj = {
      'url': 'recurring/getRecurringRules',
      'body': data,
    };

    return this.api.post(obj);
  }

  getSubscriptionDetails(data) {
    const obj = {
      'url': 'recurring/getRuleDetails',
      'body': data,
    };

    return this.api.post(obj);
  }

  getRecurringDates(data) {

    const obj = {
      'url': 'recurring/filteredVacationRule',
      'body': data,
    };

    return this.api.post(obj);
  }

  addSkippedDates(data) {

    const obj = {
      'url': 'recurring/addVacationRule',
      'body': data,
    };

    return this.api.post(obj);
  }

  pauseResumeTask(data) {

    const obj = {
      'url': 'recurring/updateRecurringRule',
      'body': data,
    };

    return this.api.post(obj);
  }
}
