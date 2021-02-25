/**
 * Created by cl-macmini-51 on 22/06/18.
 */
import { Component, EventEmitter, OnChanges, OnInit, Output, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime } from 'rxjs/operators';

import { MessageService } from '../../services/message.service';
import { SessionService } from '../../services/session.service';
import { LoaderService } from '../../services/loader.service';
import { SearchAllService } from './search-all.service';
import { AppCartService } from '../catalogue/components/app-cart/app-cart.service';
import { AppService } from '../../app.service';
import { CartModel } from '../catalogue/components/app-cart/app-cart.model';
import { RouteHistoryService } from '../../services/setGetRouteHistory.service';
import { GoogleAnalyticsEventsService } from '../../services/google-analytics-events.service';
import { PopUpService } from '../../modules/popup/services/popup.service';
import { GoogleAnalyticsEvent, BusinessType, AmountService, TaskType } from '../../enums/enum';
import { FBPixelService } from '../../services/fb-pixel.service';
import { MessageType } from '../../constants/constant';
import { DecimalConfigPipe } from '../../pipes/decimalConfig.pipe';
import { ProductTemplateService } from '../product-template/services/product-template.service';

declare var $: any;

// import 'rxjs/Rx';
// import * as $ from 'jquery';
// import { trigger, transition, useAnimation } from '@angular/animations';


@Component({
  selector: 'app-search-all',
  templateUrl: './search-all.html',
  styleUrls: ['./search-all.scss']
})
// animations: [
//  trigger('slideInLeft', [transition('* => *', useAnimation(slideInLeft))]),
//  trigger('slideOutRight', [transition('* => *', useAnimation(slideOutRight))])
// ]
export class SearchAllComponent implements OnInit, AfterViewInit {


  showBackdrop:boolean;
  cartData: any;
  currentProduct: any;
  private totalCount = 0;
  amountService=AmountService;
  public appConfig: any;
  public languageSelected: any;
  public searchText: FormControl;
  public searchTextValue: string;
  public direction = 'ltr';
  public form: any;
  public config: any;
  public terminology: any;
  public searchData = [];
  public currency: any;
  public searchLoader: boolean;
  public clearSearch: boolean;
  public noSearch = false;
  public showStoreProduct = true;
  public addBtnTxt = '';
  public removeBtnTxt = '';
  public caraouselImages = [];
  public productQuantity: any = {};
  public productBool: any = {};
  public langJson: any = {};
  public productSelectedToAdd: any;
  public indexGot: any;
  public storeIndex: any;
  private customizedObj: any = {};
  private currentCustomizeObj: any = {};
  public start_time: any;
  public end_time: any;
  private minimumOrder: any;
  public unit_count = 0;
  public cartDataPresent = false;
  business_type =BusinessType;
  public storeId = 0;
  @Output() toggle: EventEmitter<string> = new EventEmitter<string>();
  public minSelectAddonError =''
  public minSingleSelectAddonError = '';
  public maxSelectAddonError =''
  public productLongDescription = "";
  private sideOrderProductData: any = {};
  private sideOrderProductBool: any = {};
  public sideOrderProducts = [];
  public sideOrderTotalAmount: number = 0;
  public currentProductWithAddon;
  public searchDataCopy;
  public hideClosedPreorder = false;
  showCustomerVerificationPopUp: boolean;
  restaurantInfo: any;
  public multiImageUrl: [];
  public caraouselImagesIncludingVideos: Array<object> = [{}];
  public addon_layout_type;
  public showAddonPopup: boolean;
  decimalPipe = new DecimalConfigPipe(this.sessionService);
  showProductTemplate: boolean = false;
  currentProductForTemplate: any;
  protected submitQuestionnaireSubscription;
  storeIndex1: any;
  openMultiImage: boolean;
  searchTextCopy: string;
  showProductShareBox: boolean;
  productShareData: any;
  productPosition: any;
  shareUrlSection: boolean;
  mailingLink: string;
  domainName: string;
  normalCopyLink: string;
  public addButton = 'Add';
  public removeButton = 'Remove';
  searchedProduct: Array<object> = [];
  searchedMerchant: Array<object> = [];
  isAlreadySearch: object = {
    'searchedProduct': false,
    'searchedMerchant': false
  }
  storeData: any;
  storePosition: any;
  languageStrings: any={};
  constructor(
    public productTemplateService : ProductTemplateService,
    public messageService: MessageService, public sessionService: SessionService, public loader: LoaderService,
    public searchService: SearchAllService, public router: Router,
    public googleAnalyticsEventsService: GoogleAnalyticsEventsService,
    public cartService: AppCartService, public appService: AppService, public popup: PopUpService,
    public routeHistoryService: RouteHistoryService, public fbPixelService: FBPixelService,public cdref:ChangeDetectorRef) {
  }

  ngOnInit() {
    this.sessionService.langStringsPromise.then(() =>
    {
     this.languageStrings = this.sessionService.languageStrings;
     this.setLangKeys()
    });
    this.config = this.sessionService.get('config');
    this.addon_layout_type = this.config.addon_layout_type;
    this.restaurantInfo = this.sessionService.get('info');
    if (this.config) {
      this.hideClosedPreorder = this.config.marketplace_user_id === 60863;
      this.terminology = this.config.terminology;
      this.currency = this.config['payment_settings'][0].symbol;
    }

    if (this.config && this.config.button_type && this.config.button_type.button_names) {
      this.addBtnTxt = this.config.button_type.button_names.add ? this.config.button_type.button_names.add : 'Add';
      this.removeBtnTxt = this.config.button_type.button_names.remove ? this.config.button_type.button_names.remove : 'Remove';
    }

    // const cartData = this.cartService.getCartData();

    // if (cartData && cartData.length > 0) {
    // this.messageService.clearCartOnly();
    // }


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

    this.cartService.currentStatus.subscribe(() => {
      this.setDefaultValue();
    });

    this.messageService.clearCartData.subscribe(() => {

      const cartData = this.cartService.getCartData();

      this.productBool = {};
      this.productQuantity = {};
      $('#productAlready').modal('hide');
      this.cartDataPresent = false;
      if (cartData && cartData.length > 0) {
        this.cartService.cartClearCall();
        this.searchTextHit();
      }
    });

    this.form = new FormGroup({
      searchText: new FormControl()
    });



    // ============search change event======================
    this.form.get('searchText').valueChanges.pipe(
      debounceTime(1000)
    ).subscribe(res => {

      this.searchTextValue = res.trim();
      if (!this.searchTextValue.length && !res.length) {
        this.searchLoader = false;
        this.clearSearch = false;
        this.noSearch = false;
        this.searchData = [];
        $('#products').hide();
        $('#stores').show();
        $('#tab_1').addClass('active');
        $('#tab_2').removeClass('active');
      } else if (this.searchTextValue.length && this.searchTextValue.length >= 2) {
        this.clearSearch = false;
        this.searchLoader = true;
        this.searchTextHit();
      }

    });

    // ================language json manupilation======================
    this.appService.langPromise.then(() => {
      this.langJson =  this.appService.getLangJsonData();
    });

    this.appConfig = this.sessionService.get('config');
    this.loader.hide();

    $('body').on('scroll', () => {
      // console.log($('body').scrollTop());
      if ($('body').scrollTop() > 110 && $(window).innerWidth() < 650) {
        $('#tab-fix').css({
          position: 'sticky',
          top: '70px',
          width: 'auto'
        });
        $('#tab-fix').addClass('scrollTab');
        $('#tab-fix').removeClass('tabs');
      } else if ($('body').scrollTop() > 175 && $(window).innerWidth() > 650) {
        $('#tab-fix').css({
          position: 'sticky',
          top: '70px',
          width: 'auto'
        });
        $('#tab-fix').addClass('scrollTab');
        $('#tab-fix').removeClass('tabs');
      } else {
        $('#tab-fix').css({
          position: 'static',
          width: 'auto'
        });
        $('#tab-fix').removeClass('scrollTab');
        $('#tab-fix').addClass('tabs');
      }
    });
    this.submitQuestionnaireSubscription = this.productTemplateService.submitQuestionnaire.subscribe( (res : any) => {
        res.productInfo.product_template = res.template
      this.setProductContent(res.productInfo,this.indexGot, this.storeIndex1 , false);
      this.productBool[res.productInfo.product_id] = true;
      this.getTotalAmount(this.storeIndex);
      return;
  });
  }
setLangKeys()
{
  this.languageStrings.you_already_added_product_from_other_store_do_you_want_remove_that_from_cart =  (this.languageStrings.you_already_added_product_from_other_store_do_you_want_remove_that_from_cart || "You already added product from other store do you want remove that from cart")
  .replace('PRODUCT_PRODUCT', this.terminology.PRODUCT);
  this.languageStrings.you_already_added_product_from_other_store_do_you_want_remove_that_from_cart =  (this.languageStrings.you_already_added_product_from_other_store_do_you_want_remove_that_from_cart || "you already added product from other store do you want remove that from cart")
  .replace('STORE_STORE', this.terminology.STORE);
  this.languageStrings.you_already_added_product_from_other_store_do_you_want_remove_that_from_cart =  (this.languageStrings.you_already_added_product_from_other_store_do_you_want_remove_that_from_cart || "you already added product from other store do you want remove that from car")
  .replace('CART_CART', this.terminology.CART);
  this.languageStrings.view_menu =  (this.languageStrings.view_menu || "View Menu")
  .replace('MENU_MENU', this.terminology.MENU ? this.terminology.MENU : 'Menu');
  this.languageStrings.minimum_order=(this.languageStrings.minimum_order || "Minimum Order")
  .replace('ORDER_ORDER',this.terminology.ORDER) 
  this.languageStrings.side_order=(this.languageStrings.side_order || "Side Order")
  .replace('ORDER_ORDER',this.terminology.ORDER)
}
  ngAfterViewInit() {
    if (!this.sessionService.isPlatformServer()) {
      $('#products').hide();
      $('#stores').show();

    this.noSearch = false;
    // if (this.sessionService.getString('searchText')) {
    //   this.form.controls['searchText'].setValue(this.sessionService.getString('searchText'));
    //   // this.searchTextHit();
    // }
    $('#searchType').focus();
    }
  }

  getCartData() {
    const cartData = this.cartService.getCartData();
    if (cartData && cartData.length > 0) {
      this.cartDataPresent = true;
    } else {
      this.cartDataPresent = false;
    }
  }

  // ===================search text hit=================
  searchTextHit(isProduct?) {
    const obj: any = {
      'marketplace_user_id': this.appConfig.marketplace_user_id,
      'search_text': this.searchTextValue ? this.searchTextValue : undefined,
      // 'user_id' : this.sessionService.getString('user_id') ? this.sessionService.getString('user_id') : this.appConfig.marketplace_user_id
      'user_id': this.appConfig.marketplace_user_id,
      'latitude':this.sessionService.get('location') && this.sessionService.get('location').lat ?this.sessionService.get('location').lat : 0,
      'longitude':this.sessionService.get('location') && this.sessionService.get('location').lng ?this.sessionService.get('location').lng :0,
      'date_time': (new Date()).toISOString(),
      'app_type' : 'WEB'
    };
    if (this.sessionService.get('appData')) {
      obj['vendor_id'] = this.sessionService.get('appData').vendor_details.vendor_id;
      obj['access_token'] = this.sessionService.get('appData').vendor_details.app_access_token;
    }
    if(this.searchTextCopy && this.searchTextCopy !== obj.search_text){
      this.searchTextCopy = undefined;
      this.searchedProduct = undefined;
      this.searchedMerchant = undefined;
      this.isAlreadySearch['searchedProduct'] = false;
      this.isAlreadySearch['searchedMerchant'] = false;
    }else{
      this.searchTextCopy = obj.search_text;
    }
      this.searchLoader = true;
      if(isProduct){
        this.getSearchedProductData(obj);
      }else{
        this.getSearchedMerchant(obj);
    }
  }

  // ===========Merchant Search ====================
  getSearchedMerchant(obj){
    if(this.searchTextCopy && this.isAlreadySearch['searchedMerchant']){
      this.searchLoader = false;
      this.clearSearch = true;
      this.searchData = this.searchedMerchant && this.searchedMerchant.length ? this.searchedMerchant : [];
      this.selectTab(1);
      return;
    }
    if(obj && obj['date_time']){
      delete obj['date_time'];
    }
    if(!(obj && obj['search_text'])){
      this.popup.showPopup(MessageType.ERROR, 2000, 'Please enter some text.', false);
      return;
    }
    obj.self_pickup=this.sessionService.getString('deliveryMethod') == "2" ? 1 : 0;
    this.searchService.getSearchedMerchant(obj).subscribe(response => {
      if (response.status === 200) {
        this.searchLoader = false;
        this.clearSearch = true;
        this.isAlreadySearch['searchedMerchant'] = true;

        if (response.data && response.data.result && response.data.result.length > 0) {
          this.noSearch = false;
          this.searchDataCopy = JSON.parse(JSON.stringify(response.data.result));
          this.searchData = response.data.result;
          this.searchedMerchant = response.data.result;
          this.searchTextCopy = obj.search_text;
          this.setDefaultValue();
          this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.search_text, `${this.searchTextValue}: Result Found`,'' , '');
        } else {
          this.searchData = [];
          this.noSearch = true;
          this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.search_text, `${this.searchTextValue}: Result Not Found`,'' , '');
        }
      } else {
        this.searchLoader = false;
        this.clearSearch = true;
        this.searchData = [];
        this.noSearch = true;
        this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.search_text, `${this.searchTextValue}: Result Not Found`,'' , '');
      }
      this.selectTab(1)
    });
  }

  /**
   * search Product
   */
  getSearchedProductData(obj){
    this.searchLoader = true;
    this.clearSearch = false;
    if(this.searchTextCopy && this.isAlreadySearch['searchedProduct']){
      this.searchLoader = false;
      this.clearSearch = true;
      this.searchData = this.searchedProduct && this.searchedProduct.length ? this.searchedProduct : [];
      this.selectTab(2);
      return;
    }
    obj.self_pickup=this.sessionService.getString('deliveryMethod') == "2" ? 1 : 0;
    this.searchService.getSearchedProduct(obj).subscribe(response => {
      if (response.status === 200) {
        this.searchLoader = false;
        this.clearSearch = true;
        this.isAlreadySearch['searchedProduct'] = true;
        if (response.data && response.data.result && response.data.result.length > 0) {
          this.noSearch = false;
          this.searchDataCopy = JSON.parse(JSON.stringify(response.data.result));
          this.searchData = response.data.result;
          this.searchedProduct = response.data.result;
           this.setDefaultValue();
          // this.searchData[1] = this.searchData[0];
          // this.searchData[2] = this.searchData[0];
          this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.search_text, `${this.searchTextValue}: Result Found`,'' , '');
        } else {
          this.searchData = [];
          this.noSearch = true;
          this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.search_text, `${this.searchTextValue}: Result Not Found`,'' , '');
        }
        // this.sessionService.setString('searchText', this.searchTextValue);
      } else {
        this.searchLoader = false;
        this.clearSearch = true;
        this.searchData = [];
        this.noSearch = true;
        this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.search_text, `${this.searchTextValue}: Result Not Found`,'' , '');
      }
      this.selectTab(2);
    });
  }

  // ==============clearSearch=============
  clearSearchHit() {
    this.searchTextValue = '';
    this.form.controls['searchText'].setValue('');
    this.clearSearch = false;
    this.noSearch = false;
    this.searchData = [];
    // this.sessionService.remove('searchText');
  }

  // ==============go back==================
  goBack() {
    // this.sessionService.remove('searchText');
    history.back();
  }

  // ============select tab feature==========
  selectTab(type) {
    switch (type) {
      case 1:
        this.showStoreProduct = true;
        $('#tab_1').addClass('active');
        $('#tab_2').removeClass('active');
        $('#products').slideUp();
        $('#stores').slideDown();
        break;
      case 2:
        this.showStoreProduct = false;
        $('#tab_1').removeClass('active');
        $('#tab_2').addClass('active');
        $('#products').slideDown();
        $('#stores').slideUp();
        break;
      default:
        this.showStoreProduct = true;
        $('#tab_1').addClass('active');
        $('#tab_2').removeClass('active');
        $('#products').slideUp();
        $('#stores').slideDown();
        break;
    }
    this.cdref.detectChanges();
  }

  // ========================navigate to direct store if it is one=========================

  _objectWithoutProperties(obj, keys) {
    const target = {};
    for (const i in obj) {
      if (keys.indexOf(i) >= 0) {
        continue;
      }
      if (!Object.prototype.hasOwnProperty.call(obj, i)) {
        continue;
      }
      target[i] = obj[i];
    }
    return target;
  }

  navigate(item) {
    if (!item.available && !item.scheduled_task && !item.takeaway_timeslots_enabled ) {
      this.popup.showPopup(MessageType.ERROR, 2000, (this.languageStrings.sorry_this_merchant_closed_for_now || "Sorry! this Merchant is closed for now.") .replace(
        'MERCHANT_MERCHANT', this.terminology.MERCHANT), false);
      return;
    }

    let itemGot: any;
    let getProductIndex = 0;
    itemGot = this._objectWithoutProperties(item, ['product_list']);
    this.sessionService.set('info', itemGot);
    this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.restaurant_click, item.store_name, '', '');
    this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.restaurant_detail_order_online, item.store_name, '', '');
    const cartData = this.cartService.getCartData();
    if (cartData && cartData.length > 0) {
      getProductIndex = item.product_list.findIndex(function (o: any) { return o.product_id === cartData[0].id; });
    }
    const id = this.sessionService.getByKey('app', 'rest_id') || undefined;

    if (getProductIndex === -1) {
      this.messageService.clearCartOnly();
    }
    this.sessionService.remove('preOrderTime');
    this.router.navigate(['store', itemGot.storepage_slug || '-', itemGot.storefront_user_id]);
  
  }

  // ============set default values================
  setDefaultValue() {
    const cartData = this.cartService.getProductQuantity();
    if (this.searchData[0] === undefined) {
      this.searchData = [];
    }
    this.productBool = {};
    this.searchData.forEach((val, index) => {
      if (val.product_list && val.product_list.length > 0) {
        val.product_list.forEach((pro, index) => {
          if(pro.layout_data &&
            pro.layout_data.lines &&
            pro.layout_data.lines[1] &&
            pro.layout_data.lines[1].data ){
              pro.layout_data.lines[1].data = this.searchService.convertStringToBreakHTML(pro.layout_data.lines[1].data);
          }
          if (cartData && cartData[pro.product_id]) {
            this.productQuantity[pro.product_id] = cartData[pro.product_id].quantity;
            this.productBool[pro.product_id] = true;
          } else {
            this.productQuantity[pro.product_id] = 0;
            this.productBool[pro.product_id] = 0;
          }

            pro.long_description  = this.searchService.convertStringToBreakHTML(pro.long_description);

        });
      }
    });
    this.getCartData();
  }

  // ===============show multiple images of product=======================
  showLightBox(product) {
    if(this.addon_layout_type ===1){
      return ;
    }
    this.productLongDescription = product.long_description
    this.caraouselImages = product.multi_image_url;
    this.multiImageUrl = product.multi_image_url;
    var split_objects = this.multiImageUrl.map(function(str) {
      return { url: str, thumb_urls: { "250x250": str, "400x400": str } };
    });
      this.caraouselImagesIncludingVideos = split_objects.concat(
        product.multi_video_url
      );
    if (this.caraouselImages.length || this.productLongDescription || this.caraouselImagesIncludingVideos.length) {
      this.openMultiImage = true;
      this.showBackdrop = true;
      // $('#lightbox').modal('show').css('display', 'flex');
    }
  }

  // ================decrease quantity============
  decreamentQuantity(productAll, id, index) {
    const cartProductData = this.sessionService.getByKey('app', 'cartProduct');
    this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.remove_quantity, productAll.name, '', '');
    const productData = this.sessionService.getByKey('app', 'cart');
    const customizedData = this.sessionService.getByKey('app', 'customize');
    if (Object.keys(customizedData[id].data).length === 1) {
      //==========Check for min quantity 0 to avoid negative quantity=========
      if (cartProductData[id].quantity == 0) {
        return;
      }
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

      this.getCartData();

    } else {
      this.popup.showPopup(MessageType.ERROR, 2000, 'Please remove it from the cart as cart contains this item with different addons.', false);
    }
  }
  //=============On Blur Function of Input Box===============
  onBlurInputFun(product, id, index, newQuant) {
    var newQuantity = Number(newQuant);
    const cartProductData = this.sessionService.getByKey('app', 'cartProduct');
    if (newQuantity == 0 || newQuantity <= product.minimium) {
      const productData = this.sessionService.getByKey('app', 'cart');
      cartProductData[id].quantity = newQuantity;
      this.sessionService.setByKey('app', 'cartProduct', cartProductData);
      index = cartProductData[id].index;
      this.productBool[id] = 0;
      this.cartService.removeProduct(id, index);
    }
    else {
      this.productQuantity[product.product_id] = newQuantity;
      if ((product.inventory_enabled && this.productQuantity[product.product_id] < product.available_quantity) ||
        !product.inventory_enabled) {
        this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.add_quantity, product.name, '', '');
        cartProductData[id].quantity = Number(this.productQuantity[id]);
        this.sessionService.setByKey('app', 'cartProduct', cartProductData);
        this.cartService.updateProductQuantity(id, this.productQuantity[id]);
        setTimeout(() => this.cartService.updateAddCartStatus(), 100);
      } else {
        this.popup.showPopup(MessageType.ERROR, 2000, this.languageStrings.selected_quantity_exceed_avail || 'The selected quantity exceeds quantity available in stock.', false);
      }
    }
  }

  questionnaireSetup(productDeatil, productQuantityAll) {
    this.currentProductForTemplate = productDeatil;
    this.currentProductForTemplate.min_quantity = productDeatil.minimum_quantity || 1;
    this.currentProductForTemplate.quantity = productQuantityAll[productDeatil.product_id];
    if(this.restaurantInfo.business_type === BusinessType.SERVICE_MARKETPLACE){
      this.currentProductForTemplate.totalPrice = this.setAmountForServices(productDeatil);
    }else{
      this.currentProductForTemplate.totalPrice = this.currentProductForTemplate.price;
    }
    this.currentProductForTemplate.total_amount = 0;
  if((productDeatil.is_product_template_enabled == 1)){
    this.currentProductForTemplate.isSearchOn = true;
  }
    this.showProductTemplate = true;
  }

  // ===============increase quantity=====================
  increaseQuantity(product, id, index) {
    if(product.maximum_quantity > 0) {
      if (this.productQuantity[product.product_id] + 1 >  product.maximum_quantity) {
        this.popup.showPopup(
          'info',
          2000,
          this.languageStrings.total_quantity_cannot_more_than_max || 'Total quantity for this item cannot be more than maximum quantity.',
          false
        );
        return;
      }
    }
    if ((product.inventory_enabled && (this.productQuantity[product.product_id] < product.available_quantity)) ||
      !product.inventory_enabled) {
      const cartProductData = this.sessionService.getByKey('app', 'cartProduct');
      this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.add_quantity, product.name, '', '');

      //==========Check for max quantity 9999==========
      if (this.productQuantity[id] >= 9999) {

        return;
      }
      cartProductData[id].quantity = Number(this.productQuantity[id]) + 1;

      this.sessionService.setByKey('app', 'cartProduct', cartProductData);
      if (this.productQuantity[id]) {
        this.productQuantity[id]++;
      } else {
        this.productQuantity[id] = 2;
      }
      this.cartService.updateProductQuantity(id, this.productQuantity[id]);
      setTimeout(() => this.cartService.updateAddCartStatus(), 100);
    } else {
      this.popup.showPopup(MessageType.ERROR, 2000, this.languageStrings.selected_quantity_exceed_avail || 'The selected quantity exceeds quantity available in stock.', false);
    }
  }

  // ============check if product added already=============
  checkCartFilledWithOtherStore(cart, product, storeIndex) {
    let getProductIndex = 0;
    let confirmProductHave = false;
    for (let j = 0; j < cart.length; j++) {
      getProductIndex = this.searchData[storeIndex].product_list.findIndex((o: any) => { return o.product_id === cart[j].id; });
      if (getProductIndex > -1) {
        confirmProductHave = false;
      } else {
        confirmProductHave = true;
      }
    }


    if (!confirmProductHave) {
      return true;
    } else {
      $('#productAlready').modal('show');
      return false;
    }
  }

  resetProductDialog() {
    $('#productAlready').modal('hide');
  }

  removeFromCart() {
    this.messageService.clearCartOnly();
  }

  // =================business type======================
  checkBusinessTypeBeforeAdding(products, index, storeIndex) {
    this.showProductShareBox = false;
    this.storeIndex1 = storeIndex;
    this.currentProductWithAddon = Object.assign({},this.searchDataCopy[storeIndex].product_list[index]);

    let status = true;
    const cartData = this.cartService.getCartData();
    if (cartData && cartData.length > 0) {
      status = this.checkCartFilledWithOtherStore(cartData, products, storeIndex);
    }


    if (status) {
      this.storeId = this.searchData[storeIndex].storefront_user_id;
      let itemGot: any;
      itemGot = this._objectWithoutProperties(this.searchData[storeIndex], ['product_list']);

      this.sessionService.set('info', itemGot);
      if (this.searchData[storeIndex].multiple_product_single_cart === 2) {
        // (this.restaurantInfo.business_type === 2 || this.restaurantInfo.business_type === '2')

        const productData = this.sessionService.getByKey('app', 'cart');
        if (productData && productData.length) {
          this.languageStrings.you_can_only_avail_one_product_at  = (this.languageStrings.you_can_only_avail_one_product_at || 'You can only avail one product at a time.')
          .replace('PRODUCT_PRODUCT', this.terminology.PRODUCT);
          const msg = this.languageStrings.you_can_only_avail_one_product_at;
          this.popup.showPopup(MessageType.ERROR, 2000, msg, false);
          // this.removeProductAccToType(productData[0].id,productData.length - 1);
        } else {
          this.getSchedulingTimeAccToProduct(products, index, storeIndex);
        }
        // this.addCart(products, index);
      } else {
        this.getSchedulingTimeAccToProduct(products, index, storeIndex);
      }
    }
  }

  getSchedulingTimeAccToProduct(products, index, storeIndex) {
    let cart = this.cartService.getCartData();
    if (!cart) {
      cart = [];
    }
    const indexCheck = cart.findIndex((o: any) => { return o.id === products.product_id; });
    const businessType = this.searchData[storeIndex].business_type;
    const taskType = this.searchData[storeIndex].pd_or_appointment;
    if( businessType == BusinessType.PRODUCT_MARKETPLACE ||
      (businessType == BusinessType.SERVICE_MARKETPLACE &&
        taskType == TaskType.SERVICE_AS_PRODUCT)
    ){
      this.addCart(products, index, storeIndex);
    }else {
      if (indexCheck > -1) {
        this.addCart(products, index, storeIndex);
      } else {
        this.productSelectedToAdd = products;
        this.indexGot = index;
        this.storeIndex = storeIndex;
        $('#timeSelection').modal('show');
      }
    }
  }

  getSelectedTiming(event) {

    this.start_time = event.start;
    if (event.end) {
      this.end_time = event.end;
    }
    if((event.product.is_product_template_enabled == 1)){
      event.product.start_time = event.start;
      event.product.end_time = event.end;
    }
    event.product.start_time = event.start;
    event.product.end_time = event.end;
    this.unit_count = event.unit_count;
    const surgeFeature= document.getElementById('featureSearchAmount');

this.addCart(event.product, event.index, event.storeIndex);
  }
  addCart(products, index, storeIndex) {
    if ((products.inventory_enabled && this.productQuantity[products.product_id] < products.available_quantity) ||
      !products.inventory_enabled) {
      const copyProduct = this.searchData[storeIndex].product_list;
      if(this.config.is_multi_currency_enabled && this.searchData[storeIndex].payment_settings)
      {
        this.currency=this.searchData[storeIndex].payment_settings.symbol;
      }
      const product = copyProduct[index];
      this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.add_quantity, product.name, '', '');
      this.addBtnTxt = this.searchData[storeIndex].button_type.button_names.add ? this.searchData[storeIndex].button_type.button_names.add : 'Add';
      this.removeBtnTxt = this.searchData[storeIndex].button_type.button_names.remove ? this.searchData[storeIndex].button_type.button_names.remove : 'Remove';
      if (product.customization && product.customization.length) {

        this.currentProduct = product;
        this.currentProduct.customization.forEach((elem, index) => {
          if (elem.is_check_box == 0) {
            if ((elem.customize_options.findIndex((item) => { return (item.is_default == 1); })) != -1) {
              elem.is_singleSelect_mandatory = true;
            }
            else {
              elem.is_singleSelect_mandatory = false;
            }
          }
        });
        this.currentProduct.quantity = product.minimum_quantity || 1;
        this.currentProduct.minimum_quantity = product.minimum_quantity;
        this.currentProduct.maximum_quantity = product.maximum_quantity;
        if(this.searchData[storeIndex].business_type===this.business_type.SERVICE_MARKETPLACE){
          this.currentProduct.totalPrice = this.setAmountForServices(product);
          if(product.surge_amount)
          {
            this.currentProduct.totalPrice +=product.surge_amount;

          }
        }else{
          this.currentProduct.totalPrice = this.currentProduct.price;
        }
        this.currentProduct.type = this.currentProduct.layout_data.buttons[0].type;
        this.currentProduct.totalItem = 0;
        this.customizedObj[product.product_id] = product;
        this.setCustomizedObj();
        this.storeIndex = storeIndex;
        setTimeout(() => {
          if (this.addon_layout_type === 1) {
            this.currentProductWithAddon = Object.assign({}, this.currentProduct);
            this.currentProduct = product;
            this.currentProduct.quantity = product.minimum_quantity || 1;
            this.currentProduct.minimum_quantity = product.minimum_quantity;
            this.currentProduct.maximum_quantity = product.maximum_quantity;
            this.currentProduct.totalPrice = this.currentProduct.price;
            this.storeIndex = storeIndex;
            this.showAddonPopup = true;
          } else if(this.appConfig.side_order && this.appConfig.onboarding_business_type === 804){
            this.getSideOrders(storeIndex);
          }
         else {
            $('#myModal').modal('show');
          }
        }, 100);
      } else {
        if((product.is_product_template_enabled === 1)){
          this.questionnaireSetup(product , this.productQuantity);
          return;
        }
        if (this.addon_layout_type === 1) {
          this.currentProductWithAddon = Object.assign({}, this.currentProduct);
          this.currentProduct = product;
          this.currentProduct.quantity = product.minimum_quantity || 1;
          this.currentProduct.minimum_quantity = product.minimum_quantity;
          this.currentProduct.maximum_quantity = product.maximum_quantity;
          this.currentProduct.totalPrice = this.currentProduct.price;
          this.storeIndex = storeIndex;
          this.showAddonPopup = true;
        } else {
         this.setProductContent(product, index, storeIndex, false);
          this.productBool[product.product_id] = true;
          this.getTotalAmount(storeIndex);
        }
      }
    } else {
      this.popup.showPopup(MessageType.ERROR, 2000, this.languageStrings.selected_quantity_exceed_avail || 'The selected quantity exceeds quantity available in stock.', false);
    }
    this.getCartData();
  }
  setAmountForServices(obj){
    let converterToSec;
        let check = this.cartService.convertToSec(obj);
        if(check.type==this.amountService.Price){
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
    let showPrice = pricePerUnitTime * service_time;
    if(obj['customizations']){
      obj['customizations'].forEach(addOn => {
        showPrice = showPrice + addOn.unit_price
      });
    }
    this.totalCount +=  showPrice;
    return showPrice;
}
  getSideOrders(storeIndex){
    this.loader.show();
    const obj = {
      'user_id' : this.searchData[storeIndex].storefront_user_id.toString(),
      'limit' : '50',
      'offset' : '0',
      'marketplace_user_id': this.appConfig.marketplace_user_id.toString(),
    };
    if (this.sessionService.get('appData')) {
      obj['vendor_id'] = this.sessionService.get('appData').vendor_details.vendor_id;
      obj['access_token'] = this.sessionService.get('appData').vendor_details.app_access_token;
    }
    this.searchService.getSideOrders(obj).subscribe(
      response => {
        this.loader.hide();
        if(response.status == 200){
          this.sideOrderProducts = response.data;
          this.sideOrderProducts.sort((a, b) => { return (a.parent_category_id - b.parent_category_id) });
          this.setDefaultSideOrderValue();
        }
        $('#myModal').modal('show');
      },
      error => {
        this.loader.hide();
        $('#myModal').modal('show');
      }
    );
  }
  addNewAddon(value, list,currentProduct, custom, custIndex, customizedObj) {
    let status;
    if(list === -1){
      status = false
    }
    else if(list.findIndex(el => el.cust_id == value.cust_id)!=-1){
      status = false;
    }
    else{
      status = true;
    }
    if (value) {
      const optionIndex = custom.customize_options.indexOf(value);
      this.changeExtrasStatus(
        currentProduct.product_id,
        custom,
        custIndex,
        optionIndex,
       status
      );
    }
  }


  getTotalAmount(storeIndex) {
    if (this.searchData[storeIndex].multiple_product_single_cart === 2) {
      // (this.restaurantInfo.business_type === 2 || this.restaurantInfo.business_type === '2') &&
      this.totalCount = 0;
      this.cartService.getCartData().forEach((val: CartModel) => {
        return this.totalCount += val.quantity * val.showPrice;
      });
      this.goToCheckout(storeIndex);
    }
  }

  setAmountData(storeIndex) {
    // this.totalCount = 0;
    // const cart = this.cartService.getCartData();
    // if (cart && cart.length > 0) {
    //   this.cartService.getCartData().forEach((val: CartModel) => {
    //     return this.totalCount += val.quantity * val.showPrice;
    //   });
    // }
    this.totalCount = 0;
    if(this.searchData[storeIndex].business_type=== this.business_type.SERVICE_MARKETPLACE){

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
    this.goToCheckout(storeIndex);
      return this.totalCount;
    }

    this.cartData.forEach((val: CartModel) => {
      return this.totalCount += val.quantity * val.showPrice;
    });
    this.goToCheckout(storeIndex);
  }

  checkToGo() {
    const cart = this.cartService.getCartData();
    let indexCheck = 0;
    if (cart && cart.length > 0) {

      this.cartData=cart;
      for (let i = 0; i < this.searchData.length; i++) {
        for (let j = 0; j < cart.length; j++) {
          indexCheck = this.searchData[i].product_list.findIndex((o: any) => o.product_id === cart[j].id);

          if (indexCheck > -1) {
            this.setAmountData(i);
             return;
          }
        }
      }
    }
  }
  onPopUpClose() {
    this.showCustomerVerificationPopUp = false;
    this.router.navigate(['profile']);
  }

  goToCheckout(storeIndex) {
this.sessionService.remove('preOrderTime');
    this.minimumOrder = this.searchData[storeIndex].merchantMinimumOrder;
    this.sessionService.set('user_id', this.searchData[storeIndex].storefront_user_id);
    if (parseFloat(this.decimalPipe.decimalPrecision(this.totalCount)) < parseFloat(this.decimalPipe.decimalPrecision(this.minimumOrder))) {
      this.languageStrings.min_order_amt_should_be = (this.languageStrings.min_order_amt_should_be || 'Minimum order amount should be $10')
      .replace('----', this.terminology.ORDER);
      this.languageStrings.min_order_amt_should_be = this.languageStrings.min_order_amt_should_be
      .replace('$', this.currency);
      this.languageStrings.min_order_amt_should_be = this.languageStrings.min_order_amt_should_be.replace('10', this.decimalPipe.transform(this.minimumOrder));
      const msg = this.languageStrings.min_order_amt_should_be;
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
      this.fbPixelService.emitEvent('AddToCart', '');
      this.getRestaurantData(this.searchData[storeIndex].user_id)
  
    } else if (this.sessionService.get('appData') && parseInt(this.sessionService.getString('reg_status')) !== 1 &&
      !this.sessionService.get('appData').signup_template_data.length) {
      this.toggle.emit();
      this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.go_to_checkout, 'Go to checkout', '', '');
      this.fbPixelService.emitEvent('AddToCart', '');
      this.getRestaurantData(this.searchData[storeIndex].user_id)
    } else {
      this.messageService.getLoginSignupLocation('From Checkout Button');
      $('#loginDialog').modal('show');
    }

  }
 
 getRestaurantData(data) {

      const obj = {
        'marketplace_reference_id': this.config.marketplace_reference_id,
        'marketplace_user_id': this.config.marketplace_user_id,
        'latitude': this.sessionService.get('location')?this.sessionService.get('location').lat:0,
        'longitude': this.sessionService.get('location')?this.sessionService.get('location').lng:0,
        'user_id': data,
        'source':0
        // 'access_token' : this.sessionService.get('appData').vendor_details.app_access_token,
      };
      if (this.sessionService.get('appData')) {
        obj['vendor_id'] = this.sessionService.get('appData').vendor_details.vendor_id;
        obj['access_token'] = this.sessionService.get('appData').vendor_details.app_access_token;
      }
        this.searchService.getSingleRestaturant(obj).subscribe(
          response => {
              if (response.status === 200 && response.data && response.data[0]) {
                this.sessionService.set('info',response.data[0]);
                   localStorage.setItem('oftenBoughtModal','true')
                   this.router.navigate(['checkout']);
              } 
          
          },
          error => {
            this.popup.showPopup(MessageType.ERROR, 2000, error.message, false);
          }
        )
  }
  setProductContent(product, index, storeIndex, sideOrderBool) {
    const obj: any = {};
    obj.id = product.product_id;
    obj.quantity = sideOrderBool ? product.quantity : (product.minimum_quantity || 1 ) ;
    obj.minimum_quantity = product.minimum_quantity;
    obj.maximum_quantity = product.maximum_quantity;
    obj.price = product.price;
    obj.available_quantity = product.available_quantity;
    obj.inventory_enabled = product.inventory_enabled;
    obj.name = product.name;
    obj.type = product.layout_data.buttons[0].type;
    obj.unit = product.unit;
    obj.unit_type = product.unit_type;
    obj.unit_count = this.unit_count;
    obj.is_veg = product.is_veg;
    obj.image_url = product.image_url;
    obj.enable_tookan_agent = product.enable_tookan_agent;
    obj.is_agents_on_product_tags_enabled = product.is_agents_on_product_tags_enabled;
    obj.storeId = this.storeId;
    obj.user_id = product.user_id;
    obj.delivery_by_merchant = product.delivery_by_merchant;
    obj.is_static_address_enabled = product.is_static_address_enabled;
    obj.productId = product.product_id;
    obj.category_id = product.parent_category_id;
    obj.is_product_template_enabled = product.is_product_template_enabled;
    obj.original_customization = product.customization;
    obj.layout_data = product.layout_data;
    if(product.often_bought_products){
      obj.often_bought_products = product.often_bought_products;
    }
    if(product.service_time){
      obj.service_time = product.service_time;
    }
    if((obj.is_product_template_enabled === 1)) {
      obj.showPrice = product.total_amount;
      obj.totalPrice = product.total_amount * obj.quantity;
      obj.productTemplatePrice = product.productTemplatePrice;
      obj.product_template = product.product_template;
      }
      else {
        obj.totalPrice = obj.price * obj.quantity;
        obj.showPrice = product.price;
      }
      if(this.config.is_multi_currency_enabled){
        obj.payment_settings = product.payment_settings
      }
    if(product.is_agents_on_product_tags_enabled && product.agent_id){
      obj.agent_id = product.agent_id;
    }
      if(product.is_addOns == true){
        obj.customizations = JSON.parse(JSON.stringify(product.customizations))
      }
      else {
        obj.customizations = [];
      }
      if(product.surge_amount)
    {
      obj.surge_amount=product.surge_amount;
    }
    obj.is_recurring_enabled = this.searchData[storeIndex].is_recurring_enabled ? product.is_recurring_enabled : 0;
    if (this.searchData[storeIndex].business_type === 2) {
      this.makeCustomizationTimeSame(obj);
      // obj.start_time = this.start_time;
      // if (this.end_time) {
      //   obj.end_time = this.end_time;
      // }
    }
    // this.selectedProduct[product.product_id] = obj;
    this.setProductInCart(obj, storeIndex);
  }

  setProductInCart(data, storeIndex) {

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
      this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.add_to_cart, this.searchData[storeIndex].store_name, '', '');
      productData = [];
      productData.push(data);
      this.setProductQuantityForCart(data, productData.length - 1);

    }
    this.sessionService.setByKey('app', 'cart', productData);
    this.setQuestionaireAmountData();
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

  getCustomizeProductQuantityByData(data, index) {
    const obj = {};
    obj[index] = data.customizations;
    return obj;
  }

  getProductQuantityByData(data, index) {
    const obj = {};
    obj['quantity'] = data.quantity;
    obj['index'] = index;
    return obj;
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

  setCustomizedObj() {
    const customizedObj = {};
    this.currentProduct.customization.forEach(val => {
      const obj = {};
      val.customize_options.forEach(element => {
        element.optionLabel = element.name + ' - ' + this.currency + element.price;
        if (element.is_default && this.addon_layout_type != 1) {
          obj[element.cust_id] = element;
          this.currentProduct.totalPrice += element.price;
          this.currentProduct.totalItem++;
        }
      });
      customizedObj[val.customize_id] = obj;
    });
    this.currentCustomizeObj = customizedObj;
  }


  decreaseCustomizeProduct() {
    if (this.currentProduct.quantity > 1) {
      this.currentProduct.quantity--;
    } else {
      this.resetDialog();
    }
  }

  increaseCustomizeProduct() {
    if (this.currentProduct.quantity >= 9999) {
      return;
    }
    if (this.currentProduct.maximum_quantity > 0) {
      if (this.currentProduct.quantity >= this.currentProduct.maximum_quantity) {
        this.popup.showPopup(
          'info',
          2000,
          this.languageStrings.total_quantity_cannot_more_than_max || 'Total quantity for this item cannot be more than maximum quantity.',
          false
        );
        return;
      }
    }
    const productData = this.searchData[this.storeIndex].product_list;
    const that = this;

    productData.forEach(function (obj) {
      if (obj.product_id === that.currentProduct.product_id) {
        const checkQuantity = that.productQuantity[obj.product_id] + that.currentProduct.quantity;
        if ((checkQuantity < obj.available_quantity && obj.inventory_enabled) || !obj.inventory_enabled) {
          that.currentProduct.quantity++;
        } else {
          that.popup.showPopup(MessageType.ERROR, 2000, this.languageStrings.selected_quantity_exceed_avail || 'The selected quantity exceeds quantity available in stock.', false);
        }
      }
    });
  }

  changeExtrasStatus(productId, customization, custIndex, optionIndex, status) {
    const length = Object.keys(this.currentCustomizeObj[customization.customize_id]).length;
    let is_default_check = false;
    if (!customization.is_check_box) {
      this.currentProductWithAddon.customization[custIndex].customize_options.forEach((elem)=>{
        if(elem.is_default){
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
        if(previousItem){
          this.currentProduct.totalPrice -= previousItem.price;
        }
        this.currentProduct.totalPrice += customization.customize_options[optionIndex].price;
        this.currentCustomizeObj[customization.customize_id][customization.customize_options[optionIndex].cust_id]
          = customization.customize_options[optionIndex];
      }

      if(status == true && (!customization.is_singleSelect_mandatory || !is_default_check)) {
        for (const prop in this.currentCustomizeObj[customization.customize_id]) {
          delete this.currentCustomizeObj[customization.customize_id][prop];
        }
        this.customizedObj[productId].customization[custIndex].customize_options[optionIndex].is_default = false;
        this.currentProduct.totalPrice -= this.customizedObj[productId].customization[custIndex].customize_options[optionIndex].price;
      }
      else if (status == true &&  customization.is_singleSelect_mandatory) {

        let msg = this.languageStrings.exactly_option_should_be_selected ||
        'Exactly ___ option should be selected of  ___'
        ;
        msg = msg.replace('___', 'one');
        msg = msg.replace('___', customization.name);
        this.minSingleSelectAddonError = msg;
        setTimeout(() => {
          this.minSingleSelectAddonError = '';
        }, 2000);
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
    if (this.productQuantity && ((Number(this.currentProduct.quantity) + Number(this.productQuantity[this.currentProduct.product_id])) > 9999)) {
      this.resetDialog();
      this.popup.showPopup(MessageType.ERROR, 2000, this.languageStrings.selected_quantity_exceed_avail || 'The selected quantity exceeds quantity available in stock.', false);
      return;
    }
    if (!this.checkForMinimumSelectionAddon()) {
      return false;
    }
    // if (!this.checkForMaximumSelectionAddon()) {
    //   return false;
    // }

    if (+this.currentProduct.quantity < this.currentProduct.minimum_quantity) {
      let msg = this.languageStrings.quantity_less_than_min || 'Quantity of ___ is less than minimum quantity ___';
      msg = msg.replace('___', this.currentProduct.name);
      msg = msg.replace('___', this.currentProduct.minimum_quantity);
      this.minSelectAddonError = msg;
      setTimeout(() => { this.minSelectAddonError = ''; }, 2000);
      return false;
    }
    if (this.currentProduct.maximum_quantity > 0) {
    if (+this.currentProduct.quantity > this.currentProduct.maximum_quantity) {
      let msg = this.languageStrings.quantity_greater_than_max || 'Quantity of ___ is greater than maximum quantity ___';
      msg = msg.replace('___', this.currentProduct.name);
      msg = msg.replace('___', this.currentProduct.maximum_quantity);
      this.maxSelectAddonError = msg;
      setTimeout(() => { this.maxSelectAddonError = ''; }, 2000);
      return false;
    }
  }
    if (!this.checkForMinimumSelectionSideOrder()) {
      return false;
    }
    if (!this.checkForMaximumSelectionSideOrder()) {
      return false;
    }

    this.updateCartWithSideOrders();
    this.currentProduct.quantity = parseInt(this.currentProduct.quantity) || 0;
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
    obj.image_url = this.currentProduct.image_url;
    obj.is_veg = this.currentProduct.is_veg;
    obj.unit_count = this.unit_count;
    obj.storeId = this.storeId;
    obj.type = this.currentProduct.layout_data.buttons[0].type;
    obj.customizations = customizations;
    obj.enable_tookan_agent = this.currentProduct.enable_tookan_agent;
    obj.is_agents_on_product_tags_enabled = this.currentProduct.is_agents_on_product_tags_enabled;
    obj.totalPrice = (this.currentProduct.totalPrice * this.currentProduct.quantity);
    obj.user_id = this.currentProduct.user_id;
    obj.delivery_by_merchant = this.currentProduct.delivery_by_merchant;
    obj.is_static_address_enabled = this.currentProduct.is_static_address_enabled;
    obj.minimum_quantity = this.currentProduct.minimum_quantity;
    obj.maximum_quantity = this.currentProduct.maximum_quantity;
    obj.is_recurring_enabled = this.searchData[this.storeIndex].is_recurring_enabled ? this.currentProduct.is_recurring_enabled : 0;
    obj.product_id = this.currentProduct.product_id;
    obj.original_customization = this.currentProduct.customization;
    if(this.currentProduct.often_bought_products){
      obj.often_bought_products = this.currentProduct.often_bought_products;
    }
    obj.layout_data = this.currentProduct.layout_data;
    obj.is_product_template_enabled = this.currentProduct.is_product_template_enabled;
    if(this.currentProduct.service_time){
      obj.service_time = this.currentProduct.service_time;
    }
    if(this.currentProduct.is_agents_on_product_tags_enabled && this.currentProduct.agent_id){
      obj.agent_id = this.currentProduct.agent_id;
    }
    if(this.currentProduct.surge_amount)
    {
      obj.surge_amount=this.currentProduct.surge_amount;
    }
    if(this.config.is_multi_currency_enabled){
      obj.payment_settings = this.currentProduct.payment_settings
    }
    if (this.searchData[this.storeIndex].business_type === 2) {
      this.makeCustomizationTimeSame(obj);
      // obj.start_time = this.start_time;
      // if (this.end_time) {
      //   obj.end_time = this.end_time;
      // }
    }
    if((this.currentProduct.is_product_template_enabled === 1)){
      const productInfo = JSON.parse(JSON.stringify(this.currentProduct));
      productInfo.addOnPrice = obj.showPrice - obj.price*obj.unit_count;
      productInfo.is_addOns = true;
      productInfo.product_id = obj.product_id;
      productInfo.customizations = customizations;
      this.questionnaireSetup(productInfo, this.productQuantity);
     setTimeout(() => {
      if (type === 0) {
        this.getTotalAmount(this.storeIndex);
        this.resetDialog();
      }
     },100);
    }
    else {
      this.setProductInCart(obj,this.storeIndex);
      this.resetDialog();
      if (type === 0) {
        this.getTotalAmount(this.storeIndex);
      }
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
    this.showProductShareBox = false;
    this.customizedObj = {};
    this.currentCustomizeObj = {};
    if(this.addon_layout_type ===1){
      this.showAddonPopup = true;
    }
    else {
      $('#myModal').modal('hide');
    }
  }

  checkUniq(product) {
    this.cartService.checkUniq(product);
  }
   /**
   * function to check selection for addons
   */

  checkForMinimumSelectionAddon(){
    let CustomizationOriginal =  this.currentProduct.customization
    let custObj;
    let success = true;

    for(let key in this.currentCustomizeObj){
      custObj = CustomizationOriginal.filter(elem => elem.customize_id == key )[0];
      if(custObj.minimum_selection_required){
        if(Object.keys(this.currentCustomizeObj[key]).length != custObj.minimum_selection){
          let msg = this.languageStrings.exactly_options_should_be_selected || 'Exactly ___ options should be selected of  ___'
          msg = msg.replace('___', custObj.minimum_selection);
          msg = msg.replace('___', custObj.name);
          this.minSelectAddonError = msg;
          setTimeout(()=>{this.minSelectAddonError='';},2000);
          success = false;
        }
      }
      else if(this.addon_layout_type == 1 && custObj.is_check_box == 0){
        if(custObj.customize_options.find(el => el.is_default == 1) != undefined){
          if (
            Object.keys(this.currentCustomizeObj[key]).length !=
            custObj.minimum_selection
          ){
            let msg = this.languageStrings.pls_select_any_1 || 
              'Please select any 1 ___' ;
            msg = msg.replace('___', custObj.name);
            this.minSelectAddonError = msg;
            setTimeout(() => {
              this.minSelectAddonError = '';
            }, 2000);
            success = false;
          }
        }
      }
    }
    return success;
  }



  /**
   * Side Order Integration
   */

  addSideOrder(products, index) {
    // if ((products.inventory_enabled && this.sideOrderProductData[products.product_id] && this.sideOrderProductData[products.product_id].quantity < products.available_quantity) ||
    //   !products.inventory_enabled) {
      const copyProduct = JSON.parse(JSON.stringify(this.sideOrderProducts));
      const product = copyProduct[index];
      this.sideOrderProductData[product.product_id] = {}
      this.sideOrderProductData[product.product_id].quantity = (product.minimum_quantity || 1 );
      this.sideOrderProductData[product.product_id].amount = product.price;
      this.sideOrderProductData[product.product_id].minimum_quantity = product.minimum_quantity;
      this.sideOrderProductData[product.product_id].maximum_quantity = product.maximum_quantity;
      this.sideOrderProductData[product.product_id].name = product.name;
      this.sideOrderProductData[product.product_id].index = index;
      this.sideOrderProductBool[product.product_id] = true;

      this.updateSideOrderAmount();

    // } else {
    //   this.popup.showPopup(MessageType.ERROR, 2000, this.langJson['The selected quantity exceeds quantity available in stock.'], false);
    // }
  }

  increaseSideOrderQuantity(product, id, index) {
    if ((product.inventory_enabled && this.sideOrderProductData[product.product_id].quantity < product.available_quantity) ||
      !product.inventory_enabled) {
      if (this.sideOrderProductData[id].quantity) {
        this.sideOrderProductData[id].quantity++;
      } else {
        this.sideOrderProductData[id].quantity = 2;
      }

      this.updateSideOrderAmount();
    } else {
      this.popup.showPopup(MessageType.ERROR, 2000, this.languageStrings.selected_quantity_exceed_avail || 'The selected quantity exceeds quantity available in stock.', false);
    }
  }

    //=========Input box blur function========
    onBlurSideOrderInputFun(product, id, index, newQuant) {


      var newQuantity = Number(newQuant);
      if (newQuantity == 0) {
        delete this.sideOrderProductBool[id];
        delete this.sideOrderProductData[id];

      }
      else {
        this.sideOrderProductData[product.product_id].quantity = newQuantity;
        if ((product.inventory_enabled && this.sideOrderProductData[product.product_id].quantity < product.available_quantity) ||
          !product.inventory_enabled) {
          this.sideOrderProductData[id].quantity = Number(this.sideOrderProductData[id].quantity);
        } else {
          this.popup.showPopup(MessageType.ERROR, 2000, this.languageStrings.selected_quantity_exceed_avail || 'The selected quantity exceeds quantity available in stock.', false);
        }
      }

      this.updateSideOrderAmount();
    }



  decreamentSideOrderQuantity(id, index) {

    const product = JSON.parse(JSON.stringify(this.sideOrderProducts))[0];

      //==========Check for min quantity 0 to avoid negative quantity=========
      if (this.sideOrderProductData[id].quantity == 0) {
        return;
      }

      if (this.sideOrderProductData[id].quantity) {
        this.sideOrderProductData[id].quantity--;

        const cartProducts = this.sessionService.getByKey('app','cartProduct');
        if (!this.sideOrderProductData[id].quantity) {
          if(cartProducts && cartProducts[id]){
            this.productBool[id] = 0;
            cartProducts[id].quantity = 0;
            this.sessionService.setByKey('app','cartProduct',cartProducts);
            this.cartService.removeProduct(id, cartProducts[id].index);
          }
          delete this.sideOrderProductBool[id];
          delete this.sideOrderProductData[id];
        }
      }

      this.updateSideOrderAmount();

  }


  updateSideOrderAmount() {
    this.sideOrderTotalAmount = 0;


    Object.keys(this.sideOrderProductData).forEach((key) => {
      return this.sideOrderTotalAmount += this.sideOrderProductData[key].quantity * this.sideOrderProductData[key].amount;
    });
  }

  setDefaultSideOrderValue() {
    this.sideOrderProductData= {};
    this.sideOrderProductBool = {};
    const cartData = this.sessionService.getByKey('app', 'cart')
    if(cartData){
      cartData.forEach((product) => {
        let index = this.sideOrderProducts.findIndex((sideProduct) => sideProduct.product_id == product.id);
        if (index != -1) {
          this.sideOrderProductBool[product.id] = true;
          this.sideOrderProductData[product.id] = {};
          this.sideOrderProductData[product.id].quantity = product.quantity;
          this.sideOrderProductData[product.id].amount = product.price;
          this.sideOrderProductData[product.id].name = product.name;
          this.sideOrderProductData[product.id].minimum_quantity = product.minimum_quantity;
          this.sideOrderProductData[product.id].maximum_quantity = product.maximum_quantity;
          this.sideOrderProductData[product.id].index = index;
        }
      });
      this.updateSideOrderAmount();
    }

  }


  checkForMinimumSelectionSideOrder() {

    let success = true;
    for (let key in this.sideOrderProductData) {
      if (+this.sideOrderProductData[key].quantity < this.sideOrderProductData[key].minimum_quantity) {
        let msg = this.languageStrings.quantity_less_than_min || 'Quantity of ___ is less than minimum quantity ___';
        msg = msg.replace('___', this.sideOrderProductData[key].name);
        msg = msg.replace('___', this.sideOrderProductData[key].minimum_quantity);
        this.minSelectAddonError = msg;
        setTimeout(() => { this.minSelectAddonError = ''; }, 2000);
        success = false;
      }
    }

    return success;
  }

  checkForMaximumSelectionSideOrder() {
        let success = true;
        for (let key in this.sideOrderProductData) {
          if (this.sideOrderProductData[key].maximum_quantity > 0) {
          if (+this.sideOrderProductData[key].quantity > this.sideOrderProductData[key].maximum_quantity) {
            let msg = this.languageStrings.quantity_greater_than_max || 'Quantity of ___ is greater than maximum quantity ___';
            msg = msg.replace('___', this.sideOrderProductData[key].name);
            msg = msg.replace('___', this.sideOrderProductData[key].maximum_quantity);
            this.maxSelectAddonError = msg;
            setTimeout(() => { this.maxSelectAddonError = ''; }, 2000);
            success = false;
          }
        }
        }
        return success;
      }
      closePopup() {
        this.showProductTemplate = false;
      }

  updateCartWithSideOrders(){
    for( let productId in this.sideOrderProductData){
      const cartProductData = this.sessionService.getByKey('app','cartProduct');
      if(cartProductData && cartProductData[productId]){
        cartProductData[productId].quantity = Number(this.sideOrderProductData[productId].quantity);
        this.sessionService.setByKey('app', 'cartProduct', cartProductData);
        this.productQuantity[productId] = cartProductData[productId].quantity
        this.cartService.updateProductQuantity(productId, this.productQuantity[productId]);
        setTimeout(() => this.cartService.updateAddCartStatus(), 100);
      }
      else{
        let index = this.sideOrderProductData[productId].index;
        let sideProductData = JSON.parse(JSON.stringify(this.sideOrderProducts[index]));
        sideProductData.quantity = this.sideOrderProductData[productId].quantity;
        this.setProductContent(sideProductData,0,this.storeIndex, true);
        this.productBool[sideProductData.product_id] = true;
        this.getTotalAmount(this.storeIndex);
      }
    }

  }
  productShareBox(product,storeList,index,storeIndex){
    this.productShareData = product;
    this.storeData=storeList;
    this.normalCopyLink = `${window.location.origin}/${this.sessionService.getString('language')}/store/${(this.storeData.storepage_slug || '-')}/${this.storeData.storefront_user_id}?prodname=${this.productShareData.product_id}`;
    if(this.productShareData.parent_category_id)
      this.normalCopyLink += '&pordCat=' + this.productShareData.parent_category_id;
    this.domainName = encodeURIComponent(this.normalCopyLink);
    this.mailingLink=`mailto:?subject=${product.name}&body=${this.domainName}`
    this.showProductShareBox = true;
    this.productPosition = index;
    this.storePosition = storeIndex;
    this.shareUrlSection = false;

  }
  onShareUrl(){
    this.shareUrlSection = true;
  }
  copyText(){
    let selBox = document.createElement('textarea');
      selBox.style.position = 'fixed';
      selBox.style.opacity = '0';
      selBox.value =  this.normalCopyLink;
      document.body.appendChild(selBox);
      selBox.focus();
      selBox.select();
      document.execCommand('copy');
      document.body.removeChild(selBox);
      this.popup.showPopup(MessageType.SUCCESS, 2000, 'Copied', false);
    }
  /**
   * setting questionaire amount for cart as it shows wrong sso copied this fn from cart, as i have
   * no idea what the developer did, loop has a check of product template enabled,
   * as it is only for that case
   */
  setQuestionaireAmountData() {
    const data = this.sessionService.getByKey('app', 'cart') || [];
      data.forEach((val, index) => {
        if (!val.is_product_template_enabled) {
          return;
        }
        let productTemplateCharges = 0;
        if (val.productTemplatePrice) {
          productTemplateCharges = val.productTemplatePrice;
        }
          let converterToSec;
          let check = this.cartService.convertToSec(val);
          if (check.type == AmountService.Price) {
            return check.value
          }
          else {
            converterToSec = check.value;
          }
          let pricePerUnitTime = val.price / val['unit'];
          let timeDiff;
          if (val.start_time && val.end_time) {
            let start_dateTime = new Date(val.start_time);
            let end_dateTime = new Date(val.end_time);
            timeDiff = (end_dateTime.getTime() - start_dateTime.getTime()) / 1000;
            timeDiff /= converterToSec;
          }
          let service_time = val.service_time ? val.service_time / (converterToSec / 60) : timeDiff;
          if (!service_time) {
            service_time = 1;
          }
          let showPrice = ((val.quantity * pricePerUnitTime * service_time) + productTemplateCharges);
          val['customizations'].forEach(addOn => {
            showPrice = showPrice + addOn.unit_price * val.quantity;
          });
          data[index].showPrice = showPrice / val.quantity;
          data[index].totalPrice = showPrice;
        });
      this.sessionService.setByKey('app', 'cart', data);
  }
  hideMultiImageDialog(){
    this.openMultiImage = false;
    this.showBackdrop = false;
  }
  ngOnDestroy() {
    this.submitQuestionnaireSubscription.unsubscribe();
  }
}
