/**
 * Created by cl-macmini-51 on 10/09/18.
 */
import { Injectable } from '@angular/core';
import { ApiService } from "../../../../services/api.service";

@Injectable()
export class BusinessCategoriesService {

  constructor(private api: ApiService) {
  }

  getBusinessCategories(data) {
    // const headers = new Headers();
    const obj = {
      'url': 'businessCategory/getCategory',
      'body': data,
      // 'headers': headers
    };
    return this.api.get(obj);
  }
}
