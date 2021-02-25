import { MessageType } from './../../constants/constant';
/**
 * Created by cl-macmini-51 on 01/06/18.
 */
import { Component, NgZone, OnDestroy, OnInit, AfterViewInit, EventEmitter, Output, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MapsAPILoader } from '@agm/core';
import { PageScrollService, PageScrollInstance } from 'ngx-page-scroll';
import { DOCUMENT } from '@angular/common';
import { FormBuilder, Validators, FormControl, FormGroup } from '@angular/forms';

import { SessionService } from '../../services/session.service';
import { LoaderService } from '../../services/loader.service';
import { AppCartService } from '../catalogue/components/app-cart/app-cart.service';
import { RestaurantsService } from '../restaurants-new/restaurants-new.service';
import { MessageService } from '../../services/message.service';
import { ProductOnlyService } from '../app-product-only/app-product.service';
import { PopUpService } from '../../modules/popup/services/popup.service';
import { GoogleAnalyticsEventsService } from '../../services/google-analytics-events.service';
import { AppService } from '../../app.service';
import { ProductDetailsService } from './product-details.service';
import { FetchLocationService } from '../fetch-location/fetch-location.service';

import { CartModel } from '../catalogue/components/app-cart/app-cart.model';
import { ModalType, priceType } from '../../constants/constant';
import { IMerchantProfile, ILastReviewRating } from './product-details.interface';
import { GoogleAnalyticsEvent, AmountService } from "../../enums/enum";
import { DecimalConfigPipe } from '../../pipes/decimalConfig.pipe';

declare var $: any;

// import * as $ from 'jquery';

@Component({
  selector: "app-product-details",
  templateUrl: "./product-details.component.html",
  styleUrls: ["./product-details.component.scss"]
})
export class ProductDetailsComponent
  implements OnDestroy, OnInit, AfterViewInit {
  showViewProfilePopup: boolean;
  showReviewPopup: boolean;
  showAllReviewsPopup: boolean;
  public config: any;
  public terminology: any;
  public currency: any;
  public product_id: any;
  public productDetailsData: any;
  public mapStyle: any;
  public productDetailsDataArray: any;
  public productIndex: number;
  public productShow = true;
  public cartData: Array<any> = [];
  public productSelectedToAdd: any;
  public indexGot: any;
  public start_time: any;
  public end_time: any;
  private productQuantity: any = {};
  currentProduct: any;
  totalCount = 0;
  private customizedObj: any = {};
  private productBool: any = {};
  private currentCustomizeObj: any = {};
  private minimumOrder: any;
  public addBtnTxt;
  public removeBtnTxt;
  public unit_count = 0;
  public langJson: any = {};
  public languageSelected: any;
  public direction = "ltr";
  public modalType: ModalType = ModalType;
  public merchantProfile: IMerchantProfile;
  priceTypeConst = priceType;
  public currentProductWithAddon;
  public productDetailsDataCopy;
  showCustomerVerificationPopUp: boolean;
  ratingForm: FormGroup;
  ratingError: any;
  allReviews: ILastReviewRating;
  myReview: any;

  loggedIn = false;
  public headerData;

  @Output()
  toggle: EventEmitter<string> = new EventEmitter<string>();
  restaurentInfo: any;
  store: any;
  deliveryMode: any;
  stores: any;
  decimalPipe = new DecimalConfigPipe(this.sessionService);
  languageStrings: any={};

  constructor(
    public service: RestaurantsService,
    public messageService: MessageService,
    public loader: LoaderService,
    public router: Router,
    public sessionService: SessionService,
    public route: ActivatedRoute,
    public cartService: AppCartService,
    public mapsAPILoader: MapsAPILoader,
    public ngZone: NgZone,
    public googleAnalyticsEventsService: GoogleAnalyticsEventsService,
    public popup: PopUpService,
    public detailsService: ProductDetailsService,
    public fetchLocationService: FetchLocationService,
    public appService: AppService,
    private pageScrollService: PageScrollService,
    @Inject(DOCUMENT) private document: any,
    private formBuilder: FormBuilder
  ) {
    this.mapStyle = this.fetchLocationService.getMapStyle();
    this.product_id = parseInt(this.route.snapshot.params["id"]);

    this.config = this.sessionService.get("config");
    this.messageService.sendIndex.subscribe(data => {
      this.productIndex = parseInt(data) - 1;
    });

    if (this.config) {

      this.config.borderColor = this.config["color"] || "#e13d36";
      this.terminology = this.config.terminology;
      this.currency = this.config["payment_settings"][0].symbol;
      if (this.config.button_type && this.config.button_type.button_names) {
        this.addBtnTxt = this.config.button_type.button_names.add
          ? this.config.button_type.button_names.add
          : "Add";
        this.removeBtnTxt = this.config.button_type.button_names.remove
          ? this.config.button_type.button_names.remove
          : "Remove";
      }
      if (this.config.pdp_view === 0) {
        this.router.navigate([""]);
      }
    }
    if (this.config && this.config.pdp_view === 1 && this.config.multiple_product_single_cart === 2 &&
      (this.config.nlevel_enabled !== 2 && this.config.business_model_type !== 'ECOM')) {
      const checkCartData = this.cartService.getCartData();
      if (checkCartData && checkCartData.length) {
        this.cartService.cartClearCall();
        this.messageService.clearCartOnly();
      }
    }
    if (this.sessionService.getString("language")) {
      this.languageSelected = this.sessionService.getString("language");
      if (this.languageSelected === "ar") {
        this.direction = "rtl";
      } else {
        this.direction = "ltr";
      }
    } else {
      this.languageSelected = "en";
      if (this.languageSelected === "ar") {
        this.direction = "rtl";
      } else {
        this.direction = "ltr";
      }
    }

    this.messageService.userLoggedOut.subscribe(() => {
      this.loggedIn = false;
    });

    this.messageService.userLoggedIn.subscribe(() => {
      this.loggedIn = true;
      this.getProductLastReviews();
    });
    this.sessionService.langStringsPromise.then(() =>
    {
     this.languageStrings = this.sessionService.languageStrings;
     this.languageStrings.customize_item = (this.languageStrings.customize_item || 'Customize Item')
     .replace(
       "ITEM_ITEM",
       this.terminology.ITEM
     );
     this.languageStrings.your_cart = (this.languageStrings.your_cart || "Your cart") 
     .replace(
       "CART_CART",
       this.terminology.CART
     );
     this.languageStrings.your_cart_empty = (this.languageStrings.your_cart_empty || "Your cart is empty")
     .replace("CART_CART", this.terminology.CART);
     this.languageStrings.this_product_available_with = (this.languageStrings.this_product_available_with || "This Product is available with")
     .replace("PRODUCT_PRODUCT", this.terminology.PRODUCT);
     
    });
  }

  ngAfterViewInit() { }

  ngOnInit() {
    if (this.sessionService.get('appData')) { this.loggedIn = true; }

    this.headerData = this.sessionService.get("config");
    this.loader.hide();
    this.getProductDetails();
    if (
      this.config.nlevel_enabled === 2 &&
      this.config.business_model_type === "ECOM"
    ) {
      this.getCartData();
      if (this.cartData.length > 0) {
        this.getTotalAmount();
        this.setAmountData();
      }
    }
    this.deliveryMode = Number(this.sessionService.getString('deliveryMethod'));
    this.stores=this.sessionService.get('info');
    if (this.deliveryMode == 2) {
      this.minimumOrder = this.stores.minimum_self_pickup_amount;
    }
    else if (this.deliveryMode == 1) {
      this.minimumOrder = this.stores.merchantMinimumOrder;
    }
    // ================language json manupilation======================
    this.appService.langPromise.then(() => {
      this.langJson = this.appService.getLangJsonData();
    });
    this.cartService.currentStatus.subscribe(() => {
      this.setCartData();
    });
    this.cartService.currentStatus.subscribe(() => {
      this.setCartData();
    });
    this.cartService.cartClear.subscribe(() => {
      this.setCartData();
    });
    this.myReview = { rating: '', review: '' };
  }

  ngOnDestroy() {
    this.sessionService.resetTitle();
  }

  public triggerScrollTo(): void {
    const pageScrollInstance: PageScrollInstance = PageScrollInstance.simpleInstance(
      this.document,
      "#mapContainer"
    );
    this.pageScrollService.start(pageScrollInstance);
  }
  setCartData() {
    const cartData = this.cartService.getCartData();
    if (cartData && cartData.length) {

      this.cartData = cartData;
      this.getTotalAmount();
      this.setAmountData();
    } else {
      this.cartData = [];
      // this.hideDialog();
    }
  }
  // ==============================get product details===========================
  getProductDetails() {
    this.loader.show();
    const data = {
      app_type: "WEB",
      is_demo_app: 0,
      marketplace_reference_id: this.config.marketplace_reference_id,
      marketplace_user_id: this.config.marketplace_user_id,
      product_id: this.product_id,
      user_id: (this.config.nlevel_enabled === 2 && this.config.business_model_type === 'ECOM') ?
        this.config.marketplace_user_id : undefined,
    };
    if (this.sessionService.get('appData')) {
      data['vendor_id'] = this.sessionService.get('appData').vendor_details.vendor_id;
      data['access_token'] = this.sessionService.get('appData').vendor_details.app_access_token;
    }
    this.detailsService.getProductDetails(data)
      .subscribe(
        response => {
          try {
            if (response.status === 200) {
              this.ngZone.run(() => {
              
                if (response.data && response.data.length > 0) {
                  this.goToParticularRestaurant(response.data[0]);
                  this.productShow = true;
                  this.productDetailsDataCopy = JSON.parse(JSON.stringify(response.data[0]))
                  this.productDetailsData = response.data[0];
                  this.productDetailsDataArray = response.data;
                  this.productSelectedToAdd = this.productDetailsData;
                  if (this.productDetailsData.custom_fields && this.productDetailsData.custom_fields.length) {

                    const CustomFieldbyDataType = {};
                    this.productDetailsData.custom_fields.forEach(element => {
                      CustomFieldbyDataType[element.data_type] = CustomFieldbyDataType[element.data_type] || [];
                      CustomFieldbyDataType[element.data_type].push(element);
                    });

                    const numberFields = CustomFieldbyDataType['Number'] || [];
                    this.productDetailsData.numberFields = numberFields;

                    const multiSelect = CustomFieldbyDataType['Multi-Select'] || [];
                    this.productDetailsData.multiSelect = multiSelect;

                    const singleSelect = CustomFieldbyDataType['Single-Select'] || [];
                    this.productDetailsData.singleSelect = singleSelect;

                    const image = CustomFieldbyDataType['Image'] || [];
                    this.productDetailsData.image = image;

                    const text = CustomFieldbyDataType['Text'] || [];
                    const textArea = CustomFieldbyDataType['TextArea'] || [];
                    const date = CustomFieldbyDataType['Date'] || [];
                    const time = CustomFieldbyDataType['Time'] || [];
                    const dateFuture = CustomFieldbyDataType['Date-Future'] || [];
                    const datePast = CustomFieldbyDataType['Date-Past'] || [];
                    const dateTime = CustomFieldbyDataType['Date-Time'] || [];
                    const dateTimeFuture = CustomFieldbyDataType['Datetime-Future'] || [];
                    const dateTimePast = CustomFieldbyDataType['Datetime-Past'] || [];
                    const email = CustomFieldbyDataType['Email'] || [];
                    const telephone = CustomFieldbyDataType['Telephone'] || [];

                    const concatArray = text.concat(date, time, dateFuture, datePast, dateTime,
                      dateTimeFuture, dateTimePast, email, telephone);
                    this.productDetailsData.text = concatArray.concat().sort(this.sessionService.sortBy('order'));
                    this.productDetailsData.text = this.productDetailsData.text.concat(singleSelect);
                    this.productDetailsData.text = this.productDetailsData.text.concat(textArea);
               
                  }

                  if (
                    this.productDetailsData.multiSelect &&
                    this.productDetailsData.multiSelect.length
                  ) {
                    this.makeFourthContainerElement(
                      this.productDetailsData.multiSelect
                    );
                  }
                  this.sessionService.set(
                    "user_id",
                    this.productDetailsData.user_id
                  );
                  this.getProductLastReviews();
                } else {
                  this.productShow = false;
                }
              });
            } else if (response.status === 400) {
            }
          } catch (e) {
            console.error(e);
          }
          this.loader.hide();
        },
        error => {
          console.error(error);
          this.loader.hide();
        }
      );
  }

  // =========================make fourth container width==============================
  makeFourthContainerElement(data) {
    const innerWidth = $(window).innerWidth();
    data.forEach(col => {
      switch (col.value.length) {
        case 1:
          col.width = "100%";
          break;
        case 2:
          col.width = "50%";
          break;
        case 3:
          if (innerWidth < 760) {
            col.width = "50%";
          } else {
            col.width = "33.33%";
          }
          break;
        default:
          if (col.value.length >= 4) {
            if (innerWidth < 760) {
              col.width = "50%";
            } else {
              col.width = "25%";
            }
          }
          break;
      }
    });
  }

  // =======================check availability==========================
  checkAvail() {
    if (!this.restaurentInfo && this.config.business_model_type === 'RENTAL') {
      this.popup.showPopup(MessageType.ERROR, 2000, this.languageStrings.not_serve_this_delivery_area || 'We do not serve in this delivery area', false);
      return;
    } else {
      const cart = this.cartService.getCartData();
      if (cart && cart.length > 0) {
        this.getTotalAmount();
        return;
      }
      this.checkBusinessTypeBeforeAdding(
        this.productDetailsData,
        this.productIndex
      );
    }

  }

  // =======================check availability==========================
  checkAvailForEcom(product) {
    // console.log("product",product,this.productDetailsData);
    if (product && product.price) {
      this.productDetailsData.price = product.price;
    } else {
      this.productDetailsData.price = this.productDetailsData.sellers[0].price;
    }
    const checkCartData = this.cartService.getCartData();
    if (checkCartData && checkCartData.length) {
      this.cartService.cartClearCall();
      this.messageService.clearCartOnly();
    }
    this.checkBusinessTypeBeforeAdding(
      this.productDetailsData,
      this.productIndex
    );
  }
  // =====================check business before adding===========================
  checkBusinessTypeBeforeAdding(products, index) {
    this.currentProductWithAddon = Object.assign({}, this.productDetailsDataCopy);
    if (this.config.multiple_product_single_cart === 2) {
      const productData = this.sessionService.getByKey("app", "cart");
      if (productData && productData.length) {
        this.languageStrings.you_can_only_avail_one_product =
          (this.languageStrings.you_can_only_avail_one_product || 'You can only avail one product at a time.')
          .replace('PRODUCT_PRODUCT', this.terminology.PRODUCT);
        const msg = this.languageStrings.you_can_only_avail_one_product;
        this.popup.showPopup(MessageType.ERROR, 2000, msg, false);
      } else {
        this.getSchedulingTimeAccToProduct(products, index);
      }
    } else {
      this.getSchedulingTimeAccToProduct(products, index);
    }
  }

  getSchedulingTimeAccToProduct(products, index) {
    let cart = this.cartService.getCartData();
    if (!cart) {
      cart = [];
    }
    const indexCheck = cart.findIndex((o: any) => o.id === products.product_id);
    if (this.config.business_type === 2) {
      if (indexCheck > -1) {
        this.addCart(products, index);
      } else {
        this.productSelectedToAdd = products;
        this.indexGot = index;
        $("#timeSelection").modal("show");
      }
    } else if (this.config.business_type === 1) {
      this.addCart(products, index);
    }
  }

  addCart(products, index) {
    if (
      (products.inventory_enabled &&
        this.productQuantity[products.product_id] <
        products.available_quantity) ||
      !products.inventory_enabled
    ) {
      const copyProduct = this.productDetailsDataArray;
      const product = copyProduct[0];
      this.googleAnalyticsEventsService.emitEvent(
        GoogleAnalyticsEvent.add_quantity,
        product.name,
        '',
        ''
      );
      if (product.customization && product.customization.length) {
        this.currentProduct = product;
        this.currentProduct.quantity = 1;

        if(this.config.business_model_type === 'HYPERLOCAL_SERVICE'){
          this.currentProduct.totalPrice = this.setAmountForServices(product);
        }else{
          this.currentProduct.totalPrice = this.currentProduct.price;
        }
        this.currentProduct.type = this.currentProduct.layout_data.buttons[0].type;
        this.currentProduct.totalItem = 0;
        this.customizedObj[product.product_id] = product;
        this.setCustomizedObj();
        setTimeout(() => {
          $("#myModal").modal("show");
        }, 100);
      } else {
        this.setProductContent(product, index);
        this.productBool[product.product_id] = true;
        this.getTotalAmount();
      }
    } else {
      this.popup.showPopup(
        MessageType.ERROR,
        2000,
        this.languageStrings.selected_quantity_exceed_avail || "The selected quantity exceeds quantity available in stock.",
        false
      );
    }
  }

  setAmountForServices(obj){
    let converterToSec;
    let check = this.cartService.convertToSec(obj);
    if(check.type== AmountService.Price){
      return check.value
    }else{
      converterToSec = check.value;
    }
    let pricePerUnitTime = obj.price/obj['unit'];
    let timeDiff;
    if(obj.start_time && obj.end_time){
      let start_dateTime = new Date(obj.start_time);
      let end_dateTime = new Date(obj.end_time);
      timeDiff = (end_dateTime.getTime() - start_dateTime.getTime())/1000;
      timeDiff /= converterToSec;
    }
    let service_time = obj.service_time ? obj.service_time/(converterToSec / 60): timeDiff;
    if(!service_time){
      service_time = 1;
    }
    let showPrice = obj.quantity * pricePerUnitTime * service_time;
    if(obj['customizations']){
      obj['customizations'].forEach(addOn => {
        showPrice = showPrice + addOn.unit_price * obj.quantity;
      });
    }
    this.totalCount +=  showPrice;
    return showPrice;
}
  // ==========================get selected timings from date picker=============================
  getSelectedTiming(event) {
    // console.log(event,'111111111');
    this.start_time = event.start;
    if (event.end) {
      this.end_time = event.end;
    }
    this.unit_count = event.unit_count;
    this.addCart(event.product, event.index);
  }

  getTotalAmount() {
    if (this.config.multiple_product_single_cart === 2) {
      // (this.restaurantInfo.business_type === 2 || this.restaurantInfo.business_type === '2') &&
      this.totalCount = 0;
      this.cartService.getCartData().forEach((val: CartModel) => {
        return (this.totalCount += val.quantity * val.showPrice);
      });
      this.goToCheckout();
    }
  }
  setAmountData() {
    this.totalCount = 0;
    this.cartData.forEach((val: CartModel) => {
      return (this.totalCount += val.quantity * val.showPrice);
    });
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
    obj.quantity = 1;
    obj.price = product.price;
    obj.variablePrice = product.variablePrice;
    obj.showPrice = product.price;
    obj.available_quantity = product.available_quantity;
    obj.inventory_enabled = product.inventory_enabled;
    obj.name = product.name;
    obj.type = product.layout_data.buttons[0].type;
    obj.customizations = [];
    obj.totalPrice = obj.price * product.quantity;
    obj.unit = product.unit;
    obj.unit_type = product.unit_type;
    obj.unit_count = this.unit_count;
    obj.enable_tookan_agent = product.enable_tookan_agent;
    obj.is_agents_on_product_tags_enabled = this.currentProduct.is_agents_on_product_tags_enabled;
    obj.delivery_by_merchant = product.delivery_by_merchant;
    obj.is_static_address_enabled = product.is_static_address_enabled;
    obj.user_id = product.user_id;
    obj.category_id = product.parent_category_id;
    obj.original_customization = product.customization;
    obj.layout_data = product.layout_data;
    if(product.service_time){
      obj.service_time = product.service_time;
    }
    if(obj.is_agents_on_product_tags_enabled && product.agent_id){
      obj.agent_id =  product.agent_id;
    }
    if(product.often_bought_products){
      obj.often_bought_products = product.often_bought_products;
    }
    if(this.sessionService.get('config').is_multi_currency_enabled){
      obj.payment_settings = product.payment_settings
    }
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
    const indexCheck = cart.findIndex((o: any) => o.id === data.id);
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
    let productData = this.sessionService.getByKey("app", "cart");
    if (productData && productData.length) {
      if (this.productBool[data.id]) {
        const customizedData = this.sessionService.getByKey("app", "customize");
        const status = this.checkAvailableIndexOfCustomize(
          data,
          customizedData[data.id]
        );
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
    this.sessionService.setByKey("app", "cart", productData);
    this.cartService.updateStatus();
  }
  setProductInCartForEcom() {
    // let productData = this.sessionService.getByKey('app', 'cart');
    // productData.push(this.productDetailsData);
  }
  setProductQuantityForCart(data, index) {
    let cartProductData = this.sessionService.getByKey("app", "cartProduct");
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
    this.sessionService.setByKey("app", "cartProduct", cartProductData);
  }

  setCustomizeData(product, index) {
    let customizedData = this.sessionService.getByKey("app", "customize");
    if (customizedData) {
      if (customizedData[product.id]) {
        const status = this.checkAvailableIndexOfCustomize(
          product,
          customizedData[product.id]
        );
        if (status === false) {
          customizedData[product.id]["data"][index] = product.customizations;
        }
      } else {
        const obj = this.getCustomizeProductQuantityByData(product, index);
        customizedData[product.id] = {};
        customizedData[product.id]["data"] = obj;
      }
    } else {
      customizedData = {};
      const obj = this.getCustomizeProductQuantityByData(product, index);
      customizedData[product.id] = {};
      customizedData[product.id]["data"] = obj;
    }
    this.sessionService.setByKey("app", "customize", customizedData);
  }

  getProductQuantityByData(data, index) {
    const obj = {};
    obj["quantity"] = data.quantity;
    obj["index"] = index;
    return obj;
  }

  getCustomizeProductQuantityByData(data, index) {
    const obj = {};
    obj[index] = data.customizations;
    return obj;
  }

  checkAvailableIndexOfCustomize(product, customizeData) {
    let status: any = false;
    for (const custom in customizeData.data) {
      const customData = customizeData.data[custom];
      if (customData.length === product.customizations.length) {
        let count = 0;
        customData.forEach((element, index) => {
          product.customizations.forEach(item => {
            if (item.cust_id === element.cust_id) {
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
  // ========================customize addons dialog==========================
  resetDialog() {
    this.currentProduct = false;
    this.customizedObj = {};
    this.currentCustomizeObj = {};
    $("#myModal").modal("hide");
  }

  addCustomization(type) {
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
    if(this.currentProduct.often_bought_products){
      obj.often_bought_products = this.currentProduct.often_bought_products;
    }
    obj.type = this.currentProduct.layout_data.buttons[0].type;
    obj.customizations = customizations;
    obj.enable_tookan_agent = this.currentProduct.enable_tookan_agent;
    obj.is_agents_on_product_tags_enabled = this.currentProduct.is_agents_on_product_tags_enabled;
    obj.user_id = this.currentProduct.user_id;
    obj.totalPrice =
      this.currentProduct.totalPrice * this.currentProduct.quantity;
    obj.delivery_by_merchant = this.currentProduct.delivery_by_merchant;
    obj.is_static_address_enabled = this.currentProduct.is_static_address_enabled;
    obj.original_customization = this.currentProduct.customization;
    obj.layout_data = this.currentProduct.layout_data;
    if(this.currentProduct.service_time){
      obj.service_time = this.currentProduct.service_time;
    }
    if(obj.is_agents_on_product_tags_enabled && this.currentProduct.agent_id){
      obj.agent_id =  this.currentProduct.agent_id;
    }
    if(this.sessionService.get('config').is_multi_currency_enabled){
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

  decreaseCustomizeProduct() {
    if (this.currentProduct.quantity !== 1) {
      this.currentProduct.quantity--;
    } else {
      this.resetDialog();
    }
  }

  increaseCustomizeProduct() {
    const productData = this.productDetailsDataArray;
    const that = this;

    productData.forEach(function (obj) {
      if (obj.product_id === that.currentProduct.product_id) {
        const checkQuantity =
          that.productQuantity[obj.product_id] + that.currentProduct.quantity;
        if (
          (checkQuantity < obj.available_quantity && obj.inventory_enabled) ||
          !obj.inventory_enabled
        ) {
          that.currentProduct.quantity++;
        } else {
          that.popup.showPopup(
            MessageType.ERROR,
            2000,
            this.languageStrings.selected_quantity_exceed_avail || "The selected quantity exceeds quantity available in stock." ,
            false
          );
        }
      }
    });
  }

  changeExtrasStatus(productId, customization, custIndex, optionIndex, status) {
    const length = Object.keys(
      this.currentCustomizeObj[customization.customize_id]
    ).length;
    let is_default_check = false;
    if (!customization.is_check_box) {
      this.currentProductWithAddon.customization[custIndex].customize_options.forEach((elem) => {
        if (elem.is_default) {
          is_default_check = true;
        }
      });
      let previousItem;
      if (!status) {
        for (const prop in this.currentCustomizeObj[
          customization.customize_id
        ]) {
          previousItem = this.currentCustomizeObj[customization.customize_id][
            prop
          ];
          delete this.currentCustomizeObj[customization.customize_id][prop];
        }
        customization.customize_options.forEach((element, index) => {
          if (index === optionIndex) {
            this.customizedObj[productId].customization[
              custIndex
            ].customize_options[index].is_default = true;
          } else {
            this.customizedObj[productId].customization[
              custIndex
            ].customize_options[index].is_default = false;
          }
        });
        if (previousItem) {
          this.currentProduct.totalPrice -= previousItem.price;
        }
        this.currentProduct.totalPrice +=
          customization.customize_options[optionIndex].price;
        this.currentCustomizeObj[customization.customize_id][
          customization.customize_options[optionIndex].cust_id
        ] = customization.customize_options[optionIndex];
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
      this.customizedObj[productId].customization[custIndex].customize_options[
        optionIndex
      ].is_default = !status;
      if (status) {
        this.currentProduct.totalPrice -=
          customization.customize_options[optionIndex].price;
        this.currentProduct.totalItem--;
        delete this.currentCustomizeObj[customization.customize_id][
          customization.customize_options[optionIndex].cust_id
        ];
      } else {
        this.currentProduct.totalPrice +=
          customization.customize_options[optionIndex].price;
        this.currentProduct.totalItem++;
        this.currentCustomizeObj[customization.customize_id][
          customization.customize_options[optionIndex].cust_id
        ] = customization.customize_options[optionIndex];
      }
    }
  }
  getCartData() {
    if (
      this.config.nlevel_enabled === 2 &&
      this.config.business_model_type === "ECOM"
    ) {
      const cartData = this.cartService.getCartData();

      if (cartData && cartData.length) {

        this.cartData = cartData;
        // this.setAmountData();
      } else {
        this.cartData = [];
        // this.hideDialog();
      }
    }
  }
  decreamentQuantityCart(id, index) {
    this.cartService.decreamentQuantity(id, index);
  }
  increaseQuantityCart(id, index) {
    this.cartService.increaseQuantity(id, index);
  }
  goToCheckoutForEcom() {
    if (parseFloat(this.decimalPipe.decimalPrecision(this.totalCount)) < parseFloat(this.decimalPipe.decimalPrecision(this.minimumOrder))) {
      this.languageStrings.min_order_amt_should_be =
        (this.languageStrings.min_order_amt_should_be || 'Minimum order amount should be $10')
        .replace('ORDER_ORDER', this.terminology.ORDER);
      this.languageStrings.min_order_amt_should_be =
        this.languageStrings.min_order_amt_should_be
        .replace('$', this.currency);
      this.languageStrings.min_order_amt_should_be =
        this.languageStrings.min_order_amt_should_be.replace('10', this.decimalPipe.transform(this.minimumOrder));
      const msg = this.languageStrings.min_order_amt_should_be;
      this.popup.showPopup(MessageType.ERROR, 2000, msg, false);
      return false;
    }

    if (
      this.sessionService.get("appData") &&
      parseInt(this.sessionService.getString("reg_status")) === 1
    ) {
      this.toggle.emit();
      this.googleAnalyticsEventsService.emitEvent(
        GoogleAnalyticsEvent.go_to_checkout,
        "Go to checkout",
        '',
        ''
      );
      this.router.navigate(["checkout"]);
    } else if (
      this.sessionService.get("appData") &&
      parseInt(this.sessionService.getString("reg_status")) !== 1 &&
      !this.sessionService.get("appData").signup_template_data.length
    ) {
      this.toggle.emit();
      this.googleAnalyticsEventsService.emitEvent(
        GoogleAnalyticsEvent.go_to_checkout,
        "Go to checkout",
        '',
        ''
      );
      this.router.navigate(["checkout"]);
    } else {
      this.messageService.getLoginSignupLocation('From Checkout Button');
      $("#loginDialog").modal("show");
    }
  }
  onPopUpClose() {
    this.showCustomerVerificationPopUp = false;
    this.router.navigate(['profile']);
  }
  goToCheckout() {
    if (parseFloat(this.decimalPipe.decimalPrecision(this.totalCount)) < parseFloat(this.decimalPipe.decimalPrecision(this.minimumOrder))) {
      this.languageStrings.min_order_amt_should_be =
        (this.languageStrings.min_order_amt_should_be || 'Minimum order amount should be $10')
        .replace('ORDER_ORDER', this.terminology.ORDER);
      this.languageStrings.min_order_amt_should_be =
        this.languageStrings.min_order_amt_should_be.replace('$', this.currency);
      this.languageStrings.min_order_amt_should_be =
        this.languageStrings.min_order_amt_should_be.replace('10', this.decimalPipe.transform(this.minimumOrder));
      const msg = this.languageStrings.min_order_amt_should_be;
      this.popup.showPopup(MessageType.ERROR, 2000, msg, false);
      return false;
    }
    if (
      this.sessionService.get("appData") &&
      parseInt(this.sessionService.getString("reg_status")) === 1
    ) {
      if( ( this.sessionService.get('config').is_customer_verification_required ===  1 ) && ( this.sessionService.get('appData').vendor_details.is_vendor_verified !== 1 ) ) {
        this.showCustomerVerificationPopUp = true;
        return false;
      }
      this.toggle.emit();
      if (
        this.config.nlevel_enabled === 2 &&
        this.config.business_model_type === "ECOM"
      ) {
        this.getCartData();
      } else {
        this.googleAnalyticsEventsService.emitEvent(
          GoogleAnalyticsEvent.go_to_checkout,
          "Go to checkout",
          '',
          ''
        );
        this.router.navigate(['checkout']);
      }

    } else if (this.sessionService.get('appData') && parseInt(this.sessionService.getString('reg_status')) !== 1 &&
      !this.sessionService.get('appData').signup_template_data.length) {
      this.toggle.emit();
      if (
        this.config.nlevel_enabled === 2 &&
        this.config.business_model_type === "ECOM"
      ) {
        this.getCartData();
      } else {
        this.googleAnalyticsEventsService.emitEvent(
          GoogleAnalyticsEvent.go_to_checkout,
          "Go to checkout",
          '',
          ''
        );
        this.router.navigate(['checkout']);
      }
    } else {
      this.messageService.getLoginSignupLocation('From Checkout Button');
      $("#loginDialog").modal("show");
    }
  }

  viewProfile() {
    this.loader.show();
    const data = {
      app_type: "WEB",
      is_demo_app: 0,
      marketplace_reference_id: this.config.marketplace_reference_id,
      user_id: this.sessionService.get("user_id"),
      marketplace_user_id: this.config.marketplace_user_id,

    };
    if (this.sessionService.get('appData')) {
      data['vendor_id'] = this.sessionService.get('appData').vendor_details.vendor_id;
      data['access_token'] = this.sessionService.get('appData').vendor_details.app_access_token;
    }

    this.detailsService.getProfileData(data).subscribe(
      response => {
        try {
          if (response.status === 200) {
            this.merchantProfile = response.data;
            this.sessionService.set("info", this.merchantProfile);
            this.showViewProfilePopup = true;
          }
        } catch (e) {
          console.error(e);
        } finally {
          this.loader.hide();
        }
      },
      error => {
        console.error(error);
        this.loader.hide();
      }
    );
  }

  hideViewProfilePopup() {
    this.showViewProfilePopup = false;
  }

  seeAllReview() {
    this.router.navigate(["/store-review", this.sessionService.get("user_id")]);
  }
  seeAllReviewProduct() {
    const data = {
      app_type: 'WEB',
      is_demo_app: 0,
      user_id: this.sessionService.get("user_id"),
      marketplace_user_id: this.config.marketplace_user_id,
      product_id: this.productDetailsData.product_id
    };
    if (this.sessionService.get("appData")) {
      data["access_token"] = this.sessionService.get(
        "appData"
      ).vendor_details.app_access_token;
      data["vendor_id"] = this.sessionService.get(
        "appData"
      ).vendor_details.vendor_id;
    }
    this.loader.show();
    this.detailsService.getProductReviews(data).subscribe(
      response => {
        try {
          this.loader.hide();
          if (response.status === 200) {
            this.allReviews = response.data;
            this.showAllReviewsPopup = true;
          }
        } catch (e) {
          console.error(e);
        } finally {
          this.loader.hide();
        }
      },
      error => {
        console.error(error);
        this.loader.hide();
      }
    );
  }

  hideAllReviewsPopup() {
    this.showAllReviewsPopup = false;
  }

  getColourRed(rating) {
    if (rating === 1) {
      return true;
    } else {
      return false;
    }
  }

  getColourGreen(rating) {
    if (rating > 3.3) {
      return true;
    } else {
      return false;
    }
  }

  getColourYellow(rating) {
    if (rating > 1 && rating <= 3.3) {
      return true;
    } else {
      return false;
    }
  }

  viewReviewPopup() {
    this.showReviewPopup = true;
    this.ratingForm = new FormGroup({
      ratingInput: new FormControl(""),
      description: new FormControl("")
    });
    if (this.myReview && this.myReview.rating) {
      this.ratingForm.setValue({
        ratingInput: this.myReview.rating,
        description: this.myReview.review
      });
    }
  }

  hideReviewPopup() {
    this.showReviewPopup = false;
  }

  submitReview() {
    if (!this.ratingForm.value.ratingInput) {
      this.ratingError = this.languageStrings.pls_provide_rating || "Please provide rating.";
      setTimeout(() => {
        this.ratingError = false;
      }, 2000);
    } else {
      const data = {
        app_type: "WEB",
        is_demo_app: 0,
        user_id: this.sessionService.get("user_id"),
        marketplace_user_id: this.config.marketplace_user_id,
        rating: this.ratingForm.value.ratingInput,
        review: this.ratingForm.value.description
          ? this.ratingForm.value.description
          : "",
        product_id: this.productDetailsData.product_id,
      };
      if (this.sessionService.get('appData')) {
        data['vendor_id'] = this.sessionService.get('appData').vendor_details.vendor_id;
        data['access_token'] = this.sessionService.get('appData').vendor_details.app_access_token;
      }

      this.loader.show();
      this.detailsService.createProductReview(data).subscribe(
        response => {
          try {
            if (response.status === 200) {
              this.myReview = {
                rating: this.ratingForm.value.ratingInput,
                review: this.ratingForm.value.description
              };
              this.hideReviewPopup();
              this.productDetailsData.product_rating =
                response.data.product_rating;
              this.productDetailsData.last_review_rating =
                response.data.last_review_rating;
              this.productDetailsData.total_review_count =
                response.data.total_review_count;
              this.popup.showPopup(MessageType.ERROR, 2000, response.message, false);
            }
          } catch (e) {
            console.error(e);
          } finally {
            this.loader.hide();
          }
        },
        error => {
          console.error(error);
          this.loader.hide();
        }
      );
    }
  }

  getProductLastReviews() {
    const data = {
      app_type: 'WEB',
      is_demo_app: 0,
      user_id: this.sessionService.get("user_id"),
      marketplace_user_id: this.config.marketplace_user_id,
      product_id: this.productDetailsData.product_id
    };
    if (this.sessionService.get("appData")) {
      data["access_token"] = this.sessionService.get(
        "appData"
      ).vendor_details.app_access_token;
      data["vendor_id"] = this.sessionService.get(
        "appData"
      ).vendor_details.vendor_id;
    }
    this.loader.show();
    this.detailsService.getProductLastReviews(data).subscribe(
      response => {
        try {
          this.loader.hide();
          if (response.status === 200) {
            if (response.data.my_rating && response.data.my_rating !== 0) {
              this.myReview = {
                rating: response.data.my_rating,
                review: response.data.my_review
              };
            }
          }
        } catch (e) {
          console.error(e);
        } finally {
          this.loader.hide();
        }
      },
      error => {
        console.error(error);
        this.loader.hide();
      }
    );
  }


  /**
   * go to particular restaurant
   */
  goToParticularRestaurant(data) {


    if (this.sessionService.get('location')) {
      const obj = {
        'marketplace_reference_id': this.config.marketplace_reference_id,
        'marketplace_user_id': this.config.marketplace_user_id,
        'latitude': this.sessionService.get('location').lat,
        'longitude': this.sessionService.get('location').lng,
        'user_id': data.user_id,
      };
      if (this.sessionService.get('appData')) {
        obj['vendor_id'] = this.sessionService.get('appData').vendor_details.vendor_id;
        obj['access_token'] = this.sessionService.get('appData').vendor_details.app_access_token;
      }

      this.detailsService.getSingleRestaturant(obj)
        .subscribe(
          response => {
            try {
              if (response.status === 200) {
                this.sessionService.set('info', response.data[0]);
                this.restaurentInfo = response.data[0];
              }
            } catch (e) {
              console.error(e);
            }
          },
          error => {
            console.error(error);
          }
        );
    }
  }



}
