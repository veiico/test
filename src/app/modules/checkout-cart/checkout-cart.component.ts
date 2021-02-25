import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  Output,
  OnDestroy
} from "@angular/core";
import * as moment from "moment";
import { takeWhile, distinctUntilChanged } from "rxjs/operators";
import { Subject, Subscription } from "rxjs";
import { PaymentService } from "../../components/payment/payment.service";
import { SessionService } from "../../services/session.service";
import { CheckOutService } from "../../components/checkout/checkout.service";
import { AppService } from "../../app.service";
import { PopupModalService } from "../popup/services/popup-modal.service";
import { CheckoutTemplateService } from "../checkout-template/services/checkout-template.service";
import { MessageService } from "../../services/message.service";
import { priceType, MessageType, ModalType } from "../../constants/constant";
import { AppCartService } from "../../components/catalogue/components/app-cart/app-cart.service";
import { PromoMode, PromotionOn, OnboardingBusinessType, BusinessType } from '../../enums/enum';
import { UtilityFunctions } from '../../classes/utility-functions.class';
import { CatalogueService } from '../../components/catalogue/catalogue.service';
import { ISubscription } from 'rxjs/Subscription';
import { Router, ActivatedRoute } from '@angular/router';
import { CheckoutTemplateType } from '../../enums/enum';
import { AppProductComponent } from '../../components/catalogue/components/app-product/app-product.component';
import { ProductTemplateService } from '../../components/product-template/services/product-template.service';
import { PopUpService } from '../popup/services/popup.service';
import { GoogleAnalyticsEventsService } from '../../services/google-analytics-events.service';
import { RestaurantsService } from '../../components/restaurants-new/restaurants-new.service';
import { ProductTimingService } from '../../components/product-timing/product-timing.service';
import { ConfirmationService } from '../jw-notifications/services/confirmation.service';

@Component({
  selector: "app-checkout-cart",
  templateUrl: "./checkout-cart.component.html",
  styleUrls: ["./checkout-cart.component.scss","../../components/catalogue/components/app-product/app-product.scss"]
})
export class CheckoutCartComponent extends AppProductComponent implements OnInit, OnDestroy {
  languageStrings: any={};
  dataFromCheckout: boolean;
  // global
  terminology: any = {};
  langJson;
  appConfig;
  currency: string;
  @Input("direction")
  direction: string;

  // cart data
  @Input("cartData")
  cartData: any = [];
  @Output("setNotes")
  setNotes: EventEmitter<string> = new EventEmitter<string>();
  @Output("returnFlow")
  returnFlow: EventEmitter<Event> = new EventEmitter<Event>();
  prevoiusQty: number;
  storeData: any = {};
  billData: any = {};
  totalCountDisplay: number;
  totalCount: number;
  private loader: Set<number> = new Set<number>();
  loaders = new Subject<any>();
  priceTypeConst = priceType;
  public showClearCartPopup: boolean = false;
  private is_scheduled: boolean = false;
  private job_pickup_datetime;

  //remove cart popup
  removeCartItemPopup: boolean = false;
  messageRemoveItem: string = "";
  selectedCartItemId: number;
  selectedCartItemIndex: number;
  selectedOperationMethod;

  private alive: boolean = true;
  notes: string;

  //delivery type
  selectedDeliveryMethod: number = 1;

  //BillBreakdown
  lat: number;
  lng: number;
  showBillDataShimmer: boolean;
  billBreakDownSubscription: Subscription;
  editAddon:any;
  editAddonIndex:any;
  business_type=BusinessType

  //checkout template
  checkoutTemplateAmount: number = 0;
  public onboardingBusinessType=OnboardingBusinessType;
  templateData: Array<any> = [];

  recurringData = {};
  public restaurantInfo;
  public sideOrderProducts;
  customOrderFlow: boolean;
  public showSideOrder: boolean = false;
  currentProduct: any;
  public oldSideOrders;

  isPlatformServer: boolean;
  bill_breakdown_address: string = '';
  subscription: ISubscription;
  allowBillbreakdownHit: boolean = true;
  constructor(
    public productTemplateService : ProductTemplateService,
    protected route: ActivatedRoute,
    protected router: Router,
    protected sessionService: SessionService,
    protected popup: PopUpService,
    protected cartService: AppCartService,
    public googleAnalyticsEventsService: GoogleAnalyticsEventsService,
    public messageService: MessageService,
    public appService: AppService,
    protected restaurantService: RestaurantsService,
    protected catalogueService: CatalogueService,
    protected productTimingService: ProductTimingService,
    public confirmationService : ConfirmationService,
    protected checkoutService: CheckOutService,
    protected popupModal: PopupModalService,
    protected checkoutTemplateService: CheckoutTemplateService,
    protected paymentService: PaymentService,
  ) {
    
    super(productTemplateService,route,router,sessionService,popup,cartService,googleAnalyticsEventsService,messageService,appService,restaurantService,catalogueService,productTimingService,confirmationService)
   
   }

  ngOnInit() {
    this.isPlatformServer = this.sessionService.isPlatformServer();
    this.showBillDataShimmer = this.isPlatformServer;
    this.selectedDeliveryMethod = +this.sessionService.getString(
      "deliveryMethod"
    ); // 1 delivery, 2 pickup
    this.subscribeToDeliveryAddress();
    this.subscribeToCheckoutTemplate();
    this.subscribeToRecurringDataChange();
    this.subscribeToDeliveryTypeChange();
    this.subscribeToCartDataChange();
    this.setFromSession();
    this.setStoreData();
    this.getBillBreakdown();
    this.subscribeMandatItem();
    this.subscription = this.cartService.productRemoved.subscribe(data => {
      if(!this.editAddon){
        this.getBillBreakdown();
      }
    });
    this.checkoutService.onUpdateTimeSlot.pipe(takeWhile(_ => this.alive)).subscribe(data => {
      if (data) {
      this.job_pickup_datetime = data;
      this.is_scheduled = true
      this.getBillBreakdown();
      }
    })

    if (this.sessionService.get('config').side_order && this.sessionService.get('config').onboarding_business_type !== 804) {
      this.showSideOrder = true;
      this.getSideOrders();
    } else {
      this.showSideOrder = false;
    }
    this.sessionService.langStringsPromise.then(() =>
    {
     this.languageStrings = this.sessionService.languageStrings;
     this.setLangKeys();
    });

  }
setLangKeys()
{
    this.languageStrings.your_cart_is_ready = (this.languageStrings.your_cart_is_ready || "your_cart_is_ready")
    .replace('CART_CART', this.terminology.CART);
    this.languageStrings.do_you_want_clear_your_cart =(this.languageStrings.do_you_want_clear_your_cart || "do_you_want_clear_your_cart")
    .replace('CART_CART', this.terminology.CART);
    this.languageStrings.side_order=(this.languageStrings.side_order || "side_order")
    .replace('ORDER_ORDER',this.terminology.ORDER)
}
  subscribeRemoveProduct() {
    this.cartService.removeProductEvent.pipe(takeWhile(_ => this.alive)).subscribe(data => {
      const cartProductData = this.sessionService.getByKey('app', 'cartProduct');
      this.sideOrderProducts = this.oldSideOrders.filter((sideOrder) => cartProductData[sideOrder.product_id] ? false : true);
    });
  }
  getCurrency(productList){
    this.currency = (this.sessionService.get('config').is_multi_currency_enabled && productList && productList[0] && productList[0].payment_settings) ? productList[0].payment_settings.symbol : this.sessionService.get('config')['payment_settings'][0].symbol;
  }
  getSideOrders() {
    if (this.sessionService.isPlatformServer()) return;

    const obj = {
      'user_id': this.sessionService.get('user_id').toString(),
      'limit': '0',
      'offset': '0',
      'marketplace_user_id': this.appConfig.marketplace_user_id.toString(),
      date_time: this.sessionService.getString('preOrderTime') || (new Date()).toISOString()
    };
    if (this.sessionService.get('appData')) {
      obj['vendor_id'] = this.sessionService.get('appData').vendor_details.vendor_id;
      obj['access_token'] = this.sessionService.get('appData').vendor_details.app_access_token;
    }
    this.checkoutService.getSideOrders(obj).subscribe(
      response => {

        if (response.status === 200) {
          this.oldSideOrders = response.data;
          const cartProductData = this.sessionService.getByKey('app', 'cartProduct');
          this.sideOrderProducts = this.oldSideOrders.filter((sideOrder) => cartProductData[sideOrder.product_id] ? false : true);
          if (response.data && response.data.length > 0) {
            this.subscribeRemoveProduct();
          }
        }
      }, error => {
        console.error(error);
      }
    );
  }



  private subscribeToDeliveryTypeChange() {
    this.messageService.sendDelivery
      .pipe(
        takeWhile(_ => this.alive),
        distinctUntilChanged()
      )
      .subscribe(message => {
        this.dataFromCheckout=true;
        this.selectedDeliveryMethod = message.type;
        this.getBillBreakdown();
      });
  }

  private subscribeToCartDataChange(){
    this.catalogueService.cartDataChange
    .subscribe(msg =>{
      if(msg){
        this.getBillBreakdown();
      }
    }
    )
  }
  private setFromSession() {
    this.appConfig = this.sessionService.get("config");
    const location = this.sessionService.get("location");
    this.lat = location.lat;
    this.lng = location.lng;
    this.bill_breakdown_address = location.city;
    this.terminology = this.appConfig.terminology || {};
    // ================language json manupilation======================
    this.appService.langPromise.then(() => {
      this.langJson = this.appService.getLangJsonData();
    });
    this.currency = this.appConfig.payment_settings[0].symbol;
    this.setRestaurentInfo();
  }

  private subscribeToDeliveryAddress() {
    this.checkoutService.newStatus
      .pipe(takeWhile(_ => this.alive))
      .subscribe(item => {
        if(item["job_pickup_latitude"]){
          this.lat = item["job_pickup_latitude"];
          this.lng = item["job_pickup_longitude"];
          this.bill_breakdown_address = item["customer_address"];
        }
        else{
           let location = this.sessionService.get("location") || {};
          this.lat = location.lat;
          this.lng = location.lng;
          this.bill_breakdown_address = location.city;
        }

        this.getBillBreakdown();
        this.setAmountData();
      });
  }

  private subscribeToCheckoutTemplate() {
    this.checkoutTemplateService.priceTemplateChange
      .pipe(
        takeWhile(_ => this.alive),
        distinctUntilChanged()
      )
      .subscribe(data => this.onCheckoutTemplateEvent(data));
  }

  private setStoreData() {
    this.getCurrency(this.cartData)
    const storeId = this.cartData.length ? this.cartData[0].user_id : null;
    if (storeId) {
      let stores: any = this.sessionService.get("stores");
      this.storeData =
        stores.find(f => f.storefront_user_id === this.cartData[0].user_id) ||
        {};
    }
    this.cartData.forEach((element, index) => {
      element["loader"] = false;
    });
    this.setAmountData();
  }

  setAmountData() {
    this.totalCount = 0;
    this.totalCountDisplay = 0;
    this.cartData.forEach(val => {
      if (val.unit_count) {
        this.totalCountDisplay += val.quantity * val.showPrice * val.unit_count;
        return (this.totalCount += val.quantity * val.showPrice);
      } else {
        this.totalCountDisplay += val.quantity * val.showPrice;
        return (this.totalCount += val.quantity * val.showPrice);
      }
    });
  }

  onReturnFlowSelect(e: Event) {
    this.returnFlow.emit(e);
  }

  onSetNotes() {
    this.setNotes.emit(this.notes);
  }

  // Function to calculate bill details
  getPaymentStatus() {
    const productData = this.sessionService.getByKey("app", "cart");
    const checkoutData = this.sessionService.getByKey("app", "checkout");
    this.customOrderFlow = this.sessionService.getString("customOrderFlow")
      ? Boolean(this.sessionService.getString("customOrderFlow"))
      : false;
    const data = {
      amount: this.totalCountDisplay,
      domain_name: this.sessionService.getString("domain"),
      dual_user_key: 0,
      language: "en",
      marketplace_reference_id: this.appConfig.marketplace_reference_id,
      marketplace_user_id: this.appConfig.marketplace_user_id,
      user_id: this.sessionService.get("user_id"),
    };
    if (this.sessionService.get('appData')) {
      data['vendor_id'] = this.sessionService.get('appData').vendor_details.vendor_id;
      data['access_token'] = this.sessionService.get('appData').vendor_details.app_access_token;
    }
    if (
      this.restaurantInfo.business_type === 2 &&
      this.restaurantInfo.pd_or_appointment === 2
    ) {
      data["job_pickup_datetime"] = moment().format(
        this.appConfig.date_format ? this.appConfig.date_format.toUpperCase() : 'YYYY-MM-DD' + "THH:mm:ss.SSS[Z]"
      );
      data["job_delivery_datetime"] = moment().format(
        this.appConfig.date_format ? this.appConfig.date_format.toUpperCase() : 'YYYY-MM-DD' + "THH:mm:ss.SSS[Z]"
      );
    } else if (checkoutData) {
      const cart = checkoutData.cart;
      data["job_pickup_datetime"] = cart.job_pickup_datetime;
      data["job_delivery_datetime"] = cart.job_delivery_datetime;
    }
    data["payment_method"] = this.checkWhichPaymentEnabled(); // checkoutData.payment_method;
    data["products"] = [];
    if (productData) {
      for (let i = 0; i < productData.length; i++) {
        data["amount"] += productData[i].showPrice * productData[i].quantity;
        data["products"].push({
          product_id: productData[i].id,
          unit_price: productData[i].price,
          quantity: productData[i].quantity,
          total_price: productData[i].price * productData[i].quantity,
          customizations: productData[i].customizations,
          return_enabled: productData[i].return_enabled
        });

        if (this.restaurantInfo.business_type === 2) {
          data["products"][i].start_time = productData[i].start_time;
          data["products"][i].end_time = productData[i].end_time;
        }
      }
    }
    this.paymentService.sendPaymentTask(data).subscribe(response => {

    });
  }

  private setRestaurentInfo() {
    if (this.appConfig.product_view === 1) {
      this.restaurantInfo = this.appConfig;
    }
    else if (this.customOrderFlow) {
      this.restaurantInfo = this.appConfig;
    }
    else {
      this.restaurantInfo = this.sessionService.get("info");
    }
  }

  checkWhichPaymentEnabled() {
    let method = this.sessionService.get("appData").formSettings;
    for (let i = 0; i < method[0].payment_methods.length; i++) {
      if (method[0].payment_methods[i].enabled) {
        return method[0].payment_methods[i].value;
      }
    }
  }

  private subscribeMandatItem(){
    this.checkoutService.allowApiHit.pipe(distinctUntilChanged()).subscribe(res => {
      if(res){
        this.allowBillbreakdownHit = true;
      }
      else {
        this.allowBillbreakdownHit = false;
      }
    });
  }

  getBillBreakdown() {
    if (this.sessionService.isPlatformServer()) return;
    const obj = this.createBillBreakdownJson();
    this.showBillDataShimmer = true;
    return new Promise((resolve, reject) => {
      if (this.billBreakDownSubscription) {
        this.billBreakDownSubscription.unsubscribe();
      }
if (!this.allowBillbreakdownHit) return;
      this.billBreakDownSubscription = this.checkoutService
        .getBillBreakdown(obj)
        .subscribe(
          response => {
            if(response.status==200){
              this.sessionService.set('paymentData', response.data);
            }
            if(response.status==202){
              this.checkoutService.mandatoryItems(response);
              this.sessionService.set('remainingMandatoryCategories', -1);
              this.loader.clear();
              this.showBillDataShimmer = false;
              this.loaders.next(this.loader);
              return;
            }
            if(response.status == 201) {
              this.loader.clear();
              this.loaders.next(this.loader);
              this.showBillDataShimmer = false;
              this.popupModal.showPopup("error", 2000, response.message, false);

              if(response.data.debt_amount > 0){
                  this.router.navigate(['/debtAmount']);
              }
              return;
            }
            this.sessionService.set('remainingMandatoryCategories', 1);
            this.checkoutService.mandatoryItems(false);
            this.billData = response.data;
            if (this.billData.DELIVERY_DISCOUNT && !isNaN(this.billData.DELIVERY_DISCOUNT)) {
              this.billData.DELIVERY_CHARGE_AFTER_DISCOUNT = +this.billData.DELIVERY_CHARGE - +this.billData.DELIVERY_DISCOUNT;
            }

            this.showBillDataShimmer = false;
            for (let i = 0; i < this.cartData.length; i++) {
              if (this.cartData[i].id === response.data.PRODUCTS[i].product_id) {
                this.cartData[i].tax = response.data.PRODUCTS[i].taxes;
              }
            }
            if (this.billData.BILL_BREAKUP && this.billData.BILL_BREAKUP.length) {
              this.billData.productTotalForService = this.billData.BILL_BREAKUP.reduce((acc, el) => (acc + (el.price * el.unit)), 0);
            }

            if (this.billData.APPLIED_PROMOS && this.billData.APPLIED_PROMOS.length) {
              const autoAppliedPromo = this.billData.APPLIED_PROMOS.filter(el => el.promo_mode === PromoMode.AUTO_APPLY);
              if (autoAppliedPromo && autoAppliedPromo.length) {
                const autoAppliedPromoGrouped = UtilityFunctions.groupBy(autoAppliedPromo, 'promo_on');
                this.billData.autoAppliedPromoOnDelivery = autoAppliedPromoGrouped[PromotionOn.DELIVERY_CHARGE] || [];
                this.billData.autoAppliedPromoOnSubtotal = autoAppliedPromoGrouped[PromotionOn.SUBTOTAL] || [];
              }
              if (this.billData.DISCOUNT && !isNaN(this.billData.DISCOUNT)) {
                this.billData.NET_PAYABLE_AMOUNT += this.billData.DISCOUNT;
              }
            }
            this.setBillData(this.billData);
            resolve(true);
          },
          error => {
            this.showBillDataShimmer = false;
            reject(error);
          }
        );
    });
  }

  setBillData(billData) {
    const paymentData = this.sessionService.getByKey("app", "payment") || {
      amount: 0
    };
    paymentData["bill"] = billData;
    this.sessionService.setByKey("app", "payment", paymentData);
  }

  private createBillBreakdownJson() {
    let obj: any = {
      access_token: this.sessionService.get("appData").vendor_details
        .app_access_token,
      amount: this.totalCountDisplay,
      domain_name: this.sessionService.getString("domain"),
      dual_user_key: 0,
      language: "en",
      latitude: this.lat,
      longitude: this.lng,
      job_pickup_datetime: moment().format(
        "YYYY-MM-DDTHH:mm:ss.SSS[Z]"
      ),
      customer_address: this.bill_breakdown_address,
      marketplace_reference_id: this.appConfig.marketplace_reference_id,
      marketplace_user_id: this.appConfig.marketplace_user_id,
      user_id: this.sessionService.get("user_id"),
      vendor_id: this.sessionService.get("appData").vendor_details.vendor_id,
      checkout_template: JSON.stringify(this.templateData),
      ...this.recurringData
    };
    if (this.is_scheduled) {
      obj.job_pickup_datetime = this.job_pickup_datetime;
      obj.is_scheduled = 1;
    }
    if(this.sessionService.get('pick_up_and_delivery').address){
      let address = this.sessionService.get('pick_up_and_delivery').address, lat =  this.sessionService.get('pick_up_and_delivery').lat,
          lng = this.sessionService.get('pick_up_and_delivery').lng;
      obj.custom_pickup_address = address ? address : undefined;
      obj.custom_pickup_latitude = lat ? lat : undefined;
      obj.custom_pickup_longitude = lng ? lng : undefined;
    }
    const productData = this.sessionService.getByKey("app", "cart");
   if (this.appConfig.business_model_type === "RENTAL") {
      obj.product_id = productData[0].id;
      obj.start_dateTime = productData[0].start_time;
      obj.end_dateTime = productData[0].end_time;
      obj.price_calculation = 1;
    }
    var method = this.sessionService.getString("deliveryMethod");
    if(this.dataFromCheckout)
    {
      if(this.selectedDeliveryMethod ==1)
      {
        this.sessionService.setString("deliveryMethod",1);
         method="1";
      }
      else if(this.selectedDeliveryMethod ==2)
      {
        this.sessionService.setString("deliveryMethod",2);
         method="2";
      }
      else
      {
        this.sessionService.setString("deliveryMethod",8);
          method="8";
      }
    }
    switch (Number(method)) {
      case 1:
        obj["home_delivery"] = 1;
        break;
      case 2:
        obj["self_pickup"] = 1;
        break;
      case 8:
        obj["pick_and_drop"] = 1;
        break;
    }

    obj["products"] = [];
    if (productData) {
      for (let i = 0; i < productData.length; i++) {
        // obj["amount"] += productData[i].showPrice * productData[i].quantity;
        obj["products"].push({
          product_id: productData[i].id,
          unit_price: productData[i].price,
          quantity: productData[i].quantity,
          total_price: productData[i].price * productData[i].quantity,
          customizations: productData[i].customizations,
          return_enabled: productData[i].return_enabled,
          template : productData[i].product_template,
        });
        if (this.restaurantInfo.business_type === 2) {
          obj["products"][i].start_time = productData[i].start_time;
          obj["products"][i].end_time = productData[i].end_time;
        }
      }
    }
    if(this.sessionService.get('editJobId')){
      obj['prev_job_id'] = this.sessionService.get('editJobId');
    }

    return obj;
  }

  async onQuantityChange(product) {

    this.loader.add(product.id);
    this.loaders.next(this.loader);
    this.setAmountData();

    await this.getBillBreakdown().catch(reject => {
      this.popupModal.showPopup(MessageType.ERROR, 2000, reject.message, false);
    });
    this.loader.clear();
    this.loaders.next(this.loader);
  }

  productsTrackBy(index: number, product: any) {
    return product.id;
  }

  private onCheckoutTemplateEvent(items: any[]) {
    this.templateData = this.checkoutTemplateService.createCheckoutTemplateJson(
      items
    );


    this.getBillBreakdown();
  }

  addProduct(productData) {
    let product = productData.product;
    let index = productData.index;
    const obj: any = {};
    obj.id = product.product_id;
    obj.quantity = (product.minimum_quantity || 1);
    obj.price = product.price;
    obj.showPrice = product.price;
    obj.available_quantity = product.available_quantity;
    obj.inventory_enabled = product.inventory_enabled;
    obj.name = product.name;
    obj.type = product.layout_data.buttons[0].type;
    obj.customizations = [];
    obj.totalPrice = (obj.price * obj.quantity);
    obj.unit = product.unit;
    obj.unit_type = product.unit_type;
    obj.image_url = product.image_url;
    obj.is_veg=product.is_veg;
    obj.unit_count = 0;
    obj.enable_tookan_agent = product.enable_tookan_agent;
    obj.is_agents_on_product_tags_enabled = product.is_agents_on_product_tags_enabled;
    obj.return_enabled = product.return_enabled;
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
    if(this.sessionService.get('config').is_multi_currency_enabled){
      obj.payment_settings = product.payment_settings
    }
    // this.selectedProduct[product.product_id] = obj;
    this.checkoutService.setProductInCart(obj);
    this.onQuantityChange(obj);
    // this.sideOrderProducts.splice(index,1);
    // this.showingSideOrders = this.sideOrderProducts.slice(0,3);
    // console.log(this.showingSideOrders);
  }


  ngOnDestroy() {
    this.alive = false;
    this.subscription.unsubscribe();
  }

  groupBy(xs, key) {
    return xs.reduce(function (rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  }

  subscribeToRecurringDataChange(){
    this.checkoutService.recurringTaskDataChange.pipe(takeWhile(_=> this.alive), distinctUntilChanged())
    .subscribe((data)=>{
      this.recurringData =  data;
      this.getBillBreakdown();

    })
  }

  clearCartData(){
    this.sessionService.remove('isReOrder');
    this.cartService.cartClearCall();
    this.showClearCartPopup = false;
    this.cartService.updateStatus();
    this.router.navigate(['list']);
  }
  returnCatalogue(){
    this.router.navigate([
      'store',
      this.restaurantInfo.storepage_slug || '-',
      this.restaurantInfo.storefront_user_id
    ]);
  }
  clearCart(){
    this.showClearCartPopup = true;
  }
  doNotClearCart(){
    this.showClearCartPopup = false;
  }
  editCustomization(data,index){
    this.editAddon = true;
    this.cartService.editAddon = true;
    this.editAddonIndex = index;
    data.customization = data.original_customization;
      const cartData = this.cartService.getProductQuantity();
      if (cartData && cartData[data.product_id]) {
        this.productQuantity[data.product_id] =
          cartData[data.product_id].quantity;
        this.productBool[data.product_id] = true;
      } else {
        this.productQuantity[data.product_id] = 0;
        this.productBool[data.product_id] = 0;
      }
    this.currentProduct = data;
    this.currentProduct.customization = this.currentProduct.original_customization;
    this.checkBusinessTypeBeforeAdding(data,-1);

  }
  resetDialog(){
    this.currentProduct = false;
    this.customizedObj = {};
    this.currentCustomizeObj = {};
  }
}
