import { MessageType } from './../../../../constants/constant';
import { Injectable, Output, EventEmitter } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { ApiService } from '../../../../services/api.service';
import { PopUpService } from '../../../../modules/popup/services/popup.service';
import { SessionService } from '../../../../services/session.service';
import { MessageService } from '../../../../services/message.service';
import { AppService } from '../../../../app.service';

@Injectable({
  providedIn: 'root'
})
export class AppCartService {
  mandatoryItems: EventEmitter<any> = new EventEmitter();
  productRemoved: EventEmitter<any> = new EventEmitter();
  private cartStatus = new Subject<any>();
  private cartDataClear = new Subject();
  public removeProductEvent = new Subject();
  private addCartStatus = new Subject();
  public editCustomizationData = new Subject();
  private cartData: any = {};
  private cartQuantity: any = {};
  sellerData: Array<any> = [];
  currentStatus = this.cartStatus.asObservable();
  cartClear = this.cartDataClear.asObservable();
  addCartDataStatus = this.cartStatus.asObservable();
  langJson;
  editAddon: boolean = false;
  
  constructor(
    private api: ApiService,
    private sessionService: SessionService,
    private popup: PopUpService,
    private messageService: MessageService,
    private appService: AppService
  ) {
    this.cartQuantity = this.getProductQuantity();
    this.appService.langPromise.then(() => {
      this.langJson = this.appService.getLangJsonData();
    });
  }

  updateStatus() {
    this.cartStatus.next(this.cartData);
  }
  editCustomization(data){
    this.editCustomizationData.next(data);
  }
  cartClearCall() {
    this.cartData = {};
    this.sessionService.removeByChildKey('app', 'cart');
    this.sessionService.removeByChildKey('app', 'customize');
    this.sessionService.removeByChildKey('app', 'cartProduct');
    this.cartDataClear.next();
    if(this.sessionService.get('config').bumbl_domain_name && !this.sessionService.isPlatformServer())
    {
    (<any>window).mt('send', 'pageview', {email: this.sessionService.get('appData') ? this.sessionService.get('appData').vendor_details.email : undefined, itemincart : false});
    }
  }
  updateAddCartStatus() {
    this.addCartStatus.next();
  }
  updateProductQuantity(id, quantity, index: any = false) {
    const productData = this.sessionService.getByKey('app', 'cart');
    const cartProductData = this.sessionService.getByKey('app', 'cartProduct');
    const productIndex = cartProductData[id].index;
    if (index === false) {
      productData[productIndex].quantity = quantity;
      productData[productIndex].totalPrice =
        productData[productIndex].price * productData[productIndex].quantity;
    } else {
      this.cartData[index].quantity = quantity;
      productData[index].quantity = quantity;
      productData[index].totalPrice =
        productData[index].price * productData[index].quantity;
    }
    this.sessionService.setByKey('app', 'cart', productData);
    this.sessionService.setByKey('app', 'cartProduct', cartProductData);
    this.updateStatus();
  }
  increaseQuantity(id, index) {
    const cartProductData = this.sessionService.getByKey('app', 'cartProduct');
    if (this.cartData[index].quantity) {
      if (this.cartData[index].quantity === 0) {
        return;
      }
      this.sessionService.setByKey('app', 'cartProduct', cartProductData);
      if (this.cartData[index].quantity >= 9999) {
        return;
      }
      if (this.cartData[index].maximum_quantity > 0 ) {
      if (this.cartData[index].quantity >= this.cartData[index].maximum_quantity) {
        this.popup.showPopup(
          'info',
          2000,
          this.langJson['Total quantity for this item cannot be more than maximum quantity.'],
          false
        ); return;
      }
    }
      // if (!this.cartData[index].quantity) {
      //   this.otherIncreaseQuantity(id, index);
      // } else {
      //   this.updateProductQuantity(id, this.cartData[index].quantity, index);
      // }
    } else {
      this.otherIncreaseQuantity(id, index);
    }
    if (
      this.sessionService.get('config') &&
      this.sessionService.get('config').business_model_type === 'ECOM' &&
      this.sessionService.get('config').nlevel_enabled === 2
    ) {
      this.ecomIncreaseQuantity(id, index);
    } else {
      this.otherIncreaseQuantity(id, index);
    }
  }

  ecomIncreaseQuantity(id, index) {
    const cartProductData = this.sessionService.getByKey('app', 'cartProduct');
    if (
      (this.cartData[index].inventory_enabled &&
        this.cartData[index].quantity <
          this.cartData[index].available_seller_quantity) ||
      !this.cartData[index].inventory_enabled
    ) {
      //==========Check for max quantity==========
      if (this.cartData[index].quantity >= 9999) {
        return;
      }
      if (this.cartData[index].maximum_quantity > 0 ) {
      if (this.cartData[index].quantity >= this.cartData[index].maximum_quantity) {
        this.popup.showPopup(
          'info',
          2000,
          this.langJson['Total quantity for this item cannot be more than maximum quantity.'],
          false
        );
        return;
      }
    }
      if (this.cartData[index].quantity) {
        this.cartData[index].quantity++;
      } else {
        this.cartData[index].quantity = 2;
      }
      cartProductData[id].quantity = Number(cartProductData[id].quantity) + 1;
      this.sessionService.setByKey('app', 'cartProduct', cartProductData);
      this.updateProductQuantity(id, this.cartData[index].quantity, index);
      this.updateAddCartStatus();
    } else {
      this.popup.showPopup(
        MessageType.ERROR,
        2000,
        this.langJson['The selected quantity exceeds quantity available in stock.'],
        false
      );
    }
  }

  otherIncreaseQuantity(id, index) {
    const cartProductData = this.sessionService.getByKey('app', 'cartProduct');
    let cartData = JSON.parse(JSON.stringify(this.cartData));
    cartData[index].quantity = Number(cartData[index].quantity) + 1;
    let newQuantity = 0;
    if (cartData && cartData.length > 0) {
      cartData.forEach(data => {
        if (data.id === id) {
        // newQuantity = newQuantity + data.quantity;
           newQuantity = data.quantity;
        }
      });
    }
    if (newQuantity > 9999) {
      this.popup.showPopup(
        MessageType.ERROR,
        2000,
        this.langJson['Total quantity for this item cannot be more than 9999.'],
        false
      );
      return;
    }
    if (this.cartData[index].maximum_quantity > 0 ) {
    if (newQuantity > cartData[index].maximum_quantity) {
      this.popup.showPopup(
        'info',
        2000,
        this.langJson['Total quantity for this item cannot be more than maximum quantity.'],
        false
      );
      return;
    }
  }
    if (
      (this.cartData[index].inventory_enabled &&
        newQuantity <= this.cartData[index].available_quantity) ||
      !this.cartData[index].inventory_enabled
    ) {
      //==========Check for max quantity==========
      if (this.cartData[index].quantity >= 9999) {
        return;
      }
      if (this.cartData[index].maximum_quantity > 0) {
      if (this.cartData[index].quantity >= cartData[index].maximum_quantity) {
        return;
      }
    }
      if (this.cartData[index].quantity) {
        this.cartData[index].quantity++;
      } else {
        this.cartData[index].quantity = 2;
      }
      cartProductData[id].quantity = Number(cartProductData[id].quantity) + 1;
      this.sessionService.setByKey('app', 'cartProduct', cartProductData);
      this.updateProductQuantity(id, this.cartData[index].quantity, index);
      this.updateAddCartStatus();
    } else {
      this.popup.showPopup(
        MessageType.ERROR,
        2000,
        this.langJson['The selected quantity exceeds quantity available in stock.'],
        false
      );
    }
  }
  syncProductQuantity(id, index, quantity) {
    const cartProductData = this.sessionService.getByKey('app', 'cartProduct');
    let cartData = JSON.parse(JSON.stringify(this.cartData));
    cartData[index].quantity = Number(quantity);
    let newQuantity = 0;
    if (cartData && cartData.length > 0) {
      cartData.forEach(data => {
        if (data.id == id) {
          newQuantity = newQuantity + data.quantity;
        }
      });
    }
    if (quantity < 1 || quantity < cartData[index].minimum_quantity) {
      cartProductData[id].quantity = 0;
      this.sessionService.setByKey('app', 'cartProduct', cartProductData);
      this.removeProduct(id, index);
      return;
    }
    if (newQuantity > 9999) {
      this.popup.showPopup(
        MessageType.ERROR,
        2000,
        this.langJson['Total quantity for this item cannot be more than 9999.'],
        false
      );
      this.updateProductQuantity(id, this.cartData[index].quantity, index);
      this.updateAddCartStatus();
      return;
    }
    if (cartData[index].maximum_quantity > 0 ) {
    if (newQuantity > cartData[index].maximum_quantity) {
      this.popup.showPopup(
        'info',
        2000,
        this.langJson['Total quantity for this item cannot be more than maximum quantity.'],
        false
      );
      this.updateProductQuantity(id, this.cartData[index].quantity, index);
      this.updateAddCartStatus();
      return;
    }
  }
    if (
      (this.cartData[index].inventory_enabled &&
        newQuantity <= this.cartData[index].available_quantity) ||
      !this.cartData[index].inventory_enabled
    ) {
      this.cartData[index].quantity = Number(quantity);
      //==========Check for max quantity==========
      cartProductData[id].quantity = Number(newQuantity);
      this.sessionService.setByKey('app', 'cartProduct', cartProductData);
      this.updateProductQuantity(id, this.cartData[index].quantity, index);
      this.updateAddCartStatus();
    } else {
      this.updateProductQuantity(id, this.cartData[index].quantity, index);
      this.updateAddCartStatus();
      this.popup.showPopup(
        MessageType.ERROR,
        2000,
        this.langJson[
          'The selected quantity exceeds quantity available in stock.'
        ],
        false
      );
    }
  }

  checkUniq(product) {
    let isUniq = true;
    let cartData = this.cartData
      ? JSON.parse(JSON.stringify(this.cartData))
      : {};
    if (cartData && cartData.length > 0) {
      let productsCount = cartData.filter(data => {
        if (product && data.id == product.product_id) {
          return data;
        }
      }).length;
      if (productsCount > 1) {
        isUniq = false;
        product['isUniq'] = isUniq;
      }
    }
    product['isUniq'] = isUniq;
    return false;
  }

  decreamentQuantity(id, index) {
    const cartProductData = this.sessionService.getByKey('app', 'cartProduct');
    if (this.cartData[index].quantity) {
      //==========Check for min quantity 0 to avoid negative quantity=========
      if (this.cartData[index].quantity == 0) {
        return;
      }
      if (
        this.cartData[index].quantity <= this.cartData[index].minimum_quantity
      ) {
        cartProductData[id].quantity -= this.cartData[index].quantity;
        this.cartData[index].quantity = 0;
      } else {
        this.cartData[index].quantity--;
        cartProductData[id].quantity -= 1;
      }

      this.sessionService.setByKey('app', 'cartProduct', cartProductData);
      if (this.cartData.length == 1 && !this.cartData[index].quantity) {
        this.setDefaultData(true);
        this.messageService.clearCartOnly();
        return;
      }
      if (!this.cartData[index].quantity) {
        this.removeProduct(id, index);
      } else {
        this.updateProductQuantity(id, this.cartData[index].quantity, index);
      }
    } else {
      this.removeProduct(id, index);
    }
  }
  //=================Set input box Quantity============
  setQuantity(id, index, newQuantity) {
    const cartProductData = this.sessionService.getByKey('app', 'cartProduct');
    cartProductData[id].quantity = newQuantity;
    this.cartData[index].quantity = newQuantity;
    this.sessionService.setByKey('app', 'cartProduct', cartProductData);
    this.updateProductQuantity(id, this.cartData[index].quantity, index);
    const cardData = this.sessionService.getByKey('app', 'cart');
    cardData[index].quantity = newQuantity;
    this.sessionService.setByKey('app', 'cart', cardData);
    this.getCartData();
    //========Remove product if quantity is 0=====
    if (newQuantity == 0) {
      this.removeProduct(id, index);
    }
  }
  getProductQuantity() {
    const cartData = this.sessionService.getByKey('app', 'cartProduct');
    this.cartQuantity = cartData;
    return cartData;
  }
  removeProduct(id, index) {
    let sellerData;
    const productData = this.sessionService.getByKey('app', 'cart');
    const cartProductData = this.sessionService.getByKey('app', 'cartProduct');
    const customizedData = this.sessionService.getByKey('app', 'customize');
    sellerData = this.sessionService.get('sellerArray');

    delete customizedData[id]['data'][index];
    if (sellerData && sellerData[0] != null) {
      for (let i = 0; i < sellerData.length; i++) {
        if ((sellerData[i].id = id)) {
          delete sellerData[i];
        }
      }
      if (sellerData.length < 1) {
        this.sessionService.remove('sellerArray');
      } else {
        this.sessionService.set('sellerArray', sellerData);
      }
    } else if (sellerData && sellerData[0] == null) {
      this.sessionService.remove('sellerArray');
    }
    productData.splice(index, 1);
    if (!cartProductData[id].quantity) {
      delete customizedData[id];
      delete cartProductData[id];
      if (this.cartData.length == 1) {
        this.setDefaultData(true);
        this.messageService.clearCartOnly();
      }
    }
    this.sessionService.setByKey('app', 'cart', productData);
    this.sessionService.setByKey('app', 'cartProduct', cartProductData);
    this.sessionService.setByKey('app', 'customize', customizedData);
    this.sessionService.set('sellerArray', sellerData);
    this.updateProductIndex();
    this.updateCustomizeIndex(index);
    this.removeProductEvent.next(id);
    this.productRemoved.emit();
    /**
     * hardcode code for Hoifoods,as he is priority client
     * notify user when item removed from cart
     */
    const config = this.sessionService.get('config');
    if (config && config.marketplace_user_id == 48956) {
      this.popup.showPopup(MessageType.SUCCESS, 2000, 'Item removed from cart', false);
    }
  }
  updateProductIndex() {
    const cartProductData = this.sessionService.getByKey('app', 'cartProduct');
    const productData = this.sessionService.getByKey('app', 'cart');
    productData.forEach((element, index) => {
      if (cartProductData[element.id] && cartProductData[element.id].index) {
        cartProductData[element.id].index = index;
      }
    });
    this.sessionService.setByKey('app', 'cartProduct', cartProductData);
    this.updateStatus();
  }
  updateCustomizeIndex(index) {
    const customizedData = this.sessionService.getByKey('app', 'customize');
    const copyCustomizedData = this.sessionService.getByKey('app', 'customize');
    for (const prop in customizedData) {
      const customData = customizedData[prop].data;
      copyCustomizedData[prop].data = {};
      for (const pindex in customData) {
        const currentIndex = Number(pindex);
        if (currentIndex > index) {
          copyCustomizedData[prop].data[currentIndex - 1] =
            customizedData[prop].data[pindex];
        } else {
          copyCustomizedData[prop].data[currentIndex] =
            customizedData[prop].data[pindex];
        }
      }
    }
    this.sessionService.setByKey('app', 'customize', copyCustomizedData);
  }
  getCartData() {
    const cardData = this.sessionService.getByKey('app', 'cart');
    const isReOrder = this.sessionService.get('isReOrder');
  

    if( cardData &&
      cardData.length && isReOrder){
     this.cartData = cardData;
     if(this.sessionService.get('config').bumbl_domain_name && !this.sessionService.isPlatformServer())
     {
      (<any>window).mt('send', 'pageview', {email:this.sessionService.get('appData') ? this.sessionService.get('appData').vendor_details.email : undefined,  itemincart : true});
     }
     return this.cartData;
    }

    if (
      cardData &&
      cardData.length &&
      this.sessionService.get('info') &&
      cardData[0].user_id !== this.sessionService.get('info').storefront_user_id
    ) {
      this.cartClearCall();
      this.cartData = {};
      return [];
    } else {
      this.cartData = cardData;
      return this.cartData;
    }
  }
  setDefaultData(bool?) {
    this.cartData = {};
    this.sessionService.removeByChildKey('app', 'cart');
    this.sessionService.removeByChildKey('app', 'customize');
    this.sessionService.removeByChildKey('app', 'cartProduct');
    this.sessionService.removeByChildKey('app', 'checkout');
    this.sessionService.remove('sellerArray');
    this.updateStatus();
  }
  getAllCategory(): Observable<any> {
    const apiObj = {
      serviceName: 'get_app_catalogue',
      method: 'POST',
      serviceType: 3,
      payload: {
        date_time: new Date().toISOString() ,
        vendor_id : this.sessionService.get('appData').vendor_details.vendor_id,
        access_token : this.sessionService.get('appData').vendor_details.app_access_token
      }
    };
    return this.api.post(apiObj);
  }
  getAllCartData(payload): Observable<any> {
    const apiObj = {
      serviceName: 'get_carts_for_category',
      method: 'POST',
      serviceType: 3,
      payload: payload
    };
    return this.api.post(apiObj);
  }

  mandatoryItemsList(data){
    this.mandatoryItems.emit(data);
  }
  convertToSec(obj)
   {
    let converterToSec;
    switch (obj['unit_type']) {
      case 1:
          return {type:1,value: obj.price} ;
      case 2:
        converterToSec =  60;
        break;
      case 3:
        converterToSec =  60 * 60;
        break;
      case 4:
        converterToSec =  60 * 60 * 24;
        break;
      case 5:
        converterToSec =  60 * 60 * 24 * 7;
        break;
      case 6:
        converterToSec =   60 * 60 * 24  * 30;
        break;
      case 7:
        converterToSec =  60 * 60 * 24 * 365;
        break;
        default:
          break

    }
    return {type:0,value: converterToSec}
}
}
