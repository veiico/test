import { MessageType } from './../../constants/constant';
import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ChangeDetectorRef
} from "@angular/core";
import { CheckOutComponent } from "../checkout/checkout.component";
import {
  FormBuilder,
  Validators
} from "../../../../node_modules/@angular/forms";
import { DropDownListService } from "../dropdownlist/dropdownlist.service";
import { PopUpService } from "../../modules/popup/services/popup.service";
import { Router, ActivatedRoute } from "../../../../node_modules/@angular/router";
import { SessionService } from "../../services/session.service";
import { AppCartService } from "../catalogue/components/app-cart/app-cart.service";
import { CheckOutService } from "../checkout/checkout.service";
import { LoaderService } from "../../services/loader.service";
import { GoogleAnalyticsEventsService } from "../../services/google-analytics-events.service";
import { AppService } from "../../app.service";
import { BsLocaleService } from "../../../../node_modules/ngx-bootstrap/datepicker";
import { DateTimeAdapter } from "../../../../node_modules/ng-pick-datetime";
import { PaymentService } from "../payment/payment.service";
import { ProductDescriptionService } from "../../services/product-description.service";
import { MessageService } from "../../services/message.service";
import { FavLocationService } from "../fav-location/fav-location.service";
import { FBPixelService } from "../../services/fb-pixel.service";
import { CatalogueService } from '../catalogue/catalogue.service'
import * as moment from "moment";
import { OnboardingBusinessType, CheckoutTemplateType, PageType, PaymentByUsing } from "../../enums/enum";
import { trigger,
  transition,
  style,
  animate,
 } from '../../../../node_modules/@angular/animations';
import { takeWhile, distinctUntilChanged } from '../../../../node_modules/rxjs/operators';
import { CheckoutTemplateService } from '../../modules/checkout-template/services/checkout-template.service';
import { CheckoutTemplateComponent } from '../../modules/checkout-template/checkout-template.component';

declare var $: any;


@Component({
  selector: "app-custom-checkout",
  templateUrl: "./custom-checkout.component.html",
  styleUrls: ["./custom-checkout.component.scss", "../checkout/checkout.scss"],
  animations: [
    trigger("slideInOut", [
      transition(":enter", [
        style({ transform: "translateX(100%)", opacity: 0 }),
        animate(
          ".3s ease-out",
          style({ transform: "translateX(0)", opacity: 1 })
        )
      ]),
      transition(":leave", [
        style({ transform: "translateX(0)", opacity: 1 }),
        animate(
          ".3s ease-out",
          style({ transform: "translateX(100%)", opacity: 0 })
        )
      ])
    ])
  ]
})
export class CustomCheckoutComponent extends CheckOutComponent
  implements OnInit, OnDestroy {
  public mapInitCheck: boolean;
  pickupOption = 1;
  appConfig: any = {};
  customQuotationOrderDetails: any = {};
  isLaundryFlow: boolean;
  laudaryFlowSlots = {
    pickup_start_time: '',
    pickup_end_time: '',
    delivery_start_time: '',
    delivery_end_time: ''
  };
  customOrderActivePage: any;
  showCheckoutTemplate: boolean;
  alive = true;
  templateData: any[];
  checkoutTemplateType = CheckoutTemplateType;
  public PaymentByUsing=PaymentByUsing;
  @ViewChild('checkoutTemplate') checkoutTemplate: CheckoutTemplateComponent;
  laundryPickupAddress: any;
  pickupDeliveryLaundryEqual: boolean;
  showCustomerVerificationPopUp : boolean;
  checkoutStaticTerm: any;
  storeCustomOrder: boolean=true;
  confirmCheckoutLocationPopup: boolean;
  constructor(
    fb: FormBuilder,
    protected dropDownService: DropDownListService,
    protected popup: PopUpService,
    protected router: Router,
    protected sessionService: SessionService,
    protected cartService: AppCartService,
    protected checkOutService: CheckOutService,
    protected loader: LoaderService,
    public googleAnalyticsEventsService: GoogleAnalyticsEventsService,
    public appService: AppService,
    protected localeService: BsLocaleService,
    protected dateTimeAdapter: DateTimeAdapter<any>,
    protected paymentService: PaymentService,
    protected messageService: MessageService,
    protected favLocationService: FavLocationService,
    protected fbPixelService: FBPixelService,
    protected productDescService: ProductDescriptionService,
    protected checkoutTemplateService: CheckoutTemplateService,
    protected cd: ChangeDetectorRef,
    protected activatedRoute: ActivatedRoute,
    public catalogueService: CatalogueService
  ) {
    super(
      fb,
      dropDownService,
      popup,
      router,
      sessionService,
      cartService,
      checkOutService,
      loader,
      googleAnalyticsEventsService,
      appService,
      localeService,
      dateTimeAdapter,
      paymentService,
      messageService,
      favLocationService,
      fbPixelService,
      productDescService,
      checkoutTemplateService,
      catalogueService
    );
  }

  ngOnInit() {
  
    if (!this.sessionService.isPlatformServer()) {
      setTimeout(() => {
        if (document.getElementsByClassName("checkout_card") && document.getElementsByClassName("checkout_card")[0]) {
          document.getElementsByClassName("checkout_card")[0].scrollIntoView({
            behavior: "smooth",
            block: "center"
          });
        }
      }, 0);
    }
   
    this.activatedRoute.queryParams.subscribe(
      (data) => {
          if(data.customFlow)
          {
       this.storeCustomOrder=false;
        }
        else{
          this.storeCustomOrder=true;
        }
      });
    if (this.sessionService.get('mapView') == true) {
      this.mapInitCheck = true;
    } else {
      this.mapInitCheck = false;
    }
    if (!this.sessionService.isPlatformServer()) {
      this.sessionService.removeByChildKey("app", "checkout_template");
    }
    this.appService.langPromise.then(() => {
    this.langJson = this.appService.getLangJsonData();
  
    });
    
    const cartData = this.cartService.getCartData();
    if (cartData && cartData.length) {
      this.cartService.cartClearCall();
    }
    this.sessionService.setString("customOrderFlow", true);
    this.headerData = this.sessionService.get("config");
    this.checkoutForm.controls.notes.setValidators(Validators.required);
    this.appConfig = this.sessionService.get("config");
    this.isLaundryFlow = this.appConfig.onboarding_business_type === OnboardingBusinessType.LAUNDRY;
    this.customOrderActivePage = this.appConfig.custom_order_page;
    this.sessionService.remove('orderType');
    this.isCheckoutEnabled();
    this.subscribeToCheckoutTemplate();
    this.sessionService.langStringsPromise.then(() =>
    {
     this.languageStrings = this.sessionService.languageStrings;
     this.languageStrings.your_order_details = (this.languageStrings.your_order_details || 'Your Orders Detail')
     .replace(
       'ORDER_ORDER',
       this.appConfig.terminology.ORDER ? this.appConfig.terminology.ORDER : 'ORDER'
     );
    });
  }
  ngOnDestroy() {
    this.alive=false;
    if (document.getElementById("iframe_fuguWidget")) {
      (<any>window).fuguWidget_Collapse();
      document.getElementById("iframe_fuguWidget").style.visibility = "visible";
      document.getElementById("iframe_fuguWidgetContent").className = "";
    }
  }

  onPickupOptionChange(e) {
    this.pickupOption = Number(e);
  }

  getValueForPickUpAndDelivery(formValue) {
    let apiObj, pickUpData, deliveryData;
    const defaultData = this.getDefaultApiValue(formValue);
    if (this.pickupOption === 2) {
      pickUpData = this.pickUpComponent.getValueForPickUp(); 
    }
    if(!this.pickupDeliveryLaundryEqual){
      deliveryData = this.deliveryAddressComponent.getValueForDelivery(false);
    }
    if (this.pickupOption === 2 && !pickUpData) {
      this.popup.showPopup(
        MessageType.ERROR,
        2500,
        this.languageStrings.please_fill_up_pickup_details || "Please fill up pickup details",
        false
      );
    } else if (!deliveryData && !this.pickupDeliveryLaundryEqual) {
      this.languageStrings.please_fill_up_delivery_details  = (this.languageStrings.please_fill_up_delivery_details || "Please fill up pickup details")
      .replace("DELIVERY_DELIVERY", this.terminology.DELIVERY);
      const msg = this.languageStrings.please_fill_up_delivery_details;
      this.popup.showPopup(MessageType.ERROR, 2500, msg, false);
    } else {
      if (this.pickupOption === 2) {
        apiObj = Object.assign({}, defaultData, pickUpData, deliveryData);
      } else {
        apiObj = Object.assign({}, defaultData, deliveryData);
      }
    }
    if (this.pickupOption === 1) {
      apiObj.is_pickup_anywhere = 1;
    }
    if(!this.storeCustomOrder){
      apiObj.is_pickup_anywhere = 0;
    }
    if(!this.storeCustomOrder && this.sessionService.get('info')){
      apiObj['job_pickup_latitude'] = this.sessionService.get('info').latitude;
      apiObj['job_pickup_longitude'] = this.sessionService.get('info').longitude;
    }
    if(this.isLaundryFlow){
      apiObj['customer_pickup_latitude'] = this.laundryPickupAddress.latitude;
      apiObj['customer_pickup_longitude'] = this.laundryPickupAddress.longitude;
      apiObj['customer_pickup_address'] =  this.laundryPickupAddress.address;
      if(this.pickupDeliveryLaundryEqual){
        apiObj['latitude'] = this.laundryPickupAddress.latitude;
        apiObj['longitude'] = this.laundryPickupAddress.longitude;
        apiObj['customer_address'] =  this.laundryPickupAddress.address;
      }
    }
    return apiObj;
  }

  getValueForApi() {
    const formValue = this.checkoutForm.value;
    let obj;
    obj = this.getValueForPickUpAndDelivery(formValue);
    return obj;
  }

  triggerHippoOrderBot(payload) {
    this.loader.show();
    let order: any = {
      AppIP: this.sessionService.getString("ip_address"),
      checkout_template:
        this.sessionService.getByKey("app", "checkout_template") || [],
      custom_field_template: "",
      customer_address: payload.customer_address,
      // domain_name: window.location.origin,
      dual_user_key: 0,
      has_delivery: payload.has_delivery,
      home_delivery: 1,
      is_custom_order: 2,
      is_pickup_anywhere: payload.is_pickup_anywhere || 0,
      is_scheduled: payload.is_scheduled || 0,
      job_description: payload.job_description,
      language: this.sessionService.getString("language"),
      latitude: payload.latitude,
      longitude: payload.longitude,
      marketplace_reference_id: this.headerData.marketplace_reference_id,
      marketplace_user_id: this.headerData.marketplace_user_id,
      payment_method: 700,
      return_enabled: 0,
      fac_payment_flow:PaymentByUsing.USING_FAC,
      timezone: new Date().getTimezoneOffset(),
      tip: 0,
      user_id: this.storeCustomOrder ? this.sessionService.get("config").marketplace_user_id : this.sessionService.getString("user_id"),
      // vendor_id: this.sessionService.get("appData").vendor_details.vendor_id,
      vertical: this.sessionService.get("appData").formSettings[0].vertical,
      job_delivery_datetime: moment().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
      job_pickup_datetime: new Date(),
      custom_quotation_enabled: 1
    };
    if (this.sessionService.get('appData')) {
      order['vendor_id'] = this.sessionService.get('appData').vendor_details.vendor_id;
      order['access_token'] = this.sessionService.get('appData').vendor_details.app_access_token;
      order['customer_email'] = this.sessionService.get("appData").vendor_details.email;
      order['customer_phone'] = this.sessionService.get("appData").vendor_details.phone_no;
      order['customer_username'] = this.sessionService.get("appData").vendor_details.first_name;
      order['currency_id'] = this.sessionService.get("appData").formSettings[0].payment_settings[0].currency_id;
    }
    if(this.sessionService.get('config').is_multi_currency_enabled && !this.storeCustomOrder && this.sessionService.get('info') && this.sessionService.get('info').payment_settings ) {
      order['currency_id'] = this.sessionService.get('info').payment_settings.currency_id;
    }

    if(this.isLaundryFlow){
      order['customer_pickup_latitude'] = this.laundryPickupAddress.latitude
      order['customer_pickup_longitude'] = this.laundryPickupAddress.longitude
      order['customer_pickup_address'] =  this.laundryPickupAddress.address
      if(this.pickupDeliveryLaundryEqual){
        order['latitude'] = this.laundryPickupAddress.latitude
        order['longitude'] = this.laundryPickupAddress.longitude
        order['customer_address'] =  this.laundryPickupAddress.address
      }
    }

    order.job_pickup_datetime.setTime(
      order.job_pickup_datetime.getTime() +
        -1 * new Date().getTimezoneOffset() * 60 * 1000
    );
    order.job_pickup_datetime.toISOString();
    if (this.isLaundryFlow) {
      order.job_pickup_datetime = payload.job_pickup_datetime;
      order.job_delivery_datetime = payload.job_delivery_datetime;
    }
    this.sessionService.remove('mapView');
    order = Object.assign({}, payload, order);

    this.paymentService.createTask(order).subscribe(response => {
      this.loader.hide();
      if(response.status == 200) {
        if(response.data.mapped_pages){
          let thankYouPageHtml = response.data.mapped_pages.find(el => el.type == PageType.THANKYOU);
          thankYouPageHtml = thankYouPageHtml ? thankYouPageHtml.template_data : undefined;
          this.sessionService.thankYouPageHtml = thankYouPageHtml;         
          this.sessionService.set('OrderPlacedPage',thankYouPageHtml ? 1: 0);
        }
        (<any>window).startConversation({
          tags: ["YELO_CUSTOM_ORDER"],
          transaction_id: response.data.job_id,
          user_id: this.sessionService.get("appData").vendor_details.vendor_id
        });
        order.order_id = response.data.job_id;
        this.customQuotationOrderDetails = { ...order };
  
        document.getElementById("iframe_fuguWidget").style.visibility = "visible";
        document.getElementById("iframe_fuguWidgetContent").className =
          "fugu-chat-inline";
  
          this.clearCartForQuotation();
      } else {
        this.popup.showPopup('error', 3000, response.message, false);
        setTimeout(() => {
          if(response.data.debt_amount > 0){
            this.router.navigate(['/debtAmount']);
        }
        }, 3000);
      }
   
    });
  }

  onPopUpClose() {
    this.showCustomerVerificationPopUp = false;
    this.router.navigate(['profile']);
  }

  confirmAddress(){
    if (this.checkoutForm.controls.notes.invalid) {
      this.popup.showPopup(
        MessageType.ERROR,
        2000,
        this.languageStrings.please_specify_description || "Please specify description",
        false
      );
      return;
    }

    if (this.checkoutTemplate) {
      if (!this.checkoutTemplate.validateFields()) { return; }
    }

    if (!this.sessionService.get("appData")) {
      this.messageService.getLoginSignupLocation('From Checkout Button');
      $("#loginDialog").modal("show");
    } else {
      if( ( this.sessionService.get('config').is_customer_verification_required ===  1 ) && ( this.sessionService.get('appData').vendor_details.is_vendor_verified !== 1 ) ) {
        this.showCustomerVerificationPopUp = true;
        return;
      }  
      if (this.selectedAddress === null && !this.pickupDeliveryLaundryEqual) {
        this.popup.showPopup(
          MessageType.ERROR,
          2000,
          this.languageStrings.please_select_delivery_address || "Please select a Delivery Address",
          false
        );
        return;
      }

      if(this.isLaundryFlow && !this.laundryPickupAddress){
        this.popup.showPopup(MessageType.ERROR, 2000, this.languageStrings.please_select_pickup_address || "Please select a Pickup Address" , false);
        return;
      }
      if (this.isLaundryFlow && (!this.laudaryFlowSlots.pickup_start_time || !this.laudaryFlowSlots.delivery_start_time)) {
        this.popup.showPopup(MessageType.ERROR, 2000, this.languageStrings.please_select_timeslots || "Please select Timeslots", false);
        return;
      }
    }
    if(this.selectedAddress && this.config.is_show_delivery_popup){
      this.confirmCheckoutLocationPopup = true;
    }else{
      this.onSubmit();
    }
  }
  closeCheckoutLocationPopup(){
    this.confirmCheckoutLocationPopup = false;
    this.checkOutService.changeAddress.next(true);
    this.onAddressSelect(null);
    const addressDiv = document.getElementsByClassName('checkout_card');
    if(addressDiv && addressDiv[0]){
      addressDiv[0].scrollIntoView({behavior: "smooth", block: "end"});
    }
  }
  onSubmit(): void {
      const payload = this.getValueForApi();
      if (payload) {
        const chekoutData = {};
        payload.return_enabled = 0;
        chekoutData["cart"] = payload;
        payload.is_scheduled = 0;
        if (this.isLaundryFlow) {
          chekoutData['cart']['job_pickup_datetime'] = this.laudaryFlowSlots.pickup_start_time;
          chekoutData['cart']['job_delivery_datetime'] = this.laudaryFlowSlots.delivery_start_time;
          chekoutData['cart']['is_scheduled'] = 1;
          chekoutData['customer_pickup_latitude'] = this.laundryPickupAddress.latitude;
          chekoutData['customer_pickup_longitude'] = this.laundryPickupAddress.longitude;
          chekoutData['customer_pickup_address'] =  this.laundryPickupAddress.address;
          if(this.pickupDeliveryLaundryEqual){
            chekoutData['latitude'] = this.laundryPickupAddress.latitude;
            chekoutData['longitude'] = this.laundryPickupAddress.longitude;
            chekoutData['customer_address'] =  this.laundryPickupAddress.address;
          }
          payload['job_pickup_datetime'] = this.laudaryFlowSlots.pickup_start_time;
          payload['job_delivery_datetime'] = this.laudaryFlowSlots.delivery_start_time;
          payload['is_scheduled'] = 1;
        }
        if (!this.sessionService.getString("user_id")) {
          this.sessionService.setString('user_id', this.sessionService.get("config").user_id);
        }
        this.sessionService.setByKey("app", "checkout", chekoutData);
        this.sessionService.setByKey("app", "payment", {});
        this.sessionService.setByKey("app", "checkout_template", this.templateData);
        this.checkAllPayment = false;
        if (this.sessionService.get("config").custom_quotation_enabled && !this.sessionService.get("config").is_hold_amount_active && this.storeCustomOrder) {
          this.triggerHippoOrderBot(payload);
          let thankYouPageEnabled = this.sessionService.thankYouPageHtml? 1 : 0;
          this.sessionService.set('OrderPlacedPage',thankYouPageEnabled );
          this.confirmCheckoutLocationPopup = false;
          return;
        }
        if(!this.storeCustomOrder)
        {
          this.router.navigate(["payment"], { queryParams: { redir_source: 'NEW_CUSTOM',vendor_id: this.sessionService.get('appData').vendor_details.vendor_id} });
        }
        else
        {        this.router.navigate(["payment"], { queryParams: { redir_source: 'NEW_CUSTOM' } });
      }
        return;
      }
  }

  /**
   * get timeslots data from laundry scheduling component
   * @param data timeslot data
   */
  getLaundryTimeslots(data: any) {
    let pickup_start_time: string;
    let pickup_end_time: string;
    let delivery_start_time: string;
    let delivery_end_time: string;
    data.forEach((element: any) => {
      if (element.type === 'pickup') {
        pickup_start_time = element.start_time;
        pickup_end_time = element.end_time;
      } else {
        delivery_start_time = element.start_time;
        delivery_end_time = element.end_time;
      }
      this.laudaryFlowSlots.pickup_start_time = pickup_start_time;
      this.laudaryFlowSlots.pickup_end_time = pickup_end_time;
      this.laudaryFlowSlots.delivery_start_time = delivery_start_time;
      this.laudaryFlowSlots.delivery_end_time = delivery_end_time;
    });
  }


  clearCartForQuotation() {
    this.sessionService.removeByChildKey('app', 'cart');
    this.sessionService.removeByChildKey('app', 'checkout');
    this.sessionService.removeByChildKey('app', 'payment');
    this.sessionService.remove("customOrderFlow");
    this.sessionService.remove('noProductStoreData');

  }

  /**
   * go to static page
   */
  goToPages(route) {
      this.router.navigate(['/page', route]);
  }

  // checkout template
  protected isCheckoutEnabled() {
    this.checkOutService.isCheckoutTemplateEnabled(CheckoutTemplateType.CUSTOM_ORDER)
      .subscribe(response => {
        if (response.status === 200) {
          this.showCheckoutTemplate = !!response.data.is_checkout_template_enabled;
        } else {
          this.showCheckoutTemplate = false;
        }
      }, error => {
        this.showCheckoutTemplate = false;
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

  private onCheckoutTemplateEvent(items: any[]) {
    this.templateData = this.checkoutTemplateService.createCheckoutTemplateJson(
      items
    );
    // this.calculateAdditionalCharge();

    // this.getBillBreakdown();
  }

  /**
   * save pickup laundry address
   * @param event
   */
  onlaundryPickupAddressSelect(event){
    this.laundryPickupAddress = event;
  }

  /**
   * make pickup and delivery equal for laundry
   */
  markLaundryDeliverAsPickupEvent(event) {
    this.pickupDeliveryLaundryEqual = event;
  }
}
