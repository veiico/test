import { MessageType } from './../../constants/constant';
import {
  Component,
  OnInit,
  ElementRef,
  NgZone,
  AfterViewInit,
  Renderer2
} from "@angular/core";
import { OnRatingChangeEven } from "angular-star-rating/star-rating-struct";
import * as $ from "jquery";

import { LoaderService } from "../../services/loader.service";
import { PopUpService } from "../../modules/popup/services/popup.service";
import { OrdersService } from "./orders.service";
import { SessionService } from "../../services/session.service";
import { MessageService } from "../../services/message.service";
import { AppService } from "../../app.service";
import { ExternalLibService } from "../../services/set-external-lib.service";
import { TransactionStatus, priceType } from "../../constants/constant";
import { OnboardingBusinessType, PromotionOn, TransactionStatusEnum, BusinessType, TaskType, PaymentMode, DeliveryMethod } from "../../enums/enum";
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { ModalType } from '../../constants/constant';
import { MapsAPILoader } from '@agm/core';
import { FetchLocationService } from '../fetch-location/fetch-location.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { ConfirmationService } from '../../modules/jw-notifications/services/confirmation.service';

declare var $: any;

@Component({
  selector: "app-orders",
  templateUrl: "./orders.component.html",
  styleUrls: ["./orders.component.scss"],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({transform: 'translateY(0)', opacity: 0}),
        animate('300ms', style({transform: 'translateY(0)', opacity: 1}))
      ]),
      transition(':leave', [
        style({transform: 'translateY(0)', opacity: 1}),
      ])
    ])
  ]
})
export class OrdersComponent implements OnInit, AfterViewInit {
  foodFlow: boolean;
  totalPrice:number=0;
  removeCartData: boolean;
  goToCheckout: boolean;
  restaurantData: any;
  productIdDetail={};
  productDetails: any;
  customizationId=[];
  productOrderDetail: any;
  errorMsg: any;
  currentCustomizeObj: {};
  orderDetails: any;
  productData: any;
  agentData: any;
  ordersData = [];
  tempordersData = [];
  public modalType = ModalType;
  cancelDialog: any = {};
  protected dialogStatus: boolean;
  appConfig;
  ecomView: boolean;
  pageoffset;
  pagelimit;
  public showTemplatePopup = false;
  public showAgentData = false;
  public mapTemplatePopup = false;
  bg_color = "#fffff";
  profile_color = "#fffff";
  stopScrollHit = false;
  showPaginating = false;
  subtotal = 0;
  ordersCount;
  currency;
  mapStyle;
  details;
  orderForRating;
  orderForCancel;
  terminology: any = {};
  public productBool: any = {};
  hitC = false;
  public langJson: any = {};
  public unit_count = 0;
  public tookanStatusColor;
  public productDetail=[];

  _elementRef: ElementRef;
  public languageSelected: any;
  public autoCompleteGoogleForm: FormGroup;
  public direction = "ltr";
  onRatingChangeResult: OnRatingChangeEven;
  showChatIcon: boolean;
  reasonNotSelected: boolean;
  selectedReason;
  reasonData: any[] = [];
  headerData;
  formSettings: any;
  projectName: any;
  cancelType: number;
  showAdditonalInfo = false;
  additionalPrice;
  transactionStatus = TransactionStatus;
  priceTypeConst = priceType;
  isLaundryFlow: boolean;
  scrollSubscription;
  cancellationEnabled;
  openCancellationPopUp: boolean = false;
  cancelRules: any[] = [];
  refundDetails: any[] = [];
  paymentMode = PaymentMode;
  public isViewMoreOn : boolean[] = [];
  public showTemplateInfo : boolean = false;
  public productHasTemplate : boolean = false;
  public showMerchantDetails :boolean = true;


  //enums
  transactionStatusEnum = TransactionStatusEnum;
  taskTypeEnum = TaskType;
  businessTypeEnum = BusinessType;
  deliveryMethod=DeliveryMethod;

  isPlatformServer: boolean;
  openRatingReview: boolean;
  showAgentRatingTab: boolean;
  lat: number;
  lng: number;
  locationLatLong: any;
  storeAddress: any;
  deliveryMode: number;
  editOrder: boolean;
  edit_storepage_slug: any;
  edit_merchant_id: any;
  editJobId: any;
  languageStrings: any={};
  public hybridAppsView: boolean = false;
  constructor(
    protected service: OrdersService,
    protected loader: LoaderService,
    protected popup: PopUpService,
    protected sessionService: SessionService,
    protected messageService: MessageService,
    elementRef: ElementRef,
    protected ngZone: NgZone,
    public appService: AppService,
    protected extService: ExternalLibService,
    protected renderer: Renderer2,
    protected router: Router,
    protected mapsAPILoader: MapsAPILoader,
    protected fetchLocationService: FetchLocationService,
    protected confirmationService : ConfirmationService
  ) {
    this.ecomView =
      this.sessionService.get("config").business_model_type === "ECOM" &&
      this.sessionService.get("config").nlevel_enabled === 2;
    this.cancelType = this.sessionService.get(
      "config"
    ).cancellation_reason_type;
    this.tookanStatusColor = {
      9: "#26cfd4",
      10: "#26cfd4",
      11: "#ba68c8",
      12: "#181fdd",
      13: "#3fc95f",
      14: "#ffc107",
      15: "#fa4008",
      16: "#26cfd4",
      17: "#26cfd4",
      44: "#ff1b99",
      45: "#29C4CB",
      46: "#181fdd"
      
    };
    this._elementRef = elementRef;
    $(this._elementRef.nativeElement).on("hidden.bs.modal", () => {
      // this.getOrders();
      this.details = "";
    });
    this.appConfig = this.sessionService.get("config");
    // checks for ar translations
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
  }
  ngAfterViewInit() {
    this.pageoffset = 0;
    this.pagelimit = this.pageoffset + 10;
  }

  ngOnInit() {
    this.isPlatformServer = this.sessionService.isPlatformServer();
    this.mapStyle = this.fetchLocationService.getMapStyle();
    this.deliveryMode=Number(this.sessionService.getString('deliveryMethod'))

    this.headerData = this.sessionService.get("config");
    this.sessionService.remove('isReOrder');
    this.sessionService.remove('editJobId');

    if(this.sessionService.get('pwa_app') && this.sessionService.get("device_type_app")){
      this.hybridAppsView = true;
    }
    // hide merchant details if disable from merchant Dashboard
    if(!this.headerData.display_merchant_phone){
      this.showMerchantDetails = false;
    }

    this.pageoffset = 0;
    this.pagelimit = this.pageoffset + 10;
    this.bg_color = this.sessionService.get("config")
      ? this.sessionService.get("config").header_color
      : "";
    this.profile_color = this.sessionService.get("config")
      ? this.sessionService.get("config").color
      : "";
    if (!this.isPlatformServer) {
      this.getOrders();
    }
    if (this.appConfig.terminology) {
      this.terminology = this.appConfig.terminology;
    }

    this.isLaundryFlow = this.appConfig.onboarding_business_type === OnboardingBusinessType.LAUNDRY;
    let oboardingType=[805,12,701]
    this.foodFlow = !(oboardingType.includes(this.appConfig.onboarding_business_type));
    this.loader.show();
    const formSettings = this.sessionService.get("config");
    this.formSettings = this.sessionService.get("config");

    const currency = formSettings["payment_settings"];
    if (currency) {
      this.currency = currency[0].symbol;
    }
    this.messageService.showOrderData.subscribe(data => {
      for (let order = 0; order < this.ordersData.length; order++) {
        if (
          this.ordersData[order].job_id ===
          this.sessionService.getString("job_id")
        ) {
          // this.details = this.ordersData[order];
          this.openNav(this.ordersData[order]);
          if (
            this.ordersData[order].job_status === 13 &&
            this.ordersData[order].is_job_rated === 0
          ) {
            this.showRatingDialog(this.ordersData[order]);
          }
          this.sessionService.remove("job_id");
        }
      }
    });


    // $("body").on("scroll", () => {
    //   const getOffset = $(document).height() - $(window).height();
    //   if ($("body").scrollTop() === getOffset && getOffset !== 0) {
    //     this.ngZone.run(() => {
    //       this.onScroll("");
    //     });
    //   }
    // });

    this.scrollSubscription = this.renderer.listen('body', 'scroll', (event) => {
      const newOffset = event.target.scrollHeight - event.target.offsetHeight;
      const newScollTop = event.target.scrollTop
      if (newScollTop === newOffset && newOffset !== 0) {
        this.onScroll("");
      }
    });
    // ================language json manupilation======================
    this.appService.langPromise.then(() => {
      this.langJson = this.appService.getLangJsonData() || {};
    });

    if (this.sessionService.get("config").is_fugu_chat_enabled) {
      this.showChatIcon = true;
    } else {
      this.showChatIcon = false;
    }
    this.extService.updateFuguWidget();
    this.sessionService.langStringsPromise.then(() =>
    {
     this.languageStrings = this.sessionService.languageStrings;
     this.setLangKeys();
    });
  }
  setLangKeys() {
    this.languageStrings.pickup_time = (this.languageStrings.pickup_time || "Pickup Time")
    .replace('PICKUP_PICKUP',this.terminology.PICKUP)
    this.languageStrings.delivery_time = (this.languageStrings.delivery_time || "DELIVERY_DELIVERY Time")
    .replace('DELIVERY_DELIVERY',this.terminology.DELIVERY)
    this.languageStrings.locate_store = (this.languageStrings.locate_store || "Locate STORE_STORE")
    .replace("STORE_STORE", this.terminology.STORE )
    this.languageStrings.loyality_point_earned = (this.languageStrings.loyality_point_earned || "LOYALTY_POINTS Earned")
    .replace('LOYALTY_POINTS', this.terminology.LOYALTY_POINTS )
    this.languageStrings.loyality_point_expire_on = (this.languageStrings.loyality_point_expire_on || "LOYALTY_POINTS expiring on")
    .replace('LOYALTY_POINTS', this.terminology.LOYALTY_POINTS )
    this.languageStrings.additional_amount_by_agent = (this.languageStrings.additional_amount_by_agent || "Additional Amount(added) by AGENT_AGENT")
    .replace("AGENT_AGENT", this.terminology.AGENT )
    this.languageStrings.loyality_points_used = (this.languageStrings.loyality_points_used || "LOYALTY_POINTS Used")
    .replace("LOYALTY_POINTS",this.terminology.LOYALTY_POINTS)
    this.languageStrings.merchant_name = (this.languageStrings.merchant_name || "MERCHANT_MERCHANT Name")
    .replace('MERCHANT_MERCHANT',this.terminology.MERCHANT )
    this.languageStrings.merchant_phone = (this.languageStrings.merchant_phone || "MERCHANT_MERCHANT phone")
    .replace('MERCHANT_MERCHANT',this.terminology.MERCHANT )
    this.languageStrings.merchant_email = (this.languageStrings.merchant_email || "MERCHANT_MERCHANT email")
    .replace('MERCHANT_MERCHANT',this.terminology.MERCHANT )
    this.languageStrings.order_id = (this.languageStrings.order_id || "ORDER_ORDER Id")
    .replace('ORDER_ORDER',this.terminology.ORDER);
    this.languageStrings.order_amount = (this.languageStrings.order_amount || "ORDER_ORDER Amount")
    .replace('ORDER_ORDER',this.terminology.ORDER);
    this.languageStrings.order_time = (this.languageStrings.order_time || "ORDER_ORDER time")
    .replace('ORDER_ORDER',this.terminology.ORDER);
    this.languageStrings.cancel_order = (this.languageStrings.cancel_order || "cancel ORDER_ORDER")
    .replace('ORDER_ORDER',this.terminology.ORDER);
    this.languageStrings.pickup_details = (this.languageStrings.pickup_details || "PICKUP_PICKUP details")
    .replace('PICKUP_PICKUP',this.terminology.PICKUP);
    this.languageStrings.no_order_to_display = (this.languageStrings.no_order_to_display || "No ORDERS_ORDERS to display.")
    .replace('ORDERS_ORDERS',this.terminology.ORDERS);
    this.languageStrings.store_closed_now_try_other = (this.languageStrings.store_closed_now_try_other || "This store is closed now. Please try from some other store.")
    .replace('STORE_STORE',this.terminology.STORE);
    this.languageStrings.store_closed_now_try_other = this.languageStrings.store_closed_now_try_other.replace('STORE_STORE',this.terminology.STORE);
    this.languageStrings.store_not_serve_your_location = this.languageStrings.store_not_serve_your_location || "store cannot serve in your delivery location"
    .replace('STORE_STORE',this.terminology.STORE);
    this.languageStrings.productS_currently_unavail = (this.languageStrings.productS_currently_unavail || "These products are currently unavailable")
    .replace('PRODUCT_PRODUCT',this.terminology.PRODUCT);
    this.languageStrings.items_changed_in_cart_msg = (this.languageStrings.items_changed_in_cart_msg || "Some items are changed in your cart. Do you want to proceed?")
    .replace('CART_CART',this.terminology.CART);
    this.languageStrings.agent_information = (this.languageStrings.agent_information || "Agent Information")
    .replace('AGENT_AGENT',this.terminology.AGENT);
  }

  showRatingDialog(order) {
    $("#orderDetails").modal("hide");
    this.openRatingReview = true;
    this.showAgentRatingTab = false;
    this.orderForRating = order;
  }
  hideDialog() {
    this.openRatingReview = false;
    setTimeout(() => {
      this.pageoffset = 0;
      this.getOrders();
    }, 100);
  }

  shiftAgentRating(event) {
    this.getOrders();
    this.showAgentRatingTab = true;
  }

  checkForEditOrder(order){
    this.editOrder = true;
    this.removeCartData=false;
    this.goToCheckout=false;
    this.editJobId = order.job_id;
    this.edit_storepage_slug = order.storepage_slug || '-';
    this.edit_merchant_id = order.merchant_id;
    this.getRestaurantsForBrowser(order.orderDetails, order.user_id);
  }

  editOrderRedirection() {
    this.loader.hide();
    let cartData = this.sessionService.getByKey('app', 'cart');
    if(!cartData || this.removeCartData)
    {
      this.editOrder = false;
      let errorMsg=this.languageStrings.products_currently_unavail || "These products are currently unavailable";
      this.popup.showPopup(MessageType.ERROR, 2000,errorMsg, false);
      return ;
    }
    if((this.goToCheckout && !this.removeCartData) || (cartData && cartData.length<this.orderDetails.length))
    {
      this.popUpProductChangeMsg()
    }
    else if(!this.removeCartData && cartData)
    {
      this.router.navigate([`/store/${this.edit_storepage_slug}/${this.edit_merchant_id}`]);
    }

  }
  showCancelDialog(order) {
    this.orderForCancel = order;
    if (this.appConfig.is_cancellation_policy_enabled) {
      this.refundData(order);
    } else {
      if (!this.cancelType) {
        this.openCancelOrderPopup(order)
      } else {
        this.getCancelReasons(order);
      }
    }
  }
  openCancelOrderPopup(order: any) {
    $("#orderDetails").modal("hide");
    this.cancelDialog.show = true;
    this.cancelDialog.title = this.languageStrings.reason_for_cancellation || "Reason for cancellation";
    $("#orderDetailsFreelancer").modal("hide");
  }
  initiateChat(order) {
  let merchant;
   if (JSON.parse(order.store_name_json)) {
      merchant = JSON.parse(order.store_name_json)[this.languageSelected];
   } else {
     merchant = order.merchant_name;
   }
   this.startChat(order.grouping_tags, order.hippo_transaction_id, order.user_id, order.job_id,
   merchant,order.is_custom_order);
  }

  hideCancelDialog() {
    this.cancelDialog = {};
    setTimeout(() => {
      this.pageoffset = 0;
      this.getOrders();
    }, 100);
    this.popup.showPopup(MessageType.SUCCESS, 2000, 'Successful', false);
    // this.ref.detectChanges();
  }
  getCancelReasons(order) {
    const obj = {

      marketplace_user_id: this.appConfig.marketplace_user_id,
    };
    if (this.sessionService.get('appData')) {
      obj['vendor_id'] = this.sessionService.get('appData').vendor_details.vendor_id;
      obj['access_token'] = this.sessionService.get('appData').vendor_details.app_access_token;
    }
    this.service.getReasonData(obj).subscribe(response => {
      this.loader.hide();
      if (response.status === 200) {
        this.reasonData = response.data;
        this.openCancelOrderPopup(order);
      } else {
        this.popup.showPopup(MessageType.ERROR, 2000, response.message, false);
      }
    });
  }
  getOrders() {
    this.tempordersData = [];
    const obj = {
      // 'page_no': Math.floor(this.pageoffset/10) + 1,
      limit: this.pageoffset,
      marketplace_reference_id: this.appConfig.marketplace_reference_id,
      reference_id: this.sessionService.get("appData").vendor_details
        .reference_id,
      marketplace_user_id: this.appConfig.marketplace_user_id,
    };
    if (this.sessionService.get('appData')) {
      obj['vendor_id'] = this.sessionService.get('appData').vendor_details.vendor_id;
      obj['access_token'] = this.sessionService.get('appData').vendor_details.app_access_token;
    }
    this.service.getOrders(obj).subscribe(
      response => {
        this.loader.hide();
        try {
          if (response.status === 200) {
            if (response.data.length === 0) {
              this.stopScrollHit = true;
            }
            if (response.data.length) {
              this.insertCancelAllowedKey(response);
            }
            if (this.ordersData.length && this.pageoffset !== 0) {
              this.tempordersData = response.data.map(item => {
                let total = 0;
                if (item[0].orderDetails) {
                  for (let i = 0; i < item[0].orderDetails.length; i++) {
                    total += item[0].orderDetails[i].product.total_price;
                    if (item[0].orderDetails[i].customizations) {
                      for (
                        let k = 0;
                        k < item[0].orderDetails[i].customizations.length;
                        k++
                      ) {
                        total +=
                          item[0].orderDetails[i].customizations[k].unit_price *
                          item[0].orderDetails[i].product.quantity;
                      }
                    }
                  }
                }
                item[0].delivery_charge = parseInt(item[0].delivery_charge);
                // item[0].total_amount = total;
                return item[0];
              });
              this.ordersData = this.ordersData.concat(this.tempordersData);
              this.service.orderList.next(JSON.parse(JSON.stringify(this.ordersData)));
            } else {
              this.ordersData = response.data.map(item => {
                if (this.formSettings.business_model_type === "FREELANCER") {
                  return item[0];
                } else {
                  let total = 0;
                  if (item[0].orderDetails) {
                    for (let i = 0; i < item[0].orderDetails.length; i++) {
                      total += item[0].orderDetails[i].product.total_price;
                      if (item[0].orderDetails[i].customizations) {
                        for (
                          let k = 0;
                          k < item[0].orderDetails[i].customizations.length;
                          k++
                        ) {
                          total +=
                            item[0].orderDetails[i].customizations[k]
                              .unit_price *
                            item[0].orderDetails[i].product.quantity;
                        }
                      }
                    }
                  }
                  item[0].delivery_charge = parseInt(item[0].delivery_charge);
                  // item[0].total_amount = total;
                  return item[0];
                }
              });
              this.service.orderList.next(JSON.parse(JSON.stringify(this.ordersData)));
            }
            this.hitC = true;
            if (this.sessionService.getString("job_id")) {
              for (let order = 0; order < this.ordersData.length; order++) {
                if (
                  this.ordersData[order].job_id ===
                  this.sessionService.getString("job_id")
                ) {
                  // this.details = this.ordersData[order];
                  this.openNav(this.ordersData[order]);
                  this.sessionService.remove("job_id");
                }
              }
            }

            var filteredResult;
            if(this.orderForRating)
            {
              filteredResult = this.ordersData.filter((o) => {
               return o.job_id === this.orderForRating.job_id;
             });
            }

            this.orderForRating = filteredResult && filteredResult.length ? filteredResult[0] : this.orderForRating;
          } else {
            this.popup.showPopup(MessageType.ERROR, 2000, response.message, false);
          }
        } catch (e) {
          console.error(e);
        }
        this.loader.hide();
        this.showPaginating = false;
      },
      error => {
        this.loader.hide();
        console.error(error);
      }
    );
  }

  protected insertCancelAllowedKey(response: any) {
    response.data.forEach(element => {
      let cancelAllowed: number = 0;
      if (element[0].orderDetails) {
        cancelAllowed = this.getCancelAllowedStatus(element[0].orderDetails);
      }
      element[0]['cancelAllowed'] = cancelAllowed;
    });
  }

  getOrdersAfterReview() {
    this.loader.show();
    this.tempordersData = [];
    const obj = {
      // 'page_no': Math.floor(this.pageoffset/10) + 1,
      limit: this.pageoffset,
      marketplace_reference_id: this.appConfig.marketplace_reference_id,
      reference_id: this.sessionService.get("appData").vendor_details
        .reference_id,
      marketplace_user_id: this.appConfig.marketplace_user_id,
    };
    if (this.sessionService.get('appData')) {
      obj['vendor_id'] = this.sessionService.get('appData').vendor_details.vendor_id;
      obj['access_token'] = this.sessionService.get('appData').vendor_details.app_access_token;
    }
    this.service.getOrders(obj).subscribe(
      response => {
        this.loader.hide();
        try {
          if (response.status === 200) {
            if (response.data.length === 0) {
              this.stopScrollHit = true;
            }
            this.ordersData = response.data.map(item => {
              let total = 0;
              for (let i = 0; i < item[0].orderDetails.length; i++) {
                total += item[0].orderDetails[i].product.total_price;
                if (item[0].orderDetails[i].customizations) {
                  for (
                    let k = 0;
                    k < item[0].orderDetails[i].customizations.length;
                    k++
                  ) {
                    total +=
                      item[0].orderDetails[i].customizations[k].unit_price *
                      item[0].orderDetails[i].product.quantity;
                  }
                }
              }
              item[0].delivery_charge = parseInt(item[0].delivery_charge);
              // item[0].total_amount = total;
              return item[0];
            });
            this.hitC = true;
            if (this.sessionService.getString("job_id")) {
              for (let order = 0; order < this.ordersData.length; order++) {
                if (
                  this.ordersData[order].job_id ===
                  this.sessionService.getString("job_id")
                ) {
                  // this.details = this.ordersData[order];
                  this.openNav(this.ordersData[order]);
                  this.sessionService.getString("job_id");
                }
              }
            }
            this.service.orderList.next(JSON.parse(JSON.stringify(this.ordersData)));
          } else {
            this.popup.showPopup(MessageType.ERROR, 2000, response.message, false);
          }
        } catch (e) {
          console.error(e);
        }
        this.loader.hide();
        this.showPaginating = false;
      },
      error => {
        this.loader.hide();
        console.error(error);
      }
    );
  }

  onScroll(event) {
    this.pageoffset = this.pagelimit;
    this.pagelimit = this.pageoffset + 10;
    if (!this.stopScrollHit) {
      this.showPaginating = true;
      this.getOrders();
    }
  }
  updateOrders() { }

  /**
   * function for hybrid apps 
   * @param trackLink track link for apps.
   */

  trackForApps(trackLink){
    window.location.href = "https://trackUrl.yelo.red" + '?trackUrl=' + trackLink;
  }

  cancelOrder() {
    if (!this.selectedReason && this.cancelType === 1) {
      this.reasonNotSelected = true;
      setTimeout(() => {
        this.selectedReason = false;
      }, 3000);
      return;
    }
    this.loader.show();
    const obj = {
      marketplace_reference_id: this.appConfig.marketplace_reference_id,
      reference_id: this.sessionService.get("appData").vendor_details
        .reference_id,
      marketplace_user_id: this.appConfig.marketplace_user_id,
      job_id: this.orderForCancel.job_id,
      reason: this.cancelDialog.value ? this.cancelDialog.value : "",
      product_id: this.orderForCancel.product
        ? this.orderForCancel.product.product_id
        : "",
      cancellation_reason: this.selectedReason ? this.selectedReason : ""
    };
    if (this.sessionService.get('appData')) {
      obj['vendor_id'] = this.sessionService.get('appData').vendor_details.vendor_id;
      obj['access_token'] = this.sessionService.get('appData').vendor_details.app_access_token;
    }
    this.service.cancelOrder(obj).subscribe(
      response => {
        this.loader.hide();
        try {
          if (response.status === 200) {
            // this.getOrders();
            this.closeNav();
            this.hideCancelDialog();
          } else {
            this.popup.showPopup(MessageType.ERROR, 2000, response.message, false);
          }
        } catch (e) {
          console.error(e);
        }
        this.loader.hide();
        this.showPaginating = false;
      },
      error => {
        this.loader.hide();
        console.error(error);
      }
    );
  }

  getColourRed(rating) {
    if (rating === 1) {
      return true;
    } else {
      return false;
    }
  }

  getColourGreen(rating) {
    if (rating >= 4) {
      return true;
    } else {
      return false;
    }
  }

  getColourYellow(rating) {
    if (rating > 1 && rating < 4) {
      return true;
    } else {
      return false;
    }
  }
  openNav(order) {
    this.loader.show();
    const obj = {
      marketplace_reference_id: this.appConfig.marketplace_reference_id,
      reference_id: this.sessionService.get("appData").vendor_details
        .reference_id,
      marketplace_user_id: this.appConfig.marketplace_user_id,
      job_id: order.job_id
    };
    if (this.sessionService.get('appData')) {
      obj['vendor_id'] = this.sessionService.get('appData').vendor_details.vendor_id;
      obj['access_token'] = this.sessionService.get('appData').vendor_details.app_access_token;
    }
    this.service.getOrders(obj).subscribe(
      response => {
        this.loader.hide();
        try {
          if (response.status === 200) {
            this.productHasTemplate = false;
            this.showAdditonalInfo = false;
            this.showTemplateInfo = false;
            this.details = response.data[0];
            order.job_status = this.details.job_status;
            if(this.details.business_type == 2 && this.details.pd_or_appointment == 2){
              this.details.total_add_amt_agent = 0;
              for(let i = 0;i < this.details.orderDetails.length;i++){
                this.details.total_add_amt_agent += this.details.orderDetails[i].product.services.amount_add_by_agent ? this.details.orderDetails[i].product.services.amount_add_by_agent : 0;
              }
            }
            if(this.details.orderDetails && this.details.orderDetails.findIndex(el => el.product.is_product_template_enabled == 1) != -1){
              this.productHasTemplate = true;
            }
           if (this.details.promoList && this.details.promoList.length) {
              this.details.promoOnDelivery = this.details.promoList.find(el => el.promo_on === PromotionOn.DELIVERY_CHARGE);
              this.details.promoOnSubtotal = this.details.promoList.find(el => el.promo_on === PromotionOn.SUBTOTAL);
            }
            if (
              this.sessionService.get("config").business_model_type ===
              "FREELANCER" &&
              this.details.is_custom_order
            ) {
              this.details.job_description = JSON.parse(
                this.details.job_description
              );
            }
            if (
              this.details.checkout_template &&
              this.details.checkout_template.length > 0
            ) {
              const checkoutTemplate = this.details.checkout_template.map(
                elem => elem.cost || 0
              );
              this.additionalPrice = checkoutTemplate.reduce((a, c) => a + c);
            }
            // tslint:disable-next-line:radix
            if (this.formSettings.business_model_type === "FREELANCER") {
              this.subtotal = this.details.order_amount;
              if (this.details.project !== undefined) {
                this.details.project.template.forEach(data => {
                  if (data.label === "headline") {
                    this.projectName = data.value;
                  }
                });
              }

              if (this.details.path && this.details.path.length) {
                this.details.formattedPath = this.details.path.map(el => ({ label: el.name }));
              }

              $("#orderDetailsFreelancer").modal("show");
            } else {
              if (this.details.orderDetails) {
                for (let i = 0; i < this.details.orderDetails.length; i++) {

                  if (this.details.orderDetails[i].product.multiPrice &&
                    this.details.orderDetails[i].product.multiPrice.length) {
                    this.details.orderDetails[i].product.multiPrice = this.details.orderDetails[i].
                      product.multiPrice.filter(el => el.price_type > 1);
                  }

                  let prouctTotal = 0;
                  if (this.details.orderDetails[i].product.unit_type !== 1) {
                    if (this.details.orderDetails[i].product.multiPrice && this.details.orderDetails[i].product.multiPrice.length &&
                      this.appConfig.business_model_type === 'RENTAL') {
                      prouctTotal = this.details.orderDetails[i].product.multiPrice.reduce((accumulator, currentValue) =>
                        accumulator + currentValue.price * currentValue.unit, 0);
                    } else {
                      prouctTotal =
                        prouctTotal +
                        this.details.orderDetails[i].product.unit_price *
                        this.details.orderDetails[i].product.unit_count *
                        this.details.orderDetails[i].product.quantity;
                    }
                  } else {
                    prouctTotal =
                      prouctTotal +
                      this.details.orderDetails[i].product.unit_price *
                      this.details.orderDetails[i].product.quantity;
                  }

                  if(this.details.orderDetails[i].product.is_product_template_enabled == 1) {
                    prouctTotal = prouctTotal + this.details.orderDetails[i].product.template_cost;
                  }
                  if (
                    this.details.orderDetails[i].customizations &&
                    this.details.orderDetails[i].customizations.length
                  ) {
                    for (
                      let j = 0;
                      j < this.details.orderDetails[i].customizations.length;
                      j++
                    ) {
                      if (
                        this.details.orderDetails[i].product.unit_type !== 1
                      ) {
                        prouctTotal =
                          prouctTotal +
                          this.details.orderDetails[i].customizations[j]
                            .unit_price *
                          this.details.orderDetails[i].customizations[j]
                            .quantity;
                      } else {
                        prouctTotal =
                          prouctTotal +
                          this.details.orderDetails[i].customizations[j]
                            .unit_price *
                          this.details.orderDetails[i].customizations[j]
                            .quantity;
                      }
                    }
                  }
                  this.details.orderDetails[i].product.productWiseTotal = prouctTotal.toFixed(2);
                  if (this.details.orderDetails[i].product.total_tax_on_product) {
                    this.details.orderDetails[i].product.productWiseTotalWithTax =
                      Number(prouctTotal) + this.details.orderDetails[i].product.total_tax_on_product;
                  }
                }
              }

              this.subtotal = this.details.order_amount;
              // document.getElementById('mySidenav').style.width = '350px';
              // document.getElementById('main').style.display = 'block';
              $("#orderDetails").modal("show");
              $('.collapse').collapse({'toggle': false})

            }
            $("#orderScroll").scrollTop(0);

            this.service.orderDetails.next(JSON.parse(JSON.stringify(this.details)));
          } else {
            this.popup.showPopup(MessageType.ERROR, 2000, response.message, false);
          }
        } catch (e) {
          console.error(e);
        }
        this.loader.hide();
      },
      error => {
        console.error(error);
      }
    );
  }

  closeNav() {
    // document.getElementById('mySidenav').style.width = '0';
    // document.getElementById('main').style.display = 'none';
  }
  startChat(tags, transactionId, userId, orderId, storeName,isCustomOrder?:number,) {
    if(this.details && this.details.is_custom_order == 2){
      transactionId = this.details.job_id
    }else if(isCustomOrder == 2){
      transactionId = orderId
    }
    this.extService.chatWithMerchant(
      tags,
      transactionId,
      userId,
      orderId,
      storeName
    );
  }
  //show cancellation policies
  hidePopup() {
    this.openCancellationPopUp = false;
  }
  viewPolicyDetails(jobId, e: any) {
    const obj = {
      marketplace_user_id: this.appConfig.marketplace_user_id,
      language: this.sessionService.getString('language'),
      job_id: jobId
    };
    if (this.sessionService.get('appData')) {
      obj['vendor_id'] = this.sessionService.get('appData').vendor_details.vendor_id;
      obj['access_token'] = this.sessionService.get('appData').vendor_details.app_access_token;
    }
    this.loader.show();
    this.service.getCancellationRules(obj).subscribe(
      response => {
        this.loader.hide();
        if (response.data.cancellationRules && response.data.cancellationRules.length) {
          this.setCancellationRules(response.data.cancellationRules);
        }
      },
      error => {
        this.loader.hide();
      }
    );
  }
  convertMinToThreshold(min?: number) {
    var obj = { hr: 0, day: 0, min: 0 };
    obj['day'] = Math.floor(min / 1440);
    min = min % 1440;
    obj['hr'] = Math.floor(min / 60);
    min = min % 60;
    obj['min'] = Math.floor(min);
    return obj;
  }
  setCancellationRules(cancel) {
    this.openCancellationPopUp = true;
    var rule1;
    this.cancelRules = [];

    if (this.appConfig.accept_reject_enabled) {
   if (cancel[0].percentage_cancellation_fees && cancel[0].fixed_cancellation_fees)
      rule1 = (this.languageStrings.before_confirmation_from || "Before confirmation from the") + " " + this.terminology.MERCHANT + " - " + cancel[0].percentage_cancellation_fees + ( this.languageStrings.percentage_of_the || "% of the") + " " + this.terminology.ORDER + " " +(this.languageStrings.amount_or || "amount or") + " " + this.appConfig.payment_settings[0]['symbol'] + cancel[0].fixed_cancellation_fees + " , " + " " + (this.languageStrings.whichever_is_higher || "whichever is higher.") + " "
      else if (cancel[0].percentage_cancellation_fees)
        rule1 = (this.languageStrings.before_confirmation_from || "Before confirmation from the") + " " + this.terminology.MERCHANT + " - " + cancel[0].percentage_cancellation_fees + (this.languageStrings.percentage_of_the || "% of the " ) + " " + this.terminology.ORDER + " " + (this.languageStrings.amount || "amount.")
      else if (cancel[0].fixed_cancellation_fees)
        rule1 = (this.languageStrings.before_confirmation_from || "Before confirmation from the") + " " + this.terminology.MERCHANT + " - " + this.appConfig.payment_settings[0]['symbol'] + cancel[0].fixed_cancellation_fees + "."
      else
      this.languageStrings.before_confirmation_from_merchant_no_amt_deducted = (this.languageStrings.before_confirmation_from_merchant_msg || "Before confirmation from the MERCHANT_MERCHANT no amount will be deducted.")
      .replace('MERCHANT_MERCHANT',this.terminology.MERCHANT);
      this.cancelRules.push(rule1);
       rule1 = ""
      }
    for (var i = 2; i < cancel.length - 1; i++) {
      var obj = this.convertMinToThreshold(cancel[i].cancellation_threshold);
      if (cancel[i].percentage_cancellation_fees && cancel[i].fixed_cancellation_fees)
        rule1 = (this.languageStrings.upto || "Upto") + " " + (obj['day'] ? (obj['day'] + " days ") : "") + (obj['hr'] ? (obj['hr'] + " " + (this.languageStrings.hours || "hours")) : "") +  " " +(obj['min'] ? (obj['min'] + (this.languageStrings.minutes || "minutes")) : "") + " " + (this.languageStrings.before_the || "before the") + " " + this.terminology.ORDER + " " + this.terminology.DISPATCHED + " - " + cancel[i].percentage_cancellation_fees + (this.languageStrings.percentage_of_the || "% of the")+ " " + this.terminology.ORDER + " " +(this.languageStrings.amount_or || "amount or") + " " + this.appConfig.payment_settings[0]['symbol'] + cancel[0].fixed_cancellation_fees + " , " + " " + (this.languageStrings.whichever_is_higher || "whichever is higher.") + " "
      else if (cancel[i].percentage_cancellation_fees)
        rule1 = (this.languageStrings.upto || "Upto") + " " + (obj['day'] ? (obj['day'] + " days ") : "") + (obj['hr'] ? (obj['hr'] + " " + (this.languageStrings.hours || "hours")) : "") + " " + (obj['min'] ? (obj['min'] +  (this.languageStrings.minutes || "minutes")) : "") + " " + (this.languageStrings.before_the || "before the") + " " + this.terminology.ORDER + " " + this.terminology.DISPATCHED + " - " + cancel[i].percentage_cancellation_fees + (this.languageStrings.percentage_of_the || "% of the") + " " + this.terminology.ORDER + " " + (this.languageStrings.amount || "amount.")
      else if (cancel[i].fixed_cancellation_fees)
        rule1 = (this.languageStrings.upto || "Upto") + " " + (obj['day'] ? (obj['day'] + " days ") : "") + (obj['hr'] ? (obj['hr'] + " " + (this.languageStrings.hours || "hours")) : "") + " " + (obj['min'] ? (obj['min'] +  (this.languageStrings.minutes || "minutes")) : "") + " " + (this.languageStrings.before_the || "before the") + " " + this.terminology.ORDER + " " + this.terminology.DISPATCHED + " - " + this.appConfig.payment_settings[0]['symbol'] + cancel[i].fixed_cancellation_fees + "."
      else
        rule1 = (this.languageStrings.upto || "Upto") + " " + (obj['day'] ? (obj['day'] + " days ") : "") + (obj['hr'] ? (obj['hr'] + " " + (this.languageStrings.hours || "hours")) : "") + " " + (obj['min'] ? (obj['min'] + (this.languageStrings.minutes || "minutes")) : "") + " " + (this.languageStrings.before_the || "before the") + " " + this.terminology.ORDER + " " + this.terminology.DISPATCHED + " " + (this.languageStrings.no_amount_will_be_deducted || "no amount will be deducted.")
      this.cancelRules.push(rule1);
      rule1 = "";
    }
    var obj = this.convertMinToThreshold(cancel[1].cancellation_threshold);
    if (cancel[1].percentage_cancellation_fees && cancel[1].fixed_cancellation_fees)
     rule1 = (cancel.length != 3 ? (this.languageStrings.after_above_time_period_msg || "And after above mentioned period of the time"): (this.languageStrings.after_the || "After the") + " " + this.terminology.ORDER + " " + (this.languageStrings.is_confirmed || "is confirmed")) +  " "  + " - " + cancel[1].percentage_cancellation_fees + (this.languageStrings.percentage_of_the || "% of the" ) +  " " + this.terminology.ORDER + " " + (this.languageStrings.amount_or || "amount or") + " " + this.appConfig.payment_settings[0]['symbol'] + cancel[1].fixed_cancellation_fees + " , " + " " + (this.languageStrings.whichever_is_higher || "whichever is higher.") +  " "
    else if (cancel[1].percentage_cancellation_fees)
    {
      this.languageStrings.after_mentioned_period_msg_percentage = (this.languageStrings.after_mentioned_period_msg_percentage || "And after above mentioned period of the time - ---- % of the ORDER_ORDER amount.")
      .replace('----',cancel[1].percentage_cancellation_fees);
      this.languageStrings.after_mentioned_period_msg_percentage = this.languageStrings.after_mentioned_period_msg_percentage.replace('ORDER_ORDER',this.terminology.ORDER);
      
    rule1 = (cancel.length != 3 ? ( this.languageStrings.after_mentioned_time_period_percentage) : (this.languageStrings.after_order_confirmed_percentage_order_amount || "after_order_confirmed_percentage_order_amount"));

       }
       else if (cancel[1].fixed_cancellation_fees)
       {
        this.languageStrings.after_mentioned_period_msg_fixed = (this.languageStrings.after_mentioned_period_msg_fixed || "And after above mentioned period of the time - ---- -----.")
        .replace('----',this.appConfig.payment_settings[0]['symbol']);
        this.languageStrings.after_mentioned_period_msg_fixed = this.languageStrings.after_mentioned_period_msg_fixed.replace('-----',cancel[1].fixed_cancellation_fees);
        this.languageStrings.after_order_confirmed_msg_fixed = (this.languageStrings.after_order_confirmed_msg_fixed || "After the ORDER_ORDER is confirmed - ----- ------.") 
        .replace('ORDER_ORDER',this.terminology.ORDER);
        this.languageStrings.after_order_confirmed_msg_fixed = this.languageStrings.after_order_confirmed_msg_fixed.replace('-----',this.appConfig.payment_settings[0]['symbol']);
        this.languageStrings.after_order_confirmed_msg_fixed = this.languageStrings.after_order_confirmed_msg_fixed.replace('------',cancel[1].fixed_cancellation_fees);

      rule1 = (cancel.length != 3 ? (this.languageStrings.after_mentioned_time_period_msg_fixed) : (this.languageStrings.after_order_confirmed_fixed_fee))
       }// rule1 = (cancel.length != 3 ? (this.langJson["And after above mentioned period of the time"] || "And after above mentioned period of the time") : (this.langJson["After the order is confirmed - "]) + " " + this.terminology.ORDER + " " + (this.langJson["is confirmed"] || "is confirmed")) +  " " + " - " + this.appConfig.payment_settings[0]['symbol'] + cancel[1].fixed_cancellation_fees + "."
     else
  
    rule1 = (cancel.length != 3 ? (this.languageStrings.after_mentioned_time_period_no_amount_deducted || "And after above mentioned period of the time - no amount will be deducted.") : (this.languageStrings.after_mentioned_time_period_no_amount_deducted || "And after above mentioned period of the time - no amount will be deducted.")
    .replace(
        'ORDER_ORDER',
        this.terminology.ORDER
      ))

    this.cancelRules.push(rule1);
     rule1 = ""

    {
      if (cancel[cancel.length - 1].percentage_cancellation_fees && cancel[cancel.length - 1].fixed_cancellation_fees)
        rule1 =(this.languageStrings.after || "After") +  " " + this.terminology.ORDER + " " + this.terminology.DISPATCHED + " - " + cancel[cancel.length - 1].percentage_cancellation_fees + (this.languageStrings.percentage_of_the || "% of the") + " " + this.terminology.ORDER + " " + (this.languageStrings.amount_or || "amount or")+ " " + this.appConfig.payment_settings[0]['symbol'] + cancel[cancel.length - 1].fixed_cancellation_fees + " , " + " " + (this.languageStrings.whichever_is_higher || "whichever is higher.") + " "
      else if (cancel[cancel.length - 1].percentage_cancellation_fees)
        rule1 = (this.languageStrings.after || "After") +  " "  + this.terminology.ORDER + " " + this.terminology.DISPATCHED + " - " + cancel[cancel.length - 1].percentage_cancellation_fees + (this.languageStrings.percentage_of_the || "% of the") + " " +  this.terminology.ORDER + " " + (this.languageStrings.amount || "amount.")
      else if (cancel[cancel.length - 1].fixed_cancellation_fees)
        rule1 =(this.languageStrings.after || "After") +  " " + this.terminology.ORDER + " " + this.terminology.DISPATCHED + " - " + this.appConfig.payment_settings[0]['symbol'] + cancel[cancel.length - 1].fixed_cancellation_fees + ". "
      else
      {
        this.languageStrings.after_order_dispatched_msg = (this.languageStrings.after_order_dispatched_msg || "After the ORDER_ORDER is DISPATCHED_DISPATCHED - no amount will be deducted")
        .replace('ORDER_ORDER',this.terminology.ORDER);
        this.languageStrings.after_order_dispatched_msg = this.languageStrings.after_order_dispatched_msg.replace('DISPATCHED_DISPATCHED',this.terminology.DISPATCHED);
        rule1=this.languageStrings.after_order_dispatched_msg;
      }
       this.cancelRules.push(rule1);
        rule1 = ""
        }
  }



  refundData(order) {
    const obj = {
      marketplace_user_id: this.appConfig.marketplace_user_id,
      language: this.sessionService.getString('language'),
      job_id: this.orderForCancel.job_id,
    };
    if (this.sessionService.get('appData')) {
      obj['vendor_id'] = this.sessionService.get('appData').vendor_details.vendor_id;
      obj['access_token'] = this.sessionService.get('appData').vendor_details.app_access_token;
    }
    if (this.orderForCancel.product && this.orderForCancel.product.product_id) {
      obj['product_id'] = this.orderForCancel.product.product_id;
    }
    this.loader.show();
    this.service.getCancelCharges(obj).subscribe(
      response => {
        this.loader.hide();
        if (response.status === 200) {
          this.refundDetails = response.data;
          if (!this.cancelType) {
            this.openCancelOrderPopup(order)
          } else {
            this.getCancelReasons(order);
          }
        } else {
          this.popup.showPopup(MessageType.ERROR, 2000, response.message, false);
          this.hideCancelDialog();
        }
      },
      error => {
        this.loader.hide();
        this.popup.showPopup(MessageType.ERROR, 2000, error.message, false);
        this.hideCancelDialog();
      }
    );
  }
  getCancelAllowedStatus(data) {
    let cancelAllowed: number = 0;
    if (data) {
      data.forEach(element => {
        if (element.product.services && element.product.services.cancel_allowed) {
          cancelAllowed = 1;
        }
      });
      return cancelAllowed;
    }
  }

  ngOnDestroy() {
    if (this.scrollSubscription) {
      this.scrollSubscription();
    }
    }

  /**
   * repay unpaid order
   */
  payUnpaidOrder(orderDetails) {

    this.sessionService.setByKey('app', 'payment', {
      amount: orderDetails.total_amount,
      subtotal: orderDetails.total_amount,
      order_id: orderDetails.job_id,
      currency :  orderDetails.order_currency_symbol
    });
    const chekoutData = {
      amount: orderDetails.total_amount
    };
    let payload = {
      return_enabled: 0,
      is_scheduled: 0
    };
    chekoutData['cart'] = payload;
    this.sessionService.setByKey('app', 'checkout', chekoutData);
    this.sessionService.set('customOrderFlow', true);
    this.sessionService.set('repay_merchant',orderDetails.user_id);
    if (this.appConfig.merchant_select_payment_method || this.appConfig.is_multi_currency_enabled) {
      this.sessionService.set('merchantPaymentMethods', orderDetails.payment_methods)
    }

    this.loader.show();
    this.router.navigate(['/payment'], {
      queryParams: { redir_source: 'CUSTOM', repayment_transaction: 1 }
    });
  }
  /**
   *
   * open map
   */
  openMap(order) {
  console.warn(order)
   this.lat = Number(order.job_pickup_latitude);
   this.lng = Number(order.job_pickup_longitude);
   this.storeAddress=order.job_pickup_address;
 this.mapTemplatePopup = true;
  }

  /**
   * hide tmplate view modal
   */
  hideTempltePopup() {
    this.mapTemplatePopup = false;
  }
  // Template Info- View Less and More Toggle
  viewMore(index : number) {
   this.isViewMoreOn[index] = true;
  }
  viewLess(index : number){
    this.isViewMoreOn[index] = false;
  }
  viewTemplateClick(){
    this.showTemplateInfo = true;
    this.showAdditonalInfo = false
  }
  getAgentData(data) {
    if(data.show_agent_info || data.agent_info){
      data.show_agent_info = !data.show_agent_info;
      return ;
    }
    const obj = {
      vendor_id   : this.sessionService.get('appData').vendor_details.vendor_id,
      access_token: this.sessionService.get('appData').vendor_details.app_access_token,
      job_id      : data.job_id,
      product_id  : data.business_type == 2 && data.pd_or_appointment == 2 ? data.product_id : 0
    }
    this.loader.show();
    this.service.getAgentData(obj).subscribe(
      response => {
        this.loader.hide();
        if (response.status === 200) {
          data.agent_info = response.data.agent_info;
          data.show_agent_info = true;
        } else {
          this.popup.showPopup(MessageType.ERROR, 2000, response.message, false);
        }
      },
      error => {
        this.loader.hide();
        this.popup.showPopup(MessageType.ERROR, 2000, error.message, false);
      }
    );
  }
  checkForReorder(order)
  {  this.removeCartData=false;
    this.goToCheckout=false;
    this.editOrder = false;
    this.getRestaurantsForBrowser(order.orderDetails, order.user_id);
  }
  getRestaurantsForBrowser(orderInfo, user_id) {
        this.loader.show();
        this.sessionService.set('user_id',user_id),
        this.sessionService.remove('info');
    const lat = this.sessionService.get('location')
      ? this.sessionService.get('location').lat
      : 0;
    const lng = this.sessionService.get('location')
      ? this.sessionService.get('location').lng
      : 0;
    const obj = {
      marketplace_reference_id: this.formSettings.marketplace_reference_id,
      marketplace_user_id: this.formSettings.marketplace_user_id,
      latitude: lat,
      longitude: lng,
      user_id:user_id
    };
    if (this.sessionService.get('appData')) {
      obj['vendor_id'] = this.sessionService.get(
        'appData'
      ).vendor_details.vendor_id;
      obj['access_token'] = this.sessionService.get(
        'appData'
      ).vendor_details.app_access_token;
    }
    if (
      this.formSettings.is_business_category_enabled === 1 &&
      this.sessionService.getString('bId') &&
      this.sessionService.getString('bId') !== '0'
    ) {
      obj['business_category_id'] = this.sessionService.getString('bId');
    }
    if(this.editOrder){
      obj['skip_geofence'] = 1;
    }
    return this.service
      .getSingleRestaturant(obj)
      .toPromise()
      .then(response => {
        try {
          if(response.status==200)
          {  this.loader.hide();
            this.restaurantData = response.data;
            this.orderDetails=orderInfo;
            if(this.restaurantData && !this.restaurantData[0].can_serve)
            {
              this.editOrder = false;
              this.popup.showPopup(MessageType.ERROR, 2000, this.languageStrings.store_not_serve_your_location || "store cannot serve in your delivery location", false);
              return;
            }
            this.sessionService.set('info', this.restaurantData[0]);
            orderInfo.forEach(order=>
              {
              this.productIdDetail[order.product.product_id]=order.product.quantity;
                })
                this.getProducts({
                user_id:user_id,
                product_ids_array:Object.keys(this.productIdDetail)
              });
          }
          else {
            this.editOrder = false;
            this.popup.showPopup(MessageType.ERROR, 2000, this.languageStrings.store_closed_now_try_other || "This store is closed now. Please try from some other store.", false);
          }
          this.loader.hide();
        } catch (e) {
        }
        this.loader.hide();
      })
      .catch(error => {
        this.loader.hide();
      });
  }

  getProducts(data) {
    this.loader.show();
    data.marketplace_reference_id = this.formSettings.marketplace_reference_id;
    data.marketplace_user_id = this.formSettings.marketplace_user_id;
    if (this.sessionService.get('appData')) {
      data['vendor_id'] = this.sessionService.get('appData').vendor_details.vendor_id;
      data['access_token'] = this.sessionService.get('appData').vendor_details.app_access_token;
    }
    this.resetKeys();
    this.service.getProduct(data).subscribe(
      response => {
        if (response.status === 200) {
          this.productData=response.data;
          if(this.productData && this.productData.length==0)
          {
            this.editOrder = false;
            this.loader.hide();
            let errorMsg=this.languageStrings.products_currently_unavail || "These products are currently unavailable";
            this.popup.showPopup(MessageType.ERROR, 2000,errorMsg,false);
            return;
          }
          this.orderDetails.forEach((orderDetailData)=>
        {
          let id=orderDetailData.product.product_id;
          this.productData.filter((el)=>
        {
      if(el.product_id==id)
      {
       this.setProductContent(el,orderDetailData,orderDetailData.product.quantity);
      }
        })
        })
        if(this.editOrder){
          this.editOrderRedirection();
        }
        else{
          this.moveToCheckout();
        }
        }
      },
      error => {
        this.loader.hide();
        this.popup.showPopup(MessageType.ERROR, 2000, error.message, false);
      }
    );
  }
  moveToCheckout()
  {  this.loader.hide();
    let cartData = this.sessionService.getByKey('app', 'cart');
    if(!cartData || this.removeCartData)
    {
      let errorMsg=this.languageStrings.products_currently_unavail || "These products are currently unavailable";
      this.popup.showPopup(MessageType.ERROR, 2000,errorMsg, false);
      return ;
    }
    if((this.goToCheckout && !this.removeCartData) || (cartData && cartData.length<this.orderDetails.length))
    {
      this.popUpProductChangeMsg()
    }
    else if(!this.removeCartData && cartData)
    {
      this.router.navigate(['checkout']);
    }
  }
  setProductContent(product,orderDetailData,quantity) {
    const obj: any = {};
    this.customizationId=[];
    obj.quantity = this.getProductQuantity(product,quantity);
    if(obj.quantity < 0)
    { this.removeCartData=true;
      return;
    }
    if(obj.quantity==0)
    {
      return;
    }
    this.totalPrice=product.price;
    obj.id = product.product_id;
    obj.price = product.price;
    obj.available_quantity = product.available_quantity;
    obj.inventory_enabled = product.inventory_enabled;
    obj.name = product.name;
    obj.type = product.layout_data.buttons[0].type;
    obj.totalPrice = (obj.price * obj.quantity);
    obj.unit = product.unit;
    obj.unit_type = product.unit_type;
    obj.unit_count = this.unit_count;
    obj.enable_tookan_agent = product.enable_tookan_agent;
    obj.is_agents_on_product_tags_enabled = product.is_agents_on_product_tags_enabled;
    obj.user_id = product.user_id;
    obj.product_id=product.product_id;
    obj.delivery_by_merchant = product.delivery_by_merchant;
    obj.is_static_address_enabled = product.is_static_address_enabled;
    obj.minimum_quantity = product.minimum_quantity;
    obj.category_id = product.parent_category_id;
    obj.maximum_quantity = product.maximum_quantity;
    obj.layout_data = product.layout_data;
    if(product.often_bought_products){
      obj.often_bought_products = product.often_bought_products;
    }
    if(product.service_time){
      obj.service_time = product.service_time;
    }
    if(product.customization && product.customization.length){
      obj.customizations = this.setCustomizedObj(orderDetailData)
    }
    else {
      obj.customizations = [];
    }
    obj.showPrice = this.totalPrice;
    if(product.surge_amount)
    {
      obj.surge_amount=product.surge_amount;
    }
    if(obj.is_agents_on_product_tags_enabled && product.agent_id){
      obj.agent_id =  product.agent_id;
    }
    if(this.appConfig.is_multi_currency_enabled){
      obj.payment_settings = product.payment_settings
    }
    if(product.customization && product.customization.length)
    {
      product.customization.forEach((productCustomize)=>
      {
        productCustomize.customize_options.forEach((customId)=>
    {
    if(this.customizationId.includes(customId.cust_id))
    {
      customId.is_default=true;
    }
    else
    {
      customId.is_default=false;
    }
    })
      })
    }
    obj.original_customization=product.customization;
    obj.is_recurring_enabled = this.appConfig.is_recurring_enabled ? product.is_recurring_enabled : 0;
    this.setProductInCart(obj);
  }
  getProductQuantity(productData,quantity)
  { var productQuantity=quantity;
    if(productData.inventory_enabled && quantity>productData.available_quantity)
    { this.goToCheckout=true;
      this.removeCartData=false;
      productQuantity = productData.available_quantity;
    }
    else if(quantity>productData.maximum_quantity && productData.maximum_quantity !=0)
    { this.goToCheckout=true;
      this.removeCartData=false;
      productQuantity = productData.maximum_quantity;
    }
    if(productData.minimum_quantity > quantity && productData.minimum_quantity != 0) {
      return -1;
    }
    return productQuantity;
  }
  setProductInCart(data)
  {  let productData = this.sessionService.getByKey('app', 'cart');
    if(!this.editOrder){
      this.sessionService.set('isReOrder', true);
    }
    else{
      this.sessionService.set('editJobId', this.editJobId);
    }
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
  }
  else{
    productData = [];
    productData.push(data);
    this.setProductQuantityForCart(data, productData.length - 1);
  }
     this.sessionService.setByKey('app', 'cart', productData);

  }
  setProductQuantityForCart(data, index)
  {  let cartProductData = this.sessionService.getByKey('app', 'cartProduct');
      if (cartProductData) {
    if (cartProductData[data.id]) {
      cartProductData[data.id].quantity += data.quantity;
    } else {
      const obj = this.getProductQuantityByData(data, index);
      cartProductData[data.id] = obj;
    }
    }
     else{
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

  setCustomizedObj(currentProductCustomization) {
    const customizedObj = [];
    currentProductCustomization.customizations.forEach(val => {

          const obj = {
            cust_id: val.cust_id,
            unit_price: val.unit_price,
            quantity: val.quantity,
            total_price: val.total_price,
            name: val.cust_name
          };
          this.totalPrice+=val.unit_price;
          this.customizationId.push(val.cust_id)
          customizedObj.push(obj);
    });
    return customizedObj;
  }

  resetKeys()
  {
    this.sessionService.removeByChildKey('app', 'cart');
      this.sessionService.removeByChildKey('app', 'checkout');
      this.sessionService.removeByChildKey('app', 'customize');
      this.sessionService.removeByChildKey('app', 'cartProduct');
  }
  popUpProductChangeMsg()
  {
    this.confirmationService.confirm({
      header: 'Confirm',
      message: this.languageStrings.some_items_changed_proceed || "Some items are changed in your cart. Do you want to proceed?",
      confirmBtnText: status ? (this.languageStrings.cancel ||'Cancel') : (this.languageStrings.continue ||'Continue'),
      accept: () => {

        if(this.editOrder){
          this.router.navigate([`/store/${this.edit_storepage_slug}/${this.edit_merchant_id}`]);
        }
        else{
          this.router.navigate(['checkout']);
        }
      },
      reject: () => {
        this.resetKeys()
        this.sessionService.remove('isReOrder');
        this.sessionService.remove('editJobId');
         }

    });
  }

}
