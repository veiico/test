import { MessageType } from './../../../../constants/constant';
import {
  Component,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
  EventEmitter,
  OnChanges,
  AfterViewInit
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { setTime } from 'ngx-bootstrap/chronos/utils/date-setters';

import { AppCartService } from '../../../catalogue/components/app-cart/app-cart.service';
import { PopUpService } from '../../../../modules/popup/services/popup.service';
import { SessionService } from '../../../../services/session.service';
import { CartModel } from '../../../catalogue/components/app-cart/app-cart.model';
import { AppService } from '../../../../app.service';
import { GoogleAnalyticsEventsService } from '../../../../services/google-analytics-events.service';
import {
  GoogleAnalyticsEvent,
  BusinessType,
  TaskType,
  AmountService
} from '../../../../enums/enum';
import { RestaurantsService } from '../../../restaurants-new/restaurants-new.service';
import { MessageService } from '../../../../services/message.service';
import { ModalType } from '../../../../constants/constant';
import { CatalogueService } from '../../../catalogue/catalogue.service'
import { ProductTimingService } from '../../../../components/product-timing/product-timing.service';
import { DecimalConfigPipe } from '../../../../pipes/decimalConfig.pipe';
import { ProductTemplateService } from '../../../product-template/services/product-template.service';
import { ConfirmationService } from '../../../../modules/jw-notifications/services/confirmation.service';


declare var $: any;


@Component({
  selector: 'app-product-checkout',
  templateUrl: './app-product.html',
  styleUrls: ['./app-product.scss']
})
export class AppProductComponent
  implements OnInit, OnDestroy, OnChanges, AfterViewInit {
    customOrderDescription: any;
  cartProductData: any;
  readMore = -1;
  currency: any;
  currentProduct: any;
  business_type=BusinessType;
  modalType = ModalType.MEDIUM;
  showProductTemplate: boolean = false;
  currentProductForTemplate: any;
  protected _p;
  protected _showCategoryName;
  protected _mandat_item_layout_type;
  protected productListCopy: any;
  @Input('currentCategoryName') currentCategoryName;
  @Input('searchProducts') searchProducts;
  @Input('cardInfo') cardInfo;
  @Input('paginating') paginating;
  @Input('hasImages') hasImages;
  @Input ('showCategoryName') showCategoryName;
  showBackdrop: boolean;
  editAddon: boolean;
  editAddonIndex: any;
  appProductPage: boolean;
  showProductShareBox: boolean;
  productShareData: any;
  productPosition: any;
  shareUrlSection: boolean;
  mailingLink: string;
  domainName: string;
  normalCopyLink: string;
  showNotAvailable: boolean = false;
  languageStrings: any={};
  @Input('mandat_item_layout_type')
  set mandat_item_layout_type(val){
    this._mandat_item_layout_type = val;
    if(this._mandat_item_layout_type){
      this.layout_type = 2;
    }
  }
  decimalPipe = new DecimalConfigPipe(this.sessionService);
  get mandat_item_layout_type() {
    return this._mandat_item_layout_type;
  }

  store: any;
  deliveryMode: number;
  @Input('productData')
  set productData(val) {
    if (val && val[0] === undefined) {
      val = [];
    }
    this._p = val;
    this.productList = val;
    this.getCurrency(this.productList);
    if (this.searchProducts === 1) {
      this.activate(val, 0);
    } else {
      this.activate(val, 1);
    }
    if(val){
      this.productListCopy = JSON.parse(JSON.stringify(val));
    } else {
      this.productListCopy = [];
    }
  }
  get productData() {
    return this._p;
  }

  protected imgArray: Array<string>;
  protected hasDestroy: boolean;
  protected currentCategory: string;
  public appConfig: any = {
    color: ''
  };
  public addBtnTxt = '';
  public removeBtnTxt = '';
  protected layoutBool: boolean;
  protected addon_layout_type;
  public productQuantity: any = {};
  public productBool: any = {};
  protected sideOrderProductData: any = {};
  protected sideOrderProductBool: any = {};
  protected productList: any;
  protected categoryList: any;
  protected storeUnsubscribe: any;
  protected allCategoryData: any;
  protected loopData: any = [];
  public caraouselImages: [];
  public multiImageUrl: [];
  public caraouselImagesIncludingVideos: Array<object> = [{}];
  protected routeSubsriber: any;
  protected scrollProp: number;
  protected currentScrollIndex: number;
  protected scrollWidth: number;
  protected currentIndex: number;
  public noProduct = false;
  protected categoryId: string;
  protected layout: any = {};
  @Input() layout_type: any;
  @Input() isRestaurantActive: any;
  protected selectedProduct: any = {};
  protected customizedObj: any = {};
  protected productIndexObj: any = {};
  protected currentCustomizeObj: any = {};
  public amountService=AmountService;
  showFullDescription : boolean;
  public terminology: any;
  public formSetting: any;
  protected minimumOrder: any;
  protected totalCount = 0;
  public productSelectedToAdd: any;
  public indexGot: any;
  public restaurantInfo: any;
  public start_time: any;
  public end_time: any;
  public langJson: any = {};
  public unit_count = 0;
  public checkProduct = false;
  public languageSelected: any;
  public direction = 'ltr';
  public viewLoad = true;
  @Output() toggle: EventEmitter<string> = new EventEmitter<string>();
  public minSelectAddonError = '';
  public minSingleSelectAddonError = '';
  public maxSelectAddonError = '';
  public productLongDescription = "";
  public sideOrderProducts = [];
  public sideOrderTotalAmount: number = 0;
  public currentProductWithAddon;
  public openMultiImage: boolean;
  public openVideoImage: boolean;
  public showAddonPopup: boolean;
  protected submitQuestionnaireSubscription;
  public addButton = 'Add';
  public removeButton = 'Remove';
  constructor(
    public productTemplateService : ProductTemplateService,
    protected route: ActivatedRoute,
    protected router: Router,
    protected sessionService: SessionService,
    protected popup: PopUpService,
    protected cartService: AppCartService,
    public googleAnalyticsEventsService: GoogleAnalyticsEventsService,
    public messageService: MessageService,
    public appService: AppService, protected restaurantService: RestaurantsService,
    protected catalogueService: CatalogueService,protected productTimingService: ProductTimingService, public confirmationService : ConfirmationService) {
      this.languageStrings = this.sessionService.languageStrings;
      this.scrollProp = 0;
    this.currentIndex = 0;
    this.currentScrollIndex = 0;
    this.hasDestroy = false;
    this.formSetting = this.sessionService.get('config');
    this.addon_layout_type = this.formSetting.addon_layout_type;
    this.deliveryMode = Number(this.sessionService.getString('deliveryMethod'));
    this.store = this.sessionService.get('info');

    if (this.formSetting.terminology) {
      this.terminology = this.formSetting.terminology;
    }
    if (!this.layout_type) {
      this.layout_type = 1;
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
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.checkFullWidth();
  }

  @HostListener('document:keydown.escape', ['$event'])
  onKeydownHandler(event: KeyboardEvent) {
      this.hideMultiImageDialog();
  }
  activate(productData, type) {
    if (!productData || productData[0] === undefined) {
      productData = [];
    }
    if (productData.length && type === 1) {
      this.setDefaultValue();
      this.noProduct = false;
    } else if (type === 0) {
      if (productData.length) {
        this.setDefaultValue();
        this.noProduct = false;
      } else {
        this.noProduct = true;
      }
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.viewLoad = false;
    }, 3000);
    if (this.deliveryMode == 2) {
      this.minimumOrder = this.store.minimum_self_pickup_amount;
    } else if (this.deliveryMode == 1) {
      this.minimumOrder = this.store.merchantMinimumOrder;
    }
  }

ngOnChanges() {
    if (
      this.searchProducts === 1 &&
      this.productData &&
      this.productData.length > 0
      ) {
      this.activate(this.productData, 0);
    } else if (
      this.searchProducts === 1 &&
      this.productData &&
      this.productData.length === 0
    ) {
      this.activate(this.productData, 0);
    }

    if (this.productData && this.productData.length === 0) {
      this.noProduct = true;
    }
  }

  ngOnInit() {

    this.appProductPage = true;
    this.productList = this.productData;
    this.getCurrency(this.productList);
    this.getCartQuantityData();
    this.setDefaultProductQuantity();
    this.subscriptionMessageListener();
    this.appConfig = this.sessionService.get('config');
    this.addon_layout_type = this.appConfig.addon_layout_type;
    this.restaurantInfo = this.sessionService.get('info');
    this.customOrderDescription=this.terminology && this.terminology.READY_TO_PLACE_YOUR_ORDER?true:false;
    // ================language json manupilation======================
    this.appService.langPromise.then(() => {
      this.langJson = this.appService.getLangJsonData();
      this.langJson['No Product Available.'] = this.langJson[
        'No Product Available.'
      ].replace('----', this.terminology.PRODUCT);
      this.langJson['Customize Item'] = this.langJson['Customize Item'].replace(
        '----',
        this.terminology.ITEM
      );
      this.langJson['Optional'] = this.langJson['Optional'];
      this.removeButton = this.langJson['Remove'] || 'Remove';
      this.addButton = this.langJson['Add'] || 'Add';
    });
    if (
      this.sessionService.get('config').side_order &&
      this.sessionService.get('config').onboarding_business_type === 804
    ) {
      this.getSideOrders();
    }
    this.deliveryMode = Number(this.sessionService.getString('deliveryMethod'));
    this.store = this.sessionService.get('info');
    if (this.deliveryMode == 1) {
      this.minimumOrder = this.store.merchantMinimumOrder;
    } else if (this.deliveryMode == 2) {
      this.minimumOrder = this.store.minimum_self_pickup_amount;
    }
    if(this.route.snapshot.queryParams['prodname'] && this.formSetting.is_product_share_enabled)
        this.showProductPop(this.route.snapshot.queryParams['prodname'])

    this.submitQuestionnaireSubscription = this.productTemplateService.submitQuestionnaire.subscribe( (res : any) => {
        res.productInfo.product_template = res.template
      this.setProductContent(res.productInfo , false);
      this.productBool[res.productInfo.product_id] = true;
      this.getTotalAmount();
      return;
  });
  this.sessionService.langStringsPromise.then(() =>
  {
   this.languageStrings = this.sessionService.languageStrings;
   this.setLangKeys();
  });
}
  setLangKeys() {
    this.languageStrings.no_product_avail = (this.languageStrings.no_product_avail || 'No Product Available.')
    .replace('PRODUCT_PRODUCT', this.terminology.PRODUCT);
    this.languageStrings.customize_item = (this.languageStrings.customize_item || 'Customize Item').replace(
      'ITEM_ITEM',
      this.terminology.ITEM
    );
    this.languageStrings.sorry_product_not_available_at_moment = (this.languageStrings.sorry_product_not_available_at_moment || 'Sorry product is not available at the moment.').replace(
      'PRODUCT_PRODUCT',
      this.terminology.PRODUCT
    );
    this.languageStrings.side_order = (this.languageStrings.side_order || 'Side Order').replace(
      'ORDER_ORDER',
      this.terminology.ORDER
    );
    this.languageStrings.pls_remove_it_from_cart_as_msg = (this.languageStrings.pls_remove_it_from_cart_as_msg || 'Please remove it from the cart as cart contains this item with different addons.').replace(
      'CART_CART',
      this.terminology.CART
    );
    this.removeButton = this.languageStrings.remove || 'Remove';
    this.addButton = this.languageStrings.add || 'Add';
    if (
      this.restaurantInfo &&
      this.restaurantInfo.button_type &&
      this.restaurantInfo.button_type.button_names
    ) {
      this.addBtnTxt = this.restaurantInfo.button_type.button_names.add
        ? this.restaurantInfo.button_type.button_names.add
        : (this.languageStrings.add || 'Add')
      this.removeBtnTxt = this.restaurantInfo.button_type.button_names.remove
        ? this.restaurantInfo.button_type.button_names.remove
        :(this.languageStrings.remove || 'Remove');
    }
  }
  subscriptionMessageListener() {
    this.cartService.editCustomizationData.subscribe((data : any) => {
      if(data && data.productData && data.productData.id){
        this.editAddon = true;
        this.editAddonIndex = data.index;
        data.productData.customization = data.productData.original_customization;
          const cartData = this.cartService.getProductQuantity();
          if (cartData && cartData[data.productData.product_id]) {
            this.productQuantity[data.productData.product_id] =
              cartData[data.productData.product_id].quantity;
            this.productBool[data.productData.product_id] = true;
          } else {
            this.productQuantity[data.productData.product_id] = 0;
            this.productBool[data.productData.product_id] = 0;
          }
        this.checkBusinessTypeBeforeAdding(data.productData,-1);
      }
    });
  }

  getCurrency(productList){
      this.currency = (this.sessionService.get('config').is_multi_currency_enabled && productList && productList[0] && productList[0].payment_settings) ? productList[0].payment_settings.symbol : this.sessionService.get('config')['payment_settings'][0].symbol;
  }
  getSideOrders() {
    const obj = {
      user_id: this.route.snapshot.params['id'],
      limit: '50',
      offset: '0',
      marketplace_user_id: this.appConfig.marketplace_user_id.toString(),
      date_time:
        this.sessionService.getString('preOrderTime') ||
        new Date().toISOString()
    };
    if(this.sessionService.get('appData')){
      obj['vendor_id'] = this.sessionService.get('appData').vendor_details.vendor_id,
        obj['access_token'] = this.sessionService.get('appData').vendor_details.app_access_token
    }
    this.restaurantService.getSideOrders(obj).subscribe(
      response => {
        if (response.status === 200) {
          this.sideOrderProducts = response.data;
          this.sideOrderProducts.sort((a, b) => {
            return a.parent_category_id - b.parent_category_id;
          });
        }
      },
      error => {
        console.error(error);
      }
    );
  }

  updateData(data) {
    if (!this.hasDestroy) {
      if (data.category) {
        this.categoryList = JSON.parse(JSON.stringify(data.category));
        this.getSubChildData(this.categoryList);
      }
    }
  }


  getParamsByRoute() {
    this.routeSubsriber = this.route.params.subscribe(params => {
      this.categoryId = params['id'];
      const productData = this.sessionService.getByKey('app', 'product');
      if (productData && productData[this.categoryId]) {
        this.productList = productData[this.categoryId];
        this.getCurrency(this.productList);
        this.activate(this.productList, 0);
      } else {
      }
    });
  }

  setProductData(data) {
    this.productList = data;
    this.getCurrency(this.productList);
    this.activate(this.productList, 0);
  }
  getCartQuantityData() {
    this.cartService.currentStatus.subscribe(() => {
      this.setDefaultValue();
    });
  }

  selectProduct(id) {
    this.productBool[id] = true;
  }
  resetDialog() {
    this.editAddon = false;
    this.cartService.editAddon = false;
    this.currentProduct = false;
    this.customizedObj = {};
    this.currentCustomizeObj = {};
    if (this.addon_layout_type === 1) {
      this.showAddonPopup = false;
    } else {
      $('#myModal').modal('hide');
    }
  }
  removeParams(){
    if(this.route.snapshot.queryParams['prodname'])
      this.router.navigate(['.'],{ relativeTo: this.route, queryParams: { page: null } });
    this.showProductShareBox = false;
    this.showNotAvailable = false;
  }
  addCustomization(type) {
    let customizeIndex : any = -1;
    let newQuantity = this.currentProduct.quantity;
    if(this.sessionService.getByKey('app', 'customize') && this.sessionService.getByKey('app', 'cart')){
      const custObj = this.sessionService.getByKey('app', 'customize');
      const cartdata = this.sessionService.getByKey('app', 'cart');
      if(custObj && this.currentProduct && custObj[this.currentProduct.product_id]){
        customizeIndex = this.checkCustomizeIndex(this.getSelectedCustomization(),custObj[this.currentProduct.product_id]);
      }
       customizeIndex = parseInt(customizeIndex);
       if(customizeIndex!=-1){
        newQuantity = newQuantity + cartdata[customizeIndex].quantity;
      }
    }

    if (
      this.productQuantity &&
      Number(newQuantity) +
      Number(this.productQuantity[this.currentProduct.product_id]) >
      9999
    ) {
      this.resetDialog();
      this.popup.showPopup(
        MessageType.ERROR,
        2000,
        this.languageStrings.selected_quantity_exceed_avail || 'The selected quantity exceeds quantity available in stock.',
        false
      );
      return;
    }

    if (!this.checkForMinimumSelectionAddon()) {
      return false;
    }

    if (+newQuantity < this.currentProduct.minimum_quantity) {
      let msg = this.languageStrings.quantity_less_than_min || 'Quantity of ___ is less than minimum quantity ___';
      msg = msg.replace('___', this.currentProduct.name);
      msg = msg.replace('___', this.currentProduct.minimum_quantity);
      this.minSelectAddonError = msg;
      setTimeout(() => {
        this.minSelectAddonError = '';
      }, 2000);
      return false;
    }
    if (this.currentProduct.maximum_quantity > 0) {
      if (+newQuantity > this.currentProduct.maximum_quantity) {
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
    if(this.editAddon){
      const cart = this.sessionService.getByKey('app', 'cart');
      if(cart && cart.length){
        this.cartService.removeProduct(this.currentProduct.id,this.editAddonIndex);
        let cartProductData = this.sessionService.getByKey('app', 'cartProduct');
        if(cartProductData && cartProductData[this.currentProduct.id] && cartProductData[this.currentProduct.id].quantity){
          cartProductData[this.currentProduct.id].quantity -= this.currentProduct.quantity;
          this.sessionService.setByKey('app', 'cartProduct',cartProductData);
        }
      }
    }
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
    obj.image_url = this.currentProduct.image_url;
    obj.customizations = customizations;
    obj.enable_tookan_agent = this.currentProduct.enable_tookan_agent;
    obj.is_agents_on_product_tags_enabled = this.currentProduct.is_agents_on_product_tags_enabled;
    obj.user_id = this.currentProduct.user_id;
    obj.delivery_by_merchant = this.currentProduct.delivery_by_merchant;
    obj.is_static_address_enabled = this.currentProduct.is_static_address_enabled;
    obj.totalPrice =
      this.currentProduct.totalPrice * this.currentProduct.quantity;
    obj.minimum_quantity = this.currentProduct.minimum_quantity;
    obj.maximum_quantity = this.currentProduct.maximum_quantity;
    if(this.currentProduct.often_bought_products){
      obj.often_bought_products = this.currentProduct.often_bought_products;
    }
    obj.is_recurring_enabled = this.store.is_recurring_enabled ? this.currentProduct.is_recurring_enabled : 0;
    obj.is_veg = this.currentProduct.is_veg;
    obj.product_id = this.currentProduct.product_id;
    obj.is_product_template_enabled = this.currentProduct.is_product_template_enabled;
    obj.original_customization = this.currentProduct.customization;
    obj.layout_data = this.currentProduct.layout_data;
    if(this.currentProduct.agent_id &&  obj.is_agents_on_product_tags_enabled){
      obj.agent_id = this.currentProduct.agent_id;
    }
    if(this.currentProduct.surge_amount)
    {
      obj.surge_amount=this.currentProduct.surge_amount;
    }
    if(this.currentProduct.service_time){
      obj.service_time = this.currentProduct.service_time;
    }
    if(this.formSetting.is_multi_currency_enabled){
      obj.payment_settings = this.currentProduct.payment_settings
    }
    if (this.restaurantInfo.business_type === 2) {
      this.makeCustomizationTimeSame(obj);
    }
    if(this.currentProduct.is_product_template_enabled === 1){
      const productInfo = JSON.parse(JSON.stringify(this.currentProduct));
      productInfo.addOnPrice = (obj.showPrice - obj.price*obj.unit_count);
      productInfo.is_addOns = true;
      productInfo.product_id = obj.product_id;
      productInfo.customizations = customizations;
      this.questionnaireSetup(productInfo, this.productQuantity);
     setTimeout(() => {
      if (type === 0) {
        this.getTotalAmount();
        this.resetDialog();
      }
     },100);
    }
    else {
      this.productQuantity[this.currentProduct.product_id] = this.currentProduct.quantity;
      this.editAddon = false;
      this.cartService.editAddon = false;
      this.setProductInCart(obj);
      this.resetDialog();
      if (type === 0) {
        this.getTotalAmount();
      }
      if(!this.appProductPage){
        this.catalogueService.cartDataChanged();
      }
    }

  }
  makeCustomizationTimeSame(data) {
    let cart = this.cartService.getCartData();
    if (!cart) {
      cart = [];
    }
    const indexCheck = cart.findIndex((o: any) => {
      return o.id === data.id;
    });
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
  getSubChildData(value) {
    const copyData = value.slice();
    const categoryObj: any = {};
    let finalArray = [];

    copyData.forEach((val, parentIndex) => {
      const catArray = [];
      val = val.slice(0);
      val.forEach(function(element, index) {
        if (element.parent_category_id) {
          const obj = {};
          obj[element.catalogue_id] = element;
          if (categoryObj[element.parent_category_id]) {
            if (element.has_children) {
              categoryObj[element.catalogue_id] = element;
            }
            if (categoryObj[element.parent_category_id].child) {
              if (!element.is_dummy) {
                categoryObj[element.parent_category_id].child.push(element);
              }
            } else {
              if (!element.is_dummy) {
                const localArray = [];
                localArray.push(element);
                categoryObj[element.parent_category_id].child = localArray;
              }
            }
          }
        } else {
          if (!element.is_dummy) {
            categoryObj[element.catalogue_id] = element;
            catArray.push(element);
          }
        }
      });
      if (catArray.length) {
        finalArray = catArray;
      }
    });

    this.categoryList = finalArray;
    this.loopData = finalArray;
    this.allCategoryData = JSON.parse(JSON.stringify(categoryObj));
  }
  ngOnDestroy() {
    this.appProductPage = false;
    this.hasDestroy = true;
    if (this.sessionService.get('app')) {
      this.sessionService.removeByChildKey('app', 'product');
    }
    if(this.submitQuestionnaireSubscription){
      this.submitQuestionnaireSubscription.unsubscribe();
    }
  }

  setDefaultValue() {
    const cartData = this.cartService.getProductQuantity();
    if (this.productList[0] === undefined) {
      this.productList = [];
    }
    this.productBool = {};
    this.productList.forEach((val, index) => {
      if (cartData && cartData[val.product_id]) {
        this.productQuantity[val.product_id] =
          cartData[val.product_id].quantity;
        this.productBool[val.product_id] = true;
      } else {
        this.productQuantity[val.product_id] = 0;
        this.productBool[val.product_id] = 0;
      }
    });
    this.checkFullWidth();
  }

  goToproduct() {
    const previousproduct: any = this.sessionService.get('category');
    if (previousproduct.layout) {
      this.layoutBool = true;
    }
    this.backToParent(previousproduct.id);
  }
  getCategory() {
    const previousCategory: any = this.sessionService.get('category');
    if (previousCategory.layout) {
      this.layoutBool = true;
    }
    this.currentCategory = previousCategory.name;
  }

  checkBusinessTypeBeforeAdding(products, index) {
    if(this.showProductShareBox)
      this.removeParams();
    this.currentProductWithAddon = Object.assign({}, products);
    if (this.restaurantInfo.multiple_product_single_cart === 2) {
      const productData = this.sessionService.getByKey('app', 'cart');
      if (productData && productData.length) {
        this.languageStrings.you_can_only_avail_one_product = (this.languageStrings.you_can_only_avail_one_product || 'You can only avail one product at a time.').replace(
          '----',
          this.terminology.PRODUCT
        );
        const msg = this.languageStrings.you_can_only_avail_one_product;
        this.popup.showPopup(MessageType.ERROR, 2000, msg, false);
      } else {
        this.getSchedulingTimeAccToProduct(products, index);
      }
    } else {
      this.getSchedulingTimeAccToProduct(products, index);
    }
  }

  goToCheckout() {
    if (parseFloat(this.decimalPipe.decimalPrecision(this.totalCount)) < parseFloat(this.decimalPipe.decimalPrecision(this.minimumOrder))) {
      this.languageStrings.min_order_amount_should= (this.languageStrings.min_order_amount_should || 'Minimum order amount should be $10')
      .replace('----', this.terminology.ORDER);
      this.languageStrings.min_order_amount_should = this.languageStrings.min_order_amount_should
      .replace('$', this.currency);
      this.languageStrings.min_order_amount_should = this.languageStrings.min_order_amount_should
      .replace('10', this.decimalPipe.transform(this.minimumOrder));
      const msg = this.languageStrings.min_order_amount_should;
      this.popup.showPopup(MessageType.ERROR, 2000, msg, false);
      return false;
    }
    if (
      this.sessionService.get('appData') &&
      parseInt(this.sessionService.getString('reg_status')) === 1
    ) {
      this.toggle.emit();
      this.googleAnalyticsEventsService.emitEvent(
        GoogleAnalyticsEvent.go_to_checkout,
        'Go to checkout',
        '',
        ''
      );
      this.router.navigate(['checkout']);
    } else if (
      this.sessionService.get('appData') &&
      parseInt(this.sessionService.getString('reg_status')) !== 1 &&
      !this.sessionService.get('appData').signup_template_data.length
    ) {
      this.toggle.emit();
      this.googleAnalyticsEventsService.emitEvent(
        GoogleAnalyticsEvent.go_to_checkout,
        'Go to checkout',
        '',
        ''
      );
      this.router.navigate(['checkout']);
    } else {
      this.messageService.getLoginSignupLocation('From Checkout Button');
      $('#loginDialog').modal('show');
    }
  }

  removeProductAccToType(id, index) {
    const cartProductData = this.sessionService.getByKey('app', 'cartProduct');
    const product = JSON.parse(JSON.stringify(this.productList))[0];
    this.googleAnalyticsEventsService.emitEvent(
      GoogleAnalyticsEvent.remove_quantity,
      product.name,
      '',
      ''
    );
    const productData = this.sessionService.getByKey('app', 'cart');
    const customizedData = this.sessionService.getByKey('app', 'customize');
    if (Object.keys(customizedData[id].data).length === 1) {
      if (this.restaurantInfo.business_type === 2) {
        cartProductData[id].quantity = 0;
      } else {
        cartProductData[id].quantity -= 1;
      }
      this.sessionService.setByKey('app', 'cartProduct', cartProductData);
      index = cartProductData[id].index;
      if (this.productQuantity[id]) {
        if (this.restaurantInfo.business_type === 2) {
          this.productQuantity[id] = 0;
        } else {
          this.productQuantity[id]--;
        }
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

  addCart(products, index) {
    const copyProduct = JSON.parse(JSON.stringify(this.productList ? this.productList : []));
    const productIndex = copyProduct.findIndex(el => el.product_id == products.product_id);
    const product = (productIndex != -1 && index != -1) ? copyProduct[productIndex] : products;
    if ((products.inventory_enabled && (index == -1 ? product.quantity : (product.minimum_quantity || 1) ) <= products.available_quantity) ||
      !products.inventory_enabled) {
      this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.add_quantity, product.name, '', '');
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
        if (index == -1) {
          this.currentProduct.quantity = product.quantity;
        } else {
          this.currentProduct.quantity = product.minimum_quantity || 1;
        }
        if (this.restaurantInfo.business_type === BusinessType.SERVICE_MARKETPLACE) {
          this.currentProduct.totalPrice = this.setAmountForServices(product)
          if (this.currentProduct.surge_amount) {
            this.currentProduct.totalPrice += this.currentProduct.surge_amount
          }
        } else {
          this.currentProduct.totalPrice = this.currentProduct.price;
        }
        this.currentProduct.type = this.currentProduct.layout_data.buttons[0].type;
        this.currentProduct.totalItem = 0;
        this.customizedObj[product.product_id] = product;
        this.setCustomizedObj(index);
        setTimeout(() => {
          /**
           *  Before open modal set default value of side product
           */
          if (this.addon_layout_type === 1) {
            this.currentProductWithAddon = Object.assign({}, this.currentProduct);
            this.showAddonPopup = true;
          } else {
            this.setDefaultSideOrderValue();
            if(this.appProductPage){
              this.router.navigate(['often-bought-product-page']);
            } 
          }
        }, 100);
      } else {
        if (product.is_product_template_enabled === 1) {
          this.questionnaireSetup(product, this.productQuantity);
          return;
        }
        if (this.addon_layout_type === 1) {
          this.currentProductWithAddon = Object.assign({}, this.currentProduct);
          this.currentProduct = product;
          this.currentProduct.quantity = product.minimum_quantity || 1;
          this.currentProduct.totalPrice = this.currentProduct.price;
          this.showAddonPopup = true;
        } else {
          this.setProductContent(product, false);
          this.productBool[product.product_id] = true;
          this.getTotalAmount();
        }
      }
    } else {
      if(this.editAddon){
        this.resetDialog();
      }
      this.popup.showPopup(
        MessageType.ERROR,
        2000,
        this.languageStrings.selected_quantity_exceed_avail ||
        'The selected quantity exceeds quantity available in stock.'
        ,
        false
      );
    }
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

  /**
   * return price for services after calculation
   * @param obj
   */
  setAmountForServices(obj) {
    let converterToSec;
    let check = this.cartService.convertToSec(obj);
    if (check.type == this.amountService.Price) {
      return check.value
    } else {
      converterToSec = check.value;
    }
    let pricePerUnitTime = obj.price / obj['unit'];
    let timeDiff;
    if (obj.start_time && obj.end_time) {
      let start_dateTime = new Date(obj.start_time);
      let end_dateTime = new Date(obj.end_time);
      timeDiff = (end_dateTime.getTime() - start_dateTime.getTime()) / 1000;
      timeDiff /= converterToSec;
    }
    let service_time = obj.service_time ? obj.service_time / (converterToSec / 60) : timeDiff;
    if(!service_time){
      service_time = 1;
    }
    let showPrice = pricePerUnitTime * service_time;
    if (obj['customizations']) {
      obj['customizations'].forEach(addOn => {
        showPrice = showPrice + addOn.unit_price
      });
    }
    this.totalCount += showPrice;
    return showPrice;
  }

  getTotalAmount() {
if (this.restaurantInfo.multiple_product_single_cart === 2) {
      this.totalCount = 0;
      this.cartService.getCartData().forEach((val: CartModel) => {
        return (this.totalCount += val.quantity * val.showPrice);
      });
      this.goToCheckout();
    }
  }

  getSchedulingTimeAccToProduct(products, index) {
    let cart = this.cartService.getCartData();
    if (!cart) {
      cart = [];
    }
    const indexCheck = cart.findIndex((o: any) => {
      return o.id === products.product_id;
    });
    const taskType = this.restaurantInfo.pd_or_appointment;
    const businessType = this.restaurantInfo.business_type;

    if (
      businessType == BusinessType.PRODUCT_MARKETPLACE ||
      (businessType == BusinessType.SERVICE_MARKETPLACE &&
        taskType == TaskType.SERVICE_AS_PRODUCT)
    ) {
      this.addCart(products, index);
    } else {
      if (indexCheck > -1) {
        this.addCart(products, index);
      } else {
        this.productSelectedToAdd = products;
        this.indexGot = index;
        const obj ={
          productSelectedToAdd : products,
          indexGot : index
        }
        this.productTimingService.addServiceToCart(obj);
        $('#timeSelection').modal('show');
      }
    }
  }

  getSelectedTiming(event) {
    this.start_time = event.start;
    event.product['start_time']= event.start;
    if (event.end) {
      this.end_time = event.end;
      event.product['end_time']= event.end;
    }
    this.unit_count = event.unit_count;
this.addCart(event.product, event.index);

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
    this.showProductTemplate = true;
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
          this.languageStrings.total_quantity_cannot_be_more_than_max || 'Total quantity for this item cannot be more than maximum quantity.',
          false
        );
        return;
      }
    }
    const productData = this.productData;
    const that = this;

    productData.forEach(function(obj) {
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
            this.languageStrings.selected_quantity_exceed_avail ||
            'The selected quantity exceeds quantity available in stock.'
            ,
            false
          );
        }
      }
    });
  }
  decreaseCustomizeProduct() {
    if (this.currentProduct.quantity > 1) {
      this.currentProduct.quantity--;
    } else {
      this.resetDialog();
    }
  }

  showLightBox(product) {
    if ( !product.image_url && product.multi_image_url && product.multi_video_url &&
          product.multi_image_url.length == 0 && product.multi_video_url.length == 0 )
        return ;

    if(this.addon_layout_type === 1){
      return ;
    }
    if (
      !product.long_description &&
      product.layout_data.lines[1] &&
      product.layout_data.lines[1].data &&
      product.layout_data.lines[1].data.length > 60
    ) {
      this.productLongDescription = product.layout_data.lines[1].data;
    } else {
      this.productLongDescription = product.long_description;
    }
    this.caraouselImages = product.multi_image_url;
    this.multiImageUrl = product.multi_image_url;
    var split_objects = this.multiImageUrl.map(function(str) {
      return { url: str, thumb_urls: { "250x250": str, "400x400": str } };
    });
    this.caraouselImagesIncludingVideos = split_objects.concat(
      product.multi_video_url
    );
    if(product.thumb_url){
      product.thumb_url = product.thumb_url.split(',')[0];
    }
    if (this.caraouselImages.length || this.productLongDescription) {
      this.openMultiImage = true;
      this.showBackdrop = true;
    }
    if(this.caraouselImagesIncludingVideos.length || this.productLongDescription){
      this.openVideoImage = true;
      this.showBackdrop = true;
    }
  }
  onreadMore(e,index){
    e.stopPropagation();
    this.readMore = index;
  }
  setCustomizedObj(index:number) {
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
  addCustomizedCart(product, index) {
    this.currentProduct = product;
    this.customizedObj[product.product_id] = product;
  }

  changeExtrasStatus(productId, customization, custIndex, optionIndex, status) {
    let is_default_check = false;
    const length = Object.keys(
      this.currentCustomizeObj[customization.customize_id]
    ).length;
    if (!customization.is_check_box) {
      this.currentProductWithAddon.customization[
        custIndex
      ].customize_options.forEach(elem => {
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
      if(status == true && (!customization.is_singleSelect_mandatory || !is_default_check)) {
        for (const prop in this.currentCustomizeObj[customization.customize_id]) {
          delete this.currentCustomizeObj[customization.customize_id][prop];
        }
        this.customizedObj[productId].customization[custIndex].customize_options[optionIndex].is_default = false;
        this.currentProduct.totalPrice -= this.customizedObj[productId].customization[custIndex].customize_options[optionIndex].price;
      }
      else if (status == true &&  customization.is_singleSelect_mandatory) {

        let msg = this.languageStrings.exactly_option_should_be_selected ||
          'Exactly ___ option should be selected of  ___';
        msg = msg.replace('___', 'one');
        msg = msg.replace('___', customization.name);
        this.minSingleSelectAddonError = msg;
        setTimeout(() => {
          this.minSingleSelectAddonError = '';
        }, 2000);
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
  setProductContent(product, sideOrderBool) {
    const obj: any = {};
    obj.id = product.product_id;
    obj.quantity = sideOrderBool
      ? product.quantity
      : product.minimum_quantity || 1;
    obj.price = product.price;
    obj.available_quantity = product.available_quantity;
    obj.inventory_enabled = product.inventory_enabled;
    obj.name = product.name;
    obj.type = product.layout_data.buttons[0].type;
    obj.unit = product.unit;
    obj.unit_type = product.unit_type;
    obj.unit_count = this.unit_count;
    obj.image_url =product.image_url;
    obj.enable_tookan_agent = product.enable_tookan_agent;
    obj.is_agents_on_product_tags_enabled = product.is_agents_on_product_tags_enabled;
    obj.return_enabled = product.return_enabled;
    obj.user_id = product.user_id;
    obj.delivery_by_merchant = product.delivery_by_merchant;
    obj.is_static_address_enabled = product.is_static_address_enabled;
    obj.minimum_quantity = product.minimum_quantity;
    obj.maximum_quantity = product.maximum_quantity;
    obj.is_veg = product.is_veg;
    obj.productId = product.product_id;
    obj.category_id = product.parent_category_id;
    obj.is_product_template_enabled = product.is_product_template_enabled;
    if(product.service_time){
      obj.service_time = product.service_time;
          }
    if(obj.is_product_template_enabled === 1) {
    obj.showPrice = product.total_amount;
    obj.totalPrice = product.total_amount * obj.quantity;
    obj.productTemplatePrice = product.productTemplatePrice;
    obj.product_template = product.product_template;
    obj.original_customization = product.customization;
    obj.layout_data = product.layout_data;
    }
    else {
      obj.totalPrice = obj.price * obj.quantity;
      obj.showPrice = product.price;
    }
    if(product.is_addOns == true){
      obj.customizations = JSON.parse(JSON.stringify(product.customizations))
    }
    else {
      obj.customizations = [];
    }
    if(this.formSetting.is_multi_currency_enabled){
      obj.payment_settings = product.payment_settings
    }
    obj.is_recurring_enabled = this.store.is_recurring_enabled ? product.is_recurring_enabled : 0;
    if(product.often_bought_products){
      obj.often_bought_products = product.often_bought_products;
    }
    if(obj.is_agents_on_product_tags_enabled && product.agent_id){
      obj.agent_id =  product.agent_id;
    }
    if(product.surge_amount)
    {
      obj.surge_amount=product.surge_amount;
    }
    if (this.restaurantInfo.business_type === 2) {
      this.makeCustomizationTimeSame(obj);
    }
    this.setProductInCart(obj);
  }
  removeCart(id) {
    this.googleAnalyticsEventsService.emitEvent(
      GoogleAnalyticsEvent.remove_quantity,
      this.selectedProduct[id].name,
      '',
      ''
    );
    this.productBool[id] = false;
    delete this.selectedProduct[id];
  }

  backToParent(id) {
    const categoryChildData = JSON.parse(
      JSON.stringify(this.allCategoryData[id])
    );
    this.currentCategory = categoryChildData.name;
    this.loopData = categoryChildData.child;
  }
  moveBack() {
    const width = this.checkDivScrolledWidth();
    const scrollWidthData = this.getScrollDivWidth();
    const scrollDivWidth = scrollWidthData.scrollDivWidth;
    const scrollDivClientWidth = scrollWidthData.scrollDivClientWidth;
    const scrollableWidth = scrollWidthData.scrollableWidth;
    const scrollSize = this.getChildrenWidthByIndex(
      this.currentScrollIndex - 1
    );
    if (Math.abs(width) < scrollableWidth) {
      if (scrollSize > scrollableWidth) {
        this.scrollProp = 0;
        this.currentScrollIndex = 1;
      } else {
        this.scrollProp = -scrollSize;
        this.currentScrollIndex--;
      }
    } else if (Math.abs(width) === scrollableWidth) {
      this.scrollProp = -scrollSize;
      this.currentScrollIndex--;
    }
  }
  moveNext() {
    const width = this.checkDivScrolledWidth();
    const scrollWidthData = this.getScrollDivWidth();
    const scrollDivWidth = scrollWidthData.scrollDivWidth;
    const scrollDivClientWidth = scrollWidthData.scrollDivClientWidth;
    const scrollableWidth = scrollWidthData.scrollableWidth;
    if (width === 0) {
      this.scrollProp = -this.getChildWidth(0, false);
      this.currentScrollIndex++;
    } else {
      const scrollSize = this.getChildrenWidthByIndex(this.currentScrollIndex);
      if (scrollSize > scrollableWidth) {
        this.scrollProp = -scrollableWidth;
        this.scrollWidth = this.scrollProp;
      } else {
        this.scrollProp = -scrollSize;
        this.currentScrollIndex++;
      }
    }
  }
  getScrollDivWidth() {
    const scroll: any = {};
    const element = document.getElementsByClassName('scroll-div')[0];
    scroll.scrollDivWidth = element.scrollWidth;
    scroll.scrollDivClientWidth = element.clientWidth;
    scroll.scrollableWidth =
      scroll.scrollDivWidth - scroll.scrollDivClientWidth;
    scroll.childCount = element.childElementCount;
    return scroll;
  }

  getTotalChildLength() {
    const elements: any = document.getElementsByClassName('scroll-child');
    let elementWidth = 0;
    for (let i = 0; i < elements.length; i++) {
      elementWidth += elements[i].clientWidth;
    }
    return elementWidth;
  }
  getChildWidth(index, bool) {
    const elements: any = document.getElementsByClassName('scroll-child');

    const elementWidth = elements[index].clientWidth;
    if (bool) {
      this.goToScrollByClick(index, elementWidth);
    }
    return elementWidth;
  }
  goToScroll(index, id) {
    this.getChildWidth(index, true);
  }
  goToScrollByClick(index, elementWidth) {
    const elements: any = document.getElementsByClassName('scroll-child');

    const currentElementWidth = elementWidth;
    for (let i = 0; i < index - 1; i++) {
      elementWidth += elements[i].clientWidth;
    }
    const scrollWidthData = this.getScrollDivWidth();
    const scrollDivWidth = scrollWidthData.scrollDivWidth;
    const scrollDivClientWidth = scrollWidthData.scrollDivClientWidth;
    const scrollableWidth = scrollWidthData.scrollableWidth;
    if (index) {
      const scrollSize = this.getChildrenWidthByIndex(index);
      if (scrollSize > scrollableWidth) {
        this.scrollProp = -scrollableWidth;
        this.scrollWidth = this.scrollProp;
      } else {
        this.scrollProp = -scrollSize;
        this.currentScrollIndex = index + 1;
      }
    } else {
      this.scrollProp = 0;
      this.currentScrollIndex = index + 1;
    }
    this.currentIndex = index;

    return elementWidth;
  }
  getChildrenWidthByIndex(index) {
    const elements: any = document.getElementsByClassName('scroll-child');
    let elementWidth = 0;
    for (let i = 0; i <= index; i++) {
      elementWidth += elements[i].clientWidth;
    }
    return elementWidth;
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
  checkDivScrolledWidth() {
    const element: any = document.getElementsByClassName('scroll-div')[0];
    const scrolledWidth = Number(element.style.marginLeft.split('px')[0]);
    return scrolledWidth;
  }
  increaseQuantity(product, id, index) {
    if (
      (product.inventory_enabled &&
        this.productQuantity[product.product_id] <
        product.available_quantity) ||
      !product.inventory_enabled
    ) {
      const cartProductData = this.sessionService.getByKey(
        'app',
        'cartProduct'
      );
      this.googleAnalyticsEventsService.emitEvent(
        GoogleAnalyticsEvent.add_quantity,
        product.name,
        '',
        ''
      );
      //==========Check for max quantity 9999==========
      if (this.productQuantity[id] >= 9999) {
        return;
      }
      if (this.productQuantity[id].maximum_quantity > 0 ) {
        if (this.productQuantity[id] >  product.maximum_quantity) {
          return;
        }
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
      this.popup.showPopup(
        MessageType.ERROR,
        2000,
        this.languageStrings.selected_quantity_exceed_avail ||
        'The selected quantity exceeds quantity available in stock.'
        ,
        false
      );
    }
  }

  decreamentQuantity(id, index) {
    const cartProductData = this.sessionService.getByKey('app', 'cartProduct');
    const product = JSON.parse(JSON.stringify(this.productList))[0];
    this.googleAnalyticsEventsService.emitEvent(
      GoogleAnalyticsEvent.remove_quantity,
      product.name,
      '',
      ''
    );
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
    } else {
      this.popup.showPopup(
        MessageType.ERROR,
        2000,
        this.languageStrings.pls_remove_it_from_cart_as_msg ||
        'Please remove it from the cart as cart contains this item with different addons.'
        ,
        false
      );
    }
  }
  // product share box
  showProductPop(product){
    let data = {};
    data['marketplace_reference_id'] = this.formSetting.marketplace_reference_id;
    data['marketplace_user_id'] = this.formSetting.marketplace_user_id;
    data['product_ids_array'] = [product];
    data['user_id'] = this.sessionService.getString('user_id');
    if (this.sessionService.get('appData')) {
      data['vendor_id'] = this.sessionService.get('appData').vendor_details.vendor_id;
      data['access_token'] = this.sessionService.get('appData').vendor_details.app_access_token;
    }
    data['date_time'] = new Date().toISOString();
    this.catalogueService.getProduct(data).subscribe(
      response => {
        if(response.status == 200 && response.data && response.data.length == 1)
          this.productShareBox(response.data[0],'')
        else if(response.status == 200 && response.data && response.data.length == 0)
          this.showNotAvailable = true;
        else
          this.removeParams();
      },
      error => {
       console.error(error.message)
      })
  }
  productShareBox(product,index){
    this.productShareData = product;
    this.normalCopyLink = `${window.location.origin}/${this.sessionService.getString('language')}/store/${(this.restaurantInfo.storepage_slug || '-')}/${this.restaurantInfo.storefront_user_id}?prodname=${this.productShareData.product_id}`;
    if(product.parent_category_id)
      this.normalCopyLink += '&pordCat=' + product.parent_category_id;
    this.domainName = encodeURIComponent(this.normalCopyLink);
    this.mailingLink=`mailto:?subject=${product.name}&body=${this.domainName}`
    this.showProductShareBox = true;
    this.productPosition = index;
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
  //=========Input box blur function========
  onBlurInputFun(product, id, index, newQuant) {
    var newQuantity = Number(newQuant);
    const cartProductData = this.sessionService.getByKey('app', 'cartProduct');
    if (newQuantity == 0) {
      const productData = this.sessionService.getByKey('app', 'cart');
      cartProductData[id].quantity = 0;
      this.sessionService.setByKey('app', 'cartProduct', cartProductData);
      index = cartProductData[id].index;
      this.productBool[id] = 0;
      this.cartService.removeProduct(id, index);
    } else {
      this.productQuantity[product.product_id] = newQuantity;
      if (
        (product.inventory_enabled &&
          this.productQuantity[product.product_id] <
          product.available_quantity) ||
        !product.inventory_enabled
      ) {
        this.googleAnalyticsEventsService.emitEvent(
          GoogleAnalyticsEvent.add_quantity,
          product.name,
          '',
          ''
        );
        cartProductData[id].quantity = Number(this.productQuantity[id]);
        this.sessionService.setByKey('app', 'cartProduct', cartProductData);
        this.cartService.updateProductQuantity(id, this.productQuantity[id]);
        setTimeout(() => this.cartService.updateAddCartStatus(), 100);
      } else {
        this.popup.showPopup(
          MessageType.ERROR,
          2000,
          this.languageStrings.selected_quantity_exceed_avail ||
          'The selected quantity exceeds quantity available in stock.'
          ,
          false
        );
      }
    }
  }

  setProductInCart(data) {
   let productData = this.sessionService.getByKey('app', 'cart');
    if (productData && productData.length) {
      if (this.productBool[data.id]) {
        const customizedData = this.sessionService.getByKey('app', 'customize');
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
      this.googleAnalyticsEventsService.emitEvent(
        GoogleAnalyticsEvent.add_to_cart,
        this.sessionService.get('info').store_name,
        '',
        ''
      );
      productData = [];
      productData.push(data);
      this.setProductQuantityForCart(data, productData.length - 1);
    }
    this.sessionService.setByKey('app', 'cart', productData);
    this.cartService.updateStatus();
    /**
     * hardcode code for Hoifoods,as he is priority client
     * notify user when item added to cart
     */
    const config = this.sessionService.get('config');
    if (config && config.marketplace_user_id == 48956) {
      this.popup.showPopup(MessageType.SUCCESS, 2000,
        'Item added to cart'
        , false);
    }
    this.resetCustomizationObj();
  }
  setProductQuantityForCart(data, index) {
    let cartProductData = this.sessionService.getByKey('app', 'cartProduct');
    if (cartProductData) {
      if (cartProductData[data.id]) {
        cartProductData[data.id].quantity += data.quantity;
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
        const status = this.checkAvailableIndexOfCustomize(
          product,
          customizedData[product.id]
        );
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
  setDefaultProductQuantity() {
    const cartProductData = this.sessionService.getByKey('app', 'cartProduct');
    cartProductData
      ? (this.cartProductData = cartProductData)
      : (this.cartProductData = {});
  }
  trimString(string: string) {
    if (string.length > 98) {
      string = string.substring(0, 98) + '...';
    }
    return string;
  }
  checkUniq(product) {
    this.cartService.checkUniq(product);
  }

  /**
   * function to check selection for addons
   */

  checkForMinimumSelectionAddon() {
    let CustomizationOriginal = this.currentProduct.customization;
    let custObj;
    let success = true;
    for (let key in this.currentCustomizeObj) {
      custObj = CustomizationOriginal.filter(
        elem => elem.customize_id == key
      )[0];
      if (custObj.minimum_selection_required) {
        if (
          Object.keys(this.currentCustomizeObj[key]).length !=
          custObj.minimum_selection
        ) {
          let msg = this.languageStrings.exactly_option_should_be_selected ||
            'Exactly ___ options should be selected of  ___'
          ;
          msg = msg.replace('___', custObj.minimum_selection);
          msg = msg.replace('___', custObj.name);
          this.minSelectAddonError = msg;
          setTimeout(() => {
            this.minSelectAddonError = '';
          }, 2000);
          success = false;
        }
      }
      else if(this.addon_layout_type == 1 && custObj.is_check_box == 0){
        if(custObj.customize_options.find(el => el.is_default == 1) != undefined){
          if (
            Object.keys(this.currentCustomizeObj[key]).length !=
            custObj.minimum_selection
          ){
            let msg = this.languageStrings.pls_select_any_1
              'Please select any 1 ___'
            ;
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
    const copyProduct = JSON.parse(JSON.stringify(this.sideOrderProducts));
    const product = copyProduct[index];
    this.sideOrderProductData[product.product_id] = {};
    this.sideOrderProductData[product.product_id].quantity = product.minimum_quantity || 1 ;
    this.sideOrderProductData[product.product_id].amount = product.price;
    this.sideOrderProductData[product.product_id].minimum_quantity = product.minimum_quantity;
    this.sideOrderProductData[product.product_id].maximum_quantity = product.maximum_quantity;
    this.sideOrderProductData[product.product_id].name = product.name;
    this.sideOrderProductData[product.product_id].index = index;
    this.sideOrderProductBool[product.product_id] = true;
    this.updateSideOrderAmount();
  }

  increaseSideOrderQuantity(product, id, index) {
    if (
      (product.inventory_enabled &&
        this.sideOrderProductData[product.product_id].quantity <
        product.available_quantity) ||
      !product.inventory_enabled
    ) {
      if (this.sideOrderProductData[id].quantity) {
        this.sideOrderProductData[id].quantity++;
      } else {
        this.sideOrderProductData[id].quantity = 2;
      }
      this.updateSideOrderAmount();
    } else {
      this.popup.showPopup(
        MessageType.ERROR,
        2000,
        this.languageStrings.selected_quantity_exceed_avail ||
        'The selected quantity exceeds quantity available in stock.'
        ,
        false
      );
    }
  }

  //=========Input box blur function========
  onBlurSideOrderInputFun(product, id, index, newQuant) {
    var newQuantity = Number(newQuant);
    if (newQuantity == 0) {
      delete this.sideOrderProductBool[id];
      delete this.sideOrderProductData[id];
    } else {
      this.sideOrderProductData[product.product_id].quantity = newQuantity;
      if (
        (product.inventory_enabled &&
          this.sideOrderProductData[product.product_id].quantity <
          product.available_quantity) ||
        !product.inventory_enabled
      ) {
        this.sideOrderProductData[id].quantity = Number(
          this.sideOrderProductData[id].quantity
        );
      } else {
        this.popup.showPopup(
          MessageType.ERROR,
          2000,
          this.languageStrings.selected_quantity_exceed_avail ||
          'The selected quantity exceeds quantity available in stock.'
          ,
          false
        );
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

      const cartProducts = this.sessionService.getByKey('app', 'cartProduct');
      if (!this.sideOrderProductData[id].quantity) {
        if (cartProducts && cartProducts[id]) {
          this.productBool[id] = 0;
          cartProducts[id].quantity = 0;
          this.sessionService.setByKey('app', 'cartProduct', cartProducts);
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

    Object.keys(this.sideOrderProductData).forEach(key => {
      return (this.sideOrderTotalAmount +=
        this.sideOrderProductData[key].quantity *
        this.sideOrderProductData[key].amount);
    });
  }

  setDefaultSideOrderValue() {
    this.sideOrderProductData = {};
    this.sideOrderProductBool = {};
    const cartData = this.sessionService.getByKey('app', 'cart');
    if (cartData) {
      cartData.forEach(product => {
        let index = this.sideOrderProducts.findIndex(
          sideProduct => sideProduct.product_id == product.id
        );
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
      if (
        +this.sideOrderProductData[key].quantity <
        this.sideOrderProductData[key].minimum_quantity
      ) {
        let msg = this.languageStrings.quantity_less_than_min ||
          'Quantity of ___ is less than minimum quantity ___'
        ;
        msg = msg.replace('___', this.sideOrderProductData[key].name);
        msg = msg.replace(
          '___',
          this.sideOrderProductData[key].minimum_quantity
        );
        this.minSelectAddonError = msg;
        setTimeout(() => {
          this.minSelectAddonError = '';
        }, 2000);
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

  updateCartWithSideOrders() {
    for (let productId in this.sideOrderProductData) {
      const cartProductData = this.sessionService.getByKey(
        'app',
        'cartProduct'
      );
      if (cartProductData && cartProductData[productId]) {
        cartProductData[productId].quantity = Number(
          this.sideOrderProductData[productId].quantity
        );
        this.sessionService.setByKey('app', 'cartProduct', cartProductData);
        this.productQuantity[productId] = cartProductData[productId].quantity;
        this.cartService.updateProductQuantity(
          productId,
          this.productQuantity[productId]
        );
        setTimeout(() => this.cartService.updateAddCartStatus(), 100);
      } else {
        let index = this.sideOrderProductData[productId].index;
        let sideProductData = JSON.parse(
          JSON.stringify(this.sideOrderProducts[index])
        );
        sideProductData.quantity = this.sideOrderProductData[
          productId
        ].quantity;
        this.setProductContent(sideProductData, true);
        this.productBool[sideProductData.product_id] = true;
        this.getTotalAmount();
      }
    }
  }

  /**
   * listen emit event for showing multi images
   */
  showMultiImagesEvent(event) {
    this.showLightBox(event.data);
  }
  showMultiImages(product) {
    if((product.multi_image_url && product.multi_image_url.length > 0 || product.multi_video_url && product.multi_video_url.length > 0) && this.addon_layout_type != 1)
    this.showLightBox(product);
  }
  closePopup() {
    this.showProductTemplate = false;
  }
  hideMultiImageDialog() {
    this.openMultiImage = false;
    this.openVideoImage = false;
    this.showBackdrop = false;
    this.showFullDescription = false;
  }

  redirectToCustomOrder() {
    if (
      this.sessionService.get('appData') &&
      parseInt(this.sessionService.getString('reg_status')) === 1
    ) {
      this.googleAnalyticsEventsService.emitEvent(
        GoogleAnalyticsEvent.go_to_checkout,
        'Custom order checkout',
        '',
        ''
      );
      this.setNoProductStoreValue();
      this.messageService.noProductCustomOrder.next('no-product');
      this.router.navigate(['customCheckout']);
      // tslint:disable-next-line:radix
    } else if (
      this.sessionService.get('appData') &&
      parseInt(this.sessionService.getString('reg_status')) !== 1 &&
      !this.sessionService.get('appData').signup_template_data.length
    ) {
      this.googleAnalyticsEventsService.emitEvent(
        GoogleAnalyticsEvent.go_to_checkout,
        'Custom order checkout',
        '',
        ''
      );
      this.messageService.noProductCustomOrder.next('no-product');
      this.setNoProductStoreValue();
      this.router.navigate(['customCheckout']);
    } else {
      this.messageService.getLoginSignupLocation('From Checkout Button');
      $('#loginDialog').modal('show');
    }
  }

  setNoProductStoreValue() {
    let storeData: any = this.sessionService.get('stores')[0];
    let obj = {
      address: storeData.address || '',
      name: storeData.store_name || '',
      email: storeData.email || '',
      phone: storeData.phone || '',
      lat: storeData.latitude || '',
      lng: storeData.longitude || '',
      display_merchant_phone: this.formSetting.display_merchant_phone || 0,
      display_merchant_address: this.formSetting.display_merchant_address || 0
    };
    this.sessionService.setString('noProductStoreData', obj);
    this.sessionService.setString(
      'user_id',
      this.formSetting.marketplace_user_id
    );
  }
  moveToCustomOrder()
  {
       // tslint:disable-next-line:radix
       if(this.sessionService.get('noProductStoreData')) {
        this.sessionService.remove('noProductStoreData');
      }
      if (this.sessionService.get('appData') && parseInt(this.sessionService.getString('reg_status')) === 1) {
        this.toggle.emit();
        this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.go_to_checkout, 'Custom order checkout', '', '');
        this.router.navigate(['customCheckout'],{queryParams: {customFlow:true}});
        // tslint:disable-next-line:radix
      } else if (this.sessionService.get('appData') && parseInt(this.sessionService.getString('reg_status')) !== 1 &&
        !this.sessionService.get('appData').signup_template_data.length) {
        this.toggle.emit();
        this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.go_to_checkout, 'Custom order checkout', '', '');
        this.router.navigate(['customCheckout'],{queryParams: {customFlow:true}});
     } else {
        this.messageService.getLoginSignupLocation('From Checkout Button');
        $('#loginDialog').modal('show');
      }
  }
  /**
   * Reset customization object
   */
  resetCustomizationObj() {
    if (this.productListCopy && Array.isArray(this.productListCopy) && this.currentProduct && this.currentProduct.product_id) {
      const index = this.productListCopy.findIndex(el => el.product_id == this.currentProduct.product_id);
      if (index != -1) {
        this.productList[index] = this.productListCopy[index];
      }
    }

  }
  checkCustomizeIndex(customization, customizeData) {
    let status: any = -1;
    for (const custom in customizeData.data) {
      const customData = customizeData.data[custom];
      if (customData.length === customization.length) {
        let count = 0;
        if (customData.length == 0) {
          status = custom;
        } else {
          customData.forEach((element, index) => {
            customization.forEach(product => {
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
}
