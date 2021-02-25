import { Component, Input, ViewChild, OnInit, OnDestroy, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { BsDatepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { DateTimeAdapter } from 'ng-pick-datetime';
import * as moment from 'moment';
import { Subject, Observable } from 'rxjs';

import { PickUpComponent } from './components/pickup/pickup.component';
import { DeliveryComponent } from './components/delivery/delivery.component';
import { AppointmentComponent } from './components/appointment/appointment.component';
import { AppDeliveryAddressComponent } from './components/delivery-address/delivery-address.component';
import { ValidationService } from '../../services/validation.service';

import { CheckOutService } from './checkout.service';
import { AppCartService } from '../catalogue/components/app-cart/app-cart.service';
import { CartModel } from '../catalogue/components/app-cart/app-cart.model';
import { SessionService } from '../../services/session.service';
import { appString } from '../../services/appstring';
import { PopUpService } from '../../modules/popup/services/popup.service';
import { DropDownListService } from '../dropdownlist/dropdownlist.service';
import { LoaderService } from '../../services/loader.service';
import { GoogleAnalyticsEventsService } from '../../services/google-analytics-events.service';
import { AppService } from '../../app.service';
import { PaymentService } from '../payment/payment.service';
import { MessageService } from '../../services/message.service';
import { ProductDescriptionService } from '../../services/product-description.service';
import { GoogleAnalyticsEvent, CheckoutTemplateType, BusinessType, TaskType, PageType, OnboardingBusinessType } from '../../enums/enum';
import { trigger, transition, style, animate } from '@angular/animations';
import { AppStaticAddress } from './components/static-address/static-address.component';
import { distinctUntilChanged, takeWhile } from 'rxjs/operators';
import { CheckoutTemplateComponent } from '../../modules/checkout-template/checkout-template.component';
import { fadeInOutDOM } from '../../animations/fadeInOut.animation';
import { FavLocationService } from '../fav-location/fav-location.service';
import { FBPixelService } from '../../services/fb-pixel.service';
import { defineLocale } from 'ngx-bootstrap';
import * as de from 'ngx-bootstrap/locale';
import { TimeFormat } from "../../enums/enum";
import { MessageType, OrderType, ModalType } from '../../constants/constant';
import { RecurringTasksComponent } from './components/recurring-tasks/recurring-tasks.component';
import { DecimalConfigPipe } from '../../pipes/decimalConfig.pipe';
import { CheckoutTemplateService } from '../../modules/checkout-template/services/checkout-template.service';
import { IProdultListPageData } from '../../themes-custom/interfaces/interface';
import { CatalogueService } from '../catalogue/catalogue.service'
declare var $: any;
// import { defineLocale } from 'ngx-bootstrap/chronos';
// import { arLocale, esUsLocale, frLocale } from 'ngx-bootstrap/locale';

export interface WorkFlowAddressModel {
  pickUpLatitude?: number;
  pickUpLongitude?: number;
  pickUpAddress?: string;
  deliveryLatitude?: number;
  deliveryLongitude?: number;
  deliveryAddress?: string;
}

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.html',
  styleUrls: ['./checkout.scss'],
  animations: [
    trigger(
      'slideInOut',
      [
        transition(
          ':enter', [
            style({ transform: 'translateX(100%)', opacity: 0 }),
            animate('.3s ease-out', style({ transform: 'translateX(0)', 'opacity': 1 }))
          ]
        ),
        transition(
          ':leave', [
            style({ transform: 'translateX(0)', 'opacity': 1 }),
            animate('.3s ease-out', style({ transform: 'translateX(100%)', 'opacity': 0 }))
          ]
        )]
    ),
    trigger('slideTopBottom', [
      transition(':enter', [
        style({transform: 'translateY(0)', opacity: 0}),
        animate('300ms', style({transform: 'translateY(0)', opacity: 1}))
      ]),
      transition(':leave', [
        style({transform: 'translateY(0)', opacity: 1}),
      ])
    ]),
    fadeInOutDOM
  ]
})

export class CheckOutComponent implements OnInit, OnDestroy, AfterViewInit {
  currency: any;
  @ViewChild('appPickup') pickUpComponent: PickUpComponent;
  @ViewChild('checkoutTemplate') checkoutTemplate: CheckoutTemplateComponent;
  @ViewChild('appDelivery') deliveryComponent: DeliveryComponent;
  @ViewChild('appDeliveryAddress') deliveryAddressComponent: AppDeliveryAddressComponent;
  @ViewChild('appStaticDeliveryAddress') staticDeliveryAddress: AppStaticAddress;
  @ViewChild('recurringTasksComponent') recurringTasksComponent: RecurringTasksComponent;
  @ViewChild(AppointmentComponent)
  @Input('cardInfo') cardInfo;
  decimalPipe = new DecimalConfigPipe(this.sessionService);
  stars: number[] = [1, 2, 3, 4, 5];
  readOnly: boolean = true;
  protected appointmentComponent: AppointmentComponent;
  protected hasDestroy: boolean;
  public addBtnTxt = 'Add';
  public removeBtnTxt = 'Remove';
  public appConfig: any = {
    color: ''
  };
  protected workflowObj: WorkFlowAddressModel = {};
  public ecomView;
  is_google_map: boolean;
  public items: any[] = [];
  public activeItem: any = [];
  protected qpickupTime: any;
  protected userBillPlan: any;
  protected storeUnsubscribe: any;
  protected cartSubscriber: any;
  protected routeSubsriber: any;
  protected checkoutSubscriber: any;
  public cartData: any = [];
  public checkoutForm: FormGroup;
  protected submitted = false;
  protected pickUpCountryCode: AbstractControl;
  protected deliveryCountryCode: AbstractControl;
  protected pickUpDateAndTime: Date;
  protected deliveryDateAndTime: Date;
  protected childStatus;
  protected totalCount: number;
  protected pre_booking_buffer = 0;
  public totalCountDisplay: number;
  public dialogStatus = false;
  public message: string;
  public actionBool: boolean;
  protected formSettings: any;
  protected todayTime: Date;
  protected momentValue;
  public pickUpOrDeliveryBool: number;
  protected pickUpAndDeliveryBool: number;
  workflowBool: number;
  public custmPickupForm: FormGroup;
  public selectedPickupAndDeliverySection = {};
  protected cartbool: boolean;
  public restaurantInfo: any;
  public daterange: any = {};
  public confirmCheckoutLocationPopup: boolean = false;
  modalType = ModalType;
  public options: any = {
    singleDatePicker: true,
    opens: 'right',
    timePicker: true,
    minDate: new Date(),
    locale: {
      'format': 'DD MMM YYYY,  hh:mm a',
    }
  };
  public minDate: Date = new Date();
  public maxDate: Date;
  public maxStartDate: Date;
  public maxEndDate: Date;
  public bsValue: Date = new Date();
  public bsStartValue: Date = new Date();
  public bsEndValue: Date = new Date();
  public scheduleRadio: Boolean = true;
  public time;
  public endTime;
  public startTime;
  public pickupAndDeliverySection = {
    lng: "",
    lat: "",
    address: "",
  };
  country_code;
  public agentTime;
  config: any = {};
  public agentDate;
  public openSlots = false;
  public openEndSlots = false;
  public openStartSlots = false;
  public colorTheme = 'theme-dynamic';
  public bsConfig;
  public domain;
  public slots = {
    morning: new Set(),
    afternoon: new Set(),
    evening: new Set()
  };
  public startSlots = {
    morning: new Set(),
    afternoon: new Set(),
    evening: new Set()
  };
  public agentStartSlots = {
    morning: new Set(),
    afternoon: new Set(),
    evening: new Set()
  };
  public agentEndSlots = {
    morning: new Set(),
    afternoon: new Set(),
    evening: new Set()
  };
  public tFormat;
  public tStartFormat;
  public tEndFormat;
  public terminology: any = {};
  public checkoutBackData;
  public langJson: any;
  slotDataAgent: any;
  slotData: any;
  public languageSelected: any;
  public checkAllPayment = false;
  public deliveryMode = false;
  public deliveryMethod;
  public businessModal;
  public direction = 'ltr';

  public headerData;
  isReturnFlow = false;

  /* add Address */
  public showAddAddress = false;
  public selectedAddress = null;
  public editAddress: boolean = false;
  public editValues: any;
  public fetchAddressNotify = new Subject<any>();
  public staticAddress: boolean = false;
  public staticAddressList: any;
  public deliveryModeNumber: number;


  public suggestion: string;
  public selectedCartItemIndex;
  public selectedCartItemId;
  public removeCartItemPopup = false;
  public messageRemoveItem = '';
  public prevoiusQty;
  public selectedOperationMethod;

  public preOrderTime: any;
  public disableSchedulingInput: boolean;

  // checkout template
  showCheckoutTemplate: boolean;
  hideScheduling: boolean;
  public morning = [];
  public afternoon = [];
  public evening = [];
  checkoutTemplateType = CheckoutTemplateType;

  //enums for html
  businessTypeEnum = BusinessType;
  taskTypeEnum = TaskType;
  timeFormat = TimeFormat;
  minimumOrder: any;
  store: any;
  alive = true;
  public orderType = OrderType.INSTANT_ORDER;
  public recurringEnabled = false;
  dayLimit: any;
  showAgentList: boolean;
  selectedAgent: any;
  agentList = [];
  selectedAgentIndex: any;
  isLalamoveActive: boolean;
  showTemplatePopup: boolean;
  languageStrings: any={};
  oftenBoughtModal: boolean;
  productList: any = [];
  hideCategory = false;
  searchOn: any;
  public productShimmer: boolean = true;
  public checkCartData = [];
  product_layout_type: number = 2;
  product_has_images: number = 1;
  oftenBoughtArray: any = [];
  constructor(fb: FormBuilder, protected dropDownService: DropDownListService,
    protected popup: PopUpService, protected router: Router,
    protected sessionService: SessionService, protected cartService: AppCartService,
    protected checkOutService: CheckOutService, protected loader: LoaderService,
    public googleAnalyticsEventsService: GoogleAnalyticsEventsService, public appService: AppService,
    protected localeService: BsLocaleService, protected dateTimeAdapter: DateTimeAdapter<any>,
    protected paymentService: PaymentService, protected messageService: MessageService,
    protected favLocationService: FavLocationService,
    protected fbPixelService: FBPixelService,
    protected productDescService: ProductDescriptionService, protected checkoutTemplateService: CheckoutTemplateService,
    public catalogueService: CatalogueService) {
    this.checkoutBackData = this.sessionService.getByKey('app', 'checkout');
    this.config = this.sessionService.get('config');
    this.hasDestroy = false;
    this.checkoutForm = fb.group({
      'notes': [this.checkoutBackData ? this.checkoutBackData.cart.job_description : ''],
      'schedule_radio': false,
      'delivery_method': [''],
      'time': [''],
      'date': [''],
      'startDate': [''],
      'startTime': [''],
      'endDate': [''],
      'endTime': [''],
    });
    this.custmPickupForm = fb.group({
      'phone': [''],
      'email': ['', [ValidationService.emailValidator]],
      'name': ['']
    });
    this.appConfig = this.sessionService.get('config');
    this.businessModal = this.appConfig.business_model_type;
    this.domain = this.sessionService.getString('domain');
    this.sessionService.set("pick_up_and_delivery",{})
    this.ecomView = (this.sessionService.get('config').business_model_type === 'ECOM') &&
    (this.sessionService.get('config').nlevel_enabled === 2);
    if (this.appConfig.product_view === 1 && this.appConfig.business_model_type !== 'RENTAL') {
      this.restaurantInfo = this.sessionService.get('config');
      this.restaurantInfo.self_pickup = this.appConfig.admin_self_pickup;
      this.restaurantInfo.home_delivery = this.appConfig.admin_home_delivery;
      this.restaurantInfo.pick_and_drop = this.appConfig.admin_pick_and_drop;
    } else {
      this.restaurantInfo = this.sessionService.get('info') || {};
    }
    this.deliveryModeNumber = Number(this.sessionService.getString('deliveryMethod'));
    if (this.appConfig.terminology) {
      this.terminology = this.appConfig.terminology;
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
  ngOnInit() {
    this.sessionService.langStringsPromise.then(() =>
    {
     this.languageStrings = this.sessionService.languageStrings;
     this.setLangKeys();
    });
    this.cartService.editAddon = false;
    if(this.restaurantInfo.is_order_agent_scheduling_enabled && this.restaurantInfo.business_type == 2 && this.restaurantInfo.pd_or_appointment != 2)
    {
      this.getAgentList();
      this.showAgentList = true;
    }
    this.dayLimit= this.sessionService.get('config').max_schedule_days_limit;
    this.maxDate = moment(this.bsValue).add(this.dayLimit, 'days').toDate();
    this.maxStartDate = moment(this.bsStartValue).add(this.dayLimit, 'days').toDate();
    this.maxEndDate = moment(this.bsStartValue).add(this.dayLimit, 'days').toDate();
    this.deliveryModeNumber = Number(this.sessionService.getString('deliveryMethod'));
    this.store = this.sessionService.get('info');
    // console.log(this.store);

    if (this.deliveryModeNumber == 2) {
      this.minimumOrder = this.store.minimum_self_pickup_amount;

    }
    else if (this.deliveryModeNumber == 1) {
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

    this.onSaveLocalLocation();
    this.headerData = this.sessionService.get('config');
    // const locales = [arLocale, esUsLocale, frLocale];
    // locales.forEach(locale => defineLocale(locale.abbr, locale));
    let language = this.sessionService.getString('language');

    language = this.defineLangLocale(language);
    this.localeService.use(language);
    this.dateTimeAdapter.setLocale(language);



    this.userBillPlan = this.sessionService.get('config')['user_billing_plan'];
    this.bsConfig = Object.assign({}, {
      containerClass: this.colorTheme, showWeekNumbers: false,
      dateInputFormat: 'LL'
    });

    this.cartSubscriber = this.cartService.currentStatus.pipe(distinctUntilChanged())
      .subscribe(() => {
        this.setCartData();
      });

    this.checkoutSubscriber = this.checkOutService.currentStatus.subscribe(() => {
      this.onSubmit();
    });
    this.setCartData(true);
    this.loader.hide();
    // ================language json manupilation======================
    this.appService.langPromise.then(() => {
      this.langJson = this.appService.getLangJsonData();
    })

    this.setDefaultComponentData();
    this.cartbool = true;


    if (!this.sessionService.isPlatformServer()) {
      this.isCheckoutEnabled();
      (<any>document.body).scrollTo(0, 0);
       this.getDeliveryTimeslot();
      if (this.restaurantInfo && this.restaurantInfo.button_type && this.restaurantInfo.button_type.button_names) {
        this.addBtnTxt = this.restaurantInfo.button_type.button_names.add ? this.restaurantInfo.button_type.button_names.add : 'Add';
        this.removeBtnTxt = this.restaurantInfo.button_type.button_names.remove ?
          this.restaurantInfo.button_type.button_names.remove : 'Remove';
      }

      if (this.restaurantInfo.instant_task === 0 && this.restaurantInfo.scheduled_task === 1 && this.restaurantInfo.available === 0) {
        this.checkoutForm.controls.schedule_radio.setValue(true);
      } else if (this.restaurantInfo.instant_task === 1 && this.restaurantInfo.scheduled_task === 1 && this.restaurantInfo.available === 0) {
        this.checkoutForm.controls.schedule_radio.setValue(true);
      } else if (this.restaurantInfo.instant_task === 0 && this.restaurantInfo.scheduled_task === 1 && this.restaurantInfo.available === 1) {
        this.checkoutForm.controls.schedule_radio.setValue(true);
      }
      else if (this.restaurantInfo.business_type == BusinessType.SERVICE_MARKETPLACE &&
        this.restaurantInfo.pd_or_appointment == TaskType.SERVICE_AS_PRODUCT) {
        this.checkoutForm.controls.schedule_radio.setValue(true);
      }

      else {
        this.checkoutForm.controls.schedule_radio.setValue(false);
      }
      if (this.restaurantInfo.is_menu_enabled && this.appConfig.is_menu_enabled) {
        this.preOrderTime = this.sessionService.getString('preOrderTime');
        if (this.preOrderTime && this.restaurantInfo.scheduled_task === 1) {
          this.bsValue = new Date(this.preOrderTime);
        this.setDefaultSchecdulingValue();
        } else if (!this.preOrderTime && this.restaurantInfo.pre_booking_buffer && this.restaurantInfo.instant_task === 0 && this.restaurantInfo.scheduled_task === 1) {
          this.bsValue=new Date(new Date().valueOf() + this.restaurantInfo.pre_booking_buffer*60000);
          this.setDefaultSchecdulingValue();
        }
        else if(!this.preOrderTime && this.restaurantInfo.instant_task === 0 && this.restaurantInfo.scheduled_task === 1)
        {
          this.bsValue=new Date();
        }
      else {
          this.checkoutForm.controls.schedule_radio.setValue(false);
          this.hideScheduling = true;
        }
      }

      this.checkForStaticAddress();

      if(!this.restaurantInfo.instant_task){
        this.orderType = OrderType.SCHEDULED_ORDER;
      }
    }
    const addOn = this.config.addon;
    addOn.forEach(data=> {
      if (data.enabled && data.value === 111) {
        this.isLalamoveActive = true;
      }
    })
  }
  setLangKeys() {
    this.languageStrings.add_new_address = (this.languageStrings.add_new_address || "Add New address")
    .replace('ADDRESS_ADDRESS', this.appConfig.terminology.ADDRESS ) 
    this.languageStrings.edit_address = (this.languageStrings.edit_address || "Edit address")
    .replace('ADDRESS_ADDRESS', this.appConfig.terminology.ADDRESS )
    this.languageStrings.type_address_detail = (this.languageStrings.type_address_detail || "Type address detail")
    .replace("PICKUP_PICKUP", this.appConfig.terminology.PICKUP )
    this.languageStrings.enter_address = (this.languageStrings.enter_address || "Enter Address")
    .replace('ADDRESS_ADDRESS', this.appConfig.terminology.ADDRESS)
    this.languageStrings.select_agent = (this.languageStrings.select_agent || "Select Agent")
    .replace('AGENT_AGENT', this.appConfig.terminology.AGENT) 
    this.languageStrings.no_agent_avail = (this.languageStrings.no_agent_avail || "No agent available")
    .replace('AGENT_AGENT',this.appConfig.terminology.AGENT)
    this.languageStrings.order_now = (this.languageStrings.order_now || "Order now")
    .replace('ORDER_ORDER', this.appConfig.terminology.ORDER);
    this.languageStrings.remove_cart = (this.languageStrings.remove_cart || "Remove Cart")
    .replace('CART_CART', this.appConfig.terminology.CART);
    this.languageStrings.store_closed_msg = (this.languageStrings.store_closed_msg || "This STORE_STORE is closed now. Please try from some other STORE_STORE.")
    .replace('STORE_STORE', this.appConfig.terminology.STORE);
    this.languageStrings.store_closed_msg = this.languageStrings.store_closed_msg
    .replace('STORE_STORE', this.appConfig.terminology.STORE);
    this.languageStrings.remove_cart_items_msg = (this.languageStrings.remove_cart_items_msg || "Are you sure you want to remove the added items from the CART_CART ?")
    .replace('CART_CART', this.appConfig.terminology.CART);
    this.message = this.languageStrings.remove_cart_items_msg;
  }
  getDeliveryTimeslot()
  {
    if (this.restaurantInfo.enable_start_time_end_time && !this.restaurantInfo.enable_tookan_agent &&
      (this.restaurantInfo.business_type == BusinessType.PRODUCT_MARKETPLACE ||
        (this.restaurantInfo.business_type == BusinessType.SERVICE_MARKETPLACE &&
          this.restaurantInfo.pd_or_appointment == TaskType.SERVICE_AS_PRODUCT
        )
      )) {
      this.getTimeSlots(0);
      this.getTimeSlots('Start');
    } else if (this.restaurantInfo.enable_tookan_agent &&
      (this.restaurantInfo.business_type == BusinessType.PRODUCT_MARKETPLACE ||
        (this.restaurantInfo.business_type == BusinessType.SERVICE_MARKETPLACE &&
          this.restaurantInfo.pd_or_appointment == TaskType.SERVICE_AS_PRODUCT
        )
      )) {
      this.maxEndDate = moment(this.bsStartValue).add(this.dayLimit, 'days').toDate();
      this.getTimeSlots('Agent');
    } else if ((this.restaurantInfo.business_type == BusinessType.PRODUCT_MARKETPLACE ||
      (this.restaurantInfo.business_type == BusinessType.SERVICE_MARKETPLACE &&
        this.restaurantInfo.pd_or_appointment == TaskType.SERVICE_AS_PRODUCT
      )
    ) && this.restaurantInfo.scheduled_task === 1) {
      this.getTimeSlots(0);
    }
    else
    {
      return;
    }
  }
  getAgentList() {
    const obj = {
      marketplace_user_id : this.sessionService.get('config').marketplace_user_id,
      language : this.sessionService.getString('language'),
      user_id : this.sessionService.get('info')['storefront_user_id']
    }
    if(this.sessionService.get('appData') && this.sessionService.get('appData').vendor_details){
      obj['vendor_id'] = this.sessionService.get('appData').vendor_details.vendor_id;
      obj['access_token'] = this.sessionService.get('appData').vendor_details.app_access_token;
    }
    if(this.sessionService.get('location')){
      obj['latitude'] = this.sessionService.get('location').lat;
      obj['longitude']= this.sessionService.get('location').lng;
    }
    obj['product_ids'] = [];
    let cartData = this.cartService.getCartData();
    if(cartData){
      cartData.forEach(el => {
        if(el.id){
          obj['product_ids'].push(el.id);
        }
      });
    }
    this.loader.show();
    this.checkOutService.getAgentList(obj).subscribe(res=>{
      this.loader.hide();
      if(res.status == 200){
        this.agentList = res.data;
      } else {
        this.agentList = [];
      }
    }, err=>{
      this.agentList = [];
      this.loader.hide();
    })
  }

  defineLangLocale(language) {
    if (language == 'zh-Hant' || language == 'zh-Hans') {
      defineLocale('zh-cn', de.zhCnLocale);
      return 'zh-cn';
    }
    else if (language == 'el' || language == 'es-mx' || language == 'nl' || language == 'pt-br' || language == 'sv' || language == 'pt' || language == 'es' || language == 'th' ||  language == 'mr' || language == 'hi' || language == 'ru' || language =='ar-sa' || language =='tr' || language =='lv' || language =='nb' || language == 'lo' || language == 'vi' || language == 'it' || language == 'fr-ch' || language == 'ro' || language == 'de') {
       // fallback for all languages which are not valid for bsdatepicker
      return 'en';
    }
    else {
      return this.sessionService.getString('language');
    }
  }


  private setDefaultSchecdulingValue() {
    this.checkoutForm.controls.schedule_radio.setValue(true);
    this.disableSchedulingInput = true;
    this.time = moment(this.bsValue).format('hh:mm');
    this.tFormat = this.config.time_format === this.timeFormat.TWELVE_HOURS ? this.bsValue.getHours() < 12 ? 'AM' : 'PM' : '';
  }

  ngAfterViewInit() {
    if (!this.sessionService.isPlatformServer()) {
      const windowHeight = (window.screen.height) - 580 + 'px';
      $('#heightScroll').css('height', windowHeight);
    }
    this.deliveryModeNumber = Number(this.sessionService.getString('deliveryMethod'));
    this.store = this.sessionService.get('info');
    if (this.deliveryModeNumber == 2) {
      this.minimumOrder = this.store.minimum_self_pickup_amount;

    }
    else if (this.deliveryModeNumber == 1 && this.store) {
      this.minimumOrder = this.store.merchantMinimumOrder;
    }
  }

  /**
   * check which mode is enabled
   */
  checkWhichModeEnabled() {
    if (this.businessModal === 'RENTAL') {
      this.deliveryMethod = 'pickup';
    }

    else if ((this.restaurantInfo.home_delivery && this.restaurantInfo.self_pickup) ||
              (this.restaurantInfo.home_delivery && this.restaurantInfo.pick_and_drop) ||
              (this.restaurantInfo.pick_and_drop && this.restaurantInfo.self_pickup)){
      this.deliveryMode = true;
      this.items = [];
      if(this.restaurantInfo.home_delivery && (this.restaurantInfo.scheduled_task || this.restaurantInfo.available_for_home_delivery))
      this.items.push({
        label: this.terminology.HOME_DELIVERY, value: 'home', command: () => {
        this.changeDeliveryMethod('home');
        this.messageService.templateListData.next(1);
        }
      })
      if(this.restaurantInfo.self_pickup && (this.restaurantInfo.scheduled_task || this.restaurantInfo.available_for_self_pickup))
      this.items.push({
        label: this.terminology.SELF_PICKUP, value: 'pickup', command: () => {
        this.changeDeliveryMethod('pickup');
        this.messageService.templateListData.next(0);
        }
      })
      if(this.restaurantInfo.pick_and_drop && (this.restaurantInfo.scheduled_task || this.restaurantInfo.available_for_pick_and_drop))
      this.items.push({
        label: this.terminology.PICKUP_AND_DROP || 'Pick & drop', value: 'pickDrop', command: () => {
        this.changeDeliveryMethod('pickDrop');
        this.messageService.templateListData.next(8);
        }
      })
    }
    else {
      this.deliveryMode = false;
      if (this.restaurantInfo.home_delivery && (this.restaurantInfo.scheduled_task || this.restaurantInfo.available_for_home_delivery)) {
        this.sessionService.setString('deliveryMethod', 1);
        this.messageService.sendDeliveryMode({ type: 1, checkout: 1 });
        this.deliveryMethod = 'home';
      } else if (this.restaurantInfo.self_pickup && (this.restaurantInfo.scheduled_task || this.restaurantInfo.available_for_self_pickup)) {
        this.sessionService.setString('deliveryMethod', 2);
        this.messageService.sendDeliveryMode({ type: 2, checkout: 1 });
        this.deliveryMethod = 'pickup';
      }
      else if (this.restaurantInfo.pick_and_drop && (this.restaurantInfo.scheduled_task || this.restaurantInfo.available_for_pick_and_drop)) {
        this.sessionService.setString('deliveryMethod', 8);
        this.messageService.sendDeliveryMode({ type: 8, checkout: 1 });
        this.deliveryMethod = 'pickDrop';
      }
    }
    if (this.sessionService.getString('deliveryMethod')) {
     let deliveryMethod = Number(this.sessionService.getString('deliveryMethod'))
        if(this.restaurantInfo.home_delivery && deliveryMethod == 1 && (this.restaurantInfo.scheduled_task || this.restaurantInfo.available_for_home_delivery))
       {
        this.messageService.sendDeliveryMode({ type: 1, checkout: 1 })
        this.sessionService.setString('deliveryMethod', 1);
        this.deliveryMethod = 'home';
       }  
        else if(this.restaurantInfo.self_pickup && deliveryMethod == 2 && (this.restaurantInfo.scheduled_task || this.restaurantInfo.available_for_self_pickup))
         {  this.messageService.sendDeliveryMode({ type: 2, checkout: 1 })
         this.sessionService.setString('deliveryMethod', 2);
          this.deliveryMethod = 'pickup';
        }
        else if(this.restaurantInfo.pick_and_drop && deliveryMethod == 8 && (this.restaurantInfo.scheduled_task || this.restaurantInfo.available_for_pick_and_drop))
       {      this.messageService.sendDeliveryMode({ type: 8, checkout: 1 })
       this.sessionService.setString('deliveryMethod', 8);
              this.deliveryMethod = 'pickDrop';
      }
        else if(this.restaurantInfo.home_delivery && (this.restaurantInfo.scheduled_task || this.restaurantInfo.available_for_home_delivery))
        { this.messageService.sendDeliveryMode({ type: 1, checkout: 1 })
        this.sessionService.setString('deliveryMethod', 1);
          this.deliveryMethod = 'home';
           }
        else if(this.restaurantInfo.self_pickup && (this.restaurantInfo.scheduled_task || this.restaurantInfo.available_for_self_pickup))  
        {
          this.messageService.sendDeliveryMode({ type: 2, checkout: 1 })
          this.sessionService.setString('deliveryMethod', 2);
          this.deliveryMethod = 'pickup';
  }
        else if(this.restaurantInfo.pick_and_drop && (this.restaurantInfo.scheduled_task || this.restaurantInfo.available_for_pick_and_drop))  
        { this.messageService.sendDeliveryMode({ type: 8, checkout: 1 })
        this.sessionService.setString('deliveryMethod', 8);
          this.deliveryMethod = 'pickDrop';
}
    }
    else{
      if(this.restaurantInfo.home_delivery && this.config.selected_delivery_method_for_apps == 2 && (this.restaurantInfo.scheduled_task || this.restaurantInfo.available_for_home_delivery)){
        this.deliveryMethod = 'home';
        this.messageService.sendDeliveryMode({ type: 1, checkout: 1 })
        this.sessionService.setString('deliveryMethod', 1);
      }
      else if(this.restaurantInfo.self_pickup && this.config.selected_delivery_method_for_apps == 4 && (this.restaurantInfo.scheduled_task || this.restaurantInfo.available_for_self_pickup)){
        this.sessionService.setString('deliveryMethod', 2);
        this.messageService.sendDeliveryMode({ type: 2, checkout: 1 })
        this.deliveryMethod = 'pickup';
      }
      else if(this.restaurantInfo.pick_and_drop && this.config.selected_delivery_method_for_apps == 8 && (this.restaurantInfo.scheduled_task || this.restaurantInfo.available_for_pick_and_drop)){
        this.sessionService.setString('deliveryMethod', 8);
        this.messageService.sendDeliveryMode({ type: 8, checkout: 1 })
        this.deliveryMethod = 'pickDrop';
      }
      else if (!this.config.admin_home_delivery && this.config.admin_self_pickup && (this.restaurantInfo.scheduled_task || this.restaurantInfo.available_for_self_pickup)) {
        this.deliveryMethod = 'pickup';
        this.messageService.sendDeliveryMode({ type: 2, checkout: 1 })
        this.sessionService.setString('deliveryMethod', 2);
      }
      else if(this.config.admin_home_delivery  && this.restaurantInfo.home_delivery && (this.restaurantInfo.scheduled_task || this.restaurantInfo.available_for_home_delivery)){
        this.messageService.sendDeliveryMode({ type: 1, checkout: 1 })
        this.sessionService.setString('deliveryMethod', 1);
        this.deliveryMethod = 'home';
      }
    }
  }

  /**
   * change delivery method
   */
  changeDeliveryMethod(deliveryMethod) {
    this.deliveryMethod = deliveryMethod;
    if(this.deliveryMethod != 'pickDrop'){
      this.pickupAndDeliverySection = {
        lng: "",
        lat: "",
        address: "",
      };
      this.selectedPickupAndDeliverySection = {};
      this.sessionService.set("pick_up_and_delivery",{})
    }
    switch (this.deliveryMethod) {
      case 'home':
        this.sessionService.setString('deliveryMethod', 1);
        this.deliveryMethod='home'
        this.messageService.sendDeliveryMode({ type: 1, checkout: 1 });
        this.getDeliveryTimeslot();
        break;
      case 'pickup':
        this.sessionService.setString('deliveryMethod', 2);
        this.deliveryMethod='pickup'
        this.getDeliveryTimeslot();
        this.messageService.sendDeliveryMode({ type: 2, checkout: 1 });
        break;
      case 'pickDrop':
        this.sessionService.setString('deliveryMethod', 8);
        this.deliveryMethod='pickDrop'
        this.messageService.sendDeliveryMode({ type: 8, checkout: 1 });
        this.getDeliveryTimeslot();
        break;
    }
  }
    // ===================open map for better and accurate address==========================
    openMap() {
        if(this.pickupAndDeliverySection.lat && this.pickupAndDeliverySection.lng){
            this.pickupAndDeliverySection.lat = this.pickupAndDeliverySection.lat;
            this.pickupAndDeliverySection.lng = this.pickupAndDeliverySection.lng;
        }else{
          this.pickupAndDeliverySection.lat = this.sessionService.get('location').lat;
          this.pickupAndDeliverySection.lng = this.sessionService.get('location').lng;
        }
      this.showTemplatePopup = true;
    }
    clearLatLng() {
      this.pickupAndDeliverySection["lat"] = null;
      this.pickupAndDeliverySection["lng"] = null;
    }
    hideTempltePopup() {
      this.showTemplatePopup = false;
    }
    onMapPopupSave(event){
      if (this.is_google_map) {
        this.pickupAndDeliverySection.address = event.city;
        this.pickupAndDeliverySection.lat =event.lat;
        this.pickupAndDeliverySection.lng = event.lng;
      }else{
        this.pickupAndDeliverySection['lat'] = event.lat
        this.pickupAndDeliverySection['lng'] = event.lng;
        this.pickupAndDeliverySection['address'] = event.city
      }
      if(this.pickupAndDeliverySection.address && this.pickupAndDeliverySection.lat){
        this.selectedPickupAndDeliverySection = this.pickupAndDeliverySection;
        this.sessionService.set("pick_up_and_delivery", this.pickupAndDeliverySection);
        this.servicableArea();
      }
      this.hideTempltePopup();
    }
  /**
   * initialize default address autocomplete
   */
  onLatLngEvent(e)
  {
    if(!e){
      this.pickupAndDeliverySection =  {
        lng: "",
        lat: "",
        address: "",
      };
      this.sessionService.set("pick_up_and_delivery",{})
    }

    if(!this.is_google_map && e)
    {
      this.pickupAndDeliverySection.lat = e.lat;
      this.pickupAndDeliverySection.lng = e.lng;
    }
    else if(e && this.is_google_map){
      this.pickupAndDeliverySection.lat = e.lat();
      this.pickupAndDeliverySection.lng = e.lng();
    }
    if(this.pickupAndDeliverySection.address && this.pickupAndDeliverySection.lat){
      this.sessionService.set("pick_up_and_delivery", this.pickupAndDeliverySection);
      this.selectedPickupAndDeliverySection = this.pickupAndDeliverySection;
      this.servicableArea();
    }
    window['x']=this;
  }
  servicableArea(){
    let data = {
      job_pickup_latitude: this.pickupAndDeliverySection.lat,
      job_pickup_longitude: this.pickupAndDeliverySection.lng,
      pick_and_drop: 1,
      customer_address: this.pickupAndDeliverySection.address,
    }
    this.checkOutService.validateAddressPickUp(data).subscribe((response: any) => {
      if (response.status !== 200) {
        this.pickupAndDeliverySection = {
          lng: "",
          lat: "",
          address: "",
        };
        this.sessionService.set("pick_up_and_delivery",{})
        this.popup.showPopup(MessageType.ERROR, 2000, response.message, false);
      }
    }, error => {
      this.popup.showPopup(MessageType.ERROR, 2000, error.message, false);
    })
  };
  /**
   * check for static address
   */
  checkForStaticAddress() {
    let cartData = this.cartService.getCartData();
    let user_id;
    if (this.formSettings.product_view === 1) {
      user_id = this.sessionService.get('user_id');
    } else {
      user_id = this.sessionService.get('info')['storefront_user_id'];
    }
    if (cartData && cartData.length) {
      if (cartData[0].delivery_by_merchant === 0 && this.formSettings.is_static_address_enabled === 1) {
        this.getAdminStaticAddress(user_id);
      } else if (cartData[0].delivery_by_merchant === 1 && cartData[0].is_static_address_enabled === 1) {
        this.getMerchantStaticAddress(user_id);
      } else {
        this.getDeliveryNormal();
      }
    }
  }

  /**
   * get normal delivery flow
   */
  getDeliveryNormal() {
    this.staticAddress = false;
    this.checkWhichModeEnabled();
  }

  /**
   * get admin static address
   */
  getAdminStaticAddress(data) {
    if (this.sessionService.isPlatformServer()) return;

    const muid = this.sessionService.get('appData') ? this.sessionService.get('appData').vendor_details.marketplace_user_id : null;
    const obj = {
      'marketplace_user_id': muid,
      'user_id': data,
      'latitude': this.sessionService.get('location').lat,
      'longitude': this.sessionService.get('location').lng
    };
    this.checkOutService.getStaticAddress(obj).subscribe(res => {
      this.loader.hide();
      if (res.status === 200) {
        if (res.data && res.data.length) {
          this.staticAddressList = res.data;
          this.staticAddress = true;
        } else {
          this.staticAddress = false;
        }
        this.checkWhichModeEnabled();
      }
    });
  }

  /**
   * get merchant static address
   */
  getMerchantStaticAddress(data) {
    const muid = this.sessionService.get('appData') ? this.sessionService.get('appData').vendor_details.marketplace_user_id : null;
    const obj = {
      'marketplace_user_id': muid,
      'user_id': data,
      'latitude': this.sessionService.get('location').lat,
      'longitude': this.sessionService.get('location').lng
    };
    this.checkOutService.getStaticAddress(obj).subscribe(res => {
      this.loader.hide();
      if (res.status === 200) {
        if (res.data && res.data.length) {
          this.staticAddressList = res.data;
          this.staticAddress = true;
        } else {
          this.staticAddress = false;
        }
        this.checkWhichModeEnabled();
      }
    });
  }

  confirmLocation(){
    if (this.deliveryMethod == 'pickDrop' &&  (!this.pickupAndDeliverySection.address || !this.pickupAndDeliverySection.lat || !this.pickupAndDeliverySection.lng) ) {
      this.popup.showPopup(MessageType.ERROR, 2000, this.langJson['Please select a Pickup Address'], false);
      return;
    }
    if (this.custmPickupForm.value.email && this.custmPickupForm.invalid) {
      this.popup.showPopup(MessageType.ERROR, 2000, this.langJson['Please enter a valid email address.'], false);
      return;
    }
    if (this.selectedAddress === null && this.deliveryMethod != 'pickup' && this.businessModal !== 'RENTAL') {
      this.popup.showPopup(MessageType.ERROR, 2000, this.langJson['Please select a Delivery Address'], false);
      return;
    }
    if(this.restaurantInfo.is_order_agent_scheduling_enabled && !this.selectedAgent && this.restaurantInfo.business_type == 2 && this.restaurantInfo.pd_or_appointment != 2){
      this.popup.showPopup(MessageType.ERROR, 2000, (this.langJson['Please select a ' + this.terminology.AGENT] || 'Please select a ' + this.terminology.AGENT), false);
      return ;
    }
    if(this.restaurantInfo.is_order_agent_scheduling_enabled && !this.startTime && this.restaurantInfo.business_type == 2 && this.restaurantInfo.pd_or_appointment != 2){
      this.popup.showPopup(MessageType.ERROR, 2000, this.langJson['Please select a time slot.'], false);
      return ;
    }if(this.selectedAddress && this.config.is_show_delivery_popup){
      this.confirmCheckoutLocationPopup = true;
    }else
    this.onSubmit();
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
    if (!this.sessionService.get('appData')) {
      this.messageService.getLoginSignupLocation('From Checkout Button');
      $('#loginDialog').modal('show');
    } else {
      this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.add_address, 'Add Address', '', '');
      const payload = this.getValueForApi();
      if(this.restaurantInfo && this.pickupAndDeliverySection.address){
        payload.custom_pickup_address = this.pickupAndDeliverySection.address ? this.pickupAndDeliverySection.address : undefined;
        payload.custom_pickup_latitude = this.pickupAndDeliverySection.lat ? this.pickupAndDeliverySection.lat : undefined;
        payload.custom_pickup_longitude = this.pickupAndDeliverySection.lng ? this.pickupAndDeliverySection.lng : undefined;
        payload.custom_pickup_name = this.custmPickupForm.controls.name.value ? this.custmPickupForm.controls.name.value : undefined;
        payload.custom_pickup_email = this.custmPickupForm.controls.email.value ? this.custmPickupForm.controls.email.value : undefined;
        payload.custom_pickup_phone = this.custmPickupForm.controls.phone.value ?  '+' + this.country_code + this.custmPickupForm.controls.phone.value : undefined;
      }
      const status = true;
      const newStatus = true;
      if (payload && this.checkMinimumOrder() && this.checkMinProductQuantity() &&  this.checkMaxProductQuantity()) {
        const chekoutData = {};
        payload.return_enabled = this.isReturnFlow ? 1 : 0;
        chekoutData['cart'] = payload;
        payload.is_scheduled = 0;
        if(this.restaurantInfo.is_order_agent_scheduling_enabled && this.restaurantInfo.business_type == 2 && this.restaurantInfo.pd_or_appointment != 2){
          payload.job_pickup_datetime = this.getAgentStartTime(this.bsValue, this.startTime);
          payload.is_scheduled = 1;
        }
        else if (this.restaurantInfo.enable_tookan_agent && this.restaurantInfo.business_type !== 2) {
          const dataGot = this.pushSelectedDateToPayload();
          if (dataGot.start) {
            payload.job_pickup_datetime = dataGot.start;
            payload.job_delivery_datetime = dataGot.end;
            payload.is_scheduled = 0;
          } else {
            return;
          }
        } else if (this.restaurantInfo.business_type !== 2) {
          if (!this.restaurantInfo.enable_start_time_end_time) {
            if ((this.restaurantInfo.instant_task === 0 && this.restaurantInfo.scheduled_task === 1) || this.checkoutForm.controls.schedule_radio.value) {
        
              if (!this.time && this.orderType != OrderType.RECURRING_ORDER) {
                this.popup.showPopup(MessageType.ERROR, 2000, this.languageStrings.pls_select_time_slot || "Please select a time slot.", false);
                return;
              } else {
                const datetime = moment(moment(this.bsValue).format('YYYY-MM-DD') +
                  this.time + this.tFormat, 'YYYY-MM_DDhh:mma').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
                payload.job_pickup_datetime = datetime;
                payload.is_scheduled = 1;
              }
            }
          } else if (this.restaurantInfo.enable_start_time_end_time) {
            const dataGot = this.pushSelectedDateToPayload();
            if (dataGot.start) {
              payload.job_pickup_datetime = dataGot.start;
              payload.job_delivery_datetime = dataGot.end;
              payload.is_scheduled = 0;
            } else {
              return;
            }
          }
        }
        if(this.restaurantInfo.instant_task === 1 && this.restaurantInfo.scheduled_task === 1 && this.time)
        {
          const datetime = moment(moment(this.bsValue).format('YYYY-MM-DD') +
          this.time + this.tFormat, 'YYYY-MM_DDhh:mma').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
        payload.job_pickup_datetime = datetime;
        payload.is_scheduled = 1;
        }
        if (!status) {
          return;
        } else if (!newStatus) {
          return;
        }

        //checkout template validate
        if (this.checkoutTemplate) {
          if (!this.checkoutTemplate.validateFields()) return;
        }

        if (this.orderType == OrderType.RECURRING_ORDER) {
          if (!this.recurringTasksComponent.checkValidationForRecData(true))
            return;
          else {
            let recurenceData = this.recurringTasksComponent.getRecurringTaskData();
            this.sessionService.setByKey('app', 'recurrenceData', recurenceData);
          }
        }
        this.sessionService.setString('orderType', this.orderType);

        this.validateServingAddress(chekoutData).then(data => {

          if (this.config.show_payment_screen === 1) {

            if (this.restaurantInfo.available === 0 && this.restaurantInfo.scheduled_task === 0) {
              // this.popup.showPopup(MessageType.ERROR, 2000, , false);
              const msg = this.languageStrings.store_closed_msg;
              this.popup.showPopup(MessageType.ERROR, 2000, msg, false);
              return;
            } else {
              if(this.restaurantInfo.is_order_agent_scheduling_enabled && !this.selectedAgent && this.restaurantInfo.business_type == 2 && this.restaurantInfo.pd_or_appointment != 2){
        this.popup.showPopup(MessageType.ERROR, 2000, (this.languageStrings.pls_select_Agent || "Please select a AGENT_AGENT")
        .replace('AGENT_AGENT', this.terminology.AGENT), false);
                return ;
              }
              if(this.restaurantInfo.is_order_agent_scheduling_enabled && !this.startTime && this.restaurantInfo.business_type == 2 && this.restaurantInfo.pd_or_appointment != 2){
                this.popup.showPopup(MessageType.ERROR, 2000, this.languageStrings.pls_select_time_slot || "Please select a time slot." , false);
                return ;
              }
              if (this.restaurantInfo.business_type == BusinessType.SERVICE_MARKETPLACE &&
                this.restaurantInfo.pd_or_appointment == TaskType.SERVICE_AS_PRODUCT
              ) {
                if (!this.time && !this.restaurantInfo.is_order_agent_scheduling_enabled) {
                  this.popup.showPopup(MessageType.ERROR, 2000, this.languageStrings.pls_select_time_slot || "Please select a time slot.", false);
                  return;
                } else  if (this.restaurantInfo.is_order_agent_scheduling_enabled){
                  payload.job_pickup_datetime = this.getAgentStartTime(this.bsValue, this.startTime);
                }
                else{
                  const datetime = moment(moment(this.bsValue).format('YYYY-MM-DD') +
                    this.time + this.tFormat, 'YYYY-MM_DDhh:mma').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
                  payload.job_pickup_datetime = datetime;
                  payload.is_scheduled = 1;
                }
              }
              const paymentData = this.sessionService.get('paymentData');
              this.checkAllPayment = false;
              this.fbPixelService.emitEvent('InitiateCheckout', '');
              chekoutData['cart'] = payload;
              this.sessionService.setByKey('app', 'checkout', chekoutData);
              if(paymentData && paymentData.NET_PAYABLE_AMOUNT == 0 && this.config.onboarding_business_type == OnboardingBusinessType.FOOD && (!paymentData.TIP_ENABLE_DISABLE)){
                this.zeroOrder();
                return
              }
              this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.go_to_payment, "Go to payment", '', '');
              this.router.navigate(['payment']);
              return;
            }
          } else {
            this.checkAllPayment = true;
          }

          if (this.checkAllPayment) {
            this.makeDirectHit();
          }

        }, error => {
          console.error(error, MessageType.ERROR);
          this.popup.showPopup(MessageType.ERROR, 2000, error.message, false);
          return false;
        })

        // this.router.navigate(['payment']);
      }
    }
  }

  // when total payable amount is 0zero
  zeroOrder(){
    const obj = this.sessionService.getByKey('app', 'checkout') ? this.sessionService.getByKey('app', 'checkout').cart :  undefined;
    obj['payment_method'] = 8;
    obj.marketplace_reference_id = this.formSettings.marketplace_reference_id;
    obj.marketplace_user_id = this.formSettings.marketplace_user_id;
    obj.currency_id = this.formSettings.payment_settings[0].currency_id;
    obj.products = this.getProductApiData();
    if (this.sessionService.get('appData')) {
      obj['vendor_id'] = this.sessionService.get('appData').vendor_details.vendor_id;
      obj['access_token'] = this.sessionService.get('appData').vendor_details.app_access_token;
    }
    if (this.appConfig.product_view === 1) {
      obj.user_id = this.sessionService.get('user_id');
    } else {
      obj.user_id = this.sessionService.get('info')['storefront_user_id'];
    }
    obj.amount = 0;
    this.loader.show();
    this.paymentService.createTask(obj).subscribe(response => {
        if(response.status == 200){
          this.loader.hide();
          this.messageService.clearCartOnly();
          this.sessionService.removeByChildKey('app', 'cart');
          this.sessionService.removeByChildKey('app', 'category');
          this.sessionService.removeByChildKey('app', 'checkout');
          this.sessionService.removeByChildKey('app', 'payment');
          this.sessionService.removeByChildKey('app', 'customize');
          this.sessionService.removeByChildKey('app', 'cartProduct');
          this.sessionService.remove('sellerArray');
          this.cartService.cartClearCall();
            if(response.data.mapped_pages){
              let thankYouPageHtml = response.data.mapped_pages.find(el => el.type == PageType.THANKYOU);
              thankYouPageHtml = thankYouPageHtml ? thankYouPageHtml.template_data : undefined;
              this.sessionService.thankYouPageHtml = thankYouPageHtml;
              this.sessionService.set('OrderPlacedPage',thankYouPageHtml ? 1: 0);
          }
            this.router.navigate(['list']);
        }else{
          this.loader.hide();
          this.popup.showPopup(MessageType.ERROR, 3000, response.message, false);
        }
    })
  }

  getProductApiData() {
    const productData = [];
    this.cartData.forEach((val, index) => {
      const price = val.quantity * val.price;
      const productObj = {};
      if ((this.sessionService.get('config').business_model_type === 'ECOM') &&
        (this.sessionService.get('config').nlevel_enabled === 2)) {
        productObj['product_id'] = val.id;
        productObj['unit_price'] = val.price;
        productObj['quantity'] = val.quantity;
        productObj['total_price'] = price;
        productObj['customizations'] = val.customizations;
        productObj['seller_id'] = val.seller_id;
      } else {
        productObj['product_id'] = val.id;
        productObj['unit_price'] = val.price;
        productObj['quantity'] = val.quantity;
        productObj['total_price'] = price;
        productObj['customizations'] = val.customizations;
        productObj['return_enabled'] = this.isReturnFlow ? 1 : 0;
      }
      if (val.seller_id) {
        productObj['seller_id'] = val.seller_id;
      }
      if (this.restaurantInfo.business_type === 2) {
        productObj['start_time'] = val.start_time;
        productObj['end_time'] = val.end_time;
      }
      productData.push(productObj);
    });
    return JSON.stringify(productData);
  }

  makeDirectHit() {
    if (this.restaurantInfo.available === 0 && this.restaurantInfo.scheduled_task === 0) {
      const msg = this.languageStrings.store_closed_msg || "This store is closed now. Please try from some other store.";
      this.popup.showPopup(MessageType.ERROR, 2000, msg, false);
      return;
    }
    const obj = this.sessionService.getByKey('app', 'checkout').cart;
    delete obj.pickup_meta_data;
    delete obj.pickup_custom_field_template;
    obj.amount = this.totalCountDisplay;
    obj.payment_method = 0;
    const products = this.getProductApiData();
    obj.products = products;

    this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.go_to_payment, 'Go to payment', '', '');
    this.loader.show();
    obj.marketplace_reference_id = this.formSettings.marketplace_reference_id;
    obj.tip = 0;
    obj.marketplace_user_id = this.formSettings.marketplace_user_id;
    obj.currency_id = this.formSettings.payment_settings[0].currency_id;
    if (this.sessionService.get('appData')) {
      obj['vendor_id'] = this.sessionService.get('appData').vendor_details.vendor_id;
      obj['access_token'] = this.sessionService.get('appData').vendor_details.app_access_token;
    }
    if (this.appConfig.product_view === 1) {
      obj.user_id = this.sessionService.get('user_id');
    } else {
      obj.user_id = this.sessionService.get('info')['storefront_user_id'];
    }
    this.sessionService.remove('mapView');
    this.paymentService.createTask(obj).subscribe(response => {
      if (response.status === 200) {
        if(response.data.mapped_pages){
          let thankYouPageHtml = response.data.mapped_pages.find(el => el.type == PageType.THANKYOU);
          thankYouPageHtml = thankYouPageHtml ? thankYouPageHtml.template_data : undefined;
          this.sessionService.thankYouPageHtml = thankYouPageHtml;
          this.sessionService.set('OrderPlacedPage',thankYouPageHtml ? 1: 0);
        }
        this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.order_created_success, 'Order Created Success', '', '');
        this.languageStrings.order_placed_msg = (this.languageStrings.order_placed_msg || "Your ORDER_ORDER has been placed.") 
        .replace('ORDER_ORDER',this.terminology.ORDER)
        const msg = this.terminology.ORDER_PLACED || this.languageStrings.order_placed_msg || "Your ORDER has been placed."
        this.popup.showPopup('success', 3000, msg, false);

        this.messageService.clearCartOnly();
        this.sessionService.removeByChildKey('app', 'cart');
        this.sessionService.removeByChildKey('app', 'category');
        this.sessionService.removeByChildKey('app', 'checkout');
        this.sessionService.removeByChildKey('app', 'payment');
        this.sessionService.removeByChildKey('app', 'customize');
        this.sessionService.removeByChildKey('app', 'cartProduct');
        this.sessionService.remove('sellerArray');
        this.sessionService.remove('tip');
        this.cartService.cartClearCall();
        setTimeout(() => {
          this.loader.hide();
          if ((this.sessionService.get('config').business_model_type === 'ECOM') &&
            (this.sessionService.get('config').nlevel_enabled === 2)) {
            this.router.navigate(['ecom/categories']);
          } else {
            this.router.navigate(['list']);
          }
        }, 200);
      } else {
        this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.order_created_failure, 'Order Created Failure', '', '');
        this.loader.hide();
        this.popup.showPopup(MessageType.ERROR, 3000, response.message, false);
        setTimeout(() => {
          if(response.data.debt_amount > 0){
            this.router.navigate(['/debtAmount']);
        }
        }, 3000);
      }
    });
  }


  pushSelectedDateToPayload() {
    let status = true;
    let newStatus = true;
    let dateStartTime, dateEndTime, totalData;
    if (!this.startTime) {
      this.languageStrings.select_start_time_slot = (this.languageStrings.select_start_time_slot || "Please select a START_TIME slot.")
      .replace( 'START_TIME_START_TIME' , this.terminology.START_TIME);
      const msg = this.languageStrings.select_start_time_slot;
      this.popup.showPopup(MessageType.ERROR, 2000, msg, false);
      return false;
    } else if (!this.endTime) {
      this.languageStrings.select_end_time_slot = (this.languageStrings.select_end_time_slot || "Please select a END_TIME slot.")
      .replace( 'END_TIME_END_TIME' , this.terminology.END_TIME);
      const msg = this.languageStrings.select_end_time_slot;
      this.popup.showPopup(MessageType.ERROR, 2000, msg, false);
      return false;
    } else {
      if (this.restaurantInfo.instant_task === 1 && this.restaurantInfo.scheduled_task === 0 && !this.restaurantInfo.enable_tookan_agent &&
        this.restaurantInfo.enable_start_time_end_time) {
        dateStartTime = moment(this.makeDateTimeFormat(this.bsStartValue, this.startTime)).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
        dateEndTime = moment(this.makeDateTimeFormat(this.bsEndValue, this.endTime)).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
      } else {
        if (this.restaurantInfo.enable_tookan_agent) {
          dateStartTime = moment(moment(this.bsStartValue).format('YYYY-MM-DD') +
            this.startTime.split('-')[0], 'YYYY-MM_DDhh:mma').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
          dateEndTime = moment(moment(this.bsEndValue).format('YYYY-MM-DD') +
            this.endTime.split('-')[1] + this.tEndFormat, 'YYYY-MM_DDhh:mma').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
        } else {
          dateStartTime = moment(moment(this.bsStartValue).format('YYYY-MM-DD') +
            this.startTime + this.tStartFormat, 'YYYY-MM_DDhh:mma').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
          dateEndTime = moment(moment(this.bsEndValue).format('YYYY-MM-DD') +
            this.endTime + this.tEndFormat, 'YYYY-MM_DDhh:mma').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
        }
      }
      status = this.checkStartEndDate(dateStartTime, dateEndTime);
      if (status && this.restaurantInfo.business_type === 2) {
        newStatus = this.checkAccordingToBusiness(dateStartTime, dateEndTime);
      }

      if (status && newStatus) {
        totalData = {
          start: dateStartTime,
          end: dateEndTime
        };
        return totalData;
      } else {
        return false;
      }
    }
  }


  checkAccordingToBusiness(startDate, endDate) {
    const offset: any = new Date().getTimezoneOffset();
    const startDateTime: any = new Date(startDate).setSeconds(0);
    const endDateTime: any = new Date(endDate).setSeconds(0);
    const start: any = new Date(startDateTime).getTime();
    const end: any = new Date(endDateTime).getTime();
    const startD: any = new Date(start + (offset * 60000));
    const endD: any = new Date(end + (offset * 60000));
    if (this.cartData[0].unit_type === 2) {// MINUTE
      if (this.getTimeDifference(startD, endD, 'seconds', 'minute', this.cartData[0].unit_type)) {
        return true;
      } else {
        return false;
      }
    } else if (this.cartData[0].unit_type === 3) {// HOUR
      if (this.getTimeDifference(startD, endD, 'seconds', 'hour', this.cartData[0].unit_type)) {
        return true;
      } else {
        return false;
      }
    } else if (this.cartData[0].unit_type === 4) {// DAY
      if (this.getTimeDifference(startD, endD, 'seconds', 'day', this.cartData[0].unit_type)) {
        return true;
      } else {
        return false;
      }
    } else if (this.cartData[0].unit_type === 5) {// week
      if (this.getTimeDifference(startD, endD, 'days', 'week', this.cartData[0].unit_type)) {
        return true;
      } else {
        return false;
      }
    } else if (this.cartData[0].unit_type === 6) {// MONTH
      if (this.getTimeDifference(startD, endD, 'days', 'month', this.cartData[0].unit_type)) {
        return true;
      } else {
        return false;
      }
    } else if (this.cartData[0].unit_type === 7) {// YEAR
      if (this.getTimeDifference(startD, endD, 'days', 'year', this.cartData[0].unit_type)) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }

  getTimeDifference(startD, endD, differType, unitTypeString, unitType) {
    const timeDifference: any = moment(endD).set('second', 0).diff(moment(startD).set('second', 0), differType);
    let checkMultiples: any;
    switch (unitType) {
      case 2:
        checkMultiples = (timeDifference / 60) % this.cartData[0].unit;
        break;
      case 3:
        checkMultiples = (timeDifference) % (this.cartData[0].unit * 3600);
        break;
      case 4:
        checkMultiples = (timeDifference) % (86400);
        break;
      case 5:
        if (timeDifference === 0) {
          checkMultiples = 1;
        } else {
          checkMultiples = (timeDifference) % (7);
        }
        break;
      case 6:
        if (timeDifference === 0) {
          checkMultiples = 1;
        } else {
          checkMultiples = (timeDifference) % (30);
        }
        break;
      case 7:
        if (timeDifference === 0) {
          checkMultiples = 1;
        } else {
          checkMultiples = (timeDifference) % (365);
        }
        break;
    }

    if (checkMultiples) {

      this.languageStrings.start_time_end_time_multipe_of = (this.languageStrings.start_time_end_time_multipe_of || "START_TIME & END_TIME should be multiple of 1 minute(s).")
      .replace( 'START_TIME' , this.terminology.START_TIME);
      this.languageStrings.start_time_end_time_multipe_of = this.languageStrings.start_time_end_time_multipe_of.replace( 'END_TIME' , this.terminology.END_TIME);
      this.languageStrings.start_time_end_time_multipe_of = this.languageStrings.start_time_end_time_multipe_of.replace( '1 minute(s)', this.cartData[0].unit + ' ' + unitTypeString + '(s)');
      const msg = this.languageStrings.start_time_end_time_multipe_of;
      this.popup.showPopup(MessageType.ERROR, 2500, msg, false);
      return false;
    } else { return true; }

  }

  makeDateTimeFormat(date, time) {
    date.setHours(time.getHours());
    date.setMinutes(time.getMinutes());
    date.setSeconds(0);
    date.setMilliseconds(0);
    const newDateFormat = new Date(date);
    return newDateFormat;
  }



  highlightSlot(event, slot): void {
    $('div.slot-ui').each(function () {
      $(this).removeClass('selected-slot-ui');
    });
    $(event.target).addClass('selected-slot-ui');
    if(this.restaurantInfo.is_order_agent_scheduling_enabled && this.restaurantInfo.business_type == 2 && this.restaurantInfo.pd_or_appointment !=2){
      this.checkAvailabilityOfSlots();
    }
    if (this.isLalamoveActive) {
      slot = slot.split(":");
      if((parseInt(slot[0])!=12)){
        if(this.tFormat == "PM") {
          let time = (parseInt(slot[0]) + 12).toString();
          time = time + ":" + slot[1];
          slot = time;
        }
      }
      const job_pickup_datetime = this.getAgentStartTime(this.bsValue, slot);
      this.checkOutService.onUpdateTime(job_pickup_datetime);
    }
  }
  checkMinimumOrder() {
    let status = true;
    if (parseFloat(this.decimalPipe.decimalPrecision(this.totalCount)) < parseFloat(this.decimalPipe.decimalPrecision(this.minimumOrder))) {
      
      let msgStr = this.languageStrings.minimum_order_amount || "Minimum order amount should be $10";
      msgStr = msgStr.replace('----', this.terminology.ORDER);
      msgStr = msgStr.replace('$', this.currency);
      msgStr = msgStr.replace('10', this.decimalPipe.transform(this.minimumOrder));
      const msg = msgStr;
      this.popup.showPopup(MessageType.ERROR, 2000, msg, false);
      return false;
      status = false;

    }
    return status;
  }
  getFormSettings() {
    this.formSettings = this.sessionService.get('config');
    this.is_google_map = this.formSettings.map_object.map_type === 2 ? true : false;
    this.workflowBool = this.formSettings.work_flow;
    this.pickUpAndDeliveryBool = this.formSettings.force_pickup_delivery;
    this.pickUpOrDeliveryBool = this.formSettings.pickup_delivery_flag;
    this.currency = this.formSettings.payment_settings[0].symbol;
  }
  setDefaultComponentData() {
    this.childStatus = true;
    this.dialogStatus = false;

    this.actionBool = true;
    this.getFormSettings();
  }
  returnFlow(event) {
    if (event.checked) {
      this.isReturnFlow = true;
    } else {
      this.isReturnFlow = false;
    }
  }
  setCartData(bool?) {
    const cartData = this.cartService.getCartData();
    if (cartData && cartData.length) {
      this.cartData = cartData;
      this.cartData.forEach(element => {
        if (element.often_bought_products && element.often_bought_products.length > 0) {
          element.often_bought_products.forEach(oftenBoughtIds => {
            const findIndex = this.oftenBoughtArray.findIndex(el => el === oftenBoughtIds);
            if (findIndex == -1) {
              this.oftenBoughtArray.push(oftenBoughtIds);
            }
          });
        }
      });
      if (this.oftenBoughtArray && this.oftenBoughtArray.length > 0) {
        if(localStorage.getItem('oftenBoughtModal') == 'true'){
            this.getProductsOfBanners();
        }
      }
      let reucrringEnableForAll = true;
      for (let i = 0; i < this.cartData.length; i++) {
        if (this.cartData[i].quantity > this.cartData[i].available_seller_quantity && this.cartData[i].inventory_enabled) {
          this.cartData[i].quantity = this.cartData[i].available_seller_quantity;
        }
        if (this.cartData[i].end_time) {
          if (this.cartData[i].start_time.split('T')[0] === this.cartData[i].end_time.split('T')[0]) {
            this.cartData[i].dateFlag = true;
          } else {
            this.cartData[i].dateFlag = false;
          }
        }

        if(!this.cartData[i].is_recurring_enabled){
          reucrringEnableForAll = false;
        }
      }
      if(reucrringEnableForAll && this.config.is_recurring_enabled){
        this.recurringEnabled = true;
      }
      this.productDescService.updateCartItems(this.cartData);
      this.setAmountData();
    } else {
    if(!this.cartService.editAddon){
      this.openEmptyCartDialog();
      }
    }
  }

  openEmptyCartDialog() {

    if (this.message) {
      this.cartData = [];
      this.languageStrings.your_cart_empty = (this.languageStrings.your_cart_empty || "Your cart is empty")
      .replace( 'CART_CART' , this.terminology.CART);
      const msg = this.languageStrings.your_cart_empty;
      this.popup.showPopup(MessageType.ERROR, 2000, msg, false);
      this.message = '';
      this.cartService.setDefaultData();
      if ((this.sessionService.get('config').business_model_type === 'ECOM') &&
        (this.sessionService.get('config').nlevel_enabled === 2)) {
        this.router.navigate(['ecom/categories']);
      } else {
        this.router.navigate(['list']);
      }
      // setTimeout(() => this.router.navigate(['/pages/category']), 2500);
    }
  }

  setAmountData() {
    this.totalCount = 0;
    this.totalCountDisplay = 0;
    this.cartData.forEach((val: CartModel) => {
      if (val.unit_count) {
        this.totalCountDisplay += val.quantity * val.showPrice * val.unit_count;
        return this.totalCount += val.quantity * val.showPrice;
      } else {
        this.totalCountDisplay += val.quantity * val.showPrice;
        return this.totalCount += val.quantity * val.showPrice;
      }
    });

  }



  ngOnDestroy() {
    this.alive =false;
    this.hasDestroy = true;
    this.setCartAmountData();
  }
  setCartAmountData() {
    let paymentData = this.sessionService.getByKey('app', 'payment');
    if (paymentData) {
      paymentData['amount'] = this.totalCount;
    } else {
      paymentData = {};
      paymentData['amount'] = this.totalCount;
    }
    this.sessionService.setByKey('app', 'payment', paymentData);
  }
  showDialog(bool: boolean) {
    this.dialogStatus = true;
    if (bool) {
      this.cartService.setDefaultData();
      this.messageService.clearCartOnly();
      if ((this.sessionService.get('config').business_model_type === 'ECOM') &&
        (this.sessionService.get('config').nlevel_enabled === 2)) {
        this.router.navigate(['ecom/categories']);
      } else {
        this.router.navigate(['list']);
      }
      this.dialogStatus = false;
      $('#myModal').modal('hide');
    } else {
      $('#myModal').modal('show');
    }
  }
  closeDialog() {
    $('#myModal').modal('hide');
    this.dialogStatus = false;
  }

  getValueForApi() {
    const formValue = this.checkoutForm.value;
    let obj;
    switch (this.workflowBool) {
      case 0:
        obj = this.getValueForPickUpAndDelivery(formValue);
        break;
      case 1:
        obj = this.getValueForAppointment(formValue);
        break;
      case 2:
        obj = this.getValueForAppointment(formValue);
    }
    return obj;
  }
  getValueForPickUpAndDelivery(formValue) {

    let apiObj, pickUpData, deliveryData;
    const defaultData = this.getDefaultApiValue(formValue);
    switch (this.pickUpOrDeliveryBool) {
      case 0:
        pickUpData = this.getValueForPickUp(true);
        if (pickUpData && pickUpData.data && (pickUpData.status !== 2)) {
          apiObj = Object.assign({}, defaultData, pickUpData.data);
        } else if (pickUpData && !pickUpData.status && !pickUpData.data) {
          apiObj = Object.assign({}, defaultData, pickUpData);
        }
        break;
      case 1:
        deliveryData = this.getValueForDelivery(true);
        if (deliveryData && deliveryData.data && (deliveryData.status !== 2)) {
          apiObj = Object.assign({}, defaultData, deliveryData.data);
        } else if (deliveryData && !deliveryData.status && !deliveryData.data) {
          apiObj = Object.assign({}, defaultData, deliveryData);
        }
        break;
      case 2:
        pickUpData = this.getValueForPickUp();
        deliveryData = this.getValueForDelivery();
        switch (this.pickUpAndDeliveryBool) {
          case 0:
            if (!pickUpData.status && !deliveryData.status) {
              this.languageStrings.fill_up_details_pickup = (this.languageStrings.fill_up_details_pickup_delivery || "Please fill up details either Pickup or DELIVERY_DELIVERY.")
              .replace( 'DELIVERY_DELIVERY' , this.terminology.DELIVERY);
              const msg = this.languageStrings.fill_up_details_pickup_delivery;
              this.popup.showPopup(MessageType.ERROR, 2500, msg, false);
            } else if (pickUpData.status === 2 || !pickUpData) {
              this.popup.showPopup(MessageType.ERROR, 2500, this.languageStrings.fill_up_details_pickup, false);
            } else if (deliveryData.status === 2 || !deliveryData) {
              this.languageStrings.fill_up_details_delivery = (this.languageStrings.fill_up_details_delivery || "Please fill up DELIVERY_DELIVERY details")
              .replace( 'DELIVERY_DELIVERY' , this.terminology.DELIVERY);
              const msg = this.languageStrings.fill_up_details_delivery;
              this.popup.showPopup(MessageType.ERROR, 2500, msg, false);
            } else if (pickUpData.status && deliveryData.status && this.checkTime(deliveryData.data, pickUpData.data)) {
              apiObj = Object.assign({}, defaultData, pickUpData.data, deliveryData.data);
            } else if (pickUpData.status && !deliveryData.status) {
              apiObj = Object.assign({}, defaultData, pickUpData.data, deliveryData.data);
            } else if (!pickUpData.status && deliveryData.status) {
              apiObj = Object.assign({}, defaultData, pickUpData.data, deliveryData.data);
            }
            break;
          case 1:
            if (pickUpData && deliveryData && this.checkTime(deliveryData, pickUpData)) {
              apiObj = Object.assign({}, defaultData, pickUpData, deliveryData);
            }
        }
        break;
    }
    return apiObj;
  }
  checkTime(deliveryData, pickUpData) {
    const deliveryTime = new Date(deliveryData.job_delivery_datetime);
    const pickupTime = new Date(pickUpData.job_pickup_datetime);
    if (deliveryTime.getTime() > pickupTime.getTime()) {
      return true;
    } else {
      this.popup.showPopup(MessageType.ERROR, 2500, this.languageStrings.delivery_time_greater_msg || "Delivery Time must be greater than Pickup Time!!", false);
      return false;
    }
  }


  checkStartEndDate(startDate, endDate) {
    const offset: any = new Date().getTimezoneOffset();
    const startDateTime: any = new Date(startDate);
    const endDateTime = new Date(endDate);
    const curDateTime = new Date();
    const today = new Date();
    const t1 = new Date(startDateTime + (offset * 60000));
    if (endDateTime.getTime() <= startDateTime.getTime()) {
      this.languageStrings.end_time_greater = (this.languageStrings.end_time_greater || "END_TIME should greater than START_TIME.")
      .replace( 'END_TIME' , this.terminology.END_TIME);
      this.languageStrings.end_time_greater = this.languageStrings.end_time_greater.replace( 'START_TIME' , this.terminology.START_TIME);

      const msg = this.languageStrings.end_time_greater;
      this.popup.showPopup(MessageType.ERROR, 2500, msg, false);
      return false;
    } else if ((t1.setSeconds(0) - today.setSeconds(0)) < 180000) {
      this.languageStrings.start_time_greater_3_mins = (this.languageStrings.start_time_greater_3_mins || "START_TIME should be 3 minutes greater than current time.")
      .replace( 'START_TIME' , this.terminology.START_TIME);

      const msg = this.languageStrings.start_time_greater_3_mins;
      this.popup.showPopup(MessageType.ERROR, 2500, msg, false);
      return false;
    } else if (((endDateTime.setSeconds(0) - startDateTime.setSeconds(0)) / 60000) < 2) {
      this.languageStrings.end_time_greater_2_mins = (this.languageStrings.end_time_greater_2_mins || "END_TIME should be 2 minutes greater than START_TIME.")
      .replace( 'END_TIME' , this.terminology.END_TIME);
      this.languageStrings.end_time_greater_2_mins = this.languageStrings.end_time_greater_2_mins.replace( 'START_TIME' , this.terminology.START_TIME);
      const msg = this.languageStrings.end_time_greater_2_mins;
      this.popup.showPopup(MessageType.ERROR, 2500, msg, false);
      return false;
    } else {
      return true;
    }
  }
  getDefaultApiValue(formValue) {
    const timezone = new Date().getTimezoneOffset();
    const defaultApiObj = {
      'layout_type': this.workflowBool,
      // "vendor_id": this.sessionService.getByKey('app', 'user', 'vendor_details').vendor_id,
      'job_description': formValue.notes || '',
      'timezone': timezone,
      // "auto_assignment": this.formSettings.auto_assign,
      'payment_method': this.checkWhichPaymentEnabled()
    };
    return defaultApiObj;
  }

  checkWhichPaymentEnabled() {
    let method = this.sessionService.get('appData').formSettings;
    for (let i = 0; i < method[0].payment_methods.length; i++) {
      if (method[0].payment_methods[i].enabled) {
        return method[0].payment_methods[i].value;
      }
    }
  }

  onAddressSave(status) {
    if (status) {
      this.fetchAddressNotify.next(true);
    }
    this.showAddAddress = false;
  }

  onSaveLocalLocation() {

    this.favLocationService.saveLocal.subscribe(data => {
      this.showAddAddress = false;
    });

  }

  onAddressSelect(address) {
    this.selectedAddress = address;
  }

  openAddAddress() {
    this.showAddAddress = true;
    this.editAddress = false;
    this.editValues = '';
  }

  openEditValue(event) {
    this.editValues = event;
    this.showAddAddress = true;
    this.editAddress = true;
  }

  getValueForPickUp(flag = false) {
    let pickUpObj;
    if (this.deliveryMethod != 'pickup' && this.businessModal !== 'RENTAL' && !this.staticAddress) {
      pickUpObj = this.deliveryAddressComponent.getValueForPickUp(flag);
    } else if (this.deliveryMethod != 'pickup' && this.businessModal !== 'RENTAL' && this.staticAddress) {
      pickUpObj = this.staticDeliveryAddress.getValueForPickUp(flag);
    } else {
      pickUpObj = this.pickUpComponent.getValueForPickUp(flag);
    }
    return pickUpObj;
  }
  getValueForDelivery(flag = false) {
    let deliveryObj;
    if (this.deliveryMethod != 'pickup' && this.businessModal !== 'RENTAL' && !this.staticAddress) {
      deliveryObj = this.deliveryAddressComponent.getValueForDelivery(flag);
    } else if (this.deliveryMethod != 'pickup' && this.businessModal !== 'RENTAL' && this.staticAddress) {
      deliveryObj = this.staticDeliveryAddress.getValueForDelivery(flag);
    } else {
      deliveryObj = this.deliveryComponent.getValueForDelivery(flag);
    }
    return deliveryObj;
  }
  getValueForAppointment(formValue) {
    const defaultData = this.getDefaultApiValue(formValue);
    const appointmentData = this.appointmentComponent.getValueForAppointment();
    if (appointmentData) {
      const apiObj = Object.assign({}, defaultData, appointmentData);
      return apiObj;
    }

  }
  setMomentForDelivery(moment1: any) {
    this.deliveryDateAndTime = moment1;
  }
  setMomentForPickUp(moment2: any) {
    this.pickUpDateAndTime = moment2;
  }
  protected setMoment(moment3: any): any {
    this.momentValue = moment3;
    // Do whatever you want to the return object 'moment'
  }
  hideDropDown() {
    this.dropDownService.changeStatus('');
  }
  goToPayment() {
    if (this.userBillPlan.amount) {

    }
  }

  // see original project for full list of options
  // can also be setup using the config service to apply to multiple pickers
  public selectedDate(value: any, datepicker?: any) {
    datepicker.start = value.start;
    datepicker.end = value.end;
    this.daterange.start = value.start;
    this.daterange.end = value.end;
    this.daterange.label = value.label;
  }
  goToBack() {
    history.back();
  }
  dateChanged() {
    $('body').css('position', 'relative');
    if (this.disableSchedulingInput) {
      return;
    }
    this.time = '';
    this.slots = {
      morning: new Set(),
      afternoon: new Set(),
      evening: new Set()
    };
    this.getTimeSlots(0);
    this.makeDateChangedGa('');
  }
  dateStartChanged() {
    $('body').css('position', 'relative');
    this.startTime = '';
    this.startSlots = {
      morning: new Set(),
      afternoon: new Set(),
      evening: new Set()
    };
    this.getTimeSlots('Start');
    this.dateStartGa('');
  }
  dateEndChanged() {
    $('body').css('position', 'relative');
    this.endTime = '';
    this.slots = {
      morning: new Set(),
      afternoon: new Set(),
      evening: new Set()
    };
    this.getTimeSlots('End');
    this.dateEndGa('');
  }

  dateAgentStartChanged() {
    $('body').css('position', 'relative');
    //this.maxStartDate = new Date();
    this.startTime = '';
    this.agentStartSlots = {
      morning: new Set(),
      afternoon: new Set(),
      evening: new Set()
    };
    this.getTimeSlots('Agent');
  }
  dateAgentEndChanged() {
    $('body').css('position', 'relative');
    this.maxEndDate = moment(this.bsStartValue).add(this.dayLimit, 'days').toDate();
    this.endTime = '';
    this.agentEndSlots = {
      morning: new Set(),
      afternoon: new Set(),
      evening: new Set()
    };
    // this.getTimeSlots('Agent');
  }

  onDatePickerShown() {
    $('body').css('position', 'initial');
    this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.choose_date_slots, 'Date Field Opened', 'Date Field Opened', '');
  }

  openTimePicker(slot) {
    if (slot) {
      this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.choose_time_slots, 'Time Field Opened', 'Time Field Opened', '');
    }
  }

  makeDateChangedGa(event) {
    let date = '';
    if (this.bsValue && this.time) {
      if (this.time && this.time.indexOf('-') > -1) {
        date = moment(moment(this.bsValue).format('YYYY-MM-DD') + this.time.split('-')[0], 'YYYY-MM_DDhh:mma').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
        this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.choose_time_slots, date, 'Date Time Selected', '');
      } else {
        date = moment(moment(this.bsValue).format('YYYY-MM-DD') + this.time, 'YYYY-MM_DDhh:mma').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
        this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.choose_time_slots, date, 'Date Time Selected', '');
      }
    } else {
      date = moment(moment(this.bsValue).format('YYYY-MM-DD'), 'YYYY-MM_DDhh:mma').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
      this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.choose_date_slots, date, 'Date Selected', '');
    }
  }

  dateStartGa(event) {
    let date = '';
    if (this.bsStartValue && this.startTime) {
      if (this.startTime && this.startTime.indexOf('-') > -1) {
        date = moment(moment(this.bsStartValue).format('YYYY-MM-DD') + this.startTime.split('-')[0], 'YYYY-MM_DDhh:mma').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
        this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.choose_time_slots, date, 'Date Time Selected', '');
      } else {
        date = moment(moment(this.bsStartValue).format('YYYY-MM-DD') + this.startTime, 'YYYY-MM_DDhh:mma').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
        this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.choose_time_slots, date, 'Date Time Selected', '');
      }
    } else {
      date = moment(moment(this.bsStartValue).format('YYYY-MM-DD'), 'YYYY-MM_DDhh:mma').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
      this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.choose_date_slots, date, 'Date Selected', '');
    }
  }

  dateEndGa(event) {
    let date = '';
    if (this.bsEndValue && this.endTime) {
      if (this.endTime && this.endTime.indexOf('-') > -1) {
        date = moment(moment(this.bsEndValue).format('YYYY-MM-DD') + this.endTime.split('-')[0], 'YYYY-MM_DDhh:mma').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
        this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.choose_time_slots, date, 'Date Time Selected', '');
      } else {
        date = moment(moment(this.bsEndValue).format('YYYY-MM-DD') + this.endTime, 'YYYY-MM_DDhh:mma').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
        this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.choose_time_slots, date, 'Date Time Selected', '');
      }
    } else {
      date = moment(moment(this.bsEndValue).format('YYYY-MM-DD'), 'YYYY-MM_DDhh:mma').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
      this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.choose_date_slots, date, 'Date Selected', '');
    }
  }

  checkIfStartSelected() {
    this.openStartSlots = false;
    if (this.startTime) {
      this.agentEndSlots = {
        morning: new Set(),
        afternoon: new Set(),
        evening: new Set()
      };
      this.makeEndSlotsForAgent();
      this.openEndSlots = !this.openEndSlots;
    } else {
      this.languageStrings.pls_select_start_time = (this.languageStrings.pls_select_start_time || "Please select START_TIME first.")
      .replace( 'START_TIME_START_TIME' , this.terminology.START_TIME);
      const msg = this.languageStrings.pls_select_start_time;
      this.popup.showPopup(MessageType.ERROR, 2500, msg, false);
      return;
    }
  }

  makeEndSlotsForAgent() {
    const startDateTime = moment(moment(this.bsStartValue).format('YYYY-MM-DD') + this.startTime.split('-')[0],
      'YYYY-MM_DDhh:mma').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
    const indexGot = this.slotDataAgent.findIndex( (o: any) => o.slot_start_time === startDateTime);
    for (let i = indexGot + 1; i < this.slotDataAgent.length; i++) {
      const current = moment(this.slotDataAgent[i].start);
      const end = moment(this.slotDataAgent[i].end);
      if (!moment().isAfter(current) && this.slotDataAgent[i].available_status === 0) {
        if (current.hours() < 12) {
          this.agentEndSlots.morning.add(current.format('hh:mm A') + ' - ' + end.format('hh:mm A'));
        } else if (current.hours() >= 12 && current.hours() < 17) {
          this.agentEndSlots.afternoon.add(current.format('hh:mm A') + ' - ' + end.format('hh:mm A'));
        } else {
          this.agentEndSlots.evening.add(current.format('hh:mm A') + ' - ' + end.format('hh:mm A'));
        }
      } else {
        return;
      }
    }
  }

  getTimeSlots(type) {
    const data: any = {};
  this.slots.evening=new Set();
  this.slots.morning=new Set();
  this.slots.afternoon=new Set();  
  this.checkoutForm.controls.time.setValue('');

    if (type === 'Agent') {
      data.date = moment(this.bsStartValue).format('YYYY-MM-DD');
      const productData = this.sessionService.getByKey('app', 'cart');
      data.product_id = productData[0].id;
    } else {

      if (this.restaurantInfo.scheduled_task && !this.restaurantInfo.enable_start_time_end_time) {
        data.date = moment(this.bsValue).format('YYYY-MM-DD');
      } else if (this.restaurantInfo.scheduled_task && this.restaurantInfo.enable_start_time_end_time && type === 'Start') {
        data.date = moment(this.bsStartValue).format('YYYY-MM-DD');
      } else if (this.restaurantInfo.scheduled_task && this.restaurantInfo.enable_start_time_end_time && type === 'End') {
        data.date = moment(this.bsEndValue).format('YYYY-MM-DD');
      } else if (this.restaurantInfo.scheduled_task && this.restaurantInfo.enable_start_time_end_time && !type) {
        data.date = moment(this.bsValue).format('YYYY-MM-DD');
      }
    }

    if(!data.date)
     data.date =  moment().format('YYYY-MM-DD')
     data.self_pickup=this.sessionService.getString('deliveryMethod') == "2" ? 1 : 0;
  if(this.restaurantInfo.display_range_intervals !=1){
     data.new_flow = 1;
    this.checkOutService.getSlotsForDay(data)
      .subscribe(response => {
        try {
          if (response.status === 200) {
            this.morning = [];
            this.afternoon = [];
            this.evening = [];
            if (type === 'Agent') {
              if (response.data && response.data.length === 0) {
                this.popup.showPopup(MessageType.ERROR, 2500, this.languageStrings.no_slot_avail || "No Slots Available", false);
                return;
              }
              this.slotDataAgent = response.data;
              this.timeConversion(this.slotDataAgent)
            } else {
              if (response.data.pre_booking_buffer) {
                this.pre_booking_buffer = response.data.pre_booking_buffer;
              }
              if (response.data && response.data.slots) {
                response.data.slots.map((item) => {
                  // this.intervals(item.start_time, item.end_time, type);
                  this.intervalsNew(item, type);
                });
              }
              let date_format = this.formSettings.date_format;
              let date_array=["dd-MMM-yyyy","dd-MM-yy","dd-MM-yyyy","MMMM dd yyyy"];
              if(date_array.includes(date_format))
              {
                date_format=date_format.toUpperCase();
              }
              if (type === 'Start') {
                this.startSlots.morning = new Set(Array.from(new Set(this.startSlots.morning)).sort());
                this.startSlots.afternoon = new Set(Array.from(new Set(this.startSlots.afternoon)).sort());
                this.startSlots.evening = new Set(Array.from(new Set(this.startSlots.evening)).sort());
                let slot = new Set();
                this.startSlots.morning.forEach((item, index) => {
                  if (this.config.time_format === this.timeFormat.TWELVE_HOURS) {
                    slot.add({ date: moment(item.date,`${date_format} hh:mm`).format('hh:mm'), booked: item.booked });
                  } else {
                    slot.add({ date: moment(item.date,`${date_format} HH:mm`).format('HH:mm'), booked: item.booked });
                  }
                });
                this.startSlots.morning = slot;
                slot = new Set();
                this.startSlots.afternoon.forEach((item, index) => {
                  if (this.config.time_format === this.timeFormat.TWELVE_HOURS) {
                    slot.add({ date: moment(item.date,`${date_format} hh:mm`).format('hh:mm'), booked: item.booked });
                  } else {
                    slot.add({ date: moment(item.date,`${date_format} HH:mm`).format('HH:mm'), booked: item.booked });
                  }
                });
                this.startSlots.afternoon = slot;
                slot = new Set();
                this.startSlots.evening.forEach((item, index) => {
                  if (this.config.time_format === this.timeFormat.TWELVE_HOURS) {
                    slot.add({ date: moment(item.date,`${date_format} hh:mm`).format('hh:mm'), booked: item.booked });
                  } else {
                    slot.add({ date: moment(item.date,`${date_format} HH:mm`).format('HH:mm'), booked: item.booked });
                  }
                });
                this.startSlots.evening = slot;
              } else {
                if (response.data.pre_booking_buffer) {
                  this.pre_booking_buffer = response.data.pre_booking_buffer;
                }
                if (response.data && response.data.slots) {
                  response.data.slots.map((item) => {
                    // this.intervals(item.start_time, item.end_time, type);
                    this.intervalsNew(item, type);
                  });
                }
                if (type === 'Start') {
                  this.startSlots.morning = new Set(Array.from(new Set(this.startSlots.morning)).sort());
                  this.startSlots.afternoon = new Set(Array.from(new Set(this.startSlots.afternoon)).sort());
                  this.startSlots.evening = new Set(Array.from(new Set(this.startSlots.evening)).sort());
                  let slot = new Set();
                  this.startSlots.morning.forEach((item, index) => {
                    if (this.config.time_format === this.timeFormat.TWELVE_HOURS) {
                      slot.add({ date: moment(item.date,`${date_format} hh:mm`).format('hh:mm'), booked: item.booked });
                    } else {
                      slot.add({ date: moment(item.date,`${date_format} HH:mm`).format('HH:mm'), booked: item.booked });
                    }
                  });
                  this.startSlots.morning = slot;
                  slot = new Set();
                  this.startSlots.afternoon.forEach((item, index) => {
                    if (this.config.time_format === this.timeFormat.TWELVE_HOURS) {
                      slot.add({ date: moment(item.date,`${date_format} hh:mm`).format('hh:mm'), booked: item.booked });
                    } else {
                      slot.add({ date: moment(item.date,`${date_format} HH:mm`).format('HH:mm'), booked: item.booked });
                    }
                  });
                  this.startSlots.afternoon = slot;
                  slot = new Set();
                  this.startSlots.evening.forEach((item, index) => {
                    if (this.config.time_format === this.timeFormat.TWELVE_HOURS) {
                      slot.add({ date: moment(item.date,`${date_format} hh:mm`).format('hh:mm'), booked: item.booked });
                    } else {
                      slot.add({ date: moment(item.date,`${date_format} HH:mm`).format('HH:mm'), booked: item.booked });
                    }
                  });
                  this.startSlots.evening = slot;
                } else {
                  this.slots.morning = new Set(Array.from(new Set(this.slots.morning)).sort());
                  this.slots.afternoon = new Set(Array.from(new Set(this.slots.afternoon)).sort());
                  this.slots.evening = new Set(Array.from(new Set(this.slots.evening)).sort());

                  let slot = new Set();
                  this.slots.morning.forEach((item, index) => {
                    if (this.config.time_format === this.timeFormat.TWELVE_HOURS) {
                      slot.add({ date: moment(item.date,`${date_format} hh:mm`).format('hh:mm'), booked: item.booked });
                    } else {
                      slot.add({ date: moment(item.date,`${date_format} HH:mm`).format('HH:mm'), booked: item.booked });
                    }
                  });
                  this.slots.morning = slot;
                  slot = new Set();
                  this.slots.afternoon.forEach((item, index) => {
                    if (this.config.time_format === this.timeFormat.TWELVE_HOURS) {
                      slot.add({ date: moment(item.date,`${date_format} hh:mm`).format('hh:mm'), booked: item.booked });
                    } else {
                      slot.add({ date: moment(item.date,`${date_format} HH:mm`).format('HH:mm'), booked: item.booked });
                    }
                  });
                  this.slots.afternoon = slot;
                  slot = new Set();
                  this.slots.evening.forEach((item, index) => {
                    if (this.config.time_format === this.timeFormat.TWELVE_HOURS) {
                      slot.add({ date: moment(item.date,`${date_format} hh:mm`).format('hh:mm'), booked: item.booked });
                    } else {
                      slot.add({ date: moment(item.date,`${date_format} HH:mm`).format('HH:mm'), booked: item.booked });
                    }
                  });
                  this.slots.evening = slot;

                }
              }
            }
          } else if (response.status === 400) {
          }
        } catch (e) {
          console.error(e);
        }
      },
        error => {
          console.error(error);
        });}
        else{
          this.checkOutService.getMerchantSlotsForDay(data)
          .subscribe(response => {
            try {
              if (response.status === 200) {
                this.morning = [];
                this.afternoon = [];
                this.evening = [];
                  if (response.data && response.data.length === 0) {
                    this.popup.showPopup(MessageType.ERROR, 2500, this.languageStrings.no_slot_avail || "No Slots Available", false);
                    return;
                  }
                  this.slotData = response.data.slots;
                  if (response.data.pre_booking_buffer) {
                  this.pre_booking_buffer = response.data.pre_booking_buffer;
                }
                  this.timeConversion(this.slotData,true,this.pre_booking_buffer)


              }
            } catch (e) {
              console.error(e);
            }
          },
            error => {
              console.error(error);
            });
        }
  }

  timeConversion(slotDataAgent,isMerchant = false,buffer_time?:number){
    const offset = new Date().getTimezoneOffset();
    const newSlots = [];
  const preOrderBufferTime=buffer_time?buffer_time:0;
    for (let i = 0; i < slotDataAgent.length; i++) {
      if (isMerchant || slotDataAgent[i].available_status === 0) {
        const slotStartTime: any = new Date(slotDataAgent[i].start_time).getTime();
        const actualStartSlot: any = new Date(slotStartTime + (offset * 60000));
        const slotEndTime: any = new Date(slotDataAgent[i].end_time).getTime();
        const actualEndSlot: any = new Date(slotEndTime + (offset * 60000));
        slotDataAgent[i].start = moment(actualStartSlot).format((this.formSettings.date_format ? this.formSettings.date_format.toUpperCase() : 'YYYY-MM-DD')+' HH:mm');
        slotDataAgent[i].end = moment(actualEndSlot).format((this.formSettings.date_format ? this.formSettings.date_format.toUpperCase() : 'YYYY-MM-DD')+' HH:mm');
        newSlots.push(slotDataAgent[i]);

        let start_date, end_end, date_format = this.formSettings.date_format? this.formSettings.date_format.toUpperCase(): "YYYY-MM-DD";
        if (this.formSettings.time_format === this.timeFormat.TWELVE_HOURS) {
          start_date = moment(slotDataAgent[i].start, `${date_format} hh:mm A`);
          end_end = moment(slotDataAgent[i].end, `${date_format} :mm A`);
        } else {
          start_date = moment(slotDataAgent[i].start, `${date_format} HH:mm`);
          end_end = moment(slotDataAgent[i].end, `${date_format} HH:mm`);
        }
        const current = start_date;
        const end = end_end;

        if (!moment().add(preOrderBufferTime, 'minutes').isAfter(current)) {
          if (current.hours() < 12) {
            if (this.config.time_format === this.timeFormat.TWELVE_HOURS) {
              if(isMerchant){
                this.slots.morning.add({date: moment(current._i,`${date_format} hh:mm A`).format('hh:mm A') + ' - ' + moment(end._i,`${date_format} hh:mm A`).format('hh:mm A'), booked: slotDataAgent[i].is_booked});
              }else{
                this.agentStartSlots.morning.add(moment(current._i,`${date_format} hh:mm A`).format('hh:mm A') + ' - ' + moment(end._i,`${date_format} hh:mm A`).format('hh:mm A'));
              }

            } else {
              if(isMerchant){
                this.slots.morning.add({date: moment(current._i,`${date_format} HH:mm`).format('HH:mm') + ' - ' + moment(end._i,`${date_format} HH:mm`).format('HH:mm'), booked: slotDataAgent[i].is_booked});
              }else{
                this.agentStartSlots.morning.add(moment(current._i,`${date_format} HH:mm`).format('HH:mm') + ' - ' + moment(end._i,`${date_format} HH:mm`).format('HH:mm'));
              }
            }
          } else if (current.hours() >= 12 && current.hours() < 17) {
            if (this.config.time_format === this.timeFormat.TWELVE_HOURS) {
              if(isMerchant){
                this.slots.afternoon.add({date: moment(current._i,`${date_format} hh:mm A`).format('hh:mm A') + ' - ' + moment(end._i,`${date_format} hh:mm A`).format('hh:mm A'), booked: slotDataAgent[i].is_booked});
              }else{
                this.agentStartSlots.afternoon.add(moment(current._i,`${date_format} hh:mm A`).format('hh:mm A') + ' - ' + moment(end._i,`${date_format} hh:mm A`).format('hh:mm A'));
              }
              //this.slots.afternoon.add(moment(current._i,`${date_format} hh:mm A`).format('hh:mm A') + ' - ' + moment(end._i,`${date_format} hh:mm A`).format('hh:mm A'));
            } else {
              if(isMerchant){
                this.slots.afternoon.add({date: moment(current._i,`${date_format} HH:mm`).format('HH:mm') + ' - ' + moment(end._i,`${date_format} HH:mm`).format('HH:mm'), booked: slotDataAgent[i].is_booked});
              }else{
                this.agentStartSlots.afternoon.add(moment(current._i,`${date_format} HH:mm`).format('HH:mm') + ' - ' + moment(end._i,`${date_format} HH:mm`).format('HH:mm'));
              }

            }
          } else {
            if (this.config.time_format === this.timeFormat.TWELVE_HOURS) {
              if(isMerchant){
                this.slots.evening.add({date: moment(current._i,`${date_format} hh:mm A`).format('hh:mm A') + ' - ' + moment(end._i,`${date_format} hh:mm A`).format('hh:mm A'), booked: slotDataAgent[i].is_booked});
              }else{
                this.agentStartSlots.evening.add(moment(current._i,`${date_format} HH:mm`).format('HH:mm') + ' - ' + moment(end._i,`${date_format} HH:mm`).format('HH:mm'));
              }

            } else {
              if(isMerchant){
                this.slots.evening.add({date: moment(current._i,`${date_format} HH:mm`).format('HH:mm') + ' - ' + moment(end._i,`${date_format} HH:mm`).format('HH:mm'), booked: slotDataAgent[i].is_booked});
              }else{
                this.agentStartSlots.evening.add(moment(current._i,`${date_format} HH:mm`).format('HH:mm') + ' - ' + moment(end._i,`${date_format} HH:mm`).format('HH:mm'));
              }

            }
          }
        }
      }
    }
    if (newSlots && newSlots.length === 0) {
      this.popup.showPopup(MessageType.ERROR, 2500, this.languageStrings.no_slot_avail || "No Slots Available", false);
      return;
    }
  }
  intervalsNew(date, type) {
    let start;
    date.date = date.date.replace("T"," ").replace("Z", "");
    if (this.restaurantInfo.scheduled_task && !this.restaurantInfo.enable_start_time_end_time) {
      start = moment(date.date).format('YYYY-MM-DD HH:mm');
    } else if (this.restaurantInfo.scheduled_task && this.restaurantInfo.enable_start_time_end_time && type === 'Start') {
      start = moment(date.date).format('YYYY-MM-DD HH:mm');
    } else if (this.restaurantInfo.scheduled_task && this.restaurantInfo.enable_start_time_end_time && type === 'End') {
      start = moment(date.date).format('YYYY-MM-DD HH:mm');
    } else if (this.restaurantInfo.scheduled_task && this.restaurantInfo.enable_start_time_end_time && !type) {
      start = moment(date.date).format('YYYY-MM-DD HH:mm');
    }
    // round starting minutes up to nearest 15 (12 --> 15, 17 --> 30)
    // note that 59 will round up to 60, and moment.js handles that correctly
    // start.minutes(Math.ceil(start.minutes() / 15) * 15);
    const result = [];
    const current = moment(start);
    if (type === 'Start') {
      if (!moment().add(this.pre_booking_buffer, 'minutes').isAfter(current)) {
        if (current.hours() < 12) {
          this.morning.push({ date: current.format((this.formSettings.date_format ? this.formSettings.date_format.toUpperCase() : 'YYYY-MM-DD')+' HH:mm'), booked: date.is_booked });
          this.startSlots.morning = new Set(this.getFilterOutDuplicate(this.morning));
          // this.morningSlots.add(current.format('hh:mm a'));
        } else if (current.hours() >= 12 && current.hours() < 17) {
          this.afternoon.push({ date: current.format((this.formSettings.date_format ? this.formSettings.date_format.toUpperCase() : 'YYYY-MM-DD')+' HH:mm'), booked: date.is_booked });
          this.startSlots.afternoon = new Set(this.getFilterOutDuplicate(this.afternoon));
          // this.afternoonSlots.add(current.format('hh:mm a'));
        } else {
          this.evening.push({ date: current.format((this.formSettings.date_format ? this.formSettings.date_format.toUpperCase() : 'YYYY-MM-DD')+' HH:mm'), booked: date.is_booked });
          this.startSlots.evening = new Set(this.getFilterOutDuplicate(this.evening));
          // this.eveningSlots.add(current.format('hh:mm a'));
        }
      }
    } else {
      // console.log('testing',moment().format("DD-MM-YYYY hh:mm:ss"),current.format("DD-MM-YYYY hh:mm:ss"),moment().isAfter(current));
      if (!moment().add(this.pre_booking_buffer, 'minutes').isAfter(current)) {
        if (current.hours() < 12) {
          this.morning.push({ date: current.format((this.formSettings.date_format ? this.formSettings.date_format.toUpperCase() : 'YYYY-MM-DD')+' HH:mm'), booked: date.is_booked });
          this.slots.morning = new Set(this.getFilterOutDuplicate(this.morning));
          // this.morningSlots.add(current.format('hh:mm a'));
        } else if (current.hours() >= 12 && current.hours() < 17) {
          this.afternoon.push({ date: current.format((this.formSettings.date_format ? this.formSettings.date_format.toUpperCase() : 'YYYY-MM-DD')+' HH:mm'), booked: date.is_booked });
          this.slots.afternoon = new Set(this.getFilterOutDuplicate(this.afternoon));
          // this.afternoonSlots.add(current.format('hh:mm a'));
        } else {
          this.evening.push({ date: current.format((this.formSettings.date_format ? this.formSettings.date_format.toUpperCase() : 'YYYY-MM-DD')+' HH:mm'), booked: date.is_booked });
          this.slots.evening = new Set(this.getFilterOutDuplicate(this.evening));
          // this.eveningSlots.add(current.format('hh:mm a'));
        }
      }
    }
  }

  getFilterOutDuplicate(data) {
    const uniq = {};
    let arrFiltered = data.filter(obj => !uniq[obj.date] && (uniq[obj.date] = true));
    return arrFiltered;
  }

  intervals(startString, endString, type) {
    let start, end;
    if (this.restaurantInfo.scheduled_task && !this.restaurantInfo.enable_start_time_end_time) {
      start = moment(moment(this.bsValue).format(this.formSettings.date_format ? this.formSettings.date_format.toUpperCase() : 'YYYY-MM-DD') + ' ' + startString, (this.formSettings.date_format ? this.formSettings.date_format.toUpperCase() : 'YYYY-MM-DD')+' HH:mm');
      end = moment(moment(this.bsValue).format(this.formSettings.date_format ? this.formSettings.date_format.toUpperCase() : 'YYYY-MM-DD') + ' ' + endString, (this.formSettings.date_format ? this.formSettings.date_format.toUpperCase() : 'YYYY-MM-DD')+' HH:mm');
    } else if (this.restaurantInfo.scheduled_task && this.restaurantInfo.enable_start_time_end_time && type === 'Start') {
      start = moment(moment(this.bsStartValue).format(this.formSettings.date_format ? this.formSettings.date_format.toUpperCase() : 'YYYY-MM-DD') + ' ' + startString, (this.formSettings.date_format ? this.formSettings.date_format.toUpperCase() : 'YYYY-MM-DD')+' HH:mm');
      end = moment(moment(this.bsStartValue).format(this.formSettings.date_format ? this.formSettings.date_format.toUpperCase() : 'YYYY-MM-DD') + ' ' + endString, (this.formSettings.date_format ? this.formSettings.date_format.toUpperCase() : 'YYYY-MM-DD')+' HH:mm');
    } else if (this.restaurantInfo.scheduled_task && this.restaurantInfo.enable_start_time_end_time && type === 'End') {
      start = moment(moment(this.bsEndValue).format(this.formSettings.date_format ? this.formSettings.date_format.toUpperCase() : 'YYYY-MM-DD') + ' ' + startString, (this.formSettings.date_format ? this.formSettings.date_format.toUpperCase() : 'YYYY-MM-DD')+' HH:mm');
      end = moment(moment(this.bsEndValue).format(this.formSettings.date_format ? this.formSettings.date_format.toUpperCase() : 'YYYY-MM-DD') + ' ' + endString, (this.formSettings.date_format ? this.formSettings.date_format.toUpperCase() : 'YYYY-MM-DD')+' HH:mm');
    } else if (this.restaurantInfo.scheduled_task && this.restaurantInfo.enable_start_time_end_time && !type) {
      start = moment(moment(this.bsValue).format(this.formSettings.date_format ? this.formSettings.date_format.toUpperCase() : 'YYYY-MM-DD') + ' ' + startString, (this.formSettings.date_format ? this.formSettings.date_format.toUpperCase() : 'YYYY-MM-DD')+' HH:mm');
      end = moment(moment(this.bsValue).format(this.formSettings.date_format ? this.formSettings.date_format.toUpperCase() : 'YYYY-MM-DD') + ' ' + endString, (this.formSettings.date_format ? this.formSettings.date_format.toUpperCase() : 'YYYY-MM-DD')+' HH:mm');
    }



    // round starting minutes up to nearest 15 (12 --> 15, 17 --> 30)
    // note that 59 will round up to 60, and moment.js handles that correctly
    // start.minutes(Math.ceil(start.minutes() / 15) * 15);
    const result = [];
    const current = moment(start);

    if (type === 'Start') {
      while (current <= end) {
        if (!moment().add(this.pre_booking_buffer, 'minutes').isAfter(current)) {
          if (current.hours() < 12) {
            this.startSlots.morning.add(current.format((this.formSettings.date_format ? this.formSettings.date_format.toUpperCase() : 'YYYY-MM-DD')+' HH:mm'));
            // this.morningSlots.add(current.format('hh:mm a'));
          } else if (current.hours() >= 12 && current.hours() < 17) {
            this.startSlots.afternoon.add(current.format((this.formSettings.date_format ? this.formSettings.date_format.toUpperCase() : 'YYYY-MM-DD')+' HH:mm'));
            // this.afternoonSlots.add(current.format('hh:mm a'));
          } else {
            this.startSlots.evening.add(current.format((this.formSettings.date_format ? this.formSettings.date_format.toUpperCase() : 'YYYY-MM-DD')+' HH:mm'));
            // this.eveningSlots.add(current.format('hh:mm a'));
          }
        }
        current.add(this.restaurantInfo.buffer_schedule, 'minutes');
      }
    } else {
      while (current <= end) {
        if (!moment().add(this.pre_booking_buffer, 'minutes').isAfter(current)) {
          if (current.hours() < 12) {
            this.slots.morning.add(current.format((this.formSettings.date_format ? this.formSettings.date_format.toUpperCase() : 'YYYY-MM-DD')+' HH:mm'));
            // this.morningSlots.add(current.format('hh:mm a'));
          } else if (current.hours() >= 12 && current.hours() < 17) {
            this.slots.afternoon.add(current.format((this.formSettings.date_format ? this.formSettings.date_format.toUpperCase() : 'YYYY-MM-DD')+' HH:mm'));
            // this.afternoonSlots.add(current.format('hh:mm a'));
          } else {
            this.slots.evening.add(current.format((this.formSettings.date_format ? this.formSettings.date_format.toUpperCase() : 'YYYY-MM-DD')+' HH:mm'));
            // this.eveningSlots.add(current.format('hh:mm a'));
          }
        }
        current.add(this.restaurantInfo.buffer_schedule, 'minutes');
      }
    }
  }

  goBack() {
    history.back();
  }

  validateServingAddress(checkoutData): Observable<any> | Promise<any> | any {
    let data = {
      job_pickup_latitude: checkoutData.cart.job_pickup_latitude,
      job_pickup_longitude: checkoutData.cart.job_pickup_longitude,
      customer_address: checkoutData.cart.job_pickup_address
    };
    return new Promise((resolve, reject) => {
      this.checkOutService.validateAddress(data).subscribe((response: any) => {
        if (response.status === 200) {
          resolve(response);
        } else {
          reject(response);
        }
      }, error => {
        reject(error);
      })
    });
  }

  /**
   * functin to check minimum quantity for products
   */
  checkMinProductQuantity() {
    let cart = this.sessionService.get('app').cart;
    let msg = '';
    let match = false;
    cart.forEach(element => {
      if (element.quantity < element.minimum_quantity) {
        msg = this.languageStrings.quantity_less_than_min || "Quantity of ___ is less than minimum quantity ___";
        msg = msg.replace('___', element.name);
        msg = msg.replace('___', element.minimum_quantity);
        match = true
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
   * functin to check maximum quantity for products
   */
  checkMaxProductQuantity() {
    let cart = this.sessionService.get('app').cart;
    let msg = '';
    let match = false;
    cart.forEach(element => {
      if (element.maximum_quantity > 0 ) {
        if (element.quantity > element.maximum_quantity) {
        msg = this.languageStrings.quantity_greater_than_max || "Quantity of ___ is greater than maximum quantity ___";
        msg = msg.replace('___', element.name);
        msg = msg.replace('___', element.maximum_quantity);
        match = true;
      }
    }
  }
  );
    if (match) {
      this.popup.showPopup('error', 2000, msg, false);
      return false;
    } else {
      return true;
    }

  }
  setNotes(data: string) {
    this.checkoutForm.controls.notes.setValue(data);
  }

  // /**
  //  * function to check for min qty on blur and decrement action
  //  * @param id
  //  * @param index
  //  * @param product
  //  * @param method 0- blur action, 1 - decrement btn action
  //  */
  // checkforMinQty(id, index, product, method) {
  //   this.selectedOperationMethod = method;
  //   let minCheck = false;
  //   if(!method){
  //     minCheck = (product.quantity < product.minimum_quantity); //blur condition
  //   }else{
  //     minCheck = (product.quantity <= product.minimum_quantity); //decrement condition
  //   }
  //   if (+product.quantity && (+product.minimum_quantity > 1) && minCheck) {
  //     this.selectedCartItemId = id;
  //     this.selectedCartItemIndex = index;
  //     let msg = this.langJson['In ___ quantity cannot be less than minimum quantity ___. Would you like to remove the product from cart?'];
  //     msg = msg.replace('___', product.name);
  //     msg = msg.replace('___', product.minimum_quantity);
  //     this.messageRemoveItem = msg;
  //     this.removeCartItemPopup = true;
  //   } else {
  //     if (!method) {
  //       this.onBlurFunction(id, index, product.quantity);
  //     } else {
  //       this.decreamentQuantity(id, index);
  //     }

  //   }
  // }

  // /**
  //  * function to retain input product previous qty
  //  * @param event
  //  */
  // onFocusQty(event) {
  //   this.prevoiusQty = event.target.value;
  // }

  // /**
  //  * function to execute remove after confirmation
  //  * @param id
  //  * @param index
  //  * @param method 0-blur 1-decrement btn
  //  * @param flag 1-remove, 0-retain
  //  */




  // checkout template
  protected isCheckoutEnabled() {
    const user_id = Number(this.sessionService.get('user_id')?this.sessionService.get('user_id'):this.sessionService.get('info')['storefront_user_id'])
    this.checkOutService.isCheckoutTemplateEnabled(CheckoutTemplateType.NORMAL_ORDER,user_id)
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

  toggleSlotPicker() {
    if (!this.disableSchedulingInput) {
    this.openSlots = !this.openSlots;
    }
  }

  /**
   * SET TIME FORMAT
   */
  setTimeFormat(type, value) {
    switch (type) {
      case 'simple':
        if (this.config.time_format === this.timeFormat.TWELVE_HOURS) {
          if(this.restaurantInfo.display_range_intervals ==1){
            this.tFormat = '';
          }else{
            this.tFormat = value;
          }

        } else {
          this.tFormat = '';
        }
        break;
      case 'start':
        if (this.config.time_format === this.timeFormat.TWELVE_HOURS) {
          this.tStartFormat = value;
        } else {
          this.tStartFormat = '';
        }
        break;
      case 'end':
        if (this.config.time_format === this.timeFormat.TWELVE_HOURS) {
          this.tEndFormat = value;
        } else {
          this.tEndFormat = '';
        }
        break;
      default:
        break;
    }
  }

  /**
   * changeOrderType
   */
  changeOrderType(type) {
    switch (type) {
      case OrderType.SCHEDULED_ORDER:
        if (this.orderType != OrderType.SCHEDULED_ORDER) {
          this.checkOutService.recurringTaskDataChange.emit({});
                  this.checkoutForm.controls['schedule_radio'].setValue(true);
        }
        this.orderType = type;
        break;
      case OrderType.RECURRING_ORDER:
        if(this.recurringEnabled && this.restaurantInfo.is_delivery_charge_surge_active && !this.selectedAddress){
          this.popup.showPopup(MessageType.ERROR, 2500, this.languageStrings.pls_select_delivery_address || "Please select a Delivery Address", false);
            return;
        }
        this.checkoutForm.controls['schedule_radio'].setValue(false);
        this.orderType = type;
        break;
      case OrderType.INSTANT_ORDER:
        if (this.orderType != OrderType.INSTANT_ORDER) {
          this.checkoutForm.controls['schedule_radio'].setValue(false);
          this.checkOutService.recurringTaskDataChange.emit({});
        }
        this.orderType = type;
        break;

    }
  }

  onSelectAgent(agent, index){
    this.selectedAgent = agent;
    this.sessionService.setString('selected_agent', this.selectedAgent ? this.selectedAgent.fleet_id : '');
    this.selectedAgentIndex = index;
    this.getSlotsForDayForAgent();
    if(document.getElementById("slots") != undefined){
      document.getElementById("slots").scrollIntoView({
        behavior: "smooth",
        block : "center"
    });
    } else {
      setTimeout(() => {
        document.getElementById("slots").scrollIntoView({
          behavior: "smooth",
          block : "center"
      });
      }, 305);
    }
  }

  getSlotsForDayForAgent() {
    this.openStartSlots = false;
    const obj = {
      currency_id: this.formSettings.payment_settings[0].currency_id,
      agent_id: this.selectedAgent ? this.selectedAgent.fleet_id : undefined,
      marketplace_user_id: this.formSettings.marketplace_user_id,
      timezone : new Date().getTimezoneOffset(),
      date : moment(this.bsValue).format('YYYY-MM-DD'),
      user_id : this.sessionService.get('info')['storefront_user_id']
    }
    obj['product_ids'] = [];
    let cartData = this.cartService.getCartData();
    if (cartData) {
      cartData.forEach(el => {
        if (el.id) {
          obj['product_ids'].push(el.id);
        }
      });
    }
    if(this.restaurantInfo && this.restaurantInfo.self_pickup){
      if (this.sessionService.getString("deliveryMethod")) {
        const method = Number(this.sessionService.getString("deliveryMethod"));
        if((method == 1 || method == 8) && (!this.restaurantInfo.available && this.restaurantInfo.scheduled_task)){
          obj["self_pickup"] = 0;
        }
        else{
          obj["self_pickup"] = 1;
        }
      }
    }
    this.checkOutService.getSlotsForDayForAgent(obj).subscribe(response=>{
      try {
        if(response.status === 200){
          this.startTime = '';
          $('div.slot-ui').each(function () {
            $(this).removeClass('selected-slot-ui');
          });
          this.morning = [];
          this.afternoon = [];
          this.evening = [];
          this.agentStartSlots = {
            morning: new Set(),
            afternoon: new Set(),
            evening: new Set()
          };
          this.slotDataAgent = response.data;
          const newSlots = [];
          const offset = new Date().getTimezoneOffset();
          let date,date_format = this.formSettings.date_format;
          let date_array=["dd-MMM-yyyy","dd-MM-yy","dd-MM-yyyy","MMMM dd yyyy"];
          if(date_array.includes(date_format))
          {
            date_format=date_format.toUpperCase();
          }
          for (let i = 0; i < this.slotDataAgent.length; i++) {
            if (this.slotDataAgent[i].available_status === 0) {
              const slotStartTime: any = new Date(this.slotDataAgent[i].slot_start_time).getTime();
              const actualStartSlot: any = new Date(slotStartTime + (offset * 60000));
              const slotEndTime: any = new Date(this.slotDataAgent[i].slot_end_time).getTime();
              const actualEndSlot: any = new Date(slotEndTime + (offset * 60000));
              this.slotDataAgent[i].start = moment(actualStartSlot).format((this.formSettings.date_format ? this.formSettings.date_format.toUpperCase() : 'YYYY-MM-DD')+' HH:mm');
              this.slotDataAgent[i].end = moment(actualEndSlot).format((this.formSettings.date_format ? this.formSettings.date_format.toUpperCase() : 'YYYY-MM-DD')+' HH:mm');
              newSlots.push(this.slotDataAgent[i]);

              date = moment(this.slotDataAgent[i].start,`${date_format} hh:mm`);
              const current = date;
              const end = moment(this.slotDataAgent[i].end);
              if (!moment().isAfter(current)) {
                if (current.hours() < 12) {
                  if (this.formSettings.time_format === this.timeFormat.TWELVE_HOURS) {
                    this.agentStartSlots.morning.add(moment(current._i,`${date_format} hh:mm A`).format('hh:mm A'));
                  } else {
                    this.agentStartSlots.morning.add(moment(current._i,`${date_format} HH:mm`).format('HH:mm'));
                  }
                } else if (current.hours() >= 12 && current.hours() < 17) {
                  if (this.formSettings.time_format === this.timeFormat.TWELVE_HOURS) {
                    this.agentStartSlots.afternoon.add(moment(current._i,`${date_format} hh:mm A`).format('hh:mm A'));
                  } else {
                    this.agentStartSlots.afternoon.add(moment(current._i,`${date_format} HH:mm`).format('HH:mm'));
                  }
                } else {
                  if (this.formSettings.time_format === this.timeFormat.TWELVE_HOURS) {
                    this.agentStartSlots.evening.add(moment(current._i,`${date_format} hh:mm A`).format('hh:mm A'));
                  } else {
                    this.agentStartSlots.evening.add(moment(current._i,`${date_format} HH:mm`).format('HH:mm'));
                  }
                }
              }
            }
          }

          if (newSlots && newSlots.length === 0) {
            this.popup.showPopup(MessageType.ERROR, 2500, this.languageStrings.no_slot_avail || "No Slots Available", false);
            return;
          }
        } else if(response.status === 400){

        }
      } catch (e){

      }
    }, err =>{
      console.error(err);
    })
  }

  checkAvailabilityOfSlots() {

    const dataSend = {
      start_time:  this.getAgentStartTime(this.bsValue, this.startTime),
      currency_id: this.formSettings.payment_settings[0].currency_id,
      user_id : this.sessionService.get('info')['storefront_user_id'],
      marketplace_user_id: this.sessionService.get('config').marketplace_user_id
    };
    dataSend['product_ids'] = [];
    let cartData = this.cartService.getCartData();
    if (cartData) {
      cartData.forEach(el => {
        if (el.id) {
          dataSend['product_ids'].push(el.id);
        }
      });
    }
    if (this.sessionService.get('appData')) {
      dataSend['vendor_id'] = this.sessionService.get('appData').vendor_details.vendor_id;
      dataSend['access_token'] = this.sessionService.get('appData').vendor_details.app_access_token;
    }
      dataSend['agent_id']= this.selectedAgent ? this.selectedAgent.fleet_id : undefined;
    this.checkOutService.checkTimeSlots(dataSend)
      .subscribe(response => {
        try {
          if (response.status === 200) {

          } else if (response.status === 400) {
            this.popup.showPopup(MessageType.ERROR, 2000, response.message, false);
          } else {
            this.popup.showPopup(MessageType.ERROR, 2500, response.message, false);
          }
        } catch (e) {
          console.error(e);
        }
      },
        error => {
          console.error(error);
        });
  }

  getAgentStartTime(date,time){
    let agentDate = ''
    if (date && time) {
      if (time && time.indexOf('-') > -1) {
        agentDate = moment(moment(date).format('YYYY-MM-DD') + time.split('-')[0], 'YYYY-MM_DDhh:mma').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
      } else {
        agentDate = moment(moment(date).format('YYYY-MM-DD') + time, 'YYYY-MM_DDhh:mma').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
      }
    }
    return agentDate;
  }
   // OFTEN BOUGHT PRODUCTS POPUP WORK
   MoveToOftenBought() {
    this.router.navigate(['often-bought-product-page']);
  }
  getProductsOfBanners() {
    const obj: any = {
      marketplace_user_id: this.config.marketplace_user_id,
      user_id: this.sessionService.getString('user_id'),
      limit: 3,
      offset: 0
    };
    if (this.sessionService.get('appData')) {
      obj['vendor_id'] = this.sessionService.get('appData').vendor_details.vendor_id;
      obj['access_token'] = this.sessionService.get('appData').vendor_details.app_access_token;
    }
    if (this.oftenBoughtArray && this.oftenBoughtArray.length > 0) {
      if(this.oftenBoughtArray.length > 3){
        this.oftenBoughtArray.length = 3;
      }
      obj['product_ids_array'] = this.oftenBoughtArray;
    }
    this.catalogueService.getProduct(obj).subscribe(response => {
      if (response.status === 200) {
        this.searchOn = 1;
        this.hideCategory = true;
        this.productList = response.data;
        if(this.productList && this.productList.length > 0){
          this.oftenBoughtModal = true;
        }
        for (let i = 0; i < this.productList.length; i++) {
          this.productList[
            i
          ].long_description = this.catalogueService.convertStringToBreakHTML(
            this.productList[i].long_description
          );
          if (this.productList[i].layout_data.lines &&
            this.productList[i].layout_data.lines[1] &&
            this.productList[i].layout_data.lines[1].data) {
            this.productList[i].layout_data.lines[1].data = this.catalogueService.convertStringToBreakHTML(this.productList[i].layout_data.lines[1].data);
          }
          if (
            this.productList[i].thumb_list &&
            (!this.productList[i].thumb_list['400x400'] ||
              this.productList[i].thumb_list['400x400'] === '')
          ) {
            this.productList[i].thumb_list = null;
          } else if (!this.productList[i].thumb_list) {
            this.productList[i].thumb_list = null;
          }
        }

        // -------------- data handing for element product list --------------//
        const dataObj: IProdultListPageData = {
          productList: this.productList,
          searchProducts: this.searchOn,
          cardInfo:  this.restaurantInfo,
          paginating: true,
          hasImages: this.product_has_images,
          layout_type: this.product_layout_type,
          isRestaurantActive:
            this.restaurantInfo.available || this.restaurantInfo.scheduled_task
        };

        this.catalogueService.productList.next(JSON.parse(JSON.stringify(dataObj)));
        this.productShimmer = false;
        // -------------- data handing for element product list-------------//

        this.checkCartData = this.cartService.getCartData();
      }
    });
  }

  hideOftenBoughtModal(){
    this.oftenBoughtModal = false;
  }
  // OFTEN BOUGHT PRODUCTS POPUP WORK
}
