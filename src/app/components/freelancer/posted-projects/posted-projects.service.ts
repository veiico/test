/**
 * Created by cl-macmini-51 on 25/07/18.
 */
import { Injectable } from '@angular/core';

import { ApiService } from '../../../services/api.service';

@Injectable()
export class PostedProjectService {
  constructor(private api: ApiService) {
  }

  getProjects(data) {
    // const headers = new Headers();
    const obj = {
      'url': 'freelancer/getProjectHistory',
      'body': data,
      // 'headers': headers
    };
    return this.api.post(obj);
  }

  getBids(data) {
    // const headers = new Headers();
    const obj = {
      'url': 'freelancer/getAllProjectBids',
      'body': {...data,source:0},
      // 'headers': headers
    };
    return this.api.post(obj);
  }
  acceptBid(data) {
    // const headers = new Headers();
    const obj = {
      'url': 'freelancer/acceptBidByVendor',
      'body': data,
      // 'headers': headers
    };
    return this.api.post(obj);
  }
  cancelJob(data) {
    // const headers = new Headers();
    const obj = {
      'url': '/freelancer/cancelProject',
      'body': data,
      // 'headers': headers
    };
    return this.api.post(obj);
  }

  /**
   * get project details
   */
  getProjectDetails(data) {
    // const headers = new Headers();
    const obj = {
      'url': '/freelancer/project/getDetails',
      'body': data,
      // 'headers': headers
    };
    return this.api.post(obj);
  }
}
