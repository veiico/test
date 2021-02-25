import { Injectable } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class FreelancerService {
  public isMobileView = new BehaviorSubject(0);

    constructor(private api: ApiService) {
  }

  getlevelWiseCategories(data) {
    const obj = {
      'url': 'AdminCatalog/getMerchantCatalogueLevelWise',
      'body': data,
    };
    return this.api.get(obj);
  }

  checkView(){
    return this.isMobileView;
  }

  setView(data){
    this.isMobileView.next(data);
  }

}
