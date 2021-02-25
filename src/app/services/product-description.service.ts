import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Subject ,  Observable } from 'rxjs';

@Injectable()
export class ProductDescriptionService {
  private subject = new Subject<any>();
  constructor(private api: ApiService) {
  }

  getProductDetails(data) {
    const obj = {
      'url': 'AdminCatalog/getProductDetails',
      'body': data,
    };
    return this.api.post(obj);
  }

  getProfileData(data) {
    const obj = {
      'url': 'merchant/viewProfile',
      'body': data,
    };
    return this.api.post(obj);
  }

  updateBreadcrumb(data) {
    this.subject.next({ bread: data });
  }
  getBreadcrumb(): Observable<any> {
        return this.subject.asObservable();
    }
    updateCartItems(data) {
      this.subject.next({ items: data });
    }
    getCartItem(): Observable<any>  {
      return this.subject.asObservable();
    }
}
