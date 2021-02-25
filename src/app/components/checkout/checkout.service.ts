import { Injectable } from '@angular/core';
import { Observable ,  Subject ,  BehaviorSubject } from 'rxjs';
import { EventEmitter, Output } from '@angular/core';
import { SessionService } from '../../services/session.service';
import { ApiService } from '../../services/api.service';
import { AppCartService } from '../catalogue/components/app-cart/app-cart.service';
import { CheckoutTemplateType } from '../../enums/enum';

// import { Headers } from '@angular/http';

@Injectable()
export class CheckOutService {
  // @Output('setAddress') setAddress: EventEmitter<any> = new EventEmitter();
  // private setAddress = new Subject<any>();
  private checkoutStatus = new Subject();
  currentStatus = this.checkoutStatus.asObservable();
  recurringTaskDataChange: EventEmitter<any> = new EventEmitter<any>();
  public onUpdateTimeSlot = new Subject();
  public changeAddress = new BehaviorSubject(null);
  private newAddressStatus = new Subject();
  newStatus = this.newAddressStatus.asObservable();

  getMandatoryItems: EventEmitter<any> = new EventEmitter();
  allowApiHit: EventEmitter<any> = new EventEmitter();

  constructor(private apiService: ApiService, private sessionService: SessionService, private cartService: AppCartService) { }


  checkout(payload): Observable<any> {
    // const headers = new Headers();
    const apiObj = {
      'url': 'send_payment_for_task',
      'body': payload,
      // 'headers': headers

    };
    return this.apiService.post(apiObj);
  }
  // checkout(payload): Observable<any> {
  //     let apiObj = {
  //         serviceName: 'send_payment_for_task',
  //         method: 'POST',
  //         serviceType: 8,
  //         payload: payload
  //     }
  //     return this.apiService.apiCall(apiObj);
  // }
  imageUpload(payload): Observable<any> {
    // const headers = new Headers();
    const apiObj = {
      'url': 'upload_reference_images',
      'body': payload,
      // 'headers': headers

    };
    return this.apiService.post(apiObj);
  }

  onUpdateTime(data) {
    this.onUpdateTimeSlot.next(data);
  }
  getSlotsForDay(payload): Observable<any> {
    // const headers = new Headers();
    payload.reference_id = this.sessionService.get('appData').vendor_details.reference_id;
    payload.user_id = this.sessionService.get('user_id');
    payload.marketplace_user_id = this.sessionService.get('appData').vendor_details.marketplace_user_id;
    if (this.sessionService.get('appData')) {
      payload['vendor_id'] = this.sessionService.get('appData').vendor_details.vendor_id;
      payload['access_token'] = this.sessionService.get('appData').vendor_details.app_access_token;
    }
    const apiObj = {
      // url: 'get_storefront_timeslots',
      url: 'timeSlot/getStorefrontTimeslotsV2',
      'body': payload,
      // 'headers': headers
    };
    return this.apiService.post(apiObj);
  }




  getMerchantSlotsForDay(payload): Observable<any> {
    payload.user_id = Number(this.sessionService.get('user_id')?this.sessionService.get('user_id'):this.sessionService.get('info')['storefront_user_id']);
    payload.marketplace_user_id = this.sessionService.get('appData').vendor_details.marketplace_user_id;
    if (this.sessionService.get('appData')) {
      payload['vendor_id'] = this.sessionService.get('appData').vendor_details.vendor_id;
      payload['access_token'] = this.sessionService.get('appData').vendor_details.app_access_token;
    }
    const apiObj = {
      url: 'v3/merchant/timeslots',
      'body': payload,
    };
    return this.apiService.post(apiObj);
  }



  getSlotsForDayForAgent(payload): Observable<any> {
    payload.marketplace_reference_id = this.sessionService.get('config').marketplace_reference_id;
    if (this.sessionService.get('appData')) {
      payload['vendor_id'] = this.sessionService.get('appData').vendor_details.vendor_id;
      payload['access_token'] = this.sessionService.get('appData').vendor_details.app_access_token;
    }
    const apiObj = {
      url: 'get_product_timeslots',
      'body': payload,
    };
    return this.apiService.post(apiObj);
  }
  /**
   * function to validate serving radius check
   * @param payload address for validating
   */
  validateAddressPickUp(payload): Observable<any> {
    payload.user_id = this.sessionService.get('user_id');
    if (this.sessionService.get('appData')) {
      payload['vendor_id'] = this.sessionService.get('appData').vendor_details.vendor_id;
      payload['access_token'] = this.sessionService.get('appData').vendor_details.app_access_token;
    }
    if (this.sessionService.get('config') && this.sessionService.get('config').is_dual_user_enable === 1) {
      payload['dual_user_key'] = 1;
    } else {
      payload['dual_user_key'] = 0;
    }
    if(this.sessionService.getString("deliveryMethod") && Number(this.sessionService.getString("deliveryMethod")) == 2){
      payload["self_pickup"] = 1;
    }
    if(this.sessionService.get('editJobId')){
      payload['prev_job_id'] = this.sessionService.get('editJobId');
    }
    const apiObj = {
      url: 'order/serviceableCheck',
      'body': payload,
    };
    let data = JSON.parse(JSON.stringify(payload));
    data.job_pickup_latitude = "";
    data.job_pickup_longitude = "";
    data.customer_address = "";
    this._newStatus(data);
    // this.setAddress.emit(payload);
    return this.apiService.postWithoutDOmain(apiObj);
  }
  /**
   * function to validate serving radius check
   * @param payload address for validating
   */
  validateAddress(payload): Observable<any> {
    payload.user_id = this.sessionService.get('user_id');
    if (this.sessionService.get('appData')) {
      payload['vendor_id'] = this.sessionService.get('appData').vendor_details.vendor_id;
      payload['access_token'] = this.sessionService.get('appData').vendor_details.app_access_token;
    }
    if (this.sessionService.get('config') && this.sessionService.get('config').is_dual_user_enable === 1) {
      payload['dual_user_key'] = 1;
    } else {
      payload['dual_user_key'] = 0;
    }
    if(this.sessionService.getString("deliveryMethod") && Number(this.sessionService.getString("deliveryMethod")) == 2){
      payload["self_pickup"] = 1;
    }
    if(this.sessionService.get('editJobId')){
      payload['prev_job_id'] = this.sessionService.get('editJobId');
    }
    const apiObj = {
      url: 'order/serviceableCheck',
      'body': payload,
    };
    this._newStatus(payload);
    // this.setAddress.emit(payload);
    return this.apiService.postWithoutDOmain(apiObj);
  }

  updateStatus(data) {
    this.checkoutStatus.next(data);
  }
  _newStatus(data) {
    this.newAddressStatus.next(data);
  }
  /**
   * function to get static address
   * @param payload address
   */
  getStaticAddress(payload): Observable<any> {
    if (this.sessionService.get('appData')) {
      payload['vendor_id'] = this.sessionService.get('appData').vendor_details.vendor_id;
      payload['access_token'] = this.sessionService.get('appData').vendor_details.app_access_token;
    }
    if (this.sessionService.get('config') && this.sessionService.get('config').is_dual_user_enable === 1) {
      payload['dual_user_key'] = 1;
    } else {
      payload['dual_user_key'] = 0;
    }
    const apiObj = {
      url: 'staticAddress/getStaticAddressForCustomer',
      'body': payload,
    };
    return this.apiService.postWithoutDOmain(apiObj);
  }

  /**
   * get laundry slots for scheduling
   */
  getLaundrySlotsForDay(payload): Observable<any> {
    // const headers = new Headers();
    payload.reference_id = this.sessionService.get('appData').vendor_details.reference_id;
    payload.user_id = this.sessionService.get('user_id') || this.sessionService.get('appData').vendor_details.marketplace_user_id;
    payload.marketplace_user_id = this.sessionService.get('appData').vendor_details.marketplace_user_id;
    payload.marketplace_reference_id = this.sessionService.get('appData').vendor_details.marketplace_reference_id;
    if (this.sessionService.get('appData')) {
      payload['vendor_id'] = this.sessionService.get('appData').vendor_details.vendor_id;
      payload['access_token'] = this.sessionService.get('appData').vendor_details.app_access_token;
    }
    const apiObj = {
      // url: 'get_storefront_timeslots',
      url: 'laundry/getStorefrontTimeslots',
      'body': payload,
      // 'headers': headers
    };
    return this.apiService.post(apiObj);
  }

  /**
   * place laundry order
   */
  laundryOrder(payload): Observable<any> {
    // const headers = new Headers();
    payload.reference_id = this.sessionService.get('appData').vendor_details.reference_id;
    payload.user_id = this.sessionService.get('user_id');
    payload.marketplace_user_id = this.sessionService.get('appData').vendor_details.marketplace_user_id;
    payload.marketplace_reference_id = this.sessionService.get('appData').vendor_details.marketplace_reference_id;
    if (this.sessionService.get('appData')) {
      payload['vendor_id'] = this.sessionService.get('appData').vendor_details.vendor_id;
      payload['access_token'] = this.sessionService.get('appData').vendor_details.app_access_token;
    }
    const apiObj = {
      url: 'laundry/createTask',
      'body': payload,
      // 'headers': headers
    };
    return this.apiService.post(apiObj);
  }

  getBillBreakdown(data) {
    data.is_app_product_tax_enabled = 1;
    const apiObj = {
      url: 'get_bill_breakdown',
      'body': data,
    };
    return this.apiService.post(apiObj);
  }
  isCheckoutTemplateEnabled(type?: number,optional_user_id?:number) {
  const user_id = optional_user_id?optional_user_id:this.sessionService.get('user_id');
    const config = this.sessionService.get('config');
return this.apiService.get({
      url: 'template/checkTemplateStatus',
      body: {
        marketplace_user_id: config.marketplace_user_id,
        user_id: type === CheckoutTemplateType.CUSTOM_ORDER ? config.marketplace_user_id : user_id,
        type: type || CheckoutTemplateType.NORMAL_ORDER
      }
    });

  }
  getSideOrders(data) {
    // const headers = new Headers();
    const obj = {
      'url': 'merchant/getSubCategory',
      'body': data,
      // 'headers': headers
    };
    return this.apiService.post(obj);
  }


  setProductInCart(data) {
    let productData = this.sessionService.getByKey('app', 'cart');
    let cartProductData = this.sessionService.getByKey('app', 'cartProduct');
    if (productData && productData.length) {
      if (cartProductData[data.id]) {
        const customizedData = this.sessionService.getByKey('app', 'customize');
        const status = this.checkAvailableIndexOfCustomize(data, customizedData[data.id]);
        if (status === false) {
          productData.push(data);
          this.setProductQuantityForCart(data, productData.length - 1);
        } else {
          productData[status].quantity += data.quantity;
          this.setProductQuantityForCart(data, productData.length - 1);
        }
      } else {
        productData.push(data);
        this.setProductQuantityForCart(data, productData.length - 1);
      }
    } else {
      productData = [];
      productData.push(data);
      this.setProductQuantityForCart(data, productData.length - 1);

    }
    this.sessionService.setByKey('app', 'cart', productData);
    this.cartService.updateStatus();
  }
  setProductQuantityForCart(data, index) {
    let cartProductData = this.sessionService.getByKey('app', 'cartProduct');
    if (cartProductData) {
      if (cartProductData[data.id]) {
        cartProductData[data.id].quantity += data.quantity;
        // let obj = this.getProductQuantityByData(data, index);
        // cartProductData[data.id] = obj;
      } else {
        const obj = this.getProductQuantityByData(data, index);
        cartProductData[data.id] = obj;
      }

    } else {
      cartProductData = {};
      const obj = this.getProductQuantityByData(data, index);
      cartProductData[data.id] = obj;
    }
    this.setCustomizeData(data, index);
    this.sessionService.setByKey('app', 'cartProduct', cartProductData);

  }
  setCustomizeData(product, index) {
    let customizedData = this.sessionService.getByKey('app', 'customize');
    if (customizedData) {
      if (customizedData[product.id]) {
        const status = this.checkAvailableIndexOfCustomize(product, customizedData[product.id]);
        if (status === false) {
          customizedData[product.id]['data'][index] = product.customizations;
        }
      } else {
        const obj = this.getCustomizeProductQuantityByData(product, index);
        customizedData[product.id] = {};
        customizedData[product.id]['data'] = obj;
      }
    } else {
      customizedData = {};
      const obj = this.getCustomizeProductQuantityByData(product, index);
      customizedData[product.id] = {};
      customizedData[product.id]['data'] = obj;
    }
    this.sessionService.setByKey('app', 'customize', customizedData);
  }
  checkAvailableIndexOfCustomize(product, customizeData) {
    let status: any = false;
    for (const custom in customizeData.data) {
      const customData = customizeData.data[custom];
      if (customData.length === product.customizations.length) {
        let count = 0;
        if (customData.length == 0) {
          status = custom;
        } else {
          customData.forEach((element, index) => {
            product.customizations.forEach(product => {
              if (product.cust_id === element.cust_id) {
                count++;
              }
            });
            if (count === customData.length) {
              status = custom;
            }
          });
        }

      }
    }
    return status;
  }
  getProductQuantityByData(data, index) {
    const obj = {};
    obj['quantity'] = data.quantity;
    obj['index'] = index;
    return obj;
  }
  getCustomizeProductQuantityByData(data, index) {
    const obj = {};
    obj[index] = data.customizations;
    return obj;
  }

  mandatoryItems(data){
    this.getMandatoryItems.emit(data);
  }

  billbreakdownHitPermission(data){
    this.allowApiHit.emit(data);
  }

  getSlotsForRecurring(payload): Observable<any> {
    let appData = this.sessionService.get('appData')
    payload.vendor_id = appData.vendor_details.vendor_id;
    payload.access_token = appData.vendor_details.app_access_token;
    payload.reference_id = appData.vendor_details.reference_id;
    payload.user_id = this.sessionService.get('user_id');
    payload.marketplace_user_id = appData.vendor_details.marketplace_user_id;
    const apiObj = {
      url: 'recurring/getRecurringSlots',
      'body': payload,
    };
    return this.apiService.post(apiObj);
  }
  getAgentList(payload){
    const apiObj = {
      url: 'product/getAgents',
      'body': payload,
    };
    return this.apiService.post(apiObj);
  }
  getdeliverySurgeChargeList(payload){
    const apiObj = {
      url: 'recurring/surgeDetails',
      'body': payload,
    };
    return this.apiService.post(apiObj);
  }
  checkTimeSlots(payload): Observable<any> {
    payload.timezone = new Date().getTimezoneOffset();
    const apiObj = {
      url: 'order/checkTimeSlots',
      'body': payload,
    };
    return this.apiService.post(apiObj);
  }
}

