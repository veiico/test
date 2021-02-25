import { MessageType } from './../../../../constants/constant';
import { Component, Output, EventEmitter, OnInit, OnDestroy, Input } from '@angular/core';
import { Router } from '@angular/router';

import { SessionService } from '../../../../services/session.service';
import { CartModel } from './app-cart.model';
import { PopUpService } from '../../../../modules/popup/services/popup.service';
import { GoogleAnalyticsEventsService } from '../../../../services/google-analytics-events.service';
import { AppCartService } from './app-cart.service';
import { AppService } from '../../../../app.service';
import { GoogleAnalyticsEvent, BusinessType ,AmountService,OnboardingBusinessType } from '../../../../enums/enum';
import { FBPixelService } from '../../../../services/fb-pixel.service';
import { MessageService } from '../../../../services/message.service';
import { takeWhile } from 'rxjs/operators';
import { DecimalConfigPipe } from '../../../../pipes/decimalConfig.pipe';
declare var $: any;

// import * as $ from 'jquery';

@Component({
  selector: 'app-cart',
  templateUrl: './app-cart.html',
  styleUrls: ['./app-cart.scss']
})
export class AppCartComponent implements OnInit, OnDestroy {
  currency: any;
  @Output() toggle: EventEmitter<string> = new EventEmitter<string>();
  @Output() askLocation: EventEmitter<null> = new EventEmitter<null>();
  @Input() notDeliverable: Boolean;
  decimalPipe = new DecimalConfigPipe(this.sessionService);
  public imgArray: Array<string>;
  public hasDestroy: boolean;
  public appConfig: any = {
    color: ''
  };
  public storeConfig: any = {};
  public addBtnTxt = 'Add';
  public removeBtnTxt = 'Remove';
  public layoutBool: boolean;
  public cartQuantity: any = {};
  public cartBool: any = {};
  public cartList: any;
  public storeUnsubscribe: any;
  public cartData: Array<any> = [];
  public routeSubsriber: any;
  public totalCount: number;
  public onboardingBusinessType=OnboardingBusinessType;
  public nocart: boolean;
  public minimumOrder: number;
  public terminology;
  public langJson: any;
  public languageSelected: any;
  public direction = 'ltr';
  public selectedCartItemIndex;
  public selectedCartItemId;
  public removeCartItemPopup = false;
  public showClearCartPopup = false;
  public messageRemoveItem = '';
  public prevoiusQty;
  public selectedOperationMethod;
  store: any;
  deliveryMode: number;
  isPlatformServer:boolean
  showCustomerVerificationPopUp: boolean;
  business_type=BusinessType;
  alive = true;
  restraurantInfo: any;
  languageStrings: any={};

  constructor(protected router: Router, protected sessionService: SessionService, protected cartService: AppCartService,
    protected popup: PopUpService, public googleAnalyticsEventsService: GoogleAnalyticsEventsService, public appService: AppService,
    public fbPixelService: FBPixelService, public messageService: MessageService) {
    this.totalCount = 0;
    this.hasDestroy = false;
    const formSetting = this.sessionService.get('config');
    this.currency = formSetting['payment_settings'][0].symbol;
    // checks for ar translations
    if (this.sessionService.getString('language')) {
      this.languageSelected = this.sessionService.getString('language');
      if (this.languageSelected === 'ar') {
        this.direction = 'rtl';
      } else {
        this.direction = 'ltr';
      }
    } else {
      this.languageSelected = 'en';
      if (this.languageSelected === 'ar') {
        this.direction = 'rtl';
      } else {
        this.direction = 'ltr';
      }
    }
  }

  ngOnInit() {
 
    this.isPlatformServer = this.sessionService.isPlatformServer();
    // this.store.select('app').subscribe((data: any) => {
    //   if (data.config) {
    //     this.appConfig = data.config;
    //   }
    // });
    this.deliveryMode = Number(this.sessionService.getString('deliveryMethod'))
    this.store = this.sessionService.get('info')
    if (this.deliveryMode == 2) {
      this.minimumOrder = this.store.minimum_self_pickup_amount;
    }
    else if (this.deliveryMode == 1) {
      this.minimumOrder = this.store.merchantMinimumOrder;
    }

    this.messageService.sendDelivery.pipe(takeWhile(_ => this.alive)).subscribe((data) => {
      if (data.type == 2) {
        this.minimumOrder = this.store.minimum_self_pickup_amount;
      }
      else if (data.type == 1) {
        this.minimumOrder = this.store.merchantMinimumOrder;
      }
    });

    this.cartService.getCartData();
    this.cartService.currentStatus.subscribe(() => {
      this.setCartData();
    });
    this.cartService.cartClear.subscribe(() => {
      this.setCartData();
    });
    this.cartService.addCartDataStatus.subscribe(() => {
      setTimeout(this.checkScroll, 0);
    });
    this.setCartData();
    this.appConfig = this.sessionService.get('config');
    if (this.appConfig.terminology) {
      this.terminology = this.appConfig.terminology;
    }
    this.storeConfig = this.sessionService.get('info');
    if (this.storeConfig && this.storeConfig.button_type && this.storeConfig.button_type.button_names) {
      this.addBtnTxt = this.storeConfig.button_type.button_names.add ? this.storeConfig.button_type.button_names.add : 'Add';
      this.removeBtnTxt = this.storeConfig.button_type.button_names.remove ? this.storeConfig.button_type.button_names.remove : 'Remove';
    }
    this.sessionService.langStringsPromise.then(() =>
    {
     this.languageStrings = this.sessionService.languageStrings;
     this.languageStrings.your_cart_empty = (this.languageStrings.your_cart_empty || "Yout Cart is Empty")
     .replace('CART_CART', this.terminology.CART);
     this.languageStrings.do_you_want_clear_your_cart = (this.languageStrings.do_you_want_clear_your_cart || "Do you want to clear your CART_CART")
     .replace('CART_CART', this.terminology.CART);
    });
    // ================language json manupilation======================
    this.appService.langPromise.then(() => {
      this.langJson = this.appService.getLangJsonData();
      this.langJson['Your cart'] = this.langJson['Your cart'].replace('----', this.terminology.CART);
      this.langJson['Your cart is empty'] = this.langJson['Your cart is empty'].replace('----', this.terminology.CART);    
    });
  }


  adjustHippo() {
    if (this.isPlatformServer) {
      return true;
    }
    const el = document.getElementsByTagName("body")[0];
    const ipadAndAbove = window.matchMedia('screen and (min-width:768px)').matches;
    if (el && !ipadAndAbove) {
      el.classList.add('adjust-hippo-position');
    }
  }

  revertHippo() {
    if (this.isPlatformServer) {
      return true;
    }
    const el = document.getElementsByTagName("body")[0];
    const ipadAndAbove = window.matchMedia('screen and (min-width:768px)').matches;
    if (el && !ipadAndAbove) {
      el.classList.remove('adjust-hippo-position');
    }
  }

  setCartData() {
    const cartData = this.cartService.getCartData();
    if (cartData && cartData.length) {
      this.cartData = cartData;
      this.getCurrency(this.cartData);
      this.setAmountData();
      this.adjustHippo();
      if(cartData.length  == 1 &&  this.sessionService.get('config').bumbl_domain_name && !this.sessionService.isPlatformServer()){
        (<any>window).mt('send', 'pageview', {email: this.sessionService.get('appData') && this.sessionService.get('appData').vendor_details ? this.sessionService.get('appData').vendor_details.email : undefined, itemincart : true});
      }
    } else {
      this.cartData = [];
      this.getCurrency(this.cartData);
      this.hideDialog();
      this.revertHippo();
      if(this.sessionService.get('config').bumbl_domain_name && !this.sessionService.isPlatformServer())
      {
        (<any>window).mt('send', 'pageview', {email:this.sessionService.get('appData') && this.sessionService.get('appData').vendor_details ?  this.sessionService.get('appData').vendor_details.email : undefined, itemincart : false});
      }
    }
  }
  getCurrency(productList){
    this.currency = (this.sessionService.get('config').is_multi_currency_enabled && productList && productList[0] && productList[0].payment_settings) ? productList[0].payment_settings.symbol : this.sessionService.get('config')['payment_settings'][0].symbol;
  }
  clearCartData(){
    this.cartService.cartClearCall();
    this.showClearCartPopup = false;
    this.cartService.updateStatus();
    if(this.sessionService.get('config').bumbl_domain_name && !this.sessionService.isPlatformServer())
    {
      (<any>window).mt('send', 'pageview', {email: this.sessionService.get('appData') ?  this.sessionService.get('appData').vendor_details.email : undefined, itemincart : false});
    }
  }

  doNotClearCart(){
    this.showClearCartPopup = false;
  }



  setAmountData() {
    this.totalCount = 0;
    const formSetting =this.sessionService.get('config');
    this.restraurantInfo=this.sessionService.get('info');
    if(this.restraurantInfo.business_type === this.business_type.SERVICE_MARKETPLACE){
      this.cartData.forEach((val: CartModel, i) => {
        let productTemplateCharges = 0;
        if(val.productTemplatePrice){
          productTemplateCharges = val.productTemplatePrice;
        }
        if(val['unit_type'] == 1){
          let fixedServicePrice
          if(this.cartData[i].surge_amount)
          {
           fixedServicePrice =val.price * val.quantity + (this.cartData[i].surge_amount*val.quantity) ;
          }
          else
          {
            fixedServicePrice =val.price * val.quantity;
          }
          let addOnPrice = 0 ;
          this.cartData[i].totalPrice = val.showPrice;
          val['customizations'].forEach(addOn => {
            addOnPrice = addOnPrice + addOn.unit_price * val.quantity;
          });
          this.totalCount = this.totalCount+  addOnPrice + fixedServicePrice + productTemplateCharges;
          this.cartData[i].totalPrice = (addOnPrice + fixedServicePrice + productTemplateCharges);
          this.cartData[i].showPrice = (addOnPrice + fixedServicePrice + productTemplateCharges)/val.quantity;

        }
        else{
          let converterToSec;
          let check = this.cartService.convertToSec(val);
          if (check.type == AmountService.Price) {
           return check.value
           }
          else {
          converterToSec = check.value;
          }
          let pricePerUnitTime = val.price/val['unit'];
          let timeDiff;
          if(val.start_time && val.end_time){
            let start_dateTime = new Date(val.start_time);
            let end_dateTime = new Date(val.end_time);
            timeDiff = (end_dateTime.getTime() - start_dateTime.getTime())/1000;
            timeDiff /= converterToSec;
          }
          let service_time = val.service_time ? val.service_time/(converterToSec / 60): timeDiff;
          if(!service_time){
            service_time = 1;
          }
          let showPrice;
          if(this.cartData[i].surge_amount)
          {
             showPrice = ((val.quantity * pricePerUnitTime * service_time +(this.cartData[i].surge_amount *val.quantity)) + productTemplateCharges);
          }
          else{
             showPrice = (val.quantity * pricePerUnitTime * service_time + productTemplateCharges);
          }
          val['customizations'].forEach(addOn => {
                showPrice = showPrice + addOn.unit_price * val.quantity;
              });
              this.totalCount +=  showPrice;
              this.cartData[i].showPrice = showPrice/val.quantity;
              this.cartData[i].totalPrice = showPrice;
 }
      })
    this.sessionService.setByKey('app', 'cart', this.cartData);
      return this.totalCount;
    }

    this.cartData.forEach((val: CartModel) => {
      return this.totalCount += val.quantity * val.showPrice;
    });

  }
  decreamentQuantity(id, index) {
    this.cartService.decreamentQuantity(id, index);
  }
  increaseQuantity(id, index) {
    this.cartService.increaseQuantity(id, index);
  }
  //==========Input Box Blur Function==========
  onBlurFunction(id, index, newQuant) {
    let newQuantity = Number(newQuant);
    // this.cartService.setQuantity(id, index, newQuantity);
    this.cartService.syncProductQuantity(id, index, newQuantity);
  }
  selectcart(id) {
    this.cartBool[id] = true;
  }
  hideDialog() {
    this.toggle.emit();
  }
  onPopUpClose() {
    this.showCustomerVerificationPopUp = false;
    this.router.navigate(['profile']);
  }
  goToCheckout() {
          if (!this.sessionService.get('location') || !this.sessionService.get('location').lat || !this.sessionService.get('location').lng) {
      this.askLocation.emit();
      return;
    }

    let preOrderTime: any = this.sessionService.getString('preOrderTime');
    if (preOrderTime) {
      preOrderTime = (new Date(preOrderTime)).setSeconds(0, 0);
      const curTime = (new Date()).setSeconds(0, 0);
      if (preOrderTime < curTime) {
        this.popup.showPopup(MessageType.ERROR, 2000, (this.languageStrings.pls_select_future_date_for_pre_order || 'Please select a future date and time for pre ordering'), false);
        return false;
      }
    }
    if (!this.checkMinProductQuantity()) {
      return false;
    }
    if (!this.checkMaxProductQuantity()) {
      return false;
    }
    if (parseFloat(this.decimalPipe.decimalPrecision(this.totalCount)) < parseFloat(this.decimalPipe.decimalPrecision(this.minimumOrder))) {

      let msgStr = this.languageStrings.minimun_order_amount_should_be || 'Minimum order amount should be $10';
      msgStr = msgStr.replace('ORDER_ORDER', this.terminology.ORDER);
      msgStr = msgStr.replace('$', this.currency);
      msgStr = msgStr.replace('10', this.decimalPipe.transform(this.minimumOrder));
      const msg = msgStr;
      this.popup.showPopup(MessageType.ERROR, 2000, msg, false);
      return false;
    }
    if(!this.checkForMandatoryCatagories()){
      return;
    }
    if (this.sessionService.get('appData') && parseInt(this.sessionService.getString('reg_status')) === 1) {
      if( ( this.sessionService.get('config').is_customer_verification_required ===  1 ) && ( this.sessionService.get('appData').vendor_details.is_vendor_verified !== 1 ) ) {
        this.showCustomerVerificationPopUp = true;
        return false;
      }
      this.toggle.emit();
      this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.go_to_checkout, 'Go to checkout', '', '');
      this.fbPixelService.emitEvent('AddToCart', '');
      if(this.appConfig.onboarding_business_type === OnboardingBusinessType.LAUNDRY){
        this.router.navigate(['payment'])
      }else{
        localStorage.setItem('oftenBoughtModal','true')
        this.router.navigate(['checkout']);
      }
    } else if (this.sessionService.get('appData') && parseInt(this.sessionService.getString('reg_status')) !== 1 &&
      !this.sessionService.get('appData').signup_template_data.length) {
      this.toggle.emit();
      this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.go_to_checkout, 'Go to checkout', '', '');
      this.fbPixelService.emitEvent('AddToCart', '');
      if(this.appConfig.onboarding_business_type === OnboardingBusinessType.LAUNDRY){
        this.router.navigate(['payment'])
      }else
      {
        localStorage.setItem('oftenBoughtModal','true')
        this.router.navigate(['checkout']);
      }
    } else {
      this.messageService.getLoginSignupLocation('From Checkout Button');
      $('#loginDialog').modal('show');
    }
    }

  checkScroll() {
    const element = document.getElementsByClassName('app-cart-list')[0];
    if (element && element.scrollHeight > 300) {
      element.scrollTop = element.scrollHeight;
    }
  }

  /**
   * function to check minimum quantity for all cart item on checkout
   */
  checkMinProductQuantity() {
    let cart = this.sessionService.get('app').cart;
    let msg = '';
    let match = false;
    cart.forEach(element => {
      if (element.quantity < element.minimum_quantity) {
        msg = this.languageStrings.quantity_less_than_min ||'Quantity of ___ is less than minimum quantity ___';
        msg = msg.replace('___', element.name);
        msg = msg.replace('___', element.minimum_quantity);
        match = true;
      }
    });
    if (match) {
      this.popup.showPopup(MessageType.ERROR, 2000, msg, false);
      return false;
    } else {
      return true;
    }
  }
  /**
   * function to check maximum quantity for all cart item on checkout
   */

  checkMaxProductQuantity() {
    let cart = this.sessionService.get('app').cart;
    let msg = '';
    let match = false;
    cart.forEach(element => {
      if (element.maximum_quantity > 0 ) {
      if (element.quantity > element.maximum_quantity) {
        msg = this.languageStrings.quantity_greater_than_max || 'Quantity of ___ is greater than maximum quantity ___';
        msg = msg.replace('___', element.name);
        msg = msg.replace('___', element.maximum_quantity);
        match = true;
      }
    }
    });
    if (match) {
      this.popup.showPopup('error', 2000, msg, false);
      return false;
    } else {
      return true;
    }
  }

  /**
   * function to check for min qty on blur and decrement action
   * @param id
   * @param index
   * @param product
   * @param method 0- blur action, 1 - decrement btn action
   */
  checkforMinQty(id, index, product, method) {
    this.selectedOperationMethod = method;
    let minCheck = false;
    if (!method) {
      minCheck = (product.quantity < product.minimum_quantity); //blur condition
    } else {
      minCheck = (product.quantity <= product.minimum_quantity); //decrement condition
    }
    if (+product.quantity && (+product.minimum_quantity > 1) && minCheck) {
      this.selectedCartItemId = id;
      this.selectedCartItemIndex = index;
      let msg = this.languageStrings.quantity_not_less_than_min_msg || 'In ___ quantity cannot be less than minimum quantity ___. Would you like to remove the product from cart?';
      msg = msg.replace('___', product.name);
      msg = msg.replace('CART_CART',this.terminology.CART);
      msg = msg.replace('___', product.minimum_quantity);
      this.messageRemoveItem = msg;
      this.removeCartItemPopup = true;
    } else {
      if (!method) {
        this.onBlurFunction(id, index, product.quantity);
      } else {
        this.decreamentQuantity(id, index);
      }

    }
  }

  /**
   * function to retain input product previous qty
   * @param event
   */
  onFocusQty(event) {
    this.prevoiusQty = event.target.value;
  }

  /**
   * function to execute remove after confirmation
   * @param id
   * @param index
   * @param method 0-blur 1-decrement btn
   * @param flag 1-remove, 0-retain
   */

  onRemoveSelected(id, index, method, flag) {
    if (method) {
      this.removeCartItemPopup = false;
      if (flag) {
        this.decreamentQuantity(id, index);
      }
    } else {
      this.removeCartItemPopup = false;
      if (flag) {
        this.onBlurFunction(id, index, 0);
      } else {
        this.onBlurFunction(id, index, this.prevoiusQty);
      }
    }
  }

  checkForMandatoryCatagories(){
    let mandatoryCategoryList = this.sessionService.get('requiredCategories');
    let categoriesInCart = [];
    if(!mandatoryCategoryList.length){
      return true;
    }
    this.cartData.forEach(element => {
      if(!categoriesInCart.includes(element.category_id)){
        categoriesInCart.push(element.category_id);
      }
    });
    let arr = mandatoryCategoryList.filter(obj=>categoriesInCart.indexOf(obj.catalogue_id)==-1);
    if(arr.length){
      this.cartService.mandatoryItemsList(arr);
      return false;
    }
    return true;
  }

  clearCart(){
    this.showClearCartPopup = true;
  }
  editCustomization(data:any,index:number){
    const dataGot = {
      productData : data,
      index : index
    }
    this.cartService.editCustomization(dataGot);
  }
  ngOnDestroy() {
    // this.toggle.emit();
    this.alive = false;
    this.hasDestroy = true;
    this.revertHippo();
  }
}
