/**
 * Created by cl-macmini-51 on 20/07/18.
 */
import { Injectable } from '@angular/core';

import { ApiService } from '../../../services/api.service';

@Injectable()
export class CreateProjectService {

  public projectAddressObj: any = {};
  public projectAddressObjCpy:any = {};
  public pickupAddress: any = {};
  public pickupAddressCpy: any = {};
  project_type: number;

  constructor(private api: ApiService) {
  }

  getTemplates(data) {
    // const headers = new Headers();
    const obj = {
      'url': 'freelancer/getProjectTemplate',
      'body': data,
      // 'headers': headers
    };
    return this.api.post(obj);
  }

  createProject(data) {
    // const headers = new Headers();
    const obj = {
      'url': 'freelancer/createProject',
      'body': data,
      // 'headers': headers
    };
    return this.api.post(obj);
  }

}
