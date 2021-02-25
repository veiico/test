/**
 * Created by cl-macmini-51 on 25/05/18.
 */
import { Component, OnDestroy, OnInit, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import { SessionService } from '../../services/session.service';
import { LoaderService } from '../../services/loader.service';
import { AppCartService } from '../catalogue/components/app-cart/app-cart.service';
import { Subscription } from 'rxjs';
import { MessageService } from '../../services/message.service';
import { PopUpService } from '../../modules/popup/services/popup.service';
import { GoogleAnalyticsEventsService } from '../../services/google-analytics-events.service';
import { AppService } from '../../app.service';
import { CartModel } from '../catalogue/components/app-cart/app-cart.model';
import { RestaurantsService } from '../restaurants-new/restaurants-new.service';
import { GoogleAnalyticsEvent, BusinessType, TaskType } from '../../enums/enum';
import { ModalType, MessageType } from '../../constants/constant';
import { DecimalConfigPipe } from '../../pipes/decimalConfig.pipe';

declare var $: any;

// import * as $ from 'jquery';

@Component({
  selector: 'app-product-only',
  templateUrl: './app-product.component.html',
  styleUrls: ['./app-product.component.scss'],
})
export class ProductOnlyComponent implements OnInit, OnDestroy, AfterViewInit, AfterViewInit {

  public lat = 51.678418;
  public lng = 7.809007;
  public config: any;
  public terminology: any;
  public currency;
  public addBtnTxt;
  public removeBtnTxt;
  public caraouselImages = [];
  private productBool: any = {};
  private productQuantity: any = {};
  public productSelectedToAdd: any;
  public indexGot: any;
  public start_time: any;
  public end_time: any;
  currentProduct: any;
  totalCount = 0;
  private customizedObj: any = {};
  private currentCustomizeObj: any = {};
  private minimumOrder: any;
  cartProductData: any;
  public cartData: Array<any> = [];
  public cartBool: any = {};
  public noProduct = true;
  public unit_count = 0;
  public langJson: any;
  public languageSelected: any;
  public direction = 'ltr';
  public filteredData: any = [];
  public formSetting: any;
  public selectedProductFilter = '0';
  @Input() productList: any;
  @Input() selectedProductFilterInput: any;
  @Input() queryParam: any;
  @Output() toggle: EventEmitter<string> = new EventEmitter<string>();
  public minSelectAddonError = '';
  public maxSelectAddonError = '';
  public productLongDescription = '';
  public currentProductWithAddon;
  public openMultiImage: boolean;
  public modalType = ModalType;
  showCustomerVerificationPopUp: boolean;
  decimalPipe = new DecimalConfigPipe(this.sessionService);
  languageStrings: any={};

  constructor(public service: RestaurantsService, public messageService: MessageService, public loader: LoaderService,
    public router: Router, public sessionService: SessionService,
    public cartService: AppCartService,
    public googleAnalyticsEventsService: GoogleAnalyticsEventsService, public popup: PopUpService,
    public appService: AppService) {
    if (this.config) {
      this.sessionService.set('user_id', this.config.marketplace_user_id);
      this.config.borderColor = this.config['color'] || '#e13d36';
      this.terminology = this.config.terminology;
      // this.currency = this.config['payment_settings'][0].symbol;
      this.minimumOrder = this.config.merchantMinimumOrder;
      if (this.config.button_type && this.config.button_type.button_names) {
        this.addBtnTxt = this.config.button_type.button_names.add ? this.config.button_type.button_names.add : 'Add';
        this.removeBtnTxt = this.config.button_type.button_names.remove ? this.config.button_type.button_names.remove : 'Remove';
      }
    }

    if (this.config && this.config.pdp_view === 1 && this.config.multiple_product_single_cart === 2) {
      const checkCartData = this.cartService.getCartData();
      if (checkCartData && checkCartData.length) {
        this.cartService.cartClearCall();
        this.messageService.clearCartOnly();
      }
    }
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

  ngAfterViewInit() {
    if (this.productList && this.productList.length) {
      this.setDefaultValue();
      this.noProduct = false;
    } else {
      this.noProduct = true;
    }

  }

  ngOnInit() {
    this.sessionService.langStringsPromise.then(() =>
    {
     this.languageStrings = this.sessionService.languageStrings;
    });
    this.loader.hide();
    this.formSetting = this.sessionService.get('config');
    if (this.formSetting.business_model_type == 'ECOM') {
      this.getCollection();
      this.service.productChangeSubject.subscribe((data: any) => {
        if (data && data.catalogue_id) {

        }
      })
    }




    this.messageService.clearCartData.subscribe(() => {
      this.sessionService.removeByChildKey('app', 'cart');
      this.sessionService.removeByChildKey('app', 'category');
      this.sessionService.removeByChildKey('app', 'checkout');
      this.sessionService.removeByChildKey('app', 'payment');
      this.sessionService.removeByChildKey('app', 'customize');
      this.sessionService.removeByChildKey('app', 'cartProduct');
      this.sessionService.removeByChildKey('app', 'checkout_template');
      this.sessionService.remove('sellerArray');
      this.cartService.cartClearCall();
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
    this.getCartQuantityData();

    // ================language json manupilation======================
    this.appService.langPromise.then(() => {
      this.langJson = this.appService.getLangJsonData();
      this.setLangKeys()
    });
  }
  setLangKeys() {
    (this.languageStrings.your_cart || "Your Cart")
    .replace("CART_CART", this.terminology.CART);
    (this.languageStrings.your_cart_is_empty || "Your Cart is empty")
    .replace("CART_CART", this.terminology.CART);
    (this.languageStrings.customize_item || "Customize Item")
    .replace("ITEM_ITEM",this.terminology.ITEM);
  }

  ngOnDestroy() {
  }


  // ECOM flow
  // get Dropdown values
  getCollection() {
    const obj = {
      'marketplace_reference_id': this.formSetting.marketplace_reference_id,
      // 'marketplace_reference_id': this.sessionService.getString('marketplace_reference_id'),
      'user_id': this.sessionService.get('user_id'),
      'marketplace_user_id': this.formSetting.marketplace_user_id,
    };
    if (this.sessionService.get('appData')) {
      obj['vendor_id'] = this.sessionService.get('appData').vendor_details.vendor_id;
      obj['access_token'] = this.sessionService.get('appData').vendor_details.app_access_token;
    }
    this.service.getCollection(obj)
      .subscribe(
        response => {
          try {
            if (response.status === 200) {
              this.filteredData = response.data.filterAndValues[0].allowed_Values;
              this.selectedProductFilter = this.selectedProductFilterInput;
            }

          } catch (e) {   
            console.error(e);
          }
        })
  }
  getFilteredData(catalogue_id) {
    this.service.productChangeSubject.next({
      catalogue_id: catalogue_id
    });
  }
  // ======================cart data====================
  setCartData() {
    const cartData = this.cartService.getCartData();
    if (cartData && cartData.length) {
      this.cartData = cartData;
      this.setAmountData();
    } else {
      this.cartData = [];
      this.hideDialog();
    }
  }

  setAmountData() {
    this.totalCount = 0;
    this.cartData.forEach((val: CartModel) => {
      return this.totalCount += val.quantity * val.showPrice;
    });
  }

  hideDialog() {
    this.toggle.emit();
  }

  checkScroll() {
    const element = document.getElementsByClassName('app-cart-list')[0];
    if (element && element.scrollHeight > 300) {
      element.scrollTop = element.scrollHeight;
    }
  }

  decreamentQuantityCart(id, index) {
    this.cartService.decreamentQuantity(id, index);
  }
  increaseQuantityCart(id, index) {
    this.cartService.increaseQuantity(id, index);
  }
  selectcart(id) {
    this.cartBool[id] = true;
  }

  // =======================open image pop up============================
  showLightBox(product, index) {
    if (this.config.pdp_view === 1 && index !== '') {
      this.goToProductDetailsPage(product, index);
      this.sessionService.set('user_id', product.user_id);
    } else {
      this.productLongDescription = product.long_description
      this.caraouselImages = product.multi_image_url;
      if (this.caraouselImages.length) {
        this.openMultiImage = true;
        //$('#lightbox').modal('show').css('display', 'flex');
      }
    }
  }

  // ====================decrease quantity of product========================
  decreamentQuantity(id, index) {
    const cartProductData = this.sessionService.getByKey('app', 'cartProduct');
    const product = JSON.parse(JSON.stringify(this.productList))[0];
    this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.remove_quantity, product.name, '', '');
    const productData = this.sessionService.getByKey('app', 'cart');
    const customizedData = this.sessionService.getByKey('app', 'customize');
    if (Object.keys(customizedData[id].data).length === 1) {
      cartProductData[id].quantity -= 1;
      this.sessionService.setByKey('app', 'cartProduct', cartProductData);
      index = cartProductData[id].index;
      if (this.productQuantity[id]) {
        this.productQuantity[id]--;
        if (!this.productQuantity[id]) {
          this.productBool[id] = 0;
          this.cartService.removeProduct(id, index);
        } else {
          this.cartService.updateProductQuantity(id, this.productQuantity[id]);
        }
      } else {
        this.productBool[id] = 0;
        this.cartService.removeProduct(id, index);
      }
    }
  }

  // =====================increase quantity=======================
  increaseQuantity(product, id, index) {
    if ((product.inventory_enabled && this.productQuantity[product.product_id] < product.available_quantity) ||
      !product.inventory_enabled) {
      const cartProductData = this.sessionService.getByKey('app', 'cartProduct');
      const product = JSON.parse(JSON.stringify(this.productList))[0];
      this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.add_quantity, product.name, '', '');
      cartProductData[id].quantity += 1;
      this.sessionService.setByKey('app', 'cartProduct', cartProductData);
      if (this.productQuantity[id]) {
        this.productQuantity[id]++;
      } else {
        this.productQuantity[id] = 2;
      }
      this.cartService.updateProductQuantity(id, this.productQuantity[id]);
      setTimeout(() => this.cartService.updateAddCartStatus(), 100);
    } else {
      this.popup.showPopup(MessageType.ERROR, 2000, this.languageStrings.quantity_exceed_msg || "The selected quantity exceeds quantity available in stock." , false);
    }
  }

  // =====================check business before adding===========================
  checkBusinessTypeBeforeAdding(products, index) {
    this.currentProductWithAddon = Object.assign({}, products);
    if (this.checkIfSameMerchantOrNot(products)) {
      if (this.config.multiple_product_single_cart === 2) {
        // (this.restaurantInfo.business_type === 2 || this.restaurantInfo.business_type === '2')
        const productData = this.sessionService.getByKey('app', 'cart');
        if (productData && productData.length) {
          this.languageStrings.one_product_avail_msg = (this.languageStrings.one_product_avail_msg || "You can only avail one PRODUCT_PRODUCT at a time.")
          .replace('PRODUCT_PRODUCT', this.terminology.PRODUCT);          
          const msg = this.languageStrings.one_product_avail_msg;
          this.popup.showPopup(MessageType.ERROR, 2000, msg, false);
          // this.removeProductAccToType(productData[0].id,productData.length - 1);
        } else {
          this.getSchedulingTimeAccToProduct(products, index);
        }
        // this.addCart(products, index);
      } else {
        this.getSchedulingTimeAccToProduct(products, index);
      }
    }
  }

  checkIfSameMerchantOrNot(products) {
    let cartData = this.cartService.getCartData();
    if (cartData && cartData.length) {
      for (let i = 0; i < cartData.length; i++) {
        if (cartData[i].user_id !== products.user_id) {
          this.popup.showPopup(MessageType.ERROR, 2000, this.languageStrings.add_same_store_msg || "Please add products from same store.", false);
          return false;
        }
      }
      this.sessionService.set('user_id', products.user_id);
      return true;
    } else {
      this.sessionService.set('user_id', products.user_id);
      return true;
    }
  }

  getSchedulingTimeAccToProduct(products, index) {
    let cart = this.cartService.getCartData();
    if (!cart) {
      cart = [];
    }
    const indexCheck = cart.findIndex((o: any) => o.id === products.product_id);
    if (this.config.business_type === 2 && this.config.pd_or_appointment != TaskType.SERVICE_AS_PRODUCT) {
      if (indexCheck > -1) {
        this.addCart(products, index);
      } else {
        this.productSelectedToAdd = products;
        this.indexGot = index;
        $('#timeSelection').modal('show');
      }
    } else if (this.config.business_type === 1) {
      this.addCart(products, index);
    }
  }

  addCart(products, index) {
    if ((products.inventory_enabled && this.productQuantity[products.product_id] < products.available_quantity) ||
      !products.inventory_enabled || (products.inventory_enabled && this.productQuantity[products.product_id] < products.maximum_quantity))
       {
      const copyProduct = JSON.parse(JSON.stringify(this.productList));
      const product = copyProduct[index];
      this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.add_quantity, product.name, '', '');

      if (product.customization && product.customization.length) {
        this.currentProduct = product;
        this.currentProduct.quantity = product.minimum_quantity || 1;
        this.currentProduct.totalPrice = this.currentProduct.price;
        this.currentProduct.type = this.currentProduct.layout_data.buttons[0].type;
        this.currentProduct.totalItem = 0;
        this.customizedObj[product.product_id] = product;
        this.setCustomizedObj();
        setTimeout(() => {
          $('#myModal').modal('show');
        }, 100);
      } else {
        this.setProductContent(product, index);
        this.productBool[product.product_id] = true;
        this.getTotalAmount();
      }
    } else {
      this.popup.showPopup(MessageType.ERROR, 2000, this.languageStrings.quantity_exceed_msg || "The selected quantity exceeds quantity available in stock.", false);
    }
  }

  getTotalAmount() {
    if (this.config.multiple_product_single_cart === 2) {
      // (this.restaurantInfo.business_type === 2 || this.restaurantInfo.business_type === '2') &&
      this.totalCount = 0;
      this.cartService.getCartData().forEach((val: CartModel) => {
        return this.totalCount += val.quantity * val.showPrice;
      });
      this.goToCheckout();
    }
  }

  setCustomizedObj() {
    const customizedObj = {};
    this.currentProduct.customization.forEach(val => {
      const obj = {};
      val.customize_options.forEach(element => {
        if (element.is_default) {
          obj[element.cust_id] = element;
          this.currentProduct.totalPrice += element.price;
          this.currentProduct.totalItem++;
        }
      });
      customizedObj[val.customize_id] = obj;
    });
    this.currentCustomizeObj = customizedObj;
  }

  setProductContent(product, index) {
    const obj: any = {};
    obj.id = product.product_id;
    obj.quantity = product.minimum_quantity || 1;
    obj.price = product.price;
    obj.showPrice = product.price;
    obj.available_quantity = product.available_quantity;
    obj.inventory_enabled = product.inventory_enabled;
    obj.name = product.name;
    obj.type = product.layout_data.buttons[0].type;
    obj.customizations = [];
    obj.totalPrice = (obj.price * product.quantity);
    obj.unit = product.unit;
    obj.unit_type = product.unit_type;
    obj.unit_count = this.unit_count;
    obj.enable_tookan_agent = product.enable_tookan_agent;
    obj.is_agents_on_product_tags_enabled = product.is_agents_on_product_tags_enabled;
    obj.user_id = product.user_id;
    obj.delivery_by_merchant = product.delivery_by_merchant;
    obj.is_static_address_enabled = product.is_static_address_enabled;
    obj.minimum_quantity = product.minimum_quantity;
    obj.category_id = product.parent_category_id;
    obj.maximum_quantity = product.maximum_quantity;
    obj.original_customization = product.customization;
    obj.layout_data = product.layout_data;
    if(product.service_time){
      obj.service_time = product.service_time;
    }
    if(obj.is_agents_on_product_tags_enabled && product.agent_id){
      obj.agent_id =  product.agent_id;
    }
    if(this.formSetting.is_multi_currency_enabled){
      obj.payment_settings = product.payment_settings
    }
    if(product.often_bought_products){
      obj.often_bought_products = product.often_bought_products;
    }
    obj.is_recurring_enabled = this.config.is_recurring_enabled ? product.is_recurring_enabled : 0;
    if (this.config.business_type === 2) {
      this.makeCustomizationTimeSame(obj);
      // obj.start_time = this.start_time;
      // if (this.end_time) {
      //   obj.end_time = this.end_time;
      // }
    }
    // this.selectedProduct[product.product_id] = obj;
    this.setProductInCart(obj);
  }

  makeCustomizationTimeSame(data) {
    let cart = this.cartService.getCartData();
    if (!cart) {
      cart = [];
    }
    const indexCheck = cart.findIndex((o: any) => o.id === o.id === data.id);

    if (indexCheck > -1) {
      data.start_time = cart[indexCheck].start_time;
      if (cart[indexCheck].end_time) {
        data.end_time = cart[indexCheck].end_time;
      }
    } else {
      data.start_time = this.start_time;
      if (this.end_time) {
        data.end_time = this.end_time;
      }
    }
  }

  setProductInCart(data) {
    let productData = this.sessionService.getByKey('app', 'cart');
    if (productData && productData.length) {
      if (this.productBool[data.id]) {
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
      this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.add_to_cart, this.sessionService.get('info').store_name, '', '');
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
  setDefaultProductQuantity() {
    const cartProductData = this.sessionService.getByKey('app', 'cartProduct');
    cartProductData ? this.cartProductData = cartProductData : this.cartProductData = {};

  }

  checkAvailableIndexOfCustomize(product, customizeData) {
    let status: any = false;
    for (const custom in customizeData.data) {
      const customData = customizeData.data[custom];
      if (customData.length === product.customizations.length) {
        let count = 0;
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
    return status;
  }

  onPopUpClose() {
    this.showCustomerVerificationPopUp = false;
    this.router.navigate(['profile']);
  }
  goToCheckout() {
    if (parseFloat(this.decimalPipe.decimalPrecision(this.totalCount)) < parseFloat(this.decimalPipe.decimalPrecision(this.minimumOrder))) {
      this.languageStrings.minimum_order_amount = (this.languageStrings.minimum_order_amount || "Minimum order amount should be $10")
      .replace('ORDER_ORDER', this.terminology.ORDER);
      this.languageStrings.minimum_order_amount = this.languageStrings.minimum_order_amount.replace('$', this.currency);
      this.languageStrings.minimum_order_amount = this.languageStrings.minimum_order_amount.replace('10', this.decimalPipe.transform(this.minimumOrder));
      const msg = this.languageStrings.minimum_order_amount;
      this.popup.showPopup(MessageType.ERROR, 2000, msg, false);
      return false;
    }
    if (this.sessionService.get('appData') && parseInt(this.sessionService.getString('reg_status')) === 1) {
      if( ( this.sessionService.get('config').is_customer_verification_required ===  1 ) && ( this.sessionService.get('appData').vendor_details.is_vendor_verified !== 1 ) ) {
        this.showCustomerVerificationPopUp = true;
        return false;
      }
      this.toggle.emit();
      this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.go_to_checkout, 'Go to checkout', '', '');
      this.router.navigate(['checkout']);
    } else if (this.sessionService.get('appData') && parseInt(this.sessionService.getString('reg_status')) !== 1 &&
      !this.sessionService.get('appData').signup_template_data.length) {
      this.toggle.emit();
      this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.go_to_checkout, 'Go to checkout', '', '');
      this.router.navigate(['checkout']);
     } else {
      if (this.sessionService.get('config').business_model_type == "ECOM" && this.sessionService.get('config').nlevel_enabled === 1) {
        this.messageService.openSignUpPage({});
        this.messageService.getLoginSignupLocation('From Checkout Button');
        $('#signupDialog').modal('show');
      }
      else {
        this.messageService.getLoginSignupLocation('From Checkout Button');
        $('#loginDialog').modal('show');
      }
      //


    }
  }



  setDefaultValue() {
    const cartData = this.cartService.getProductQuantity();
    if (this.productList[0] === undefined) {
      this.productList = [];
    }
    if(this.productList[0] != undefined){
      this.currency = this.formSetting.is_multi_currency_enabled ? this.productList[0].payment_settings.symbol : this.config['payment_settings'][0].symbol;
    }
    this.productList.forEach((val, index) => {
      if (cartData && cartData[val.product_id]) {
        this.productQuantity[val.product_id] = cartData[val.product_id].quantity;
        this.productBool[val.product_id] = true;
      } else {
        this.productQuantity[val.product_id] = 0;
        this.productBool[val.product_id] = 0;
      }

    });

    this.checkFullWidth();
  }

  checkFullWidth() {
    const totalWidth = window.innerWidth - 60;
    const childrenWidth = this.getTotalChildLength();
    if (totalWidth >= childrenWidth) {
      this.productBool['next'] = true;
    } else {
      this.productBool['next'] = false;
    }
  }

  getTotalChildLength() {
    const elements: any = document.getElementsByClassName('scroll-child');
    let elementWidth = 0;
    for (let i = 0; i < elements.length; i++) {
      elementWidth += elements[i].clientWidth;
    }
    return elementWidth;
  }

  getCartQuantityData() {
    this.cartService.currentStatus.subscribe(() => {
      this.setDefaultValue();
    });
  }

  // ==========================get selected timings from date picker=============================
  getSelectedTiming(event) {
    this.start_time = event.start;
    if (event.end) {
      this.end_time = event.end;
    }
    this.unit_count = event.unit_count;
    this.sessionService.set('user_id', event.user_id);
    this.addCart(event.product, event.index);
  }

  // ========================customize addons dialog==========================
  decreaseCustomizeProduct() {
    if (this.currentProduct.quantity !== 1) {
      this.currentProduct.quantity--;
    } else {
      this.resetDialog();
    }
  }

  increaseCustomizeProduct() {
    const productData = this.productList;
    const that = this;

    productData.forEach(function (obj) {
      if (obj.product_id === that.currentProduct.product_id) {
        const checkQuantity = that.productQuantity[obj.product_id] + that.currentProduct.quantity;
        if ((checkQuantity < obj.available_quantity && obj.inventory_enabled) || !obj.inventory_enabled) {
          that.currentProduct.quantity++;
        } else {
          that.popup.showPopup(MessageType.ERROR, 2000, this.languageStrings.quantity_exceed_msg || "The selected quantity exceeds quantity available in stock." , false);
        }
      }
    });
  }

  changeExtrasStatus(productId, customization, custIndex, optionIndex, status) {
    const length = Object.keys(this.currentCustomizeObj[customization.customize_id]).length;
    let is_default_check = false;
    if (!customization.is_check_box) {
      this.currentProductWithAddon.customization[custIndex].customize_options.forEach((elem) => {
        if (elem.is_default) {
          is_default_check = true;
        }
      });
      let previousItem;
      if (!status) {
        for (const prop in this.currentCustomizeObj[customization.customize_id]) {
          previousItem = this.currentCustomizeObj[customization.customize_id][prop];
          delete this.currentCustomizeObj[customization.customize_id][prop];
        }
        customization.customize_options.forEach((element, index) => {
          if (index === optionIndex) {
            this.customizedObj[productId].customization[custIndex].customize_options[index].is_default = true;
          } else {
            this.customizedObj[productId].customization[custIndex].customize_options[index].is_default = false;
          }

        });
        if (previousItem) {
          this.currentProduct.totalPrice -= previousItem.price;
        }
        this.currentProduct.totalPrice += customization.customize_options[optionIndex].price;
        this.currentCustomizeObj[customization.customize_id][customization.customize_options[optionIndex].cust_id]
          = customization.customize_options[optionIndex];
      }
      if (status && !is_default_check) {

        for (const prop in this.currentCustomizeObj[customization.customize_id]) {
          previousItem = this.currentCustomizeObj[customization.customize_id][prop];
          delete this.currentCustomizeObj[customization.customize_id][prop];
        }
        this.customizedObj[productId].customization[custIndex].customize_options[optionIndex].is_default = false;
        this.currentProduct.totalPrice -= this.customizedObj[productId].customization[custIndex].customize_options[optionIndex].price
      }

    } else {
      this.customizedObj[productId].customization[custIndex].customize_options[optionIndex].is_default = !status;
      if (status) {
        this.currentProduct.totalPrice -= customization.customize_options[optionIndex].price;
        this.currentProduct.totalItem--;
        delete this.currentCustomizeObj[customization.customize_id][customization.customize_options[optionIndex].cust_id];
      } else {
        this.currentProduct.totalPrice += customization.customize_options[optionIndex].price;
        this.currentProduct.totalItem++;
        this.currentCustomizeObj[customization.customize_id][customization.customize_options[optionIndex].cust_id]
          = customization.customize_options[optionIndex];
      }

    }
  }

  addCustomization(type) {
    if (!this.checkForMinimumSelectionAddon()) {
      return false;
    }

    if (+this.currentProduct.quantity < this.currentProduct.minimum_quantity) {
      let msg = this.languageStrings.quantity_less_than_min || "Quantity of ___ is less than minimum quantity ___";
      msg = msg.replace('___', this.currentProduct.name);
      msg = msg.replace('___', this.currentProduct.minimum_quantity);
      this.minSelectAddonError = msg;
      setTimeout(() => { this.minSelectAddonError = ''; }, 2000);
      return false;
    }
    if (this.currentProduct.maximum_quantity > 0 ) {
    if (+this.currentProduct.quantity > this.currentProduct.maximum_quantity) {
      let msg = this.languageStrings.quantity_greater_than_max || "Quantity of ___ is greater than maximum quantity ___";
      msg = msg.replace('___', this.currentProduct.name);
      msg = msg.replace('___', this.currentProduct.maximum_quantity);
      this.maxSelectAddonError = msg;
      setTimeout(() => { this.maxSelectAddonError = ''; }, 2000);
      return false;
    }
  }
    const obj: any = {};
    const customizations = this.getSelectedCustomization();
    obj.id = this.currentProduct.product_id;
    obj.quantity = this.currentProduct.quantity;
    obj.price = this.currentProduct.price;
    obj.showPrice = this.currentProduct.totalPrice;
    obj.available_quantity = this.currentProduct.available_quantity;
    obj.inventory_enabled = this.currentProduct.inventory_enabled;
    obj.name = this.currentProduct.name;
    obj.unit = this.currentProduct.unit;
    obj.unit_type = this.currentProduct.unit_type;
    obj.unit_count = this.unit_count;
    obj.type = this.currentProduct.layout_data.buttons[0].type;
    obj.customizations = customizations;
    obj.enable_tookan_agent = this.currentProduct.enable_tookan_agent;
    obj.is_agents_on_product_tags_enabled = this.currentProduct.is_agents_on_product_tags_enabled;
    obj.user_id = this.currentProduct.user_id;
    obj.totalPrice = (this.currentProduct.totalPrice * this.currentProduct.quantity);
    obj.delivery_by_merchant = this.currentProduct.delivery_by_merchant;
    obj.is_static_address_enabled = this.currentProduct.is_static_address_enabled;
    obj.minimum_quantity = this.currentProduct.minimum_quantity;
    obj.maximum_quantity = this.currentProduct.maximum_quantity;
    if(this.currentProduct.often_bought_products){
      obj.often_bought_products = this.currentProduct.often_bought_products;
    }
    obj.is_recurring_enabled = this.config.is_recurring_enabled ? this.currentProduct.is_recurring_enabled : 0;
    obj.original_customization = this.currentProduct.customization;
    obj.layout_data = this.currentProduct.layout_data;
    if(this.currentProduct.service_time){
      obj.service_time = this.currentProduct.service_time;
    }
    if(obj.is_agents_on_product_tags_enabled && this.currentProduct.agent_id){
      obj.agent_id =  this.currentProduct.agent_id;
    }
    if(this.formSetting.is_multi_currency_enabled){
      obj.payment_settings = this.currentProduct.payment_settings
    }
    if (this.config.business_type === 2) {
      this.makeCustomizationTimeSame(obj);
      // obj.start_time = this.start_time;
      // if (this.end_time) {
      //   obj.end_time = this.end_time;
      // }
    }
    this.setProductInCart(obj);
    this.resetDialog();
    if (type === 0) {
      this.getTotalAmount();
    }
  }

  getSelectedCustomization() {
    const data = [];
    for (const prop in this.currentCustomizeObj) {
      for (const subprop in this.currentCustomizeObj[prop]) {
        const option = this.currentCustomizeObj[prop][subprop];
        const obj = {
          cust_id: option.cust_id,
          unit_price: option.price,
          quantity: 1,
          total_price: option.price,
          name: option.name
        };
        data.push(obj);
      }
    }
    return data;
  }

  resetDialog() {
    this.currentProduct = false;
    this.customizedObj = {};
    this.currentCustomizeObj = {};
    $('#myModal').modal('hide');
  }

  // =======================got to product details page===================
  goToProductDetailsPage(item, index) {
    if (this.formSetting.business_model_type === 'ECOM' && this.sessionService.get('config').nlevel_enabled === 2
      && this.config.pdp_view !== 0) {
      this.messageService.sendProductIndexToDetails(index);
      this.router.navigate(['ecomDetails', item.product_id]);
    } else if (this.config.pdp_view !== 0) {
      this.messageService.sendProductIndexToDetails(index);
      this.router.navigate(['details', item.product_id]);
    }
  }
  /**
   * function to check selection for addons
   */

  checkForMinimumSelectionAddon() {
    let CustomizationOriginal = this.currentProduct.customization
    let custObj;
    let success = true;

    for (let key in this.currentCustomizeObj) {
      custObj = CustomizationOriginal.filter(elem => elem.customize_id == key)[0];
      if (custObj.minimum_selection_required) {
        if (Object.keys(this.currentCustomizeObj[key]).length != custObj.minimum_selection) {
          let msg = this.languageStrings.exactly_option_should_be_selected || "Exactly ___ option should be selected of  ___";
          msg = msg.replace('___', custObj.minimum_selection);
          msg = msg.replace('___', custObj.name);
          this.minSelectAddonError = msg;
          setTimeout(() => { this.minSelectAddonError = ''; }, 2000);
          success = false;
        }
      }
    }
    return success;
  }

  /**
   * listen emit event for showing multi images
   */
  showMultiImagesEvent(event) {
    this.showLightBox(event.data, '');
  }

  hideMultiImageDialog() {
    this.openMultiImage = false;
  }
}
