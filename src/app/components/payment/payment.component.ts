import { MessageType, PhoneMinMaxValidation } from './../../constants/constant';

import {
  Component,
  ChangeDetectorRef,
  OnInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  Input
} from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router, Route, ActivatedRoute } from "@angular/router";
import * as moment from "moment";
import { DomSanitizer } from "../../../../node_modules/@angular/platform-browser";
import { PaymentService } from "./payment.service";
import { SessionService } from "../../services/session.service";
import { MessageService } from "../../services/message.service";
import { PopUpService } from "../../modules/popup/services/popup.service";
import { appString } from "../../services/appstring";
import { ValidationService } from "../../services/validation.service";
import { CartModel } from "../catalogue/components/app-cart/app-cart.model";
import { LoaderService } from "../../services/loader.service";
import { AppCartService } from "../catalogue/components/app-cart/app-cart.service";
import { GoogleAnalyticsEventsService } from "../../services/google-analytics-events.service";
import { AppService } from "../../app.service";
import { GoogleAnalyticsEvent, PaymentMode, OnboardingBusinessType, PromoMode, PromotionOn, PaymentFor, PageType, PaymentByUsing, CREATE_TASK_TYPE } from "../../enums/enum";
import { validations, ModalType, WeekDays } from "../../constants/constant";
import { environment } from "../../../environments/environment";
import { FBPixelService } from "../../services/fb-pixel.service";
import { GoogleAdWordsService } from '../../services/google-adwords.service';
import { RouteHistoryService } from '../../services/setGetRouteHistory.service';
import { of } from "rxjs";
import { map } from "rxjs/operators";
import { UtilityFunctions } from '../../classes/utility-functions.class';
import { _MatTabHeaderMixinBase } from '@angular/material/tabs/typings/tab-header';
import { countrySortedList } from '../../services/countryCodeList.service';


declare var Stripe: any;

export class BillModel {
  ACTUAL_AMOUNT: number;
  BENEFIT_TYPE: any;
  CREDITS_TO_ADD: number;
  CREDITS_USED: string;
  CURRENT_CREDITS: any;
  DEFAULT_SERVICE_TAX_PERCENT: number;
  DEFAULT_VAT_PERCENT: number;
  DISCOUNT: string;
  DISCOUNTED_AMOUNT: number;
  NET_PAYABLE_AMOUNT: number;
  PAYABLE_AMOUNT: string;
  PAYABLE_AMOUNT_WITHOUT_CREDITS: number;
  SERVICE_TAX: number;
  TIP: number;
  VAT: number;
}

@Component({
  selector: "app-payment",
  templateUrl: "./payment.html",
  styleUrls: ["./payment.scss"]
})
export class PaymentComponent implements OnInit, OnDestroy {
  responseData: any;
  stripe_transaction: boolean = false;
  paylater_transaction: boolean = false;
  mpaisa_transaction: boolean = false;
  transactional_amount: boolean = false;
  transaction_charges_check: boolean;
  transactional_check: boolean;
  transaction_charges: any;
  charge_type: any;
  total_charges: any;
  transactionalData: any;
  storeTip: any;
  userBillPlan: any;
  billAmount: any;
  billDeliveryCharge: any;
  NET_PAYABLE_AMOUNT: any;
  billPromo: any = {};
  dialog: any = {};
  selectedIndex: any = "";
  showPromo: boolean;
  billBool: boolean;
  ecomView: boolean;
  @ViewChild("cardInfo") cardInfo: ElementRef;
  card: any;
  cardHandler = this.onChange.bind(this);
  error: string;
  selectedCardId: any;
  paylater_transaction_recurring: boolean =true;
  cardId: any;
  promoReferralData: any;
  showCard: boolean;
  cardEnabled: boolean;
  cards: any = [];
  secret: any;
  promoInfoBool: boolean;
  activePromo: any;
  showLimeLightPopup: boolean;
  showTwoCheckoutPopup: boolean;
  list: {
    taskStatus: {
      0: string;
      1: string;
      2: string;
      3: string;
      4: string;
      5: string;
      6: string;
      7: string;
      8: string;
      9: string;
      10: string;
      11: string;
    };
    statusColor: {
      0: string;
      1: string;
      2: string;
      3: string;
      4: string;
      5: string;
      6: string;
      7: string;
      8: string;
      9: string;
      10: string;
      11: string;
    };
    message: { clearcart: string; cancelTask: string; removeCard: string };
    months: string[];
    years: string[];
  };
  cardForm: any;
  addCouponForm: any;
  showAddCoupon: boolean;
  showReferral: any;
  cardBool: boolean = false;
  userTaxes: any;
  catalogueTaxes: any;
  tipForm: FormGroup;
  debtDataFromPayment;
  userPaymentData: any = {};
  tipValue: any;
  tipType: number;
  cardsOption: any = [];
  perTaskCost: number;
  isSourceCustom = 0;
  public hasDestroy: boolean;
  public data: any;
  public appConfig: any = {
    color: ""
  };
  public storeUnsubscribe: any;
  public routeSubsriber: any;
  public cartData: any;
  public paymentForm: FormGroup;
  public paytmForm: FormGroup;
  public billPlzForm: FormGroup;
  public name;
  public submitted = false;
  public childStatus;
  public tipArray = ["$1.00", "$2.00", "$5.00", "$10.00"];
  public tipModel: any = {};
  public applyCoupon = 1;
  public totalCartAmount: number;
  protected dialogStatus: boolean;
  protected message: string;
  protected actionBool: boolean;
  public paymentMethod: number;
  public paymentOptions: any = [];
  protected billInfo: BillModel;
  public currency: any;
  private payableAmount: number;
  private formSettings: any;
  private paymentBool: any = {};
  private workflowBool: number;
  public faccvvmodal: boolean = false;
  private pickUpOrDeliveryBool: number;
  private pickUpAndDeliveryBool: number;
  private promoList: any = [];
  public paymentType: any;
  protected stripe;
  protected elements;
  public terminology: any = {};
  public restaurantInfo;
  protected stripe_token = "";
  protected unitType;
  protected unitValue;
  protected unitCount;
  public langJson: any = {};
  public languageSelected: any;
  public direction = "ltr";
  public tipAdded = false;
  public minimumTipError = false;
  public payfortlink;
  public vistaBool = false;
  public payfortBool = false;
  public cvvPayfort = false;
  public cvvPay = "";
  public cvvFac = "";
  public payfort3dUrl;
  // public payfort3dUrlBool = false;
  public transactionIdPayfort;
  public add_card_link;
  public razorPayModal: boolean = false;
  public paymentInfo: any;
  public paytmOtpPop: boolean = false;
  public razorPayUrl: any;
  public paytmData: any;
  public deliveryMethod: number;
  public billPayTransaction;
  public billPlzModal: boolean;
  public billPlzMsgInput;
  public promoTypeAdded: string;
  public weekDays = WeekDays;
  promo_id: any;
  customOrderFlow: boolean;
  showPromoLink: boolean;
  debtPaymentMethod: boolean;
  subscriptionPlanPaymentMethod: boolean;

  addPaytmMoneyUrl: string;
  public paytmAddMoneyPopup = false;
  paytmAddMoneylink;
  appliedLoyaltyPointsTemp: number;
  appliedLoyaltyPoints: number;
  loyatyApplied: boolean;
  post_payment_enable = false;
  paymentWindowRef: any;
  cardWindowRef: any
  public triggerPayment;
  public facModal: boolean = false;
  public payuModal: boolean = false;
  public paypalModal: boolean = false;
  public telrModal: boolean = false;
  public paystackModal: boolean = false;
  public transactionIdFac = '';
  public transactionIdVista = '';
  public innstapayModal: boolean = false;
  public vivaModal: boolean = false;
  public authorizeNetModal: boolean = false;
  public vistaModal: boolean = false;
  public paymentModes = PaymentMode;
  public transactionIdInnstapay;
  public tempResponse: any;
  public transactionIdPayFast;
  public payFastModal: boolean = false;
  public lastUrl: string;
  public transactionIdPayu = '';
  public loginResponse: any;
  public walletDetails: any = {};
  public isPlatformServer: boolean;
  public isEditedTask = 0;
  public repaymentTransaction = 0;
  public authorizeNetUrl;
  public vistaUrl;
  public facUrl;
  public paymentfor;
  public additionalAmountObj: {};

  public holdPaymentCheck: boolean;
  public holdType: any;
  access_token_for_add_card: any;
  vendorId_for_add_card: any;
  public transactionIdPayMob = '';
  public transactionIdLimeLight = '';
  public transactionIdTwoCheckout = '';
  public payMobModal: boolean = false;
  transactionIdMPaisa = '';
  public mpaisaModal: boolean = false;
  transactionIdVistaMoney = '';
  public vistaMoneyModal: boolean = false;
  public showAddCardPopUp: boolean = false;
  // transactionIdWirecard = '';
  // public wirecardModal: boolean = false;
  transactionIdSslCommerz = '';
  public sslCommerzModal: boolean = false;
  transactionIdFAC3D = '';
  public fac3dModal: boolean = false;
  transactionIdCheckoutCom = '';
  transactionIdviva = '';
  public checkoutComModal: boolean = false;
  transactionIdPayHere = '';
  public payHereModal: boolean = false;
  transactionIdAzul = '';
  public azulModal: boolean = false;
  transactionIdHyperPay = '';
  public hyperPayModal: boolean = false;
  transactionIdCredimax = '';
  public credimaxModal: boolean = false;
  transactionIdFatoorah = '';
  public fatoorahModal: boolean = false;
  transactionIdPaynet = '';
  public paynetModal: boolean = false;
  transactionIdTap = '';
  public tapModal: boolean = false;
  transactionIdCurlec = '';
  public curlecModal: boolean = false;
  transactionIdTheteller = '';
  public thetellerModal: boolean = false;
  transactionIdWipay = '';
  public wipayModal: boolean = false;
  transactionIdPagar = '';
  public pagarModal: boolean = false;
  transactionIdWhoosh = '';
  public whooshModal: boolean = false;
  transactionIdMtn = '';
  public mtnModal: boolean = false;
  transactionIdWechat = '';
  public wechatModal: boolean = false;
  transactionIdMybillpayment = '';
  public mybillpaymentModal: boolean = false;
  transactionIdValitor = '';
  public valitorModal: boolean = false;
  transactionIdTruevo = '';
  public truevoModal: boolean = false;
  transactionIdPayzen = '';
  public payzenModal: boolean = false;
  transactionIdFirstdata = '';
  public firstdataModal: boolean = false;
  transactionIdBankOpen = '';
  public bankOpenModal: boolean = false;
  transactionIdEtisalat = '';
  public etisalatModal: boolean = false;
  transactionIdGocardless = '';
  public gocardlessModal: boolean = false;
  transactionIdSquare = '';
  public squareModal: boolean = false;
  transactionIdOnepay = '';
  public onepayModal: boolean = false;
  transactionIdPagoplux = '';
  public pagopluxModal: boolean = false;
  transactionIdSuncash = '';
  public suncashModal: boolean = false;
  transactionIdAth = '';
  public athModal: boolean = false;
  transactionIdIpay = '';
  public ipayModal: boolean = false;
  transactionIdProxypay = '';
  public proxypayModal: boolean = false;
  transactionIdCybersource = '';
  public cybersourceModal: boolean = false;
  transactionIdAlfalah = '';
  public alfalahModal: boolean = false;
  transactionIdCulqi = '';
  public culqiModal: boolean = false;
  transactionIdFlutterwave = '';
  public flutterwaveModal: boolean = false;
  transactionIdMpesa = '';
  public mpesaModal: boolean = false;
  transactionIdAdyen = '';
  public adyenModal: boolean = false;
  transactionIdNmi = '';
  public nmiModal: boolean = false;
  transactionIdPaymark = '';
  public paymarkModal: boolean = false;
  transactionIdHypur = '';
  public hypurModal: boolean = false;
  transactionIdPixelpay = '';
  public pixelpayModal: boolean = false;
  transactionIdPaytm = '';
  transactionIdDoku = '';
  public dokuModal: boolean = false;
  transactionIdPeach = '';
  public peachModal: boolean = false;
  transactionIdPaguelofacil = '';
  public paguelofacilModal: boolean = false;
  transactionIdNoqoody = '';
  public noqoodyModal: boolean = false;
  transactionIdGtbank = '';
  public gtbankModal: boolean = false;
  transactionIdUrway = '';
  public urwayModal: boolean = false;
  transactionIdVuka = '';
  public vukaModal: boolean = false;
  transactionIdVpos = '';
  public vposModal: boolean = false;
  transactionIdCxpay = '';
  public cxpayModal: boolean = false;
  transactionIdPayku = '';
  public paykuModal: boolean = false;
  transactionIdBambora = '';
  public bamboraModal: boolean = false;
  transactionIdPaywayone = '';
  public paywayoneModal: boolean = false;
  transactionIdPlacetopay = '';
  public placetopayModal: boolean = false;
  public debtAmountCheck: boolean;
  public customerPlanId: number;
  public PaymentByUsing = PaymentByUsing;
  public paytmModal: boolean = false;
  // transactionIdMPaytm = '';
  modalType = ModalType.MEDIUM;
  transactionIdPaystack;
  public transactionIdPaynow = '';
  public paynowModal: boolean = false;
  public debtPopupSkipped: boolean;
  public customerPlanSkipped: boolean;
  transactionIdStripeIdeal = '';
  public stripeIdealModal: boolean = false;
  public orderType;
  public walletAddMoneyPopup;
  public recurringEnabled;
  public recurringAllowedPayments = [PaymentMode.CASH, PaymentMode.WALLET, PaymentMode.PAY_LATER]
  cvvFay: any;
  store_fac_cvv: string;
  public showPhoneNumberPopupForPaytm: boolean;
  public paytmNumberForm: FormGroup;
  public country_code: any;
  public phoneCopy: any;
  public countries: any = countrySortedList;
  public paytmLinkNumber: any;
  vendorId: any;
  selectedPaymentMethod: any;
  dataofCart: any;
  public showDeliveryChargeDetails: boolean;
  public deliveryChargeList: any[];
  public tFormat: string;
  public schedule_time: string;
  editJobId: any;
  amt_diff: number = 0;
  cardHolderName: string
  city: string
  // country: string
  line1: string
  line2: string
  state: string
  showerror: boolean = false;
  show_unavailable_products: boolean = false;
  unavailable_products: any;
  hideStripePostalCodeForArr = [239393,239482,424539,278329,283939];
  orderCreationPayload: any;
  userId: any;
  customerEmail: string;
  languageStrings: any={};
  fac_cards: any;

  constructor(
    protected fb: FormBuilder,
    protected paymentService: PaymentService,
    protected cartService: AppCartService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected sessionService: SessionService,
    protected popup: PopUpService,
    protected ref: ChangeDetectorRef,
    protected loader: LoaderService,
    public googleAnalyticsEventsService: GoogleAnalyticsEventsService,
    public messageService: MessageService,
    public appService: AppService,
    public domSanitizer: DomSanitizer,
    public validationService: ValidationService,
    public fbPixelService: FBPixelService,
    public googleAdWordsService: GoogleAdWordsService,
    public routeHistoryService: RouteHistoryService
  ) {
    this.lastUrl = this.routeHistoryService.getPreviousUrl();
    this.customOrderFlow = this.sessionService.getString("customOrderFlow")
      ? Boolean(this.sessionService.getString("customOrderFlow"))
      : false;
    this.deliveryMethod = Number(
      this.sessionService.getString("deliveryMethod")
    );
    if (!this.sessionService.isPlatformServer()) {
      this.activate();
      this.loginResponse = this.sessionService.get("appData");
      if (this.loginResponse.vendor_details) {
        this.loginResponse.vendor_details.debt_amount = this.loginResponse.vendor_details.debt_amount ? this.loginResponse.vendor_details.debt_amount : 0;
      }
    }
    // ================language json manupilation======================
    this.appService.langPromise.then(() => {
      this.langJson = this.appService.getLangJsonData();
      this.langJson["Delivery Charge"] = this.langJson["Delivery Charge"].replace(
        "----",
        this.terminology.DELIVERY
      );
    });
    this.ecomView =
      this.sessionService.get("config").business_model_type === "ECOM" &&
      this.sessionService.get("config").nlevel_enabled === 2;
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

  getQuotationOrderPayment() {
    this.loader.hide();
    if (this.isSourceCustom) {
      this.NET_PAYABLE_AMOUNT = this.sessionService.getByKey('app', 'payment').amount;
      this.userPaymentData["DELIVERY_CHARGE"] = this.sessionService.getByKey('app', 'payment').delivery_charge;
      this.userPaymentData["ACTUAL_AMOUNT"] = this.sessionService.getByKey('app', 'payment').subtotal;
      this.userPaymentData["ADDITIONAL_AMOUNT"] = this.sessionService.getByKey('app', 'payment').additional_amount;
      this.userTaxes = this.sessionService.getByKey('app', 'payment').user_taxes;
      this.paymentfor = this.sessionService.getByKey('app', 'payment').payment_for;
      this.additionalAmountObj = {
        'paymentfor': this.sessionService.getByKey('app', 'payment').payment_for,
        'job_id': this.sessionService.getByKey('app', 'payment').job_id,
        'title': this.sessionService.getByKey('app', 'payment').title,
        'description': this.sessionService.getByKey('app', 'payment').description,
        'additionalpaymentId': this.sessionService.getByKey('app', 'payment').additionalpaymentId
      }
      if (this.paymentfor == 10) {
        this.userTaxes = undefined;
        this.catalogueTaxes = undefined;
      }
    }
  }

  getEditedOrderPayment() {
    if (this.isSourceCustom && this.isEditedTask) {
      this.NET_PAYABLE_AMOUNT = this.sessionService.getByKey('app', 'payment').amount;
      this.userPaymentData["ACTUAL_AMOUNT"] = this.sessionService.getByKey('app', 'payment').subtotal;
    }
  }
  activate() {
    this.hasDestroy = false;
    this.formSettings = this.sessionService.get("config");
    if (this.formSettings.terminology) {
      this.terminology = this.formSettings.terminology;
    }
    if (this.formSettings.product_view === 1) {
      this.restaurantInfo = this.formSettings;
    } else if (this.customOrderFlow) {
      this.restaurantInfo = this.sessionService.get("config");
    } else {
      this.restaurantInfo = this.sessionService.get("info");
    }
    this.workflowBool = this.formSettings.work_flow;
    this.pickUpAndDeliveryBool = this.formSettings.force_pickup_delivery;
    this.pickUpOrDeliveryBool = this.formSettings.pickup_delivery_flag;
    this.dialogStatus = false;
    this.actionBool = true;
    this.showAddCoupon = false;
    this.addCouponForm = this.fb.group({
      couponCode: ["", Validators.compose([Validators.required])]
    });
    this.cardForm = this.fb.group({
      cardNumber: [
        "",
        Validators.compose([
          Validators.required,
          ValidationService.NumberValidator,
          Validators.minLength(14)
        ])
      ],
      validity: ["", Validators.compose([Validators.required])],
      name: [""],
      cvc: [
        "",
        Validators.compose([
          Validators.required,
          ValidationService.NumberValidator,
          Validators.minLength(3)
        ])
      ]
    });
    this.list = appString;
    this.sessionService.langStringsPromise.then(() =>
    {
     this.languageStrings = this.sessionService.languageStrings;
     this.setLangKeys();
    });
  }
  ngOnInit() {
    if (!this.sessionService.isPlatformServer()) {
      setTimeout(() => {
        if (document.getElementsByClassName("payment_heading") && document.getElementsByClassName("payment_heading")[0]) {
          document.getElementsByClassName("payment_heading")[0].scrollIntoView({
            behavior: "smooth",
            block: "end"
          });
        }
      }, 0);
    }
    this.loader.hide();
    this.editJobId = this.sessionService.get('editJobId');
    this.activatedRoute.queryParams.subscribe(
      (data) => {
        if (data.vendor_id) {
          this.vendorId = parseInt(data.vendor_id);
        }
      });
    this.sessionService.set('mpaisaTransaction', false);
    this.isPlatformServer = this.sessionService.isPlatformServer();
    this.paymentInfo = Object.assign(
      {},
      this.sessionService.getByKey("app", "payment")
    );
    // debugger
    this.activatedRoute.queryParams.subscribe(
      (data) => {
        if (data.redir_source === 'CUSTOM') {
          this.isSourceCustom = 1;
        }
        if (data.is_edited_task) {
          this.isEditedTask = 1;
        }
        if (data.repayment_transaction) {
          this.repaymentTransaction = 1;
        }
        if (data.debt_payment) {
          this.debtAmountCheck = true;
          this.paymentMethod = 0;
        }
        if (data.customerPlanData) {
          this.customerPlanId = data.customerPlanData ? data.customerPlanData : 0;
          this.paymentMethod = 0
        }
      });
    this.appConfig = this.sessionService.get("config");
    // console.log('this.formSettings',this.formSettings)
    this.debtPopupSkipped = this.sessionService.get("skipDebt") || 0;
    this.customerPlanSkipped = this.sessionService.get("customerPlanSkipped") || 0;

    this.orderType = this.sessionService.getString('orderType');
    if (this.orderType && this.orderType == 'subscription') {
      this.recurringEnabled = true
    }
    this.userId = this.sessionService.get("config").marketplace_user_id;

    if (this.sessionService.getByKey("app", "payment")) {
      this.getCartAmount();
      this.setStoreSubscriber();
      // this.getCustomerPromo();
      // this.getTaskDetails();
      if (this.sessionService.get("config") && !this.isPlatformServer) {
        let arr_active_pg = JSON.parse((this.sessionService.get("config").enabled_payment_gateways))
        if(arr_active_pg.includes(PaymentMode.STRIPE)) {
          this.initStripe();
        }        
      }
      if (this.appConfig) {
        this.tipForm = this.fb.group({
          // tslint:disable-next-line:max-line-length
          tip_value: [
            "",
            [
              Validators.pattern(validations.numbersWithDecimal),
              ValidationService.setDecimalConfigRegexPattren(
                this.appConfig.decimal_calculation_precision_point
              )
            ]
          ]
        });
      }

      // this.setPaymentType('8');
    } else {
    }

    // this.Info(this.sessionService.getByKey('app', 'payment').amount);
    if (!this.isSourceCustom && this.sessionService.getByKey("app", "payment")) {
      if (this.appConfig.business_model_type === 'FREELANCER') {
        this.initFreelancerBillBreakdown();
      } else {
        this.getPaymentStatus(
          this.sessionService.getByKey("app", "payment").amount
        );
      }
    }
    else if (this.appConfig.business_model_type === 'FREELANCER' && !this.isSourceCustom) {
      //default payment mode in freelancer
      this.initStripe();
      this.getFormSettings();
      if (!this.sessionService.isPlatformServer()) {
        this.setPaymentMethod();
        this.initFreelancerBillBreakdown();

        this.getBillPlzUrlResponse();
      }
    }


    if ((this.isSourceCustom || this.isEditedTask) && !this.isPlatformServer) {

      if (this.debtAmountCheck && this.sessionService.getByKey('app', 'payment').amount && this.sessionService.getByKey('app', 'payment').order_id && this.sessionService.get("payViaBillPlzTransactionId")) {
        this.loader.show();
        const objData = {
          'transaction_id': this.sessionService.get("payViaBillPlzTransactionId"),
          'amount': this.sessionService.getByKey('app', 'payment').amount,
          'job_id': this.sessionService.getByKey('app', 'payment').order_id,
          'payment_method': 512,
          'payment_for': PaymentFor.DEBT_AMOUNT,
        };
        this.onDebtPayment(objData);
      } else if (this.customerPlanId && this.sessionService.getByKey('app', 'payment').amount && this.sessionService.get("payViaBillPlzTransactionId")) {
        this.loader.show();
        const objData = {
          'transaction_id': this.sessionService.get("payViaBillPlzTransactionId"),
          'amount': this.sessionService.getByKey('app', 'payment').amount,
          'plan_id': this.customerPlanId,
          'payment_method': 512,
          'payment_for': PaymentFor.CUSTOMER_SUBSCRIPTION_AMOUNT
        };
        this.customerPlan(objData);
      }
      else {
        this.getBillPlzUrlResponse();
      }


    }
    // let thisLocal = this;
    if (!this.sessionService.isPlatformServer()) {
      this.getActivePaymentOption();
      this.showReferral = this.sessionService.get("appData").referral.status;
      this.getQuotationOrderPayment();
      this.getEditedOrderPayment();
      //
      window.onmessage = (event) => {

        if (typeof event.data == "string") {
          if (event.data == "errorAddCard") {
            if (this.cardWindowRef) {
              this.cardWindowRef.close();
            }
            this.popup.showPopup(MessageType.ERROR, 2000, this.languageStrings.unable_to_add_card || "Unable to add card", false);
            // this.payfortBool = false;
            //this.successEventPayfort();
          }
          if (event.data == "successAddCard") {
            if (this.cardWindowRef) {
              this.cardWindowRef.close();
            }
            this.popup.showPopup(MessageType.SUCCESS, 2000, this.languageStrings.card_successfully_added || "Card successfully added", false);
            this.successEventVista();
            this.successEventPayfort();
          }
          if (event.data == "errorPayment") {
            this.cvvPay = "";
            // this.payfort3dUrlBool = false;
            if (this.paymentWindowRef) {
              setTimeout(() => {
                this.paymentWindowRef.close();
                this.popup.showPopup(MessageType.ERROR, 2000, this.languageStrings.payment_failure || "Payment Failure", false);
              }, 2000);
            }

          }
        }

        if (typeof event.data == 'object') {

          if (event.data.payment_method == PaymentMode.AUTHORIZE_NET) {
            if (event && event.data.status == 'add_card_success') {
              this.authorizeNetModal = false;
              this.getCards(PaymentMode.AUTHORIZE_NET);
              this.popup.showPopup(MessageType.SUCCESS, 2000, this.languageStrings.card_successfully_added || "Card successfully added", false);
            }
            else {
              this.popup.showPopup(MessageType.ERROR, 2000, this.languageStrings.unable_to_add_card || "Unable to add card", false);
              this.authorizeNetModal = false;
            }
          }
          if (event.data.payment_method == PaymentMode.VISTA) {
            if (event && event.data.status == 'add_card_success') {
              this.vistaModal = false;
              this.getCards(PaymentMode.VISTA);
              this.popup.showPopup(MessageType.SUCCESS, 2000, this.languageStrings.card_successfully_added || "Card successfully added", false);
            }
            else {
              this.popup.showPopup(MessageType.ERROR, 2000, this.languageStrings.unable_to_add_card || "Unable to add card", false);
              this.vistaModal = false;
            }
          }
          if (typeof event.data === 'object') {
            if (event.data.payment_method === PaymentMode.FAC) {
              if (event && event.data.status === 'add_card_success') {
                this.facModal = false;
                this.getCards(PaymentMode.FAC);
                this.popup.showPopup("succes", 2000, this.languageStrings.card_successfully_added || "Card successfully added", false);
              } else {
                this.popup.showPopup("error", 2000, this.languageStrings.unable_to_add_card || "Unable to add card", false);
                this.facModal = false;
              }
              }
          }
        if (typeof event.data == "object") {
          if (event.data.name == "successPayment") {
            this.cvvPay = "";
            this.transactionIdPayfort = event.data.transaction_id;
            if (this.debtAmountCheck) {
              this.loader.show();
              const objData = {
                'transaction_id': this.transactionIdPayfort,
                'amount': this.sessionService.getByKey('app', 'payment').amount,
                'job_id': this.sessionService.getByKey('app', 'payment').order_id,
                'payment_method': event.data.payment_method || this.paymentMethod,
                'payment_for': PaymentFor.DEBT_AMOUNT,
              };
              this.onDebtPayment(objData);
            }
            if(this.customerPlanId){
              const objData = {
                'transaction_id': this.transactionIdPayfort,
                'amount': this.sessionService.getByKey('app', 'payment').amount,
                'plan_id': this.customerPlanId,
                'payment_method': event.data.payment_method || this.paymentMethod,
                'payment_for': PaymentFor.CUSTOMER_SUBSCRIPTION_AMOUNT
              };
              this.customerPlan(objData);
            }
            this.successPayfortTransaction();
          }
          else if (event.data.payment_method === 128 && !event.data.action) {

            this.transactionIdPayfort = event.data.rzp_payment_id;

            if (this.debtAmountCheck) {
              this.loader.show();
              const objData = {
                'transaction_id': this.transactionIdPayfort,
                'amount': this.sessionService.getByKey('app', 'payment').amount,
                'job_id': this.sessionService.getByKey('app', 'payment').order_id,
                'payment_method': event.data.payment_method,
                'payment_for': PaymentFor.DEBT_AMOUNT,
              };
              this.onDebtPayment(objData);
            }
            if(this.customerPlanId){
              const objData = {
                'transaction_id': this.transactionIdPayfort,
                'amount': this.sessionService.getByKey('app', 'payment').amount,
                'plan_id': this.customerPlanId,
                'payment_method': event.data.payment_method || this.paymentMethod,
                'payment_for': PaymentFor.CUSTOMER_SUBSCRIPTION_AMOUNT
              };
              this.customerPlan(objData);
            }
            if (this.selectedPaymentMethod && this.selectedPaymentMethod.payment_process_type === 1) {
              this.successRazorpayTransaction();
            }
            if(this.sessionService.getByKey('app', 'payment') && this.sessionService.getByKey('app', 'payment').is_custom_order == 1){
                const objData = {
                  'transaction_id': this.transactionIdPayfort,
                  'amount': this.sessionService.getByKey('app', 'payment').amount,
                  'payment_method': this.paymentMethod,
                  'job_id': this.sessionService.getByKey('app', 'payment').job_id,
                  'additionalPaymentId': this.sessionService.getByKey('app', 'payment').additionalpaymentId,
                  'payment_for': 10
                };
                if (this.selectedPaymentMethod && this.selectedPaymentMethod.payment_process_type === 2)
                {
                  this.successPayfortTransaction();
                }
                else
                {
                  this.customerPlan(objData);
                }

              }
              else {
                this.successPayfortTransaction();
              }
            } else if (event.data.action === "close") {
              this.close3dver();
            }
          }
        }
      }

    }
    if ((this.appConfig.is_loyalty_point_enabled || this.sessionService.get("appData").referral.status) && this.customerPlanId) {
      this.appConfig.is_loyalty_point_enabled = false;
      this.showReferral = undefined;
      this.showPromoLink = undefined;
    }
  }
  setLangKeys() {
    this.languageStrings.are_you_sure_you_want_to_remove_added_items = (this.languageStrings.are_you_sure_you_want_to_remove_added_items ||  "Are you sure you want to remove the added items from the CART_CART ?")
    .replace("CART_CART", this.terminology.CART);
    this.message = this.languageStrings.are_you_sure_you_want_to_remove_added_items;
    this.languageStrings.deliver_charge = (this.languageStrings.deliver_charge || "Delivery Charge")
    .replace(
      "DELIVERY_DELIVERY",
      this.terminology.DELIVERY
    );
    this.languageStrings.min_tip_amt_should_be = (this.languageStrings.min_tip_amt_should_be ||  "Minimum Tip amount should be $10.")
    .replace("$", this.formSettings["payment_settings"][0].symbol);
    this.languageStrings.pls_choose_cash_for_0_amt = (this.languageStrings.pls_choose_cash_for_0_amt || "Please choose cash for 0 amount order.")
    .replace("ORDER_ORDER", this.terminology.ORDER);
    this.languageStrings.will_deducted_creation_of_each_order= (this.languageStrings.will_deducted_creation_of_each_order || "will be deducted on the creation of each order")
    .replace(
        "ORDER_ORDER",
        this.terminology.ORDER
    );
  }

  public loadStripe() {
    return new Promise((resolve, reject) => {
      if (document.getElementById('stripeScript')) {
        let stripeKey = this.sessionService.get("config").stripe_public_key;
        this.stripe = (<any>window).Stripe(stripeKey);
        resolve();
      }
      else {
        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://js.stripe.com/v3/';
        script.id = "stripeScript";
        script.onload = () => {
          let stripeKey = this.sessionService.get("config").stripe_public_key;
          // if (this.commonService.loginData.reseller && this.commonService.loginData.reseller.stripe_publishable_key) {
          //   stripeKey = this.commonService.loginData.reseller.stripe_publishable_key;
          // }
          this.stripe = (<any>window).Stripe(stripeKey);
          resolve();
        };
        document.head.appendChild(script);
      }
    });
  }

  updateDebtAmount() {
    let prevAmountObj = this.sessionService.get('appData');
    prevAmountObj.vendor_details.debt_amount = 0;
    this.sessionService.set('appData', prevAmountObj);
  }

  async initStripe() {
    await this.loadStripe();
    this.post_payment_enable = Boolean(this.appConfig.post_payment_enable);
    let user_id = this.sessionService.get("config").marketplace_user_id;
    // console.log(this.sessionService.getString("language"))
    // debugger
    try {
      this.stripe = Stripe(this.appConfig.stripe_public_key,{locale: this.sessionService.getString("language")});
      this.elements = this.stripe.elements();
      if (this.hideStripePostalCodeForArr.includes(user_id)) {
        this.card = this.elements.create("card", { hidePostalCode: true });
      }
      else {
        this.card = this.elements.create("card");
      }
      this.card.mount(this.cardInfo.nativeElement);
      this.card.addEventListener("change", this.cardHandler);
    }
    catch (e) { }
  }
  /**
   * This fetch the information whether payment option is post_enabled or not
   * i.e. The order is place after payment or before payment or parallely
   * further setOrderType is use to add the key in the paymentOption
   */
  protected getActivePaymentOption() {
    this.paymentService.getActivePaymentOption().subscribe(response => {
      if (response && response.data.length > 0 && response.data) {
        this.setOrderType(response.data);
      }
    });
  }
  setOrderType(data) {
    this.paymentOptions.forEach(option => {
      data.forEach(element => {
        if (element.value === option.value) {
          option.payment_process_type = element.payment_process_type;
        }
      })
    })
    if (this.customerPlanId) {
      this.paymentOptions = this.paymentOptions.filter(element => {
        if (![PaymentMode.CASH, PaymentMode.PAY_LATER].includes(element.value)) {
          return element;
        }
      })
    }
    // this.post_payment_enable = this.selectedPaymentMethod.payment_process_type == 1 ? true : false;
  }

  protected initFreelancerBillBreakdown() {
    const freelancerData = this.sessionService.get('freelancerCheckout');
    this.paymentService.getBillBreakdownFreelancer(freelancerData.project_id, freelancerData.bid_id).subscribe(response => {
      response.data.PROMOS = [];
      response.data.REFERRAL = [];
      this.paymentBillSuccess(response.data);
    }, error => {
      console.error(error);
    });
  }

  applyAutoTip() {
    let sum, avg;
    this.userPaymentData = this.sessionService.getByKey("app", "payment")[
      "bill"
    ];
    this.userPaymentData = Object.assign(
      this.userPaymentData || {},
      this.paymentInfo
    );
    if (this.userPaymentData && this.userPaymentData.TIP_OPTION_LIST && this.userPaymentData.TIP_OPTION_LIST.length) {
      if (this.userPaymentData.TIP_OPTION_LIST.length) {
        sum = this.userPaymentData.TIP_OPTION_LIST.reduce(function (a, b) {
          return b.value + a;
        }, 0);
        avg = sum / this.userPaymentData.TIP_OPTION_LIST.length;
      }
      let temp = { value: 0 };
      for (const index in this.userPaymentData.TIP_OPTION_LIST) {
        if (
          avg >= this.userPaymentData.TIP_OPTION_LIST[index].value &&
          temp.value < this.userPaymentData.TIP_OPTION_LIST[index].value
        ) {
          temp = this.userPaymentData.TIP_OPTION_LIST[index];
          this.selectedIndex = Number(index);
        }
      }
      if (this.selectedIndex >= 0) {
        if (this.userPaymentData.TIP_TYPE === 1) {
          this.tipValue = (
            this.perTaskCost *
            (this.userPaymentData.TIP_OPTION_LIST[this.selectedIndex].value /
              100)
          ).toFixed(this.appConfig.decimal_display_precision_point || 2);
        } else {
          this.tipValue = this.userPaymentData.TIP_OPTION_LIST[
            this.selectedIndex
          ].value;
        }
        this.userPaymentData.TIP_OPTION_LIST[
          this.selectedIndex
        ].selected = true;
      }
      // this.chooseTipOption(this.selectedIndex);
    }
  }



  /**
   * get bill plz response from url
   */
  getBillPlzUrlResponse() {

    let billUrl = decodeURIComponent(location.href);
    billUrl = billUrl.replace(/ /g, "");
    if (this.getParameterByName("billplz[id]", billUrl)) {
      this.paymentMethod = 512;
      const obj = {
        transaction_id: this.sessionService.get("payViaBillPlzTransactionId"),
        marketplace_user_id: this.sessionService.get("config")
          .marketplace_user_id,
        vendor_id: this.sessionService.get("appData").vendor_details.vendor_id,
        access_token: this.sessionService.get("appData").vendor_details
          .app_access_token,
        user_id: this.sessionService.getString("user_id") || undefined,
        isEditedTask: this.isEditedTask ? 1 : undefined,
        // payment_for: this.repaymentTransaction ? PaymentFor.REPAYMENT :undefined
      };
      //my check for debt to hit paymentcreatecharge

      if (!this.debtAmountCheck && !this.customerPlanId) {
        this.paymentService.checkBillPlzStatus(obj).subscribe(response => {
          if (response.status === 200) {
            if (response.data.mapped_pages) {
              let thankYouPageHtml = response.data.mapped_pages.find(el => el.type == PageType.THANKYOU);
              thankYouPageHtml = thankYouPageHtml ? thankYouPageHtml.template_data : undefined;
              this.sessionService.thankYouPageHtml = thankYouPageHtml;
              this.sessionService.set('OrderPlacedPage', thankYouPageHtml ? 1 : 0);
            }
            const payload = this.getTaskbyYelo();
            this.billPayTransaction = this.sessionService.get('payViaBillPlzTransactionId');

            if (payload) {
              this.afterCreateTaskSuccess('');
              this.sessionService.remove('payViaBillPlzTransactionId')
            }
          } else {
            this.loader.hide();
            this.changeRouteWithParams();
            // this.popup.showPopup("error", 3000, response.message, false);
          }
        },
          error => { }
        );
      }

    }
  }

  onChange({ error }) {
    if (error) {
      this.error = error.message;
    } else {
      this.error = null;
    }
    this.ref.detectChanges();
  }

  checkCashEnabled() {
    if (this.loginResponse && this.loginResponse.formSettings[0].payment_methods) {
      const index = this.loginResponse.formSettings[0].payment_methods.findIndex((o) => {
        return o.value === PaymentMode.CASH && o.enabled === 1;
      });
      return index > -1 ? true : false;
    }
  }

  checkPayLaterEnabled() {
    if (this.loginResponse && this.loginResponse.formSettings[0].payment_methods) {
      const index = this.loginResponse.formSettings[0].payment_methods.findIndex((o) => {
        return o.value === PaymentMode.PAY_LATER && o.enabled === 1;
      });
      return index > -1 ? true : false;
    }
  }

  //==========Delivery Charge Details============
  openDeliveryChargePopup() {
    this.showDeliveryChargeDetails = true;
  }

  hideDeliveryChargePopup() {
    this.showDeliveryChargeDetails = false;
  }


  setPaymentType(type, init?: string, holdType?: string) {
    if (type == "8" && this.debtAmountCheck) {
      this.transactional_amount = false;
      return;
    }
    this.paymentType = type;
    this.paymentMethod = type;
    this.paylater_transaction_recurring = false;
    this.paylater_transaction =  false;
    this.transactional_amount = false;
    if (this.userPaymentData.NET_PAYABLE_AMOUNT === 0 &&
      type != PaymentMode.CASH &&
      type != PaymentMode.PAY_LATER &&
      (this.checkCashEnabled() || this.checkPayLaterEnabled()) &&
      !this.appConfig.is_hold_amount_active && !this.debtAmountCheck) {
      if (this.checkCashEnabled() && this.checkPayLaterEnabled() && !this.debtAmountCheck) {
        this.paymentType = PaymentMode.CASH;
        this.paymentMethod = PaymentMode.CASH;
        this.selectedCardId = "";
        const message = (this.languageStrings.please_choose_cash_or_paylater_for_0_amount_order || 'Please choose cash or paylater for 0 amount order.')
        .replace("PAY_LATER", this.terminology.PAY_LATER || 'pay later');
        this.popup.showPopup(MessageType.ERROR, 3000, message, false);
      } else if (this.checkCashEnabled() && !this.debtAmountCheck) {
        this.paymentType = PaymentMode.CASH;
        this.paymentMethod = PaymentMode.CASH;
        this.selectedCardId = "";
        this.popup.showPopup(MessageType.ERROR, 3000, (this.languageStrings.the_amt_0_proceed_without_card || 'The order  amount is 0. You can proceed without choosing card.')
        .replace("ORDER_ORDER", this.terminology.ORDER || 'Order'), false);
      } else if (this.checkPayLaterEnabled() && !this.debtAmountCheck) {
        this.paymentType = PaymentMode.PAY_LATER;
        this.paymentMethod = PaymentMode.PAY_LATER;
        this.selectedCardId = "";
        const message = (this.languageStrings.please_choose_cash_or_paylater_for_0_amount_order || 'Please choose PAY_LATER for 0 amount order.')
        .replace("PAY_LATER", this.terminology.PAY_LATER || 'pay later');
        this.popup.showPopup(MessageType.ERROR, 3000, message, false);
      } else { }
      return;
    } else if (this.userPaymentData.NET_PAYABLE_AMOUNT === 0 && !this.checkCashEnabled() && this.checkPayLaterEnabled() && type != PaymentMode.CASH
      && type != PaymentMode.PAY_LATER
      && !this.appConfig.is_hold_amount_active && !this.debtAmountCheck) {
      this.paymentType = PaymentMode.CASH;
      this.paymentMethod = PaymentMode.CASH;
      this.selectedCardId = "";
      return;
    }
    if (
      this.paymentType === PaymentMode.CASH.toString() ||
      this.paymentType === PaymentMode.PAY_LATER.toString() ||
      this.paymentType === "16" ||
      this.paymentType === "512"
    ) {
      this.selectedCardId = "";
      this.transactional_amount = false;
      this.paylater_transaction_recurring = false;
    }
    if (type == 32 && init) {
      if (this.userPaymentData.HOLD_PAYMENT && !holdType) {
        this.holdPaymentCheck = true;
        this.transactional_amount = false;
        this.holdType = {
          type: 'Select Card',
          method: 32
        };
        return;
      }
      this.cvvPayfort = true;
      this.paylater_transaction_recurring = false;
    }
    if (type == 8388608) {
      if (this.transaction_charges_check == true) {
        this.transactional_check = true;
      }
      this.mpaisa_transaction = true;
      this.stripe_transaction = false;
      this.paylater_transaction =  false;
      this.paylater_transaction_recurring = false;
    }
    if (type == 65536) {
      this.stripe_transaction = false;
      this.mpaisa_transaction = false;
      this.paylater_transaction =  true;
      if(this.responseData && this.responseData.data.TRANSACTIONAL_CHARGES_INFO.PAYLATER){
        if (this.transaction_charges_check == true) {
          this.transactional_check = true;
        }
        this.paylater_transaction_recurring = true;
           }
    }
    if (type == 2 && init) {
      if (this.userPaymentData.HOLD_PAYMENT && !holdType) {
        this.holdPaymentCheck = true;
        this.holdType = {
          type: 'Select Card',
          method: 2
        };
        return;
      }
      this.stripe_transaction = true;
      this.mpaisa_transaction = false;
      this.transactional_amount = false;
      this.paylater_transaction =  false;
      if(this.responseData && this.responseData.data.TRANSACTIONAL_CHARGES_INFO.STRIPE){
        if (this.transaction_charges_check == true) {
          this.transactional_check = true;
          this.paylater_transaction_recurring = false;
        }
      }
    }

    if (type == 128 && init) {
      // this.getRazorpay();
      this.transactional_amount = false;
      this.paylater_transaction_recurring = false;
    }


    if (type == 64 && init) {
      this.transactional_amount = false;
      this.paylater_transaction_recurring = false;
      // this.getPaytmOtp();
    }
    if (type == 8) {
      this.transactional_amount = false;
      this.paylater_transaction_recurring = false;
      // this.getPaytmOtp();
    }
    if (type == 16384) {
      this.transactional_amount = false;
      this.paylater_transaction_recurring = false;
      // this.getPaytmOtp();
    }
    if (this.paymentType === PaymentMode.PAYTM_LINK.toString()) {
      this.showPhoneNumberPopupForPaytm = true;
      this.transactional_amount = false;
      this.initPaytmPhoneNumberForm();
      this.paylater_transaction_recurring = false;
    }
    if(type == 256){
      this.transactional_amount = false;
    }
    // if (type == 512) {
    //   this.payViaBillPlz();
    // }
  }

  //=================get razor pay data======================
  getRazorpay(job_id?: any, post_payment?: number, data?: any) {
    if (!post_payment) {
      job_id = undefined;
    }
    this.loader.show();
    const obj = {
      'amount': this.NET_PAYABLE_AMOUNT,
      'vendor_id': this.sessionService.get('appData').vendor_details.vendor_id,
      'marketplace_user_id': this.sessionService.get('config').marketplace_user_id,
      'app_type': 'WEB',
      'currency': this.sessionService.get('config').payment_settings[0].code,
      'payment_method': PaymentMode.RAZORPAY,
      'name': this.sessionService.get('appData').vendor_details.first_name,
      'email': this.sessionService.get('appData').vendor_details.email,
      'domain_name': window.location.origin,
      'access_token': this.sessionService.get('appData').vendor_details.app_access_token,
      'app_access_token': this.loginResponse.vendor_details.app_access_token,
      'isEditedTask': this.isEditedTask ? 1 : undefined,
      'payment_for': this.repaymentTransaction ? PaymentFor.REPAYMENT : PaymentFor.CREATE_TASK,
      'user_id': (this.repaymentTransaction && this.sessionService.get('config').is_multi_currency_enabled && this.sessionService.get('repay_merchant')) ? (this.sessionService.get('repay_merchant')) : this.sessionService.getString("user_id")
    };

    if (this.isSourceCustom && this.sessionService.getByKey('app', 'payment') && this.sessionService.getByKey('app', 'payment').order_id) {
      obj['job_id'] = this.sessionService.getByKey('app', 'payment').order_id
    }
    if(this.sessionService.getByKey('app', 'payment') && this.sessionService.getByKey('app', 'payment').additionalpaymentId){
      obj['job_id'] = this.sessionService.getByKey('app', 'payment').order_id
    }
    if (this.debtAmountCheck) {
      obj['payment_for'] = PaymentFor.DEBT_AMOUNT;
    }
    else if (this.customerPlanId) {
      obj['payment_for'] = PaymentFor.CUSTOMER_SUBSCRIPTION_AMOUNT;
    }
    else if (post_payment === 2) {
      obj['orderCreationPayload'] = data;
      obj['orderCreationPayload'].amount = this.NET_PAYABLE_AMOUNT;
      if (this.appConfig.onboarding_business_type === OnboardingBusinessType.LAUNDRY) {
        if (this.customOrderFlow) {
          obj['orderCreationPayload'].task_type = CREATE_TASK_TYPE.LAUNDARY_CUSTOM_ORDER;
          obj['orderCreationPayload'].job_id = this.sessionService.getByKey('app', 'payment').order_id;
          obj['orderCreationPayload'].isEditedTask = 0;
          obj['orderCreationPayload'].additionalpaymentId = this.sessionService.getByKey('app', 'payment') && this.sessionService.getByKey('app', 'payment').additionalpaymentId ? this.sessionService.getByKey('app', 'payment').additionalpaymentId : 0;
        }
        else {
          obj['orderCreationPayload'].task_type = CREATE_TASK_TYPE.LAUNDARY;
        }
        }

      else if(this.appConfig.onboarding_business_type === OnboardingBusinessType.FREELANCER) {
        obj['orderCreationPayload'].task_type = CREATE_TASK_TYPE.FREELANCER
      }
      else if (this.customOrderFlow && !this.isSourceCustom) {
        obj['orderCreationPayload'].task_type = CREATE_TASK_TYPE.CUSTOM_ORDER;
      }
      else if (this.isSourceCustom) {
        obj['orderCreationPayload'].task_type = CREATE_TASK_TYPE.QUOTATION;
        obj['orderCreationPayload'].isEditedTask = 0;
        obj['orderCreationPayload'].additionalpaymentId = this.sessionService.getByKey('app', 'payment') && this.sessionService.getByKey('app', 'payment').additionalpaymentId ? this.sessionService.getByKey('app', 'payment').additionalpaymentId : 0;
        if (this.sessionService.getByKey('app', 'payment') && this.sessionService.getByKey('app', 'payment').order_id) {
          obj['orderCreationPayload'].job_id = this.sessionService.getByKey('app', 'payment').order_id
        }
        if (this.sessionService.getByKey('app', 'payment') && this.sessionService.getByKey('app', 'payment').additionalpaymentId) {
          obj['orderCreationPayload'].task_type = CREATE_TASK_TYPE.CREATE_CHARGE;
          obj['orderCreationPayload'].payment_for=10;
        }
      }
      else {
        obj['orderCreationPayload'].task_type = CREATE_TASK_TYPE.FOOD;
      }
      if (this.sessionService.get("config").is_menu_enabled) {
        obj['orderCreationPayload'].is_app_menu_enabled = 1;
      }
      obj['orderCreationPayload'].is_app_product_tax_enabled = 1;
    }
    if (this.sessionService.getByKey('app', 'payment') && this.sessionService.getByKey('app', 'payment').is_custom_order == 1) {
      obj['additionalpaymentId'] = this.sessionService.getByKey('app', 'payment').additionalpaymentId;
      obj['payment_for'] = 10;
    }
    if (!this.repaymentTransaction && this.sessionService.getByKey('app', 'payment').user_id_merchant && this.sessionService.getByKey('app', 'payment').is_custom_order === 1 && this.sessionService.get('config').is_multi_currency_enabled)
      obj['user_id'] = this.sessionService.getByKey('app', 'payment').user_id_merchant;
    this.paymentService.getPaymentUrl(obj).subscribe(response => {
      if (response.status === 200) {
        this.loader.hide();

        this.razorPayModal = true;
        this.razorPayUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(
          response.data.url + "&domain_name=" + window.location.origin
        );
      } else {
        this.loader.hide();
        this.popup.showPopup(MessageType.ERROR, 3000, response.message, false);
      }
    });
  }

  //=================get razor pay data======================
  getPaytmOtp() {
    this.loader.show();
    const obj = {
      marketplace_user_id: this.sessionService.get("config")
        .marketplace_user_id,
      vendor_id: this.sessionService.get("appData").vendor_details.vendor_id,
      app_access_token: this.sessionService.get("appData").vendor_details
        .app_access_token
    };
    this.paymentService.getPaytmOtp(obj).subscribe(response => {
      if (response.status === 200) {
        this.loader.hide();

        this.openPopupForPaytmOTP();
      } else {
        this.loader.hide();
        this.popup.showPopup(MessageType.ERROR, 3000, response.message, false);
      }
    });
  }

  openPopupForPaytmOTP() {
    this.paytmOtpPop = true;
    this.paytmForm = this.fb.group({
      otp: ["", [Validators.required]]
    });
  }
  hidePaytmPopup() {
    this.paytmOtpPop = false;
  }

  paytmOtpSubmit() {

    if (!this.paytmForm.valid) {
      return this.validationService.validateAllFormFields(this.paytmForm);
    }
    this.loader.show();
    const obj = {
      marketplace_user_id: this.sessionService.get("config")
        .marketplace_user_id,
      vendor_id: this.sessionService.get("appData").vendor_details.vendor_id,
      app_access_token: this.sessionService.get("appData").vendor_details
        .app_access_token,
      otp: this.paytmForm.controls.otp.value
    };
    this.paymentService.verifyPaytmOtp(obj).subscribe(response => {
      if (response.status === 200) {
        this.loader.hide();
        this.popup.showPopup(MessageType.SUCCESS, 3000, response.message, false);

        this.paytmOtpPop = false;
        this.fetchPaytmWalletDetails(64);
        setTimeout(() => {
          this.taskViaPayment();
        }, 2000);
      } else {
        this.loader.hide();
        this.popup.showPopup(MessageType.ERROR, 3000, response.message, false);
      }
    });
  }

  selectedCard(id) {

    this.selectedCardId = id;
    localStorage.setItem('cardId', id);
    // this.faccvvmodal=true;
  }
  setPromoId(promo) {


    this.billPromo = promo;
    // this.promo_id = promo.promo_id;
    // this.billBool = true;
    this.callBillBreakApi();
  }
  removePromoId() {
    this.billPromo = {};
    // this.promo_id = undefined;
    this.userPaymentData.discount = undefined;
    this.callBillBreakApi();
  }
  setTipAmount(tip) {
    this.tipModel.value = tip;
    this.tipModel.type = this.paymentInfo['bill'].TIP_TYPE;
    this.callBillBreakApi();
  }
  removeTipAmount() {
    this.tipModel.value = "";
    this.callBillBreakApi();
  }
  setStoreSubscriber() {
    this.appConfig = this.sessionService.get("config");
    this.userBillPlan = this.sessionService.get("config")["user_billing_plan"];
    this.setTipData();

    // this.store.select('payment').subscribe((data: any) => {
    //
    //
    // });
    // this.store.select('apppayment').subscribe((data: any) => {
    //   if (data.cards.length) {
    //     this.cards = data.cards;
    //     this.selectedCardId = this.cards[0].card_id;
    //   } else {
    //     this.cards = [];
    //   }
    //   if (Object.keys(data.promo).length) {
    //     this.promoList = data.promo;
    //   }
    //   if (data.promoAdded) {
    //     this.store.dispatch({
    //       type: AppPayment.actionTypes.AFTER_ADD_COUPON_CODE_SUCCESS,
    //       payload: null
    //     });
    //     this.hideDialog();
    //   }
    //   if (data.cardflag) {
    //     this.resetCard();
    //     this.getMerchantCard();
    //   }
    //   // this.ref.detectChanges();
    //   // this.ref.markForCheck();
    // });
  }
  getCartAmount() {
    const paymentData = this.sessionService.getByKey("app", "payment");
    this.totalCartAmount = paymentData.amount;
    this.setPaymentMethod();
    // this.getMerchantCard();
    // this.getBillPaymentInfo();

    this.getFormSettings();
  }
  getFormSettings() {
    this.formSettings = this.sessionService.get("config");
    this.setCurrency();

    // this.getBillVisibleType();
  }
  setPayableAmount() {
    if (!Boolean(Number(this.billInfo.CREDITS_USED))) {
      this.billInfo.CREDITS_USED = "";
    }
    if (!Boolean(Number(this.billInfo.TIP))) {
      this.billInfo.TIP = 0;
    }
    if (Number(this.billInfo.DISCOUNT)) {
      this.billInfo.DISCOUNT = String(
        Number(this.billInfo.DISCOUNT).toFixed(2)
      );
    }
    this.payableAmount =
      this.totalCartAmount +
      this.billInfo.SERVICE_TAX +
      this.billInfo.VAT -
      Number(this.billInfo.CREDITS_USED);
  }
  setCurrency() {
    // let checkout = this.sessionService.getByKey('app', 'checkout');
    const billData = this.sessionService.getByKey("app", "payment");
    if (billData && billData.bill && billData.bill.CURRENCY && this.sessionService.get('config').is_multi_currency_enabled) {
      this.currency = billData.bill.CURRENCY;
    } else {
      const currency = this.formSettings.payment_settings;
      if (currency) {
        this.currency = currency[0];
      }
    }
    if (this.repaymentTransaction && this.sessionService.get('config').is_multi_currency_enabled) {
      this.currency.symbol = billData.currency
    }
    if (billData && billData.is_custom_order === 1 && this.sessionService.get('config').is_multi_currency_enabled)
      this.currency.symbol = billData.custom_currency;

    this.getTaskDetails();
  }
  getBillPaymentInfo(promoValue?, tipValue?) {
    const payload = {};
    payload["amount"] = this.totalCartAmount;
    if (promoValue) {
      payload["promo_value"] = this.billPromo.promo_value;
      payload["benefit_type"] = this.billPromo.benefit_type;
      if (this.billPromo.isPromo) {
        payload["promo_id"] = this.billPromo.id;
      } else {
        payload["referral_code"] = this.billPromo.code;
      }
    }
    if (tipValue) {
      payload["tip_amount"] = this.tipModel.value;
      payload["tip_type"] = this.tipModel.type;
    }
    if (Object.keys(this.billPromo).length) {
      //this.applyPromoCode(payload);

      this.applyPromoReferral(payload);
    } else {
      this.getPaymentInfo(this.perTaskCost, this.selectedIndex, "");
      //this.userPaymentData['discount'] = 0;
      //this.NET_PAYABLE_AMOUNT = this.userPaymentData.NET_PAYABLE_AMOUNT;
    }
  }

  applyPromoReferral(data) {

    this.promoReferralData = data;
    this.getPaymentInfo(this.perTaskCost, this.selectedIndex, data);
  }

  applyPromoCode(payload) {
    this.loader.show();
    payload["vendor_id"] = this.sessionService.get(
      "appData"
    ).vendor_details.vendor_id;
    payload["access_token"] = this.sessionService.get(
      "appData"
    ).vendor_details.app_access_token;
    payload["marketplace_user_id"] = this.sessionService.get(
      "appData"
    ).vendor_details.marketplace_user_id;
    payload["user_id"] = this.sessionService.getString("user_id");
    if (this.restaurantInfo.business_type === 2) {
      payload["amount"] = this.sessionService.getByKey(
        "app",
        "payment"
      ).bill.ACTUAL_AMOUNT; // ACTUAL_AMOUNT
    } else {
      payload["amount"] = this.sessionService.getByKey("app", "payment").amount;
    }
    payload["total_amount"] = this.userPaymentData.NET_PAYABLE_AMOUNT;
    if (this.billPromo.isPromo) {
      this.paymentService.applyPromoCode(payload).subscribe(response => {
        if (response.status === 200) {
          this.loader.hide();
          this.userPaymentData["discount"] = parseFloat(response.data.DISCOUNT);
          this.NET_PAYABLE_AMOUNT = parseFloat(
            response.data.NET_PAYABLE_AMOUNT
          );
        } else {
          this.loader.hide();
          this.popup.showPopup(MessageType.ERROR, 3000, response.message, false);
        }
      });
    } else {
      this.paymentService.applyReferral(payload).subscribe(response => {
        if (response.status === 200) {
          this.loader.hide();
          this.userPaymentData["discount"] = parseFloat(response.data.DISCOUNT);
          this.NET_PAYABLE_AMOUNT = parseFloat(
            response.data.NET_PAYABLE_AMOUNT
          );
        } else {
          this.loader.hide();
          this.popup.showPopup(MessageType.ERROR, 3000, response.message, false);
        }
      });
    }
  }

  getCards(paymentType) {
    let payload: any;
    if (paymentType) {
      payload = {
        payment_method: paymentType
      };
    } else {
      payload = this.getPaymentMethod();
    }
    this.fetchCards(payload);
  }
  selectCard() { }
  removeCard(cardDetail, paymentType) {
    const payload = {};

    payload["payment_method"] = paymentType;
    payload["card_id"] = cardDetail.card_id;

    switch (paymentType) {
      case PaymentMode.AUTHORIZE_NET:
        this.removeCardAuthorizeNet(payload, cardDetail);
        break;
      case PaymentMode.FAC:
        this.removeCardFac(payload, cardDetail);
        break;

      default:
        this.removeCardApi(payload);
    }

  }
  setPaymentMethod() {
    if (this.sessionService.isPlatformServer()) { return; }
    let method = [];
    let merchant_payment_enabled = false;
    let marketplace_user_id = this.sessionService.get("appData").vendor_details.marketplace_user_id;
    let merchnat_id = this.sessionService.get('user_id');
    if (this.appConfig.merchant_select_payment_method || this.appConfig.is_multi_currency_enabled) {
      // for only repayment and isEditedTask case
      if (this.repaymentTransaction || this.isEditedTask) {
        method = this.checkCustomerMethodsOverride(this.sessionService.get('merchantPaymentMethods'))

        merchant_payment_enabled = true;
      } else {
        // for all normal flow in merchant_select_payment_method

        if (merchnat_id != marketplace_user_id && this.sessionService.get("info") && this.sessionService.get("info").payment_methods) {
          let merchant_payment = this.sessionService.get("info").payment_methods;
          if (merchant_payment && merchant_payment.length) {
            method = this.checkCustomerMethodsOverride(merchant_payment)
            merchant_payment_enabled = true;
          } else {
            method = this.sessionService.get("appData").formSettings;
          }

        } else {
          method = this.sessionService.get("appData").formSettings;
        }
        if (this.appConfig.is_multi_currency_enabled && this.sessionService.get("info") && this.sessionService.get("info").payment_methods) {
          let merchant_payment = this.sessionService.get("info").payment_methods;
          if (merchant_payment && merchant_payment.length) {
            method = this.checkCustomerMethodsOverride(merchant_payment)
            merchant_payment_enabled = true;
          } else {
            method = this.sessionService.get("appData").formSettings;
          }
        }
      }
    } else {
      // for all normal flow
      method = this.sessionService.get("appData").formSettings;
    }

    if (method && !merchant_payment_enabled) {
      method = method[0].payment_methods;
    }
    this.paymentOptions = method;
    let paymentMethod = method
      .filter(method => method.enabled);
    this.paymentOptions = method.filter(item => item.enabled);
    for (let opt = 0; opt < this.paymentOptions.length; opt++) {
      if (
        this.paymentOptions[opt].value === 128 &&
        this.paymentOptions[opt].enabled
      ) {
        // this.cardEnabled = false;
        this.paymentMethod = this.paymentOptions[opt].value;
      }
      if (
        this.paymentOptions[opt].value === 64 &&
        this.paymentOptions[opt].enabled
      ) {
        // this.cardEnabled = false;
        this.paymentMethod = this.paymentOptions[opt].value;
        this.fetchPaytmWalletDetails(64);
      }
      if (
        this.paymentOptions[opt].value === 2 &&
        this.paymentOptions[opt].enabled
      ) {
        this.cardEnabled = true;
        this.paymentMethod = this.paymentOptions[opt].value;
        this.getCards(this.paymentOptions[opt].value);
      }
      if (
        this.paymentOptions[opt].value === 32 &&
        this.paymentOptions[opt].enabled
      ) {
        this.cardEnabled = true;
        this.paymentMethod = this.paymentOptions[opt].value;
        this.getCards(this.paymentOptions[opt].value);
      }
      if (
        this.paymentOptions[opt].value === 262144 &&
        this.paymentOptions[opt].enabled
      ) {
        this.cardEnabled = true;
        this.paymentMethod = this.paymentOptions[opt].value;
        this.getCards(this.paymentOptions[opt].value);
      }
      if (
        this.paymentOptions[opt].value === PaymentMode.AUTHORIZE_NET &&
        this.paymentOptions[opt].enabled
      ) {
        this.cardEnabled = true;
        this.paymentMethod = this.paymentOptions[opt].value;
        this.getCards(this.paymentOptions[opt].value);
      }
      if (this.paymentOptions[opt].value === PaymentMode.FAC && this.paymentOptions[opt].enabled) {
        this.cardEnabled = true;
        this.paymentMethod = this.paymentOptions[opt].value;
        this.getCards(this.paymentOptions[opt].value);
      }
      if (this.paymentOptions[opt].value === PaymentMode.WALLET && this.paymentOptions[opt].enabled) {
        this.paymentMethod = this.paymentOptions[opt].value;
        this.getWalletDetails();
      }
      else {
        this.paymentMethod = this.paymentOptions[opt].value;
      }
    }
    let lastPaymentMethod = this.sessionService.get("appData").vendor_details.last_payment_method;
    lastPaymentMethod = lastPaymentMethod ? Number(lastPaymentMethod) : lastPaymentMethod;
    let paymentModeIndex = this.paymentOptions.findIndex((res) => {
      return res.value === lastPaymentMethod && res.enabled
    })
    if(paymentModeIndex > -1){
      this.paymentMethod = this.paymentOptions[paymentModeIndex].value;
    }
    else{
      let cashIndex = this.paymentOptions.findIndex((res) => {
        return res.value === PaymentMode.CASH && res.enabled
      })
      if (cashIndex != -1 && this.appConfig.payment_method_autoselect) {
        this.setPaymentType(PaymentMode.CASH.toString());
      }
    }
    if (!this.paymentMethod) {
      this.paymentMethod = paymentMethod[0].value;
    }
    if (this.appConfig.payment_method_autoselect) {
      this.setPaymentType(this.paymentMethod);
    }
    // if (this.paymentMethod != PaymentMode.CASH) {
    //   // this.getCards();
    //   // this.getPromo();
    // }
    // this.getPromo();
  }
  getMerchantCard() {
    const paymentMethods = this.formSettings.payment_methods;
    this.paymentMethod = -1;
    for (let pm = 0; pm < paymentMethods.length; pm++) {
      if (paymentMethods[pm].value !== PaymentMode.CASH && paymentMethods[pm].value !== PaymentMode.PAY_LATER && paymentMethods[pm].enabled) {
        this.paymentMethod = paymentMethods[pm].value;
      }
    }
    if (this.paymentMethod !== -1) {
      // this.store.dispatch({
      //   type: AppPayment.actionTypes.GET_MERCHANT_CARDS,
      //   payload: {
      //     payment_method: this.paymentMethod
      //   }
      // });
      this.showCard = true;
    } else {
      this.showCard = false;
    }
  }
  getPaymentMethod() {

    if (this.paymentMethod) {
      return {
        payment_method: this.paymentMethod
      };
    } else {
      this.setPaymentMethod();
      this.getPaymentMethod();
    }
  }
  showDialog(bool: boolean) {
    if (bool) {
      this.deleteMerchantCard(this.cardId);
    }
    this.dialogStatus = !this.dialogStatus;
    // this.ref.detectChanges();
    // this.ref.markForCheck();
  }
  ngOnDestroy() {
    this.hasDestroy = true;
  }

  onSubmit() {
    if (!this.billBool) {
      if (!this.paymentType) {
        this.languageStrings.please_select_payment_method = (this.languageStrings.please_select_payment_method ||  "Please select ----")
        .replace("PAYMENT_METHOD", this.terminology.PAYMENT_METHOD);
        const msg = this.languageStrings.pls_select_payment_method || "Please select payment method";
        this.popup.showPopup(MessageType.ERROR, 2000, msg, false);
        return false;
      } else if (
        (this.paymentType == PaymentMode.STRIPE ||
          this.paymentType == PaymentMode.PAYFORT || this.paymentType == PaymentMode.FAC || this.paymentType == PaymentMode.VISTA) &&
        !this.selectedCardId
      ) {
        this.popup.showPopup(
          MessageType.ERROR,
          2000,
          (this.languageStrings.pls_select_card || "Please select card"),
          false
        );
        return false;
      }

      if (this.paymentType == PaymentMode.PAYU && !this.transactionIdPayu && this.NET_PAYABLE_AMOUNT > 0) {
        this.openWindowInCenter('', '', 500, 600, 100);
        this.sessionService.paymentWinRef.document.title = 'Payment Process';
        this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      }
      // if (this.paymentType == PaymentMode.WIRE_CARD && !this.transactionIdWirecard && this.NET_PAYABLE_AMOUNT > 0) {
      //   this.openWindowInCenter('', '', 500, 600, 100);
      //   this.sessionService.wirecardWinRef.document.title = 'Payment Process';
      //   this.sessionService.wirecardWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      // }
      if (this.paymentType == PaymentMode.SSL_COMMERZ && !this.transactionIdSslCommerz && this.NET_PAYABLE_AMOUNT > 0) {
        this.openWindowInCenter('', '', 500, 600, 100);
        this.sessionService.paymentWinRef.document.title = 'Payment Process';
        this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      }
      if (this.paymentType == PaymentMode.FAC_3D && !this.transactionIdFAC3D && this.NET_PAYABLE_AMOUNT > 0) {
        this.openWindowInCenter('', '', 500, 600, 100);
        this.sessionService.paymentWinRef.document.title = 'Payment Process';
        this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      }
      if (this.paymentType == PaymentMode.CHECKOUT_COM && !this.transactionIdCheckoutCom && this.NET_PAYABLE_AMOUNT > 0) {
        this.openWindowInCenter('', '', 500, 600, 100);
        this.sessionService.paymentWinRef.document.title = 'Payment Process';
        this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      }
      if (this.paymentType == PaymentMode.HYPERPAY && !this.transactionIdHyperPay && this.NET_PAYABLE_AMOUNT > 0) {
        this.openWindowInCenter('', '', 500, 600, 100);
        this.sessionService.paymentWinRef.document.title = 'Payment Process';
        this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      }
      if (this.paymentType == PaymentMode.VIVA && !this.transactionIdviva && this.NET_PAYABLE_AMOUNT > 0) {
        this.openWindowInCenter('', '', 500, 600, 100);
        this.sessionService.paymentWinRef.document.title = 'Payment Process';
        this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      }
      if (this.paymentType == PaymentMode.PAYHERE && !this.transactionIdPayHere && this.NET_PAYABLE_AMOUNT > 0) {
        this.openWindowInCenter('', '', 500, 600, 100);
        this.sessionService.paymentWinRef.document.title = 'Payment Process';
        this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      }
      if (this.paymentType == PaymentMode.AZUL && !this.transactionIdAzul && this.NET_PAYABLE_AMOUNT > 0) {
        this.openWindowInCenter('', '', 500, 600, 100);
        this.sessionService.paymentWinRef.document.title = 'Payment Process';
        this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      }
      if (this.paymentType == PaymentMode.CREDIMAX && !this.transactionIdCredimax && this.NET_PAYABLE_AMOUNT > 0) {
        this.openWindowInCenter('', '', 500, 600, 100);
        this.sessionService.paymentWinRef.document.title = 'Payment Process';
        this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      }
      if (this.paymentType == PaymentMode.MY_FATOORAH && !this.transactionIdFatoorah && this.NET_PAYABLE_AMOUNT > 0) {
        this.openWindowInCenter('', '', 500, 600, 100);
        this.sessionService.paymentWinRef.document.title = 'Payment Process';
        this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      }
      if (this.paymentType == PaymentMode.PAYNET && !this.transactionIdPaynet && this.NET_PAYABLE_AMOUNT > 0) {
        this.openWindowInCenter('', '', 500, 600, 100);
        this.sessionService.paymentWinRef.document.title = 'Payment Process';
        this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      }
      if (this.paymentType == PaymentMode.TAP && !this.transactionIdTap && this.NET_PAYABLE_AMOUNT > 0) {
        this.openWindowInCenter('', '', 500, 600, 100);
        this.sessionService.paymentWinRef.document.title = 'Payment Process';
        this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      }
      if (this.paymentType == PaymentMode.CURLEC && !this.transactionIdCurlec && this.NET_PAYABLE_AMOUNT > 0) {
        this.openWindowInCenter('', '', 500, 600, 100);
        this.sessionService.paymentWinRef.document.title = 'Payment Process';
        this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      }
      if (this.paymentType == PaymentMode.WIPAY && !this.transactionIdWipay && this.NET_PAYABLE_AMOUNT > 0) {
        this.openWindowInCenter('', '', 500, 600, 100);
        this.sessionService.paymentWinRef.document.title = 'Payment Process';
        this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      }
      if (this.paymentType == PaymentMode.PAGAR && !this.transactionIdPagar && this.NET_PAYABLE_AMOUNT > 0) {
        this.openWindowInCenter('', '', 500, 600, 100);
        this.sessionService.paymentWinRef.document.title = 'Payment Process';
        this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      }
      if (this.paymentType == PaymentMode.WECHAT && !this.transactionIdWechat && this.NET_PAYABLE_AMOUNT > 0) {
        this.openWindowInCenter('', '', 500, 600, 100);
        this.sessionService.paymentWinRef.document.title = 'Payment Process';
        this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      }
      if (this.paymentType == PaymentMode.MYBILLPAYMENT && !this.transactionIdMybillpayment && this.NET_PAYABLE_AMOUNT > 0) {
        this.openWindowInCenter('', '', 500, 600, 100);
        this.sessionService.paymentWinRef.document.title = 'Payment Process';
        this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      }
      if (this.paymentType == PaymentMode.VALITOR && !this.transactionIdValitor && this.NET_PAYABLE_AMOUNT > 0) {
        this.openWindowInCenter('', '', 500, 600, 100);
        this.sessionService.paymentWinRef.document.title = 'Payment Process';
        this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      }
      if (this.paymentType == PaymentMode.TRUEVO && !this.transactionIdTruevo && this.NET_PAYABLE_AMOUNT > 0) {
        this.openWindowInCenter('', '', 500, 600, 100);
        this.sessionService.paymentWinRef.document.title = 'Payment Process';
        this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      }
      if (this.paymentType == PaymentMode.PAYZEN && !this.transactionIdPayzen && this.NET_PAYABLE_AMOUNT > 0) {
        this.openWindowInCenter('', '', 500, 600, 100);
        this.sessionService.paymentWinRef.document.title = 'Payment Process';
        this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      }
      if (this.paymentType == PaymentMode.FIRSTDATA && !this.transactionIdFirstdata && this.NET_PAYABLE_AMOUNT > 0) {
        this.openWindowInCenter('', '', 500, 600, 100);
        this.sessionService.paymentWinRef.document.title = 'Payment Process';
        this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      }
      if (this.paymentType == PaymentMode.BANKOPEN && !this.transactionIdBankOpen && this.NET_PAYABLE_AMOUNT > 0) {
        this.openWindowInCenter('', '', 500, 600, 100);
        this.sessionService.paymentWinRef.document.title = 'Payment Process';
        this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      }
      if (this.paymentType == PaymentMode.ETISALAT && !this.transactionIdEtisalat && this.NET_PAYABLE_AMOUNT > 0) {
        this.openWindowInCenter('', '', 500, 600, 100);
        this.sessionService.paymentWinRef.document.title = 'Payment Process';
        this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      }
      if (this.paymentType == PaymentMode.GOCARDLESS && !this.transactionIdGocardless && this.NET_PAYABLE_AMOUNT > 0) {
        this.openWindowInCenter('', '', 500, 600, 100);
        this.sessionService.paymentWinRef.document.title = 'Payment Process';
        this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      }
      if (this.paymentType == PaymentMode.SQUARE && !this.transactionIdSquare && this.NET_PAYABLE_AMOUNT > 0) {
        this.openWindowInCenter('', '', 500, 600, 100);
        this.sessionService.paymentWinRef.document.title = 'Payment Process';
        this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      }
      if (this.paymentType == PaymentMode.WHOOSH && !this.transactionIdWhoosh && this.NET_PAYABLE_AMOUNT > 0) {
        this.openWindowInCenter('', '', 500, 600, 100);
        this.sessionService.paymentWinRef.document.title = 'Payment Process';
        this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      }
      if (this.paymentType == PaymentMode.MTN && !this.transactionIdMtn && this.NET_PAYABLE_AMOUNT > 0) {
        this.openWindowInCenter('', '', 500, 600, 100);
        this.sessionService.paymentWinRef.document.title = 'Payment Process';
        this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      }
      if (this.paymentType == PaymentMode.ONEPAY && !this.transactionIdOnepay && this.NET_PAYABLE_AMOUNT > 0) {
        this.openWindowInCenter('', '', 500, 600, 100);
        this.sessionService.paymentWinRef.document.title = 'Payment Process';
        this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      }
      if (this.paymentType == PaymentMode.PAGOPLUX && !this.transactionIdPagoplux && this.NET_PAYABLE_AMOUNT > 0) {
        this.openWindowInCenter('', '', 500, 600, 100);
        this.sessionService.paymentWinRef.document.title = 'Payment Process';
        this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      }

      if (this.paymentType == PaymentMode.THETELLER && !this.transactionIdTheteller && this.NET_PAYABLE_AMOUNT > 0) {
        this.openWindowInCenter('', '', 500, 600, 100);
        this.sessionService.paymentWinRef.document.title = 'Payment Process';
        this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      }
      if (this.paymentType == PaymentMode.SUNCASH && !this.transactionIdSuncash && this.NET_PAYABLE_AMOUNT > 0) {
        this.openWindowInCenter('', '', 500, 600, 100);
        this.sessionService.paymentWinRef.document.title = 'Payment Process';
        this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      }
      if (this.paymentType == PaymentMode.ATH && !this.transactionIdAth && this.NET_PAYABLE_AMOUNT > 0) {
        this.openWindowInCenter('', '', 500, 600, 100);
        this.sessionService.paymentWinRef.document.title = 'Payment Process';
        this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      }
      if (this.paymentType == PaymentMode.IPAY88 && !this.transactionIdIpay && this.NET_PAYABLE_AMOUNT > 0) {
        this.openWindowInCenter('', '', 500, 600, 100);
        this.sessionService.paymentWinRef.document.title = 'Payment Process';
        this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      }
      if (this.paymentType == PaymentMode.PROXYPAY && !this.transactionIdProxypay && this.NET_PAYABLE_AMOUNT > 0) {
        this.openWindowInCenter('', '', 500, 600, 100);
        this.sessionService.paymentWinRef.document.title = 'Payment Process';
        this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      }
      if (this.paymentType == PaymentMode.CYBERSOURCE && !this.transactionIdCybersource && this.NET_PAYABLE_AMOUNT > 0) {
        this.openWindowInCenter('', '', 500, 600, 100);
        this.sessionService.paymentWinRef.document.title = 'Payment Process';
        this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      }
      if (this.paymentType == PaymentMode.ALFALAH && !this.transactionIdAlfalah && this.NET_PAYABLE_AMOUNT > 0) {
        this.openWindowInCenter('', '', 500, 600, 100);
        this.sessionService.paymentWinRef.document.title = 'Payment Process';
        this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      }
      if (this.paymentType == PaymentMode.CULQI && !this.transactionIdCulqi && this.NET_PAYABLE_AMOUNT > 0) {
        this.openWindowInCenter('', '', 500, 600, 100);
        this.sessionService.paymentWinRef.document.title = 'Payment Process';
        this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      }
      if (this.paymentType == PaymentMode.FLUTTERWAVE && !this.transactionIdFlutterwave && this.NET_PAYABLE_AMOUNT > 0) {
        this.openWindowInCenter('', '', 500, 600, 100);
        this.sessionService.paymentWinRef.document.title = 'Payment Process';
        this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      }
      if (this.paymentType == PaymentMode.MPESA && !this.transactionIdMpesa && this.NET_PAYABLE_AMOUNT > 0) {
        this.openWindowInCenter('', '', 500, 600, 100);
        this.sessionService.paymentWinRef.document.title = 'Payment Process';
        this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      }
      if (this.paymentType == PaymentMode.ADYEN && !this.transactionIdAdyen && this.NET_PAYABLE_AMOUNT > 0) {
        this.openWindowInCenter('', '', 500, 600, 100);
        this.sessionService.paymentWinRef.document.title = 'Payment Process';
        this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      }
      if (this.paymentType == PaymentMode.NMI && !this.transactionIdNmi && this.NET_PAYABLE_AMOUNT > 0) {
        this.openWindowInCenter('', '', 500, 600, 100);
        this.sessionService.paymentWinRef.document.title = 'Payment Process';
        this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      }
      if (this.paymentType == PaymentMode.PAYMARK && !this.transactionIdPaymark && this.NET_PAYABLE_AMOUNT > 0) {
        this.openWindowInCenter('', '', 500, 600, 100);
        this.sessionService.paymentWinRef.document.title = 'Payment Process';
        this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      }
      if (this.paymentType == PaymentMode.HYPUR && !this.transactionIdHypur && this.NET_PAYABLE_AMOUNT > 0) {
        this.openWindowInCenter('', '', 500, 600, 100);
        this.sessionService.paymentWinRef.document.title = 'Payment Process';
        this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      }
      if (this.paymentType == PaymentMode.PIXELPAY && !this.transactionIdPixelpay && this.NET_PAYABLE_AMOUNT > 0) {
        this.openWindowInCenter('', '', 500, 600, 100);
        this.sessionService.paymentWinRef.document.title = 'Payment Process';
        this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      }
      if (this.paymentType == PaymentMode.PAYTMV3 && !this.transactionIdPaytm && this.NET_PAYABLE_AMOUNT > 0) {
        this.openWindowInCenter('', '', 500, 600, 100);
        this.sessionService.paymentWinRef.document.title = 'Payment Process';
        this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      }
      if (this.paymentType == PaymentMode.DOKU && !this.transactionIdDoku && this.NET_PAYABLE_AMOUNT > 0) {
        this.openWindowInCenter('', '', 500, 600, 100);
        this.sessionService.paymentWinRef.document.title = 'Payment Process';
        this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      }
      if (this.paymentType == PaymentMode.PEACH && !this.transactionIdPeach && this.NET_PAYABLE_AMOUNT > 0) {
        this.openWindowInCenter('', '', 500, 600, 100);
        this.sessionService.paymentWinRef.document.title = 'Payment Process';
        this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      }
      if (this.paymentType == PaymentMode.PAGUELOFACIL && !this.transactionIdPaguelofacil && this.NET_PAYABLE_AMOUNT > 0) {
        this.openWindowInCenter('', '', 500, 600, 100);
        this.sessionService.paymentWinRef.document.title = 'Payment Process';
        this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      }
      if (this.paymentType == PaymentMode.NOQOODY && !this.transactionIdNoqoody && this.NET_PAYABLE_AMOUNT > 0) {
        this.openWindowInCenter('', '', 500, 600, 100);
        this.sessionService.paymentWinRef.document.title = 'Payment Process';
        this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      }
      if (this.paymentType == PaymentMode.GTBANK && !this.transactionIdGtbank && this.NET_PAYABLE_AMOUNT > 0) {
        this.openWindowInCenter('', '', 500, 600, 100);
        this.sessionService.paymentWinRef.document.title = 'Payment Process';
        this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      }
      if (this.paymentType == PaymentMode.URWAY && !this.transactionIdUrway && this.NET_PAYABLE_AMOUNT > 0) {
        this.openWindowInCenter('', '', 500, 600, 100);
        this.sessionService.paymentWinRef.document.title = 'Payment Process';
        this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      }
      if (this.paymentType == PaymentMode.VUKA && !this.transactionIdVuka && this.NET_PAYABLE_AMOUNT > 0) {
        this.openWindowInCenter('', '', 500, 600, 100);
        this.sessionService.paymentWinRef.document.title = 'Payment Process';
        this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      }
      if (this.paymentType == PaymentMode.VPOS && !this.transactionIdVpos && this.NET_PAYABLE_AMOUNT > 0) {
        this.openWindowInCenter('', '', 500, 600, 100);
        this.sessionService.paymentWinRef.document.title = 'Payment Process';
        this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      }
      if (this.paymentType == PaymentMode.CXPAY && !this.transactionIdCxpay && this.NET_PAYABLE_AMOUNT > 0) {
        this.openWindowInCenter('', '', 500, 600, 100);
        this.sessionService.paymentWinRef.document.title = 'Payment Process';
        this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      }
      if (this.paymentType == PaymentMode.PAYKU && !this.transactionIdPayku && this.NET_PAYABLE_AMOUNT > 0) {
        this.openWindowInCenter('', '', 500, 600, 100);
        this.sessionService.paymentWinRef.document.title = 'Payment Process';
        this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      }
      if (this.paymentType == PaymentMode.BAMBORA && !this.transactionIdBambora && this.NET_PAYABLE_AMOUNT > 0) {
        this.openWindowInCenter('', '', 500, 600, 100);
        this.sessionService.paymentWinRef.document.title = 'Payment Process';
        this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      }
      if (this.paymentType == PaymentMode.PAYWAYONE && !this.transactionIdPaywayone && this.NET_PAYABLE_AMOUNT > 0) {
        this.openWindowInCenter('', '', 500, 600, 100);
        this.sessionService.paymentWinRef.document.title = 'Payment Process';
        this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      }
      if (this.paymentType == PaymentMode.PLACETOPAY && !this.transactionIdPlacetopay && this.NET_PAYABLE_AMOUNT > 0) {
        this.openWindowInCenter('', '', 500, 600, 100);
        this.sessionService.paymentWinRef.document.title = 'Payment Process';
        this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      }
      if (this.paymentType == PaymentMode.LIME_LIGHT && !this.transactionIdLimeLight && this.NET_PAYABLE_AMOUNT > 0) {
        this.showLimeLightPopup = true;
      }
      if (this.paymentType == PaymentMode.TWO_CHECKOUT && !this.transactionIdTwoCheckout && this.NET_PAYABLE_AMOUNT > 0) {
        this.showTwoCheckoutPopup = true;
      }
      if (this.paymentType == PaymentMode.PAY_MOB && !this.transactionIdPayMob && this.NET_PAYABLE_AMOUNT > 0) {
        this.openWindowInCenter('', '', 500, 600, 100);
        this.sessionService.paymentWinRef.document.title = 'Payment Process';
        this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      }
      if (this.paymentType == PaymentMode.PAYNOW && !this.transactionIdPaynow && this.NET_PAYABLE_AMOUNT > 0) {
        this.openWindowInCenter('', '', 500, 600, 100);
        this.sessionService.paymentWinRef.document.title = 'Payment Process';
        this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      }

      const payload = this.getTaskData();
      if (payload) {
        if (this.customOrderFlow) {
          payload.is_custom_order = this.appConfig.custom_quotation_enabled ? 2 : 1;
          if (this.appConfig.onboarding_business_type !== OnboardingBusinessType.LAUNDRY) {
            payload.job_pickup_datetime = new Date();
            payload.job_pickup_datetime.setTime(
              payload.job_pickup_datetime.getTime() +
              -1 * new Date().getTimezoneOffset() * 60 * 1000
            );
            payload.job_pickup_datetime.toISOString();
          }
        }
        this.createTask(payload);
      }
    } else {
      this.callBillBreakApi();
    }

  }

  callBillBreakApi() {
    let promoBool = false;
    let tipBool = false;
    if (Object.keys(this.billPromo).length) {
      promoBool = true;
    }
    if (this.tipModel.value) {
      tipBool = true;
    }
    this.getBillPaymentInfo(promoBool, tipBool);
  }
  checkDiffTime(pickTime, deliveryTime) {
    const startDate = new Date(pickTime);
    const endDate = new Date(deliveryTime);
    const startHour = startDate.getHours();
    const endHour = endDate.getHours();
    const startMinute = startDate.getMinutes();
    const endMinute = endDate.getMinutes();

    if (endHour <= startHour) {
      if (startMinute > 30) {
      }
    }
  }
  getTaskData() {
    let timeBool;
    const obj = this.sessionService.getByKey("app", "checkout").cart;

    const pickupDate = obj.job_pickup_datetime;
    const deliveryDate = obj.job_delivery_datetime;
    if (pickupDate) {
      timeBool = this.checkTime(pickupDate);
    }
    if (this.workflowBool) {
      this.checkDiffTime(pickupDate, deliveryDate);
    }
    if (timeBool) {
      return false;
    } else if (!timeBool && deliveryDate) {
      timeBool = this.checkTime(deliveryDate);
      return timeBool ? false : this.updateApiData(obj);
    } else if (!deliveryDate) {
      return this.updateApiData(obj);
    }
  }
  getTaskbyYelo() {
    if (this.appConfig.business_model_type === 'FREELANCER' && !this.customOrderFlow) {
      const obj = { payment_method: this.paymentType }
      return obj;
    }

    const obj = this.sessionService.getByKey("app", "checkout").cart;


    return this.updateApiDataYelo(obj);
  }
  updateApiData(obj) {

    delete obj.access_token;

    if (this.tipModel.value) {
      obj.tip_amount = this.tipModel.value;
      obj.tip_type = this.tipModel.type;
    }
    obj.amount = this.billInfo.ACTUAL_AMOUNT; // this.billInfo.NET_PAYABLE_AMOUNT;
    obj.payment_method = this.paymentType;
    // if (this.paymentType == '2') {
    //   obj = this.setPaymentApiObj(obj);
    // }
    obj.vertical = this.formSettings.vertical;
    // pickup meta data
    if (
      !this.workflowBool &&
      (!this.pickUpOrDeliveryBool ||
        this.pickUpOrDeliveryBool === 2 ||
        (this.pickUpAndDeliveryBool && this.pickUpOrDeliveryBool !== 1)) &&
      this.formSettings.userOptions &&
      Object.keys(this.formSettings.userOptions).length
    ) {
      obj.pickup_meta_data = this.getPickUpTaskMetaData(
        obj,
        "pickup_meta_data"
      );
    }

    // workflow meta data
    if (
      this.workflowBool &&
      this.formSettings.userOptions &&
      Object.keys(this.formSettings.userOptions).length
    ) {
      obj.meta_data = this.getPickUpTaskMetaData(obj, "meta_data");
    }
    // delivery meta data
    if (
      !this.workflowBool &&
      this.pickUpOrDeliveryBool === 1 &&
      this.formSettings.userOptions &&
      Object.keys(this.formSettings.userOptions).length
    ) {
      obj.meta_data = this.getPickUpTaskMetaData(obj, "meta_data");
    }

    if (
      !this.workflowBool &&
      this.pickUpOrDeliveryBool === 2 &&
      this.formSettings.deliveryOptions &&
      Object.keys(this.formSettings.deliveryOptions).length
    ) {
      obj.meta_data = this.getTaskMetaData(obj);
    }
    this.dataofCart = obj;

    return obj;
  }
  setPaymentApiObj(obj) {
    obj["currency_id"] = this.appConfig.is_multi_currency_enabled ? this.cartData[0].payment_settings.currency_id : this.currency.currency_id;
    obj["card_id"] = this.selectedCardId;


    if (Object.keys(this.billPromo).length) {
      obj["access_id"] = this.billPromo.access_id || "";
      if (!obj["access_id"]) {
        obj["promo_id"] = this.billPromo.promo_id;
      }
    }
    return obj;
  }
  getPickUpTaskMetaData(data, key) {
    if (data[key]) {
      let metaData;
      const items = this.formSettings.userOptions.items;
      metaData = this.getMetaData(items);
      const obj = JSON.parse(data[key]);
      metaData = obj.concat(metaData);
      return JSON.stringify(metaData);
    } else {
      return [];
    }
  }
  getMetaData(items) {
    const objArray = [];
    items.forEach(val => {
      const obj = {};
      obj["label"] = val.label;
      if (val.label === "Task_Details") {
        obj["data"] = this.getStringData();
        objArray.push(obj);
      }
      if (val.label === "subtotal") {
        (obj["data"] = this.billInfo.ACTUAL_AMOUNT), objArray.push(obj);
      }
    });
    return objArray;
  }
  checkTime(gTime) {
    const currentTime = new Date();
    const givenTime = new Date(gTime);
    if (currentTime.getTime() > givenTime.getTime()) {
      this.popup.showPopup(
        MessageType.ERROR,
        2500,
        this.languageStrings.pls_enter_valid_date_time || "Please enter valid date or time",
        false
      );
      return true;
    } else {
      return false;
    }
  }
  getTaskMetaData(data) {
    let metaData;
    const items = this.formSettings.deliveryOptions.items;
    metaData = this.getMetaData(items);
    const obj = JSON.parse(data.meta_data);
    metaData = obj.concat(metaData);
    return JSON.stringify(metaData);
  }
  getTaskDetails() {
    const obj = {};
    obj["label"] = "Task_Details";
    const string = "";
    const cartData = this.sessionService.getByKey("app", "cart");
    if (cartData) {
      this.cartData = cartData;
    }
    if (cartData) {
      of(cartData)
        .pipe(map(data => Object.keys(data).map(k => data[k])))
        .subscribe(data => (this.cartData = data));
    }
    obj["data"] = this.getStringData();
    // console.log(obj);
    this.getBillAmount();
    return obj;
  }
  getBillAmount() {
    const payment = this.sessionService.getByKey("app", "payment");
    //this.billAmount = payment && payment.bill ? payment.bill.NET_PAYABLE_AMOUNT : payment.amount;

    if ((this.appConfig.custom_quotation_enabled || this.appConfig.is_custom_order_active) && this.isSourceCustom && !this.repaymentTransaction) {
      this.billAmount = 0;
      if (this.debtAmountCheck) {
        this.billAmount = payment.amount;
      }
      //ACTUAL_AMOUNT
    } else if (this.repaymentTransaction) {
      this.billAmount = this.NET_PAYABLE_AMOUNT;
    } else {
      this.billAmount = this.userPaymentData.NET_PAYABLE_AMOUNT;
    }
    // if (this.appConfig.custom_quotation_enabled || this.appConfig.is_custom_order_active) {
    //   this.billAmount = 0;
    // } else {
    // this.billAmount = this.NET_PAYABLE_AMOUNT || 0;
    // }
    this.billDeliveryCharge = parseFloat(
      this.userPaymentData.DELIVERY_CHARGE
    );
    // this.billInfo = true
  }
  getBillVisibleType() {
    const config = this.sessionService.getByKey("app", "config");
    this.paymentBool["tip"] = config.is_tip_enabled;
    this.paymentBool["credit"] = config.is_credit_enabled;
    this.paymentBool["promo"] = config.is_promo_required;
    this.paymentBool["vat"] = config.vat;
    this.paymentBool["serviceTax"] = config.service_tax;
  }
  getStringData() {
    let string = "";
    if (this.cartData) {
      this.cartData.forEach((val: CartModel, index) => {
        const price = val.quantity * val.price;
        string +=
          val.name +
          " x " +
          val.quantity +
          " = " +
          (this.currency.symbol + price.toFixed(2));
        if (index < this.cartData.length - 1) {
          string += ",\n";
        }
      });
    }
    return string;
  }
  resetCard() {
    this.cardBool = false;
    this.cardHolderName = '';
    this.customerEmail = '';
    this.city = ''
    this.state = ''
    this.line1 = ''
    this.line2 = ''
    // this.country = ''
  }
  resetPromo() {
    this.showAddCoupon = false;
    this.addCouponForm.controls["couponCode"].setValue("");
    this.addCouponForm.markAsUntouched();
  }
  showAddCouponForm() {
    this.showAddCoupon = true;
  }

  addCoupon(data) {

    this.promoTypeAdded = data;
    let present = 0;
    for (let promo = 0; promo < this.promoList.length; promo++) {
      if (this.promoList[promo].code.toLowerCase() === data.toLowerCase()) {
        // const payload = {};
        // payload['amount'] = this.totalCartAmount;
        // payload['promo_value'] = this.promoList[promo].promo_value;
        // payload['benefit_type'] = this.promoList[promo].benefit_type;
        // payload['promo_id'] = this.promoList[promo].id;
        // this.applyPromoCode(payload);
        this.setPromoId(this.promoList[promo]);
        present = 1;
        this.hideDialog();
      }
    }
    if (!present) {
      const payload = {};
      payload["promo_code"] = this.dialog.value;
      this.applyPromoReferral(payload);
      this.hideDialog();
      //payload['vendor_id'] = this.sessionService.get('appData').vendor_details.vendor_id;
      //payload['access_token'] = this.sessionService.get('appData').vendor_details.app_access_token;
      //payload['marketplace_user_id'] = this.sessionService.get('appData').vendor_details.marketplace_user_id;
      //payload['user_id'] = this.sessionService.getString('user_id');
      //if (this.restaurantInfo.business_type === 2) {
      //  payload['amount'] = this.sessionService.getByKey('app', 'payment').bill.ACTUAL_AMOUNT; // ACTUAL_AMOUNT
      //} else {
      //  payload['amount'] = this.sessionService.getByKey('app', 'payment').amount;
      //}
      //payload['total_amount'] = this.userPaymentData.NET_PAYABLE_AMOUNT;
      //this.paymentService.applyReferral(payload).subscribe(response => {
      //  if (response.status === 200) {
      //    this.userPaymentData['discount'] = parseFloat(response.data.DISCOUNT);
      //    this.NET_PAYABLE_AMOUNT = parseFloat(response.data.NET_PAYABLE_AMOUNT);
      //    let temp_promo = {};
      //    temp_promo = {
      //      id: response.data.id,
      //      code: response.data.code,
      //      description: response.data.description,
      //      isPromo: response.data.isPromo,
      //      count: response.data.count
      //    };
      //    this.promoList.push(response.data.REFERRAL);
      //    this.billPromo = response.data.REFERRAL;
      //    this.hideDialog();
      //
      //  } else {
      //    this.popup.showPopup('error', 3000, response.message, false);
      //  }
      //});
    }
  }

  getParameterByName(name, url) {
    if (!url) {
      url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
    if (!results) {
      return null;
    }
    if (!results[2]) {
      return "";
    }
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }
  private setupIntentToken() {
    return new Promise((resolve, reject) => {
      const data =
        {
          marketplace_user_id: this.sessionService.get(
            "appData"
          ).vendor_details.marketplace_user_id,
          vendor_id: this.sessionService.get(
            "appData"
          ).vendor_details.vendor_id,
          access_token: this.sessionService.get(
            "appData"
          ).vendor_details.app_access_token
        }
      this.paymentService.getSetupIntent(data).subscribe((res) => {

        if (res.status == 200) {
          resolve(res.data || {});
        }
        else {
          this.loader.hide();
          this.popup.showPopup(MessageType.ERROR, 2500, res.message, false);
        }
      })
    })
  }

  async getCardToken(formValue, event) {
    if (this.userId == 198298 || this.userId == 283747) {
      if (!this.cardHolderName || !this.customerEmail || !this.city || !this.state || !this.line1) {
        this.showerror = true;
        return;
      }
    }

    this.loader.show();
    const intentData = await this.setupIntentToken();
    if (!intentData) {
      return;
    }

    // const dataObj = {"number": formValue.cardNumber, "exp_month": gMonth, "exp_year": gYear, "cvc": formValue.cvc};
    let payment_method_data = {};

    // if (this.cardHolderName || this.customerEmail) {
      payment_method_data = {
        // billing_details: { 
        //   name: this.cardHolderName || this.sessionService.get('appData').vendor_details.first_name, email: this.customerEmail || this.sessionService.get('appData').vendor_details.email 
        // }
        billing_details: {
          name: this.cardHolderName || this.sessionService.get('appData').vendor_details.first_name,
          email: this.customerEmail || undefined,
          address: {
            city: this.city || undefined,
            // country: this.country || undefined,
            line1: this.line1 || undefined,
            line2: this.line2 || undefined,
            state: this.state || undefined
          }
        }
      }
    // }
    this.stripe.handleCardSetup(intentData, this.card, { payment_method_data })
      .then(result => {
        if (result.setupIntent) {
          const data =
            {
              marketplace_user_id: this.sessionService.get(
                "appData"
              ).vendor_details.marketplace_user_id,
              vendor_id: this.sessionService.get(
                "appData"
              ).vendor_details.vendor_id,
              access_token: this.sessionService.get(
                "appData"
              ).vendor_details.app_access_token,
              payment_method: result.setupIntent.payment_method
            }

          this.paymentService.addCustomerCard(data).subscribe(res => {
            this.loader.hide();
            this.card.clear();
            this.cardBool = false;
            this.getCards(2);
            if (res.status === 200) {
              this.popup.showPopup(MessageType.SUCCESS, 2500, res.message, false);
            } else {
              this.popup.showPopup(MessageType.ERROR, 2500, res.message, false);
            }
          });
        } else if (result.error) {
          // Error creating the token
          this.card.clear();
          this.cardBool = false;
          this.loader.hide();
          this.popup.showPopup(MessageType.ERROR, 2500, result.error.message, false);
          console.error(result.error.message);
        } else {
          this.card.clear();
          this.cardBool = false;
          this.loader.hide();
        }
      });
  }
  showInfoDialog(promo) {
    this.activePromo = promo;
    this.promoInfoBool = true;
  }
  hideInfoDialog() {
    this.activePromo = {};
    this.promoInfoBool = false;
  }
  getPayloadForCard(cardDetails, token) {
    const apiObj: any = {};
    apiObj.card_details = {
      brand: cardDetails.brannd,
      card_token: cardDetails.id,
      exp_month: cardDetails.exp_month,
      exp_year: cardDetails.exp_year,
      funding: cardDetails.funding,
      last4_digits: cardDetails.last4,
      stripe_token: token
    };
    apiObj.payment_method = 2;
    return apiObj;
  }
  showAddCard(holdData?: string) {
    let paymentType;
    this.showAddCardPopUp = true;
    for (var i in this.paymentOptions) {
      if (
        this.paymentOptions[i].value === 32 &&
        this.paymentOptions[i].enabled
      ) {
        paymentType = PaymentMode.PAYFORT;
        break;
      }
      if (
        this.paymentOptions[i].value === PaymentMode.VISTA &&
        this.paymentOptions[i].enabled
      ) {
        paymentType = PaymentMode.VISTA;
        break;
      }
      if (
        this.paymentOptions[i].value === PaymentMode.AUTHORIZE_NET &&
        this.paymentOptions[i].enabled
      ) {
        paymentType = PaymentMode.AUTHORIZE_NET;
        break;
      }
      if (
        this.paymentOptions[i].value === PaymentMode.FAC &&
        this.paymentOptions[i].enabled
      ) {
        paymentType = PaymentMode.FAC;
        break;
      }
    }

    switch (paymentType) {

      case 32:
        this.fbEventPaymentSelection(32);
        if (this.add_card_link == "") {
          this.popup.showPopup(
            MessageType.ERROR,
            2000,
            this.languageStrings.unable_to_add_card || "Unable to add card",
            false
          );
          return false;
        }
        // this.payfortlink = this.domSanitizer.bypassSecurityTrustResourceUrl(
        //   this.add_card_link + "&domain_name=" + window.location.origin
        // );
        // this.payfortBool = true;
        // console.log(this.payfortlink);
        // document.getElementById("payfortIframe");
        if (this.userPaymentData.HOLD_PAYMENT && this.paymentType == PaymentMode.PAYFORT && !holdData) {
          this.holdPaymentCheck = true;
          this.holdType = {
            type: 'Add Card',
            method: 32
          };
          return;
        }
        if (this.userPaymentData.HOLD_PAYMENT && this.paymentType == PaymentMode.STRIPE && !holdData) {
          this.holdPaymentCheck = true;
          this.holdType = {
            type: 'Add Card',
            method: 2
          };
          return;
        }
        if (this.cardWindowRef) {
          this.cardWindowRef.close();
        }
        this.cardWindowRef = window.open('', '', "width=500,height=600,top=100,left=400");
        this.cardWindowRef.document.title = 'Add Card';
        this.cardWindowRef.location.href = this.add_card_link + "&domain_name=" + window.location.origin + '&customer_ip=' + this.sessionService.getString("ip_address");
        break;

      case PaymentMode.AUTHORIZE_NET:
        this.add_card_link += "&domain_name=" + encodeURIComponent(window.location.origin);
        this.authorizeNetUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(this.add_card_link);
        this.authorizeNetModal = true;
        break;
      case PaymentMode.VISTA:
        this.add_card_link += "&domain_name=" + encodeURIComponent(window.location.origin);
        this.vistaUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(this.add_card_link);
        this.vistaModal = true;
        break;
      case PaymentMode.FAC:
        let fac_url = this.add_card_link;
        this.add_card_link += "&domain_name=" + encodeURIComponent(window.location.origin);
        this.facUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(this.add_card_link);

        if (fac_url) {
          this.facModal = true;
        }
        break;

      default:
        this.fbEventPaymentSelection(2);
        this.cardBool = true;

    }


    // this.ref.detectChanges();
    // this.ref.markForCheck();
  }

  deleteMerchantCard(id) {
    // this.store.dispatch({
    //   type: AppPayment.actionTypes.DELETE_MERCHANT_CARD,
    //   payload: {
    //     payment_method: this.paymentMethod,
    //     card_id: id
    //   }
    // });
  }

  deleteDialog(id) {
    this.cardId = id;
    this.message = this.languageStrings.are_you_sure_want_to_delete_card || "Are you sure you want to delete this card?";
    this.showDialog(false);
    // this.ref.detectChanges();
    // this.ref.markForCheck();
  }
  setTipData() {
    if (this.appConfig.is_tip_enabled) {
      const array = [];
      if (this.appConfig.tip_default_values) {
        this.tipArray = this.appConfig.tip_default_values.split(",");
      }
    }
  }
  insertTipData(tip) {

    this.sessionService.setToString("tip", tip);
    if (this.tipArray.length > 3) {
      this.tipArray.splice(3, 1, tip);
    } else {
      this.tipArray.push(tip);
    }
    this.hideDialog();
  }
  getCustomerPromo() {
    const appSetting = this.sessionService.getByKey("app", "config");
    if (appSetting.is_promo_required && !this.customOrderFlow) {
      this.showPromo = true;
      // this.store.dispatch({
      //   type: AppPayment.actionTypes.GET_CUSTOMER_PROMOS,
      //   payload: {}
      // });
    } else {
      this.showPromo = false;
    }
  }
  hideDialog() {
    this.dialog = {};
  }
  showPromoDialog(key) {
    this.dialog.show = true;
    this.dialog.key = key;
    if (key === "Promo") {
      this.dialog.title = this.languageStrings.add_a_promo_code || "Add a Promo/Referral Code";
    } else {
      this.dialog.title = this.terminology.TIP || "Tip";
    }
  }
  showTipDialog(key, value) {
    this.dialog.show = true;
    this.dialog.key = key;
    this.dialog.title =this.terminology.TIP || "Tip";
  }
  saveDialogData() {
    if (this.dialog.value) {
      if (this.dialog.title === this.languageStrings.add_a_promo_code || "Add a Promo/Referral Code") {
        this.addCoupon(this.dialog.value);
      } else {
        this.getPaymentStatus(
          this.sessionService.getByKey("app", "payment").amount
        );
        this.tipAdded = true;
        this.insertTipData(this.dialog.value);
      }
    } else {
      this.dialog.error = true;
    }
    // this.getPaymentInfo(this.billAmount);
  }

  checkPaymentOptionsForDebt() {
    //debtPaymentMethod
    for (let opt = 0; opt < this.paymentOptions.length; opt++) {
      if (this.paymentOptions[opt].value === this.paymentModes.CASH || this.paymentOptions[opt].value === this.paymentModes.PAY_LATER) {
        this.debtPaymentMethod = true;
      } else {
        this.debtPaymentMethod = false;
        break;
      }
    }

  }

  checkPaymentOptionsForSubscriptionPlans() {
    if ([this.paymentModes.CASH, this.paymentModes.PAY_LATER].includes(+this.paymentType)) {
      this.subscriptionPlanPaymentMethod = true;
    } else {
      this.subscriptionPlanPaymentMethod = false;
    }
  }

  taskViaPayment(paymentfor?) {
    // return;
    let autoPayArray = [PaymentMode.RAZORPAY, PaymentMode.PAYPAL, PaymentMode.PAYZEN, PaymentMode.PAYFAST, PaymentMode.TAP, PaymentMode.CURLEC, PaymentMode.LIME_LIGHT, PaymentMode.WHOOSH, PaymentMode.PAGAR, PaymentMode.PAYNET, PaymentMode.STRIPE_IDEAL, PaymentMode.ONEPAY, PaymentMode.MTN, PaymentMode.TRUEVO, PaymentMode.FIRSTDATA, PaymentMode.MY_FATOORAH, PaymentMode.VALITOR, PaymentMode.VIVA, PaymentMode.SSL_COMMERZ, PaymentMode.HYPERPAY, PaymentMode.FAC_3D, PaymentMode.AZUL, PaymentMode.CREDIMAX, PaymentMode.ATH, PaymentMode.PAGOPLUX, PaymentMode.MYBILLPAYMENT, PaymentMode.TWO_CHECKOUT, PaymentMode.WECHAT, PaymentMode.SQUARE, PaymentMode.INNSTAPAY, PaymentMode.PAYHERE, PaymentMode.PAY_MOB, PaymentMode.IPAY88, PaymentMode.PAYU, PaymentMode.PAYSTACK, PaymentMode.PAYNOW, PaymentMode.ETISALAT, PaymentMode.PROXYPAY, PaymentMode.CYBERSOURCE, PaymentMode.BANKOPEN, PaymentMode.WIPAY, PaymentMode.MPAISA, PaymentMode.ALFALAH, PaymentMode.CULQI, PaymentMode.NMI, PaymentMode.CHECKOUT_COM, PaymentMode.FLUTTERWAVE, PaymentMode.MPESA, PaymentMode.ADYEN, PaymentMode.PAYMARK, PaymentMode.HYPUR, PaymentMode.PAYTMV3, PaymentMode.PIXELPAY, PaymentMode.DOKU, PaymentMode.PEACH, PaymentMode.PAGUELOFACIL, PaymentMode.NOQOODY, PaymentMode.GTBANK, PaymentMode.URWAY, PaymentMode.VUKA, PaymentMode.VPOS, PaymentMode.CXPAY, PaymentMode.PAYKU, PaymentMode.BAMBORA, PaymentMode.PAYWAYONE, PaymentMode.PLACETOPAY, PaymentMode.TELR];

    if (autoPayArray.includes(+this.paymentType) && this.selectedPaymentMethod && this.selectedPaymentMethod.payment_process_type === 2) {
      let msg = '';
      if(this.isSourceCustom || this.isEditedTask || this.repaymentTransaction){
        msg = 'Payment Successful.'
      }
      else if(+this.paymentType == PaymentMode.MPESA){
        msg = 'Order will be created once paymnet is done.'
      }
      else if(+this.paymentType == PaymentMode.VPOS) {
        msg = 'Waiting for payment confirmation.'
      }
      else {
        msg = 'Order placed successfully.'
      }
      //const msg = 'Order placed successfully.';
      this.popup.showPopup(MessageType.SUCCESS, 3000, msg, false);
      setTimeout(() => {
        this.razorPayModal = false;
        this.orderPlacedCartClear();
        this.changeRoute();
      }, 6000);

      return;
    }
    if (this.recurringEnabled && !this.recurringAllowedPayments.includes(+this.paymentType)) {
      this.popup.showPopup(MessageType.ERROR, 2000,
        this.languageStrings.payment_method_not_allowed_for_subcription_task || "This Payment Method is not allowed for subscription task, please contact your admin.",
        false);
      return false;
    }
    if (this.appConfig.is_debt_enabled && this.debtAmountCheck) {
      this.checkPaymentOptionsForDebt();
    }
    if (this.customerPlanId) {
      this.checkPaymentOptionsForSubscriptionPlans();
    }
    if (
      this.paymentType == "32" &&
      !this.payfort3dUrl &&
      this.cards.length > 0 &&
      this.selectedCardId
    ) {
      this.cvvPayfort = true;
      return false;
    }
    if (!this.billBool) {

      if (this.debtPaymentMethod) {
        this.popup.showPopup(
          MessageType.ERROR,
          2000,
          this.languageStrings.pls_contact_admin_to_clear_debt || "Please contact admin to clear your debt",
          false
        );
        return false;
      }
      if (!this.paymentType || this.subscriptionPlanPaymentMethod) {
        this.popup.showPopup(
          MessageType.ERROR,
          2000,
          (this.languageStrings.please_select_payment_method || "Please select payment method")
          .replace('PAYMENT_METHOD', this.terminology.PAYMENT_METHOD),
          false
        );
        return false;
      } else if (
        (this.paymentType == PaymentMode.STRIPE ||
          this.paymentType == PaymentMode.PAYFORT || this.paymentType == PaymentMode.FAC || this.paymentType == PaymentMode.VISTA) &&
        !this.selectedCardId
      ) {
        this.popup.showPopup(
          MessageType.ERROR,
          2000,
          this.languageStrings.pls_select_card || "Please select card",
          false
        );
        return false;
      }
      else if (this.paymentType == PaymentMode.INNSTAPAY && this.NET_PAYABLE_AMOUNT < 10) {
        this.popup.showPopup(MessageType.ERROR, 3000, this.languageStrings.order_amount_less_than_10_ngn || "Order of amount less than 10 NGN can only placed with Pay Via Cash", false);
        return;
      }
      else if (this.paymentType == PaymentMode.PAYU && !this.transactionIdPayu && this.NET_PAYABLE_AMOUNT > 0) {
        this.openWindowInCenter('', '', 500, 600, 100);
        this.sessionService.paymentWinRef.document.title = 'Payment Process';
        this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      }
      // else if (this.paymentType == PaymentMode.WIRE_CARD && !this.transactionIdWirecard && this.NET_PAYABLE_AMOUNT > 0) {
      //   this.openWindowInCenter('', '', 500, 600, 100);
      //   this.sessionService.wirecardWinRef.document.title = 'Payment Process';
      //   this.sessionService.wirecardWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      // }
      else if (this.paymentType == PaymentMode.SSL_COMMERZ && !this.transactionIdSslCommerz && this.NET_PAYABLE_AMOUNT > 0) {
        this.openWindowInCenter('', '', 500, 600, 100);
        this.sessionService.paymentWinRef.document.title = 'Payment Process';
        this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      }
      else if (this.paymentType == PaymentMode.FAC_3D && !this.transactionIdFAC3D && this.NET_PAYABLE_AMOUNT > 0) {
        this.openWindowInCenter('', '', 500, 600, 100);
        this.sessionService.paymentWinRef.document.title = 'Payment Process';
        this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      }
      else if (this.paymentType == PaymentMode.CHECKOUT_COM && !this.transactionIdCheckoutCom && this.NET_PAYABLE_AMOUNT > 0) {
        this.openWindowInCenter('', '', 500, 600, 100);
        this.sessionService.paymentWinRef.document.title = 'Payment Process';
        this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      }
      else if (this.paymentType == PaymentMode.HYPERPAY && !this.transactionIdHyperPay && this.NET_PAYABLE_AMOUNT > 0) {
        this.openWindowInCenter('', '', 500, 600, 100);
        this.sessionService.paymentWinRef.document.title = 'Payment Process';
        this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      }
      else if (this.paymentType == PaymentMode.VIVA && !this.transactionIdviva && this.NET_PAYABLE_AMOUNT > 0) {
        this.openWindowInCenter('', '', 500, 600, 100);
        this.sessionService.paymentWinRef.document.title = 'Payment Process';
        this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      }
      else if (this.paymentType == PaymentMode.PAYHERE && !this.transactionIdPayHere && this.NET_PAYABLE_AMOUNT > 0) {
        this.openWindowInCenter('', '', 500, 600, 100);
        this.sessionService.paymentWinRef.document.title = 'Payment Process';
        this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      }
      else if (this.paymentType == PaymentMode.AZUL && !this.transactionIdAzul && this.NET_PAYABLE_AMOUNT > 0) {
        this.openWindowInCenter('', '', 500, 600, 100);
        this.sessionService.paymentWinRef.document.title = 'Payment Process';
        this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      }
      else if (this.paymentType == PaymentMode.CREDIMAX && !this.transactionIdCredimax && this.NET_PAYABLE_AMOUNT > 0) {
        this.openWindowInCenter('', '', 500, 600, 100);
        this.sessionService.paymentWinRef.document.title = 'Payment Process';
        this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      }
      else if (this.paymentType == PaymentMode.MY_FATOORAH && !this.transactionIdFatoorah && this.NET_PAYABLE_AMOUNT > 0) {
        this.openWindowInCenter('', '', 500, 600, 100);
        this.sessionService.paymentWinRef.document.title = 'Payment Process';
        this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      }
      else if (this.paymentType == PaymentMode.PAYNET && !this.transactionIdPaynet && this.NET_PAYABLE_AMOUNT > 0) {
        this.openWindowInCenter('', '', 500, 600, 100);
        this.sessionService.paymentWinRef.document.title = 'Payment Process';
        this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      }
      else if (this.paymentType == PaymentMode.TAP && !this.transactionIdTap && this.NET_PAYABLE_AMOUNT > 0) {
        this.openWindowInCenter('', '', 500, 600, 100);
        this.sessionService.paymentWinRef.document.title = 'Payment Process';
        this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      }
      else if (this.paymentType == PaymentMode.CURLEC && !this.transactionIdCurlec && this.NET_PAYABLE_AMOUNT > 0) {
        this.openWindowInCenter('', '', 500, 600, 100);
        this.sessionService.paymentWinRef.document.title = 'Payment Process';
        this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      }
      else if (this.paymentType == PaymentMode.WIPAY && !this.transactionIdWipay && this.NET_PAYABLE_AMOUNT > 0) {
        this.openWindowInCenter('', '', 500, 600, 100);
        this.sessionService.paymentWinRef.document.title = 'Payment Process';
        this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      }
      else if (this.paymentType == PaymentMode.PAGAR && !this.transactionIdPagar && this.NET_PAYABLE_AMOUNT > 0) {
        this.openWindowInCenter('', '', 500, 600, 100);
        this.sessionService.paymentWinRef.document.title = 'Payment Process';
        this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      }
      else if (this.paymentType == PaymentMode.WECHAT && !this.transactionIdWechat && this.NET_PAYABLE_AMOUNT > 0) {
        // debugger;
        // this.openWindowInCenter('', '', 500, 600, 100);
        this.sessionService.paymentWinRef = window.open('');
        this.sessionService.paymentWinRef.document.title = 'Payment Process';
        this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      }
      else if (this.paymentType == PaymentMode.WHOOSH && !this.transactionIdWhoosh && this.NET_PAYABLE_AMOUNT > 0) {
        this.openWindowInCenter('', '', 500, 600, 100);
        this.sessionService.paymentWinRef.document.title = 'Payment Process';
        this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      }
      else if (this.paymentType == PaymentMode.MYBILLPAYMENT && !this.transactionIdMybillpayment && this.NET_PAYABLE_AMOUNT > 0) {
        this.openWindowInCenter('', '', 500, 600, 100);
        this.sessionService.paymentWinRef.document.title = 'Payment Process';
        this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      }
      else if (this.paymentType == PaymentMode.VALITOR && !this.transactionIdValitor && this.NET_PAYABLE_AMOUNT > 0) {
        this.openWindowInCenter('', '', 500, 600, 100);
        this.sessionService.paymentWinRef.document.title = 'Payment Process';
        this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      }
      else if (this.paymentType == PaymentMode.TRUEVO && !this.transactionIdTruevo && this.NET_PAYABLE_AMOUNT > 0) {
        this.openWindowInCenter('', '', 500, 600, 100);
        this.sessionService.paymentWinRef.document.title = 'Payment Process';
        this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      }
      else if (this.paymentType == PaymentMode.PAYZEN && !this.transactionIdPayzen && this.NET_PAYABLE_AMOUNT > 0) {
        this.openWindowInCenter('', '', 500, 600, 100);
        this.sessionService.paymentWinRef.document.title = 'Payment Process';
        this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      }
      else if (this.paymentType == PaymentMode.FIRSTDATA && !this.transactionIdFirstdata && this.NET_PAYABLE_AMOUNT > 0) {
        this.openWindowInCenter('', '', 500, 600, 100);
        this.sessionService.paymentWinRef.document.title = 'Payment Process';
        this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      }
      else if (this.paymentType == PaymentMode.BANKOPEN && !this.transactionIdBankOpen && this.NET_PAYABLE_AMOUNT > 0) {
        this.openWindowInCenter('', '', 500, 600, 100);
        this.sessionService.paymentWinRef.document.title = 'Payment Process';
        this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      }
      else if (this.paymentType == PaymentMode.ETISALAT && !this.transactionIdEtisalat && this.NET_PAYABLE_AMOUNT > 0) {
        this.openWindowInCenter('', '', 500, 600, 100);
        this.sessionService.paymentWinRef.document.title = 'Payment Process';
        this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      }
      else if (this.paymentType == PaymentMode.GOCARDLESS && !this.transactionIdGocardless && this.NET_PAYABLE_AMOUNT > 0) {
        this.openWindowInCenter('', '', 500, 600, 100);
        this.sessionService.paymentWinRef.document.title = 'Payment Process';
        this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      }
      else if (this.paymentType == PaymentMode.SQUARE && !this.transactionIdSquare && this.NET_PAYABLE_AMOUNT > 0) {
        this.openWindowInCenter('', '', 500, 600, 100);
        this.sessionService.paymentWinRef.document.title = 'Payment Process';
        this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      }
      else if (this.paymentType == PaymentMode.MTN && !this.transactionIdMtn && this.NET_PAYABLE_AMOUNT > 0) {
        this.openWindowInCenter('', '', 500, 600, 100);
        this.sessionService.paymentWinRef.document.title = 'Payment Process';
        this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      }
      else if (this.paymentType == PaymentMode.ONEPAY && !this.transactionIdOnepay && this.NET_PAYABLE_AMOUNT > 0) {
        this.openWindowInCenter('', '', 500, 600, 100);
        this.sessionService.paymentWinRef.document.title = 'Payment Process';
        this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      }
      else if (this.paymentType == PaymentMode.PAGOPLUX && !this.transactionIdPagoplux && this.NET_PAYABLE_AMOUNT > 0) {
        this.openWindowInCenter('', '', 500, 600, 100);
        this.sessionService.paymentWinRef.document.title = 'Payment Process';
        this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      }
      else if (this.paymentType == PaymentMode.THETELLER && !this.transactionIdTheteller && this.NET_PAYABLE_AMOUNT > 0) {
        this.openWindowInCenter('', '', 500, 600, 100);
        this.sessionService.paymentWinRef.document.title = 'Payment Process';
        this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      }
      else if (this.paymentType == PaymentMode.PAY_MOB && !this.transactionIdPayMob && this.NET_PAYABLE_AMOUNT > 0) {
        this.openWindowInCenter('', '', 500, 600, 100);
        this.sessionService.paymentWinRef.document.title = 'Payment Process';
        this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      }
      else if (this.paymentType == PaymentMode.PAYNOW && !this.transactionIdPaynow && this.NET_PAYABLE_AMOUNT > 0) {
        this.openWindowInCenter('', '', 500, 600, 100);
        this.sessionService.paymentWinRef.document.title = 'Payment Process';
        this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      }
      else if (this.paymentType == PaymentMode.SUNCASH && !this.transactionIdSuncash && this.NET_PAYABLE_AMOUNT > 0) {
        this.openWindowInCenter('', '', 500, 600, 100);
        this.sessionService.paymentWinRef.document.title = 'Payment Process';
        this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      }
      else if (this.paymentType == PaymentMode.ATH && !this.transactionIdAth && this.NET_PAYABLE_AMOUNT > 0) {
        this.openWindowInCenter('', '', 500, 600, 100);
        this.sessionService.paymentWinRef.document.title = 'Payment Process';
        this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      }
      else if (this.paymentType == PaymentMode.IPAY88 && !this.transactionIdIpay && this.NET_PAYABLE_AMOUNT > 0) {
        this.openWindowInCenter('', '', 500, 600, 100);
        this.sessionService.paymentWinRef.document.title = 'Payment Process';
        this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      }
      else if (this.paymentType == PaymentMode.PROXYPAY && !this.transactionIdProxypay && this.NET_PAYABLE_AMOUNT > 0) {
        this.openWindowInCenter('', '', 500, 600, 100);
        this.sessionService.paymentWinRef.document.title = 'Payment Process';
        this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      }
      else if (this.paymentType == PaymentMode.CYBERSOURCE && !this.transactionIdCybersource && this.NET_PAYABLE_AMOUNT > 0) {
        this.openWindowInCenter('', '', 500, 600, 100);
        this.sessionService.paymentWinRef.document.title = 'Payment Process';
        this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      }
      else if (this.paymentType == PaymentMode.ALFALAH && !this.transactionIdAlfalah && this.NET_PAYABLE_AMOUNT > 0) {
        this.openWindowInCenter('', '', 500, 600, 100);
        this.sessionService.paymentWinRef.document.title = 'Payment Process';
        this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      }
      else if (this.paymentType == PaymentMode.CULQI && !this.transactionIdCulqi && this.NET_PAYABLE_AMOUNT > 0) {
        this.openWindowInCenter('', '', 500, 600, 100);
        this.sessionService.paymentWinRef.document.title = 'Payment Process';
        this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      }
      else if (this.paymentType == PaymentMode.NMI && !this.transactionIdNmi && this.NET_PAYABLE_AMOUNT > 0) {
        this.openWindowInCenter('', '', 500, 600, 100);
        this.sessionService.paymentWinRef.document.title = 'Payment Process';
        this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      }
      else if (this.paymentType == PaymentMode.FLUTTERWAVE && !this.transactionIdFlutterwave && this.NET_PAYABLE_AMOUNT > 0) {
        this.openWindowInCenter('', '', 500, 600, 100);
        this.sessionService.paymentWinRef.document.title = 'Payment Process';
        this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      }
      else if (this.paymentType == PaymentMode.MPESA && !this.transactionIdMpesa && this.NET_PAYABLE_AMOUNT > 0) {
        this.openWindowInCenter('', '', 500, 600, 100);
        this.sessionService.paymentWinRef.document.title = 'Payment Process';
        this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      }
      else if (this.paymentType == PaymentMode.ADYEN && !this.transactionIdAdyen && this.NET_PAYABLE_AMOUNT > 0) {
        this.openWindowInCenter('', '', 500, 600, 100);
        this.sessionService.paymentWinRef.document.title = 'Payment Process';
        this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      }
      else if (this.paymentType == PaymentMode.PAYMARK && !this.transactionIdPaymark && this.NET_PAYABLE_AMOUNT > 0) {
        this.openWindowInCenter('', '', 500, 600, 100);
        this.sessionService.paymentWinRef.document.title = 'Payment Process';
        this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      }
      else if (this.paymentType == PaymentMode.HYPUR && !this.transactionIdHypur && this.NET_PAYABLE_AMOUNT > 0) {
        this.openWindowInCenter('', '', 500, 600, 100);
        this.sessionService.paymentWinRef.document.title = 'Payment Process';
        this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      }
      else if (this.paymentType == PaymentMode.PIXELPAY && !this.transactionIdPixelpay && this.NET_PAYABLE_AMOUNT > 0) {
        this.openWindowInCenter('', '', 500, 600, 100);
        this.sessionService.paymentWinRef.document.title = 'Payment Process';
        this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      }
      else if (this.paymentType == PaymentMode.PAYTMV3 && !this.transactionIdPaytm && this.NET_PAYABLE_AMOUNT > 0) {
        this.openWindowInCenter('', '', 500, 600, 100);
        this.sessionService.paymentWinRef.document.title = 'Payment Process';
        this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      }
      else if (this.paymentType == PaymentMode.DOKU && !this.transactionIdDoku && this.NET_PAYABLE_AMOUNT > 0) {
        this.openWindowInCenter('', '', 500, 600, 100);
        this.sessionService.paymentWinRef.document.title = 'Payment Process';
        this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      }
      else if (this.paymentType == PaymentMode.PEACH && !this.transactionIdPeach && this.NET_PAYABLE_AMOUNT > 0) {
        this.openWindowInCenter('', '', 500, 600, 100);
        this.sessionService.paymentWinRef.document.title = 'Payment Process';
        this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      }
      else if (this.paymentType == PaymentMode.PAGUELOFACIL && !this.transactionIdPaguelofacil && this.NET_PAYABLE_AMOUNT > 0) {
        this.openWindowInCenter('', '', 500, 600, 100);
        this.sessionService.paymentWinRef.document.title = 'Payment Process';
        this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      }
      else if (this.paymentType == PaymentMode.NOQOODY && !this.transactionIdNoqoody && this.NET_PAYABLE_AMOUNT > 0) {
        this.openWindowInCenter('', '', 500, 600, 100);
        this.sessionService.paymentWinRef.document.title = 'Payment Process';
        this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      }
      else if (this.paymentType == PaymentMode.GTBANK && !this.transactionIdGtbank && this.NET_PAYABLE_AMOUNT > 0) {
        this.openWindowInCenter('', '', 500, 600, 100);
        this.sessionService.paymentWinRef.document.title = 'Payment Process';
        this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      }
      else if (this.paymentType == PaymentMode.URWAY && !this.transactionIdUrway && this.NET_PAYABLE_AMOUNT > 0) {
        this.openWindowInCenter('', '', 500, 600, 100);
        this.sessionService.paymentWinRef.document.title = 'Payment Process';
        this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      }
      else if (this.paymentType == PaymentMode.VUKA && !this.transactionIdVuka && this.NET_PAYABLE_AMOUNT > 0) {
        this.openWindowInCenter('', '', 500, 600, 100);
        this.sessionService.paymentWinRef.document.title = 'Payment Process';
        this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      }
      else if (this.paymentType == PaymentMode.VPOS && !this.transactionIdVpos && this.NET_PAYABLE_AMOUNT > 0) {
        this.openWindowInCenter('', '', 500, 600, 100);
        this.sessionService.paymentWinRef.document.title = 'Payment Process';
        this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      }
      else if (this.paymentType == PaymentMode.CXPAY && !this.transactionIdCxpay && this.NET_PAYABLE_AMOUNT > 0) {
        this.openWindowInCenter('', '', 500, 600, 100);
        this.sessionService.paymentWinRef.document.title = 'Payment Process';
        this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      }
      else if (this.paymentType == PaymentMode.PAYKU && !this.transactionIdPayku && this.NET_PAYABLE_AMOUNT > 0) {
        this.openWindowInCenter('', '', 500, 600, 100);
        this.sessionService.paymentWinRef.document.title = 'Payment Process';
        this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      }
      else if (this.paymentType == PaymentMode.BAMBORA && !this.transactionIdBambora && this.NET_PAYABLE_AMOUNT > 0) {
        this.openWindowInCenter('', '', 500, 600, 100);
        this.sessionService.paymentWinRef.document.title = 'Payment Process';
        this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      }
      else if (this.paymentType == PaymentMode.PAYWAYONE && !this.transactionIdPaywayone && this.NET_PAYABLE_AMOUNT > 0) {
        this.openWindowInCenter('', '', 500, 600, 100);
        this.sessionService.paymentWinRef.document.title = 'Payment Process';
        this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      }
      else if (this.paymentType == PaymentMode.PLACETOPAY && !this.transactionIdPlacetopay && this.NET_PAYABLE_AMOUNT > 0) {
        this.openWindowInCenter('', '', 500, 600, 100);
        this.sessionService.paymentWinRef.document.title = 'Payment Process';
        this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      }
      else if (this.paymentType == PaymentMode.PAYTM_LINK) {
        if (!this.paytmLinkNumber) {
          this.showPhoneNumberPopupForPaytm = true;
          this.initPaytmPhoneNumberForm();
          return;
        }
      }
      else if (this.paymentType == PaymentMode.LIME_LIGHT) {
        this.showLimeLightPopup = true;
      }
      else if (this.paymentType == PaymentMode.TWO_CHECKOUT) {
        this.showTwoCheckoutPopup = true;
      }
      const payload = this.getTaskbyYelo();
      if (payload) {
        if (this.customOrderFlow) {
          payload.is_custom_order = this.appConfig.custom_quotation_enabled ? 2 : 1;
          if (this.paymentType === PaymentMode.FAC) {
            payload.fac_payment_flow = PaymentByUsing.USING_FAC;
          }
          if (this.appConfig.onboarding_business_type !== OnboardingBusinessType.LAUNDRY) {
            payload.job_pickup_datetime = new Date();
            payload.job_pickup_datetime.setTime(
              payload.job_pickup_datetime.getTime() +
              -1 * new Date().getTimezoneOffset() * 60 * 1000
            );
            payload.job_pickup_datetime.toISOString();
          }
        }
        if (this.paymentType == PaymentMode.PAYTM_LINK && this.paytmLinkNumber) {
          payload.paytm_number = this.paytmLinkNumber;
        }
        //write here
        if (paymentfor == 10) {
          let obj = {
            'payment_method': this.paymentType,
            'amount': this.NET_PAYABLE_AMOUNT,
            'job_id': this.sessionService.getByKey('app', 'payment').job_id,
            'payment_for': paymentfor,
            'card_id': this.selectedCardId,
            'additionalpaymentId': this.sessionService.getByKey('app', 'payment').additionalpaymentId
          }
          obj = Object.assign(obj, this.additionalAmountObj)

          this.additionalCharges(obj)
          return;
        }
        this.createTask(payload);
      }
    }
  }
  updateApiDataYelo(obj) {
    delete obj.pickup_meta_data;
    delete obj.pickup_custom_field_template;
    this.getBillAmount();
    obj.amount = this.billAmount; // this.billInfo.NET_PAYABLE_AMOUNT;
    // obj.payment_method = this.paymentType;
    // if (this.appConfig.custom_quotation_enabled || this.appConfig.is_custom_order_active) {
    obj.delivery_charge = this.billDeliveryCharge;
    // }
    //     if(this.paymentType == PaymentMode.FAC)
    // {obj.payment_by_using=2;
    // }
    if (this.paymentType === "512") {
      obj.payment_method = 512;
    } else {
      obj.payment_method = this.paymentType;
    }
    if (this.paymentType === "2") {
      obj = this.setPaymentApiObj(obj);
    }
    obj.vertical = this.formSettings.vertical;

    if (!this.customOrderFlow) {
      const products = this.getProductApiData();
      obj.products = products;
    }
    return obj;
  }
  getProductApiData() {
    const productData = [];
    let productObj: any;
    let config = this.sessionService.get("config");

    if (this.cartData) {
      this.cartData.forEach((val, index) => {
        const price = val.quantity * val.price;
        productObj = {};
        if (
          config.business_model_type === "ECOM" &&
          config.nlevel_enabled === 2
        ) {
          productObj["product_id"] = val.id;
          productObj["unit_price"] = val.price;
          productObj["quantity"] = val.quantity;
          productObj["total_price"] = price;
          productObj["customizations"] = val.customizations;
          productObj["seller_id"] = val.seller_id;
        } else {
          productObj["product_id"] = val.id;
          productObj["unit_price"] = val.price;
          productObj["quantity"] = val.quantity;
          productObj["total_price"] = price;
          productObj["customizations"] = val.customizations;
          productObj["return_enabled"] = val.return_enabled;
        }
        if (val.is_product_template_enabled === 1) {
          productObj["template"] = JSON.parse(val.product_template);
        }
        if (val.is_agents_on_product_tags_enabled && val.agent_id) {
          productObj["agent_id"] = val.agent_id;
        }

        // const productObj: any = {
        //   product_id: val.id,
        //   unit_price: val.price,
        //   quantity: val.quantity,
        //   total_price: price,
        //   customizations: val.customizations
        // };
        if (this.restaurantInfo.business_type === 2) {
          productObj["start_time"] = val.start_time;
          productObj["end_time"] = val.end_time;
        }
        productData.push(productObj);
      });
    }

    return JSON.stringify(productData);
  }
  checkCardDate(gYear, gMonth) {
    const gDate = new Date();
    const month = gDate.getMonth() + 1;
    const fullYear = gDate.getFullYear();
    let year = fullYear.toString();
    year = year.charAt(2) + year.charAt(3);
    if (Number(gYear) < Number(year) || gMonth > 12) {
      this.popup.showPopup(
        MessageType.ERROR,
        2000,
        this.languageStrings.pls_enter_valid_expire || "Please enter valid expiry date",
        false
      );
      return false;
    } else if (Number(gYear) === Number(year) && Number(gMonth) < month) {
      this.popup.showPopup(
        MessageType.ERROR,
        2000,
        this.languageStrings.pls_enter_valid_expire || "Please enter valid expiry date",
        false
      );
      return false;
    } else {
      return true;
    }
  }
  getPaymentInfo(amount, tipIndex, promo) {
    this.loader.show();
    let data: any = {};
    data["marketplace_reference_id"] = this.sessionService.getString(
      "marketplace_reference_id"
    );
    data["marketplace_user_id"] = this.sessionService.get(
      "appData"
    ).vendor_details.marketplace_user_id;
    data["user_id"] = this.sessionService.getString("user_id");
    data["vendor_id"] = this.sessionService.get(
      "appData"
    ).vendor_details.vendor_id;
    data["access_token"] = this.sessionService.get(
      "appData"
    ).vendor_details.app_access_token;
    data["amount"] = amount || 0;
    data["tip"] = +this.tipValue ? this.tipValue : undefined;
    data['loyalty_points'] = (this.appliedLoyaltyPointsTemp || this.appliedLoyaltyPointsTemp == 0) ? this.appliedLoyaltyPointsTemp : undefined
    if (promo && (promo.promo_id || promo.id)) {
      data["promo_id"] = promo.promo_id || promo.id;
    } else if (promo && promo.promo_code) {
      data["promo_code"] = promo.promo_code;
    } else if (promo && promo.referral_code) {
      data["referral_code"] = promo.referral_code;
    }
    if (this.tipType) {
      data["tip_type"] = this.tipType;
    }

    if (this.sessionService.getString("deliveryMethod")) {
      const method = this.sessionService.getString("deliveryMethod");
      switch (Number(method)) {
        case 1:
          data["home_delivery"] = 1;
          break;
        case 2:
          data["self_pickup"] = 1;
          break;
        case 8:
          data["pick_and_drop"] = 1;
          break;
      }
    }

    const checkoutData = this.sessionService.getByKey("app", "checkout").cart;
    const checkoutTemplate = this.sessionService.getByKey("app", "checkout_template") || [];
    data["checkout_template"] = JSON.stringify(checkoutTemplate);
    data["is_scheduled"] = checkoutData && checkoutData.is_scheduled ? checkoutData.is_scheduled : 0;
    data["job_pickup_datetime"] = checkoutData && checkoutData.is_scheduled ? checkoutData.job_pickup_datetime : moment().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
    if (this.customOrderFlow) {
      if (!checkoutData.is_pickup_anywhere) {
        data["job_pickup_latitude"] = checkoutData.job_pickup_latitude;
        data["job_pickup_longitude"] = checkoutData.job_pickup_longitude;
      } else {
        data["is_pickup_anywhere"] = 1;
      }
      data['customer_address'] = checkoutData.customer_address
      data["latitude"] = checkoutData.latitude;
      data["longitude"] = checkoutData.longitude;
      data["is_custom_order"] = this.appConfig.custom_quotation_enabled ? 2 : 1;
    } else {
      data['customer_address'] = checkoutData.job_pickup_address
      data["latitude"] = checkoutData.job_pickup_latitude;
      data["longitude"] = checkoutData.job_pickup_longitude;
    }

    if (!this.customOrderFlow) {
      data["products"] = this.getProductApiData();
    }

    if (this.appConfig.business_model_type === "RENTAL" && !this.customOrderFlow) {
      data.product_id = this.cartData[0].id;
      data.start_dateTime = this.cartData[0].start_time;
      data.end_dateTime = this.cartData[0].end_time;
      data.price_calculation = 1;
    }
    if (checkoutData.custom_pickup_address) {
      data.custom_pickup_address = checkoutData.custom_pickup_address ? checkoutData.custom_pickup_address : undefined;
      data.custom_pickup_latitude = checkoutData.custom_pickup_latitude ? checkoutData.custom_pickup_latitude : undefined;
      data.custom_pickup_longitude = checkoutData.custom_pickup_longitude ? checkoutData.custom_pickup_longitude : undefined;
    }
    if (this.orderType && this.orderType == 'subscription' && this.appConfig.is_recurring_enabled) {
      let recurringData = this.sessionService.getByKey('app', 'recurrenceData');
      data = Object.assign({}, data, recurringData);
    }

    if (this.sessionService.get('editJobId')) {
      data['prev_job_id'] = this.sessionService.get('editJobId');
    }
    if(this.deliveryMethod == 2 && !this.appConfig.show_tip_in_pickup)
      data["tip"] = 0;
    this.paymentService.getPaymentBillInfo(data).subscribe(response => {
      this.loader.hide();
      if (response.status === 200) {
        this.tempResponse = data;
        this.showPromoLink = response.data.SHOW_PROMO_BTN;
        this.responseData = response;
        if (this.sessionService.get('editJobId') && response.data.prev_job_amount) {
          this.amt_diff = response.data.NET_PAYABLE_AMOUNT - response.data.prev_job_amount;
        }
        if (response.data.TRANSACTIONAL_CHARGES_INFO && (Object.keys(response.data.TRANSACTIONAL_CHARGES_INFO).length != 0)) {
          if((this.sessionService.get("appData").vendor_details.last_payment_method == 8388608 && response.data.TRANSACTIONAL_CHARGES_INFO.MPAISA) ||
          (response.data.TRANSACTIONAL_CHARGES_INFO.STRIPE && this.sessionService.get("appData").vendor_details.last_payment_method == 2) ||
          (response.data.TRANSACTIONAL_CHARGES_INFO.PAYLATER && this.sessionService.get("appData").vendor_details.last_payment_method == 65536)){
            this.transactional_check = true;
            }
          if (response.data.TRANSACTIONAL_CHARGES_INFO.PAYLATER) {
            this.transaction_charges_check = true;
            if(this.paymentType == this.paymentModes.PAY_LATER){
              this.setPaymentType(PaymentMode.PAY_LATER.toString());
            }
            this.transactionalData = response.data.TRANSACTIONAL_CHARGES_INFO.PAYLATER;
            this.total_charges = this.transactionalData.total_charges;
            // this.charge_type = this.transactionalData.charge_type;
            this.transaction_charges = this.transactionalData.transaction_charges;
          }
          if (response.data.TRANSACTIONAL_CHARGES_INFO.MPAISA) {
            this.transaction_charges_check = true;
            this.transactionalData = response.data.TRANSACTIONAL_CHARGES_INFO.MPAISA;
            this.total_charges = this.transactionalData.total_charges;
            this.sessionService.set('transaction_amount', this.total_charges);
            // this.charge_type = this.transactionalData.charge_type;
            this.transaction_charges = this.transactionalData.transaction_charges;
          } else if (response.data.TRANSACTIONAL_CHARGES_INFO.STRIPE) {
            this.transaction_charges_check = true;
            this.transactionalData = response.data.TRANSACTIONAL_CHARGES_INFO.STRIPE;
            this.total_charges = this.transactionalData.total_charges;
            // this.charge_type = this.transactionalData.charge_type;
            this.transaction_charges = this.transactionalData.transaction_charges;
          }

        } else if (Object.keys(response.data.TRANSACTIONAL_CHARGES_INFO).length == 0) {
          this.transaction_charges_check = false;
        }
        if (response.data.APPLIED_PROMOS && response.data.APPLIED_PROMOS.length) {
          const autoAppliedPromo = response.data.APPLIED_PROMOS.filter(el => el.promo_mode === PromoMode.AUTO_APPLY);
          if (autoAppliedPromo && autoAppliedPromo.length) {
            const autoAppliedPromoGrouped = UtilityFunctions.groupBy(autoAppliedPromo, 'promo_on');
            response.data.autoAppliedPromoOnDelivery = autoAppliedPromoGrouped[PromotionOn.DELIVERY_CHARGE] || [];
            response.data.autoAppliedPromoOnSubtotal = autoAppliedPromoGrouped[PromotionOn.SUBTOTAL] || [];
          }
        }

        if (response.data.DELIVERY_DISCOUNT && !isNaN(response.data.DELIVERY_DISCOUNT)) {
          response.data.DELIVERY_CHARGE_AFTER_DISCOUNT = +response.data.DELIVERY_CHARGE - +response.data.DELIVERY_DISCOUNT;
        }


        if (this.customOrderFlow) {
          response.data.TIP_ENABLE_DISABLE = 0;
          response.data.PROMOS = [];
          if (response.data && response.data.CURRENCY && this.sessionService.get('config').is_multi_currency_enabled) {
            this.currency = response.data.CURRENCY;
          } else {
            if (this.formSettings.payment_settings) {
              this.currency = this.formSettings.payment_settings[0];
            }
          }
        } else {
          this.storeTip = response.data.TIP;
          if (promo && promo.promo_code) {
            let index = response.data.REFERRAL.findIndex(o => {
              return o.code === promo.promo_code;
            });
            if (index > -1) {
              this.billPromo = response.data.REFERRAL[index];
            } else {
              let index = response.data.PROMOS.findIndex((o) => { return o.code.toLowerCase() === this.promoTypeAdded.toLowerCase() });
              if (index > -1) {
                this.billPromo = response.data.PROMOS[index];
              }
            }
          }
          if (response.data.TIP_ENABLE_DISABLE === 1) {
            if (this.storeTip) {
              localStorage.setItem("tipVal", JSON.stringify(this.storeTip));
            }
          }
          if (
            response.data.TIP_OPTION_LIST &&
            response.data.TIP_OPTION_LIST.length > 0 && !promo
          ) {
            for (let i = 0; i < response.data.TIP_OPTION_LIST.length; i++) {
              if (tipIndex > -1 && tipIndex === i) {
                response.data.TIP_OPTION_LIST[i].selected = true;
                this.popup.showPopup(
                  MessageType.ERROR,
                  3000,
                  this.languageStrings.tip_added_successfully || "Tip added successfully.",
                  false
                );
              } else {
                response.data.TIP_OPTION_LIST[i].selected = false;
              }
            }
          }

          if (this.loyatyApplied ) {
            if(response.data.LOYALTY_POINT_USED > 0){
              this.popup.showPopup(MessageType.SUCCESS, 3000,
                (this.languageStrings.loyality_applied_successfully || 'Loyality Point applied successfully.')
                .replace('LOYALTY_POINTS', this.terminology.LOYALTY_POINTS),
                false);
              this.appliedLoyaltyPoints = response.data.LOYALTY_POINT_USED;
              this.loyatyApplied = false;
            }else
            this.appliedLoyaltyPoints = this.appliedLoyaltyPointsTemp || this.appliedLoyaltyPointsTemp == 0 ? this.appliedLoyaltyPointsTemp : undefined;
          }

        }
        this.paymentBillSuccess(response.data);

        this.getBillPlzUrlResponse();
      } else if (response.status === 201) {
        let paymentData = this.sessionService.getByKey("app", "payment");
        if (paymentData['bill'] && paymentData['bill'].PROMOS.length) {
          let index = paymentData['bill'].PROMOS.findIndex((o) => {
            if (this.tempResponse && this.tempResponse.promo_id) {
              return o.id == this.tempResponse.promo_id;
            } else if (this.tempResponse && this.tempResponse.promo_code) {
              return o.id == this.tempResponse.promo_code;
            }
          });
          this.billPromo = index > -1 ? paymentData['bill'].PROMOS[index] : {};
          this.promoReferralData = index > -1 ? paymentData['bill'].PROMOS[index] : '';
        }

        if (paymentData['bill'] && paymentData['bill'].REFERRAL.length) {
          let index = paymentData['bill'].PROMOS.findIndex((o) => {
            if (this.tempResponse && this.tempResponse.referral_code) {
              return o.id == this.tempResponse.referral_code;
            }
          })
          this.billPromo = index > -1 ? paymentData['bill'].REFERRAL[index] : {};
          this.promoReferralData = index > -1 ? paymentData['bill'].REFERRAL[index] : '';
        }
        if (response.data.debt_amount > 0) {
          this.router.navigate(['/debtAmount']);
        }
        //if (this.userPaymentData) {
        //  this.userPaymentData["discount"] = 0;
        //}
        this.popup.showPopup(MessageType.ERROR, 3000, response.message, false);
      } else {
        this.billPromo = {};
        this.promoReferralData = "";
        if (this.userPaymentData) {
          this.userPaymentData["discount"] = 0;
        }
        this.popup.showPopup(MessageType.ERROR, 3000, response.message, false);
      }
    });
  }

  /**
   * set default tip
   */
  setDefaultTip() {
    if (
      this.paymentInfo && this.paymentInfo['bill'] && this.paymentInfo['bill'].TIP_ENABLE_DISABLE == 1 &&
      this.sessionService.get("config").enable_default_tip === 1 &&
      !this.paymentInfo['bill']
    ) {
      this.applyAutoTip();
      localStorage.setItem("tipVal", this.tipValue);
      this.tipForm.controls.tip_value.setValue(this.tipValue);
      return;
    }

    if (
      this.paymentInfo && this.paymentInfo['bill'] && this.paymentInfo['bill'].TIP_ENABLE_DISABLE === 1 &&
      this.paymentInfo['bill'].MINIMUM_TIP_TYPE === 2 && !this.customOrderFlow
    ) {
      localStorage.setItem(
        "tipVal",
        JSON.stringify(this.paymentInfo['bill'].MINIMUM_TIP)
      );
    } else if (
      this.paymentInfo && this.paymentInfo['bill'] && this.paymentInfo['bill'].TIP_ENABLE_DISABLE === 1 &&
      this.paymentInfo['bill'].MINIMUM_TIP_TYPE === 1 && !this.customOrderFlow
    ) {
      let amountip = this.paymentInfo['bill'].MINIMUM_TIP;
      //.toFixed(this.appConfig.decimal_display_precision_point || 2);
      // let convertedValue;
      // let tensValue = Math.pow(10, this.appConfig.decimal_display_precision_point || 2);
      // amountip = Math.round(amountip * tensValue);
      // amountip = amountip / tensValue;
      // convertedValue = amountip.toFixed(this.appConfig.decimal_display_precision_point || 2);
      localStorage.setItem("tipVal", amountip);
    }
    if (localStorage.getItem("tipVal")) {
      this.tipValue = localStorage.getItem("tipVal");
      this.tipForm.controls.tip_value.setValue(this.tipValue);
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

  getPaymentStatus(amount) {

    this.loader.show();
    const data: any = {};
    const checkoutData = this.sessionService.getByKey("app", "checkout").cart;
    const productData = this.sessionService.getByKey("app", "cart");

    data["user_id"] = this.sessionService.getString("user_id");
    data["access_token"] = this.sessionService.get(
      "appData"
    ).vendor_details.app_access_token;
    data["marketplace_reference_id"] = this.sessionService.getString(
      "marketplace_reference_id"
    );
    data["vendor_id"] = this.sessionService.get(
      "appData"
    ).vendor_details.vendor_id;
    data["marketplace_user_id"] = this.sessionService.get(
      "appData"
    ).vendor_details.marketplace_user_id;
    if (
      this.restaurantInfo.business_type === 2 &&
      this.restaurantInfo.pd_or_appointment === 2
    ) {
      data["job_pickup_datetime"] = moment().format(
        "YYYY-MM-DDTHH:mm:ss.SSS[Z]"
      );
      data["job_delivery_datetime"] = moment().format(
        "YYYY-MM-DDTHH:mm:ss.SSS[Z]"
      );
    } else {
      data["job_pickup_datetime"] = checkoutData.job_pickup_datetime;
      data["job_delivery_datetime"] = checkoutData.job_delivery_datetime;
    }
    data["payment_method"] = checkoutData.payment_method;
    data["amount"] = 0;
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
          return_enabled: productData[i].return_enabled,
          template: productData[i].product_template || '',
        });

        if (this.restaurantInfo.business_type === 2) {
          data["products"][i].start_time = productData[i].start_time;
          data["products"][i].end_time = productData[i].end_time;
        }
      }
    }

    if (this.customOrderFlow) {
      data.is_custom_order = this.appConfig.custom_quotation_enabled ? 2 : 1;
    }
    if (this.sessionService.getByKey('app', 'payment') && this.sessionService.getByKey('app', 'payment').is_custom_order == 1) {
      const objData = {
        'transaction_id': this.sessionService.get("payViaBillPlzTransactionId"),
        'amount': this.sessionService.getByKey('app', 'payment').amount,
        'plan_id': this.customerPlanId,
        'payment_method': this.paymentMethod,
        'job_id': this.sessionService.getByKey('app', 'payment').job_id,
        'additionalPaymentId': this.sessionService.getByKey('app', 'payment').additionalpaymentId,
        'payment_for': 10
      };
      this.customerPlan(objData);
    }
    else {
      this.paymentService.sendPaymentTask(data).subscribe(response => {

        this.loader.hide();
        if (response.status === 200) {

          this.unitCount = response.data.unit_count;
          this.unitType = response.data.unit_type;
          this.unitValue = response.data.unit;

          this.perTaskCost = response.data.per_task_cost || 0;
          let billBreakdownActualAmmount;
          if (this.sessionService.getByKey("app", "payment").bill) {
            billBreakdownActualAmmount = this.sessionService.getByKey("app", "payment").bill.ACTUAL_AMOUNT;
          }

          if (!this.customOrderFlow &&
            !['FREELANCER', 'ECOM'].includes(this.appConfig.business_model_type) &&
            this.appConfig.onboarding_business_type !== 805 &&
            billBreakdownActualAmmount && billBreakdownActualAmmount > this.perTaskCost) {
            // to read per task cost from bill breakdown
            this.perTaskCost = billBreakdownActualAmmount;
          }
          if (this.paymentInfo && this.paymentInfo['bill']) {
            this.setDefaultTip();
          }
          this.getPaymentInfo(
            response.data.per_task_cost,
            this.selectedIndex,
            ""
          );
        } else {
          this.popup.showPopup(MessageType.ERROR, 3000, response.message, false);
        }
      });
    }
  }

  paymentBillSuccess(data) {
    let paymentData = this.sessionService.getByKey("app", "payment");
    if (paymentData && Object.keys(paymentData).length) {
      paymentData["bill"] = data;
    } else {
      paymentData = {};
      paymentData["bill"] = data;
    }
    this.userPaymentData = paymentData["bill"];

    if (this.appConfig.business_model_type !== "FREELANCER" && Object.keys(this.paymentInfo).length === 0) {
      this.sessionService.setByKey("app", "payment", paymentData);
      this.paymentInfo = Object.assign(
        {},
        this.sessionService.getByKey("app", "payment")
      );
      this.setDefaultTip();
    }

    if (this.restaurantInfo.is_delivery_charge_surge_active && this.sessionService.getByKey("app", "payment") && this.sessionService.getByKey("app", "payment").bill && this.sessionService.getByKey("app", "payment").bill.DELIVERY_CHARGES_FORMULA_FIELDS && !this.isSourceCustom) {
      this.sessionService.setByKey("app", "payment", paymentData);
    }
    this.deliveryChargeList = [];
    if (this.restaurantInfo.is_delivery_charge_surge_active && this.userPaymentData.RECURRING_SURGE_DETAIL && this.userPaymentData.RECURRING_SURGE_DETAIL.length) {
      this.userPaymentData.RECURRING_SURGE_DETAIL.forEach((element) => {
        this.schedule_time = moment(moment().format('YYYY-MM-DD') + element.schedule_time + this.tFormat, 'YYYY-MM_DDhh:mma').format('hh:mm A');
        this.deliveryChargeList.push({
          day: this.weekDays[element.day_id].day_name,
          charge: element.delivery_charges,
          amount: element.amount,
          day_id: element.day_id,
          occurances: element.occurances,
          total_amount: element.total_amount
        })
      })
    }

    this.userPaymentData["discount"] = this.userPaymentData.DISCOUNT;
    this.NET_PAYABLE_AMOUNT = paymentData["bill"].NET_PAYABLE_AMOUNT;
    this.userTaxes = paymentData["bill"].USER_TAXES;
    this.catalogueTaxes = (paymentData["bill"].CATALOG_TAX) ? paymentData["bill"].CATALOG_TAX : undefined;
    this.promoList = paymentData["bill"].PROMOS;
    this.promoList = this.promoList.concat(paymentData["bill"].REFERRAL);
    if (this.promoList.length) {
      this.showPromo = true;
    }

    this.loader.hide();


  }

  /**
   * choose particular tip option
   * @param index
   */
  chooseTipOption(index) {


    for (let i = 0; i < this.userPaymentData.TIP_OPTION_LIST.length; i++) {
      if (i !== index) {
        this.userPaymentData.TIP_OPTION_LIST[i].selected = false;
      } else {
        this.userPaymentData.TIP_OPTION_LIST[i].selected = true;
      }
    }

    this.tipValue = this.userPaymentData.TIP_OPTION_LIST[index].amount;
    this.tipForm.controls.tip_value.setValue(this.tipValue);
    this.makeTipHit(this.tipForm);
  }

  /**
   * change tip value
   */
  changeTipValue() {
    this.tipType = 2;
    if (
      this.userPaymentData.TIP_OPTION_LIST &&
      this.userPaymentData.TIP_OPTION_LIST.length > 0
    ) {
      for (let i = 0; i < this.userPaymentData.TIP_OPTION_LIST.length; i++) {
        this.userPaymentData.TIP_OPTION_LIST[i].selected = false;
      }
    }
  }

  /**
   * tip type submit
   */
  makeTipHit(value) {
    if (!this.tipForm.valid) {
      return this.validationService.validateAllFormFields(this.tipForm);
    }
    this.tipValue = value.value.tip_value;
    // this.tipValue=this.tipValue.toFixed(this.appConfig.decimal_calculation_precision_point);

    if (
      this.userPaymentData.MINIMUM_TIP !== 0 &&
      this.userPaymentData.MINIMUM_TIP > this.tipValue
    ) {
      const msg = (this.languageStrings.min_tip_amt_should_be || "Minimum Tip amount should be $10.")
      .replace(
        "10",
        this.userPaymentData.MINIMUM_TIP.toFixed(this.appConfig.decimal_display_precision_point || 2)
      );
      const msg_1 = msg.replace(
        "----",
        this.terminology.TIP
      );
      this.popup.showPopup(MessageType.SUCCESS, 3000, msg_1, false);
      return;
    }
    let index = -1;
    if (
      this.userPaymentData.TIP_OPTION_LIST &&
      this.userPaymentData.TIP_OPTION_LIST.length > 0
    ) {
      index = this.userPaymentData.TIP_OPTION_LIST.findIndex(o => {
        return o.selected === true;
      });
    }
    this.getPaymentInfo(this.perTaskCost, index, this.promoReferralData);
  }

  fetchCards(data) {
    data.marketplace_reference_id = this.sessionService.getString(
      "marketplace_reference_id"
    );
    data.marketplace_user_id = this.sessionService.get(
      "appData"
    ).vendor_details.marketplace_user_id;
    data.vendor_id = this.sessionService.get(
      "appData"
    ).vendor_details.vendor_id;
    data.access_token = this.sessionService.get(
      "appData"
    ).vendor_details.app_access_token;

    this.paymentService.getAllCards(data).subscribe(response => {
      if (response.status === 200) {
        this.fetchCardSuccess(response.data,data.payment_method);
        this.facModal = false
      } else {
        this.fetchCardSuccess([],data.payment_method);
      }
    });
  }

  /**
   * send fb pixel event on payment selection
   * @param method
   */
  fbEventPaymentSelection(method) {
    const data = {
      value: this.NET_PAYABLE_AMOUNT?this.NET_PAYABLE_AMOUNT:'',
      currency: this.currency?this.currency.code:''
    }
    switch (method) {
      case PaymentMode.STRIPE:
        this.fbPixelService.emitEvent('AddPaymentInfo', data);
        break;
      case PaymentMode.CASH:
        this.fbPixelService.emitEvent('AddPaymentInfo', data);
        break;
      case PaymentMode.PAYTM_LINK:
        this.fbPixelService.emitEvent('AddPaymentInfo', data);
        break;
      case PaymentMode.PAYTM:
        this.fbPixelService.emitEvent('AddPaymentInfo', data);
        break;
      case PaymentMode.WALLET:
        this.fbPixelService.emitEvent('AddPaymentInfo', data);
        break;
      case PaymentMode.PAY_LATER:
        this.fbPixelService.emitEvent('AddPaymentInfo', data);
        break;
      default:
        this.fbPixelService.emitEvent('AddPaymentInfo', data);
        break;
    }
  }

  fetchPaytmWalletDetails(method) {
    const data = {
      payment_method: method,
      vendor_id: this.sessionService.get("appData").vendor_details.vendor_id,
      app_access_token: this.sessionService.get("appData").vendor_details
        .app_access_token,
      app_device_type: "WEB"
    };

    this.paymentService.getWalletDetails(data).subscribe(response => {
      if (response.status === 200) {
        if (response.data && response.data.paytm) {
          this.addPaytmMoneyUrl = response.data.paytm.paytm_add_money_url;
          this.addPaytmMoneyUrl =
            this.addPaytmMoneyUrl + "&callback_url=" + location.href;
          this.paytmData = response.data.paytm;
        }
      } else {
      }
    });
  }

  fetchCardSuccess(data,method) {
    this.add_card_link = data.add_card_link;
    let paymentData = this.sessionService.get("appData").payment;
    if (paymentData) {
      paymentData["card"] = data;
    } else {
      paymentData = {};
      paymentData["card"] = data;
    }
    if(method == PaymentMode.FAC) {
      this.fac_cards = data.cards;
    }
    else this.cards = data.cards;
    
    if (this.fac_cards && this.fac_cards.length) {
      this.selectedCardId = "";
      if(this.showAddCardPopUp){
        this.selectedCardId = this.fac_cards ? (this.fac_cards.length > 0 ? this.fac_cards[this.fac_cards.length-1].card_id : "") : "";
        localStorage.setItem('cardId',this.selectedCardId);
        this.showAddCardPopUp = false;
        // for (var i in this.paymentOptions) {
        //   if (
        //     this.paymentOptions[i].value === 32 &&
        //     this.paymentOptions[i].enabled
        //   ) {
        //     this.setPaymentType(PaymentMode.PAYFORT,'init');
        //     break;
        //   }
        //   if (
        //     this.paymentOptions[i].value === PaymentMode.VISTA &&
        //     this.paymentOptions[i].enabled
        //   ) {
        //     this.setPaymentType(PaymentMode.VISTA,'init');
        //     break;
        //   }
        //   if (
        //     this.paymentOptions[i].value === PaymentMode.AUTHORIZE_NET &&
        //     this.paymentOptions[i].enabled
        //   ) {
        //     this.setPaymentType(PaymentMode.AUTHORIZE_NET,'init');
        //     break;
        //   }
        //   if (
        //     this.paymentOptions[i].value === PaymentMode.FAC &&
        //     this.paymentOptions[i].enabled
        //   ) {
        //     this.setPaymentType(PaymentMode.FAC,'init');
        //     break;
        //   }
        //   if (
        //     this.paymentOptions[i].value === PaymentMode.STRIPE &&
        //     this.paymentOptions[i].enabled
        //   ) {
        //     this.setPaymentType(PaymentMode.STRIPE,'init');
        //     break;
        //   }
        // }
        this.setPaymentType(PaymentMode.FAC,'init');
     }
     else{
      let paymentIndex = this.paymentOptions.findIndex(el => el.value == this.sessionService.get("appData").vendor_details.last_payment_method);
        if(paymentIndex > -1){
          if (this.paymentOptions[paymentIndex].value === this.sessionService.get("appData").vendor_details.last_payment_method && this.paymentOptions[paymentIndex].enabled && this.paymentOptions[paymentIndex].value === PaymentMode.FAC){
            this.setPaymentType(PaymentMode.FAC,'init');
            this.selectedCardId = this.cards ? (this.cards.length > 0 ? this.cards[this.cards.length-1].card_id : "") : "";
            localStorage.setItem('cardId',this.selectedCardId);
          }
             else
               this.setPaymentType(this.paymentOptions[paymentIndex].value);
        }
        else{
          for (let opt = 0; opt < this.paymentOptions.length; opt++) {
            if (this.paymentOptions[opt].value != PaymentMode.CASH && this.paymentOptions[opt].enabled && this.paymentOptions[opt].value === 32){
              this.setPaymentType(PaymentMode.PAYFORT,'init');
              this.selectedCardId = this.cards ? (this.cards.length > 0 ? this.cards[this.cards.length-1].card_id : "") : "";
              localStorage.setItem('cardId',this.selectedCardId);
               break;
             }
             if (this.paymentOptions[opt].value != PaymentMode.CASH && this.paymentOptions[opt].enabled && this.paymentOptions[opt].value === PaymentMode.VISTA){
              this.setPaymentType(PaymentMode.VISTA,'init');
              this.selectedCardId = this.cards ? (this.cards.length > 0 ? this.cards[this.cards.length-1].card_id : "") : "";
              localStorage.setItem('cardId',this.selectedCardId);
               break;
            }
            if(this.paymentOptions[opt].value != PaymentMode.CASH && this.paymentOptions[opt].enabled && this.paymentOptions[opt].value === PaymentMode.AUTHORIZE_NET){
              this.setPaymentType(PaymentMode.AUTHORIZE_NET,'init');
              this.selectedCardId = this.cards ? (this.cards.length > 0 ? this.cards[this.cards.length-1].card_id : "") : "";
              localStorage.setItem('cardId',this.selectedCardId);
               break;
            }
            if(this.paymentOptions[opt].value != PaymentMode.CASH && this.paymentOptions[opt].enabled && this.paymentOptions[opt].value === PaymentMode.FAC){
              this.setPaymentType(PaymentMode.FAC,'init');
              this.selectedCardId = this.cards ? (this.cards.length > 0 ? this.cards[this.cards.length-1].card_id : "") : "";
              localStorage.setItem('cardId',this.selectedCardId);
               break;
            }
            if(this.paymentOptions[opt].value != PaymentMode.CASH && this.paymentOptions[opt].enabled && this.paymentOptions[opt].value === PaymentMode.STRIPE){
              this.setPaymentType(PaymentMode.STRIPE,'init');
              this.selectedCardId = this.cards ? (this.cards.length > 0 ? this.cards[this.cards.length-1].card_id : "") : "";
              localStorage.setItem('cardId',this.selectedCardId);
               break;
            }
            if (this.paymentOptions[opt].value === PaymentMode.CASH && this.paymentOptions[opt].enabled) {
              if(this.appConfig.payment_method_autoselect){
                this.setPaymentType(PaymentMode.CASH.toString());
              }
              break;
            }
          }
        }
     }
    }
    else if (this.cards && this.cards.length) {
      this.selectedCardId = "";
      if(this.showAddCardPopUp){
        this.selectedCardId = this.cards ? (this.cards.length > 0 ? this.cards[this.cards.length-1].card_id : "") : "";
        localStorage.setItem('cardId',this.selectedCardId);
        this.showAddCardPopUp = false;
        for (var i in this.paymentOptions) {
          if (
            this.paymentOptions[i].value === 32 &&
            this.paymentOptions[i].enabled
          ) {
            this.setPaymentType(PaymentMode.PAYFORT,'init');
            break;
          }
          if (
            this.paymentOptions[i].value === PaymentMode.VISTA &&
            this.paymentOptions[i].enabled
          ) {
            this.setPaymentType(PaymentMode.VISTA,'init');
            break;
          }
          if (
            this.paymentOptions[i].value === PaymentMode.AUTHORIZE_NET &&
            this.paymentOptions[i].enabled
          ) {
            this.setPaymentType(PaymentMode.AUTHORIZE_NET,'init');
            break;
          }
          if (
            this.paymentOptions[i].value === PaymentMode.STRIPE &&
            this.paymentOptions[i].enabled
          ) {
            this.setPaymentType(PaymentMode.STRIPE,'init');
            break;
          }
        }
     }
     else{
      let paymentIndex = this.paymentOptions.findIndex(el => el.value == this.sessionService.get("appData").vendor_details.last_payment_method);
        if(paymentIndex > -1){
            if (this.paymentOptions[paymentIndex].value === this.sessionService.get("appData").vendor_details.last_payment_method && this.paymentOptions[paymentIndex].enabled && this.paymentOptions[paymentIndex].value === 32){
               this.setPaymentType(PaymentMode.PAYFORT,'init');
               this.selectedCardId = this.cards ? (this.cards.length > 0 ? this.cards[this.cards.length-1].card_id : "") : "";
               localStorage.setItem('cardId',this.selectedCardId);
              }
             else if (this.paymentOptions[paymentIndex].value === this.sessionService.get("appData").vendor_details.last_payment_method && this.paymentOptions[paymentIndex].enabled && this.paymentOptions[paymentIndex].value === PaymentMode.VISTA){
               this.setPaymentType(PaymentMode.VISTA,'init');
               this.selectedCardId = this.cards ? (this.cards.length > 0 ? this.cards[this.cards.length-1].card_id : "") : "";
               localStorage.setItem('cardId',this.selectedCardId);
             }
             else if (this.paymentOptions[paymentIndex].value === this.sessionService.get("appData").vendor_details.last_payment_method && this.paymentOptions[paymentIndex].enabled && this.paymentOptions[paymentIndex].value === PaymentMode.AUTHORIZE_NET){
               this.setPaymentType(PaymentMode.AUTHORIZE_NET,'init');
               this.selectedCardId = this.cards ? (this.cards.length > 0 ? this.cards[this.cards.length-1].card_id : "") : "";
               localStorage.setItem('cardId',this.selectedCardId);
             }
             else if (this.paymentOptions[paymentIndex].value === this.sessionService.get("appData").vendor_details.last_payment_method && this.paymentOptions[paymentIndex].enabled && this.paymentOptions[paymentIndex].value === PaymentMode.FAC){
               this.setPaymentType(PaymentMode.FAC,'init');
               this.selectedCardId = this.cards ? (this.cards.length > 0 ? this.cards[this.cards.length-1].card_id : "") : "";
               localStorage.setItem('cardId',this.selectedCardId);
             }
             else if (this.paymentOptions[paymentIndex].value === this.sessionService.get("appData").vendor_details.last_payment_method && this.paymentOptions[paymentIndex].enabled && this.paymentOptions[paymentIndex].value === PaymentMode.STRIPE){
               this.setPaymentType(PaymentMode.STRIPE,'init');
               this.selectedCardId = this.cards ? (this.cards.length > 0 ? this.cards[this.cards.length-1].card_id : "") : "";
               localStorage.setItem('cardId',this.selectedCardId);
             }
             else
               this.setPaymentType(this.paymentOptions[paymentIndex].value);
        }
        else{
          for (let opt = 0; opt < this.paymentOptions.length; opt++) {
            if (this.paymentOptions[opt].value != PaymentMode.CASH && this.paymentOptions[opt].enabled && this.paymentOptions[opt].value === 32){
              this.setPaymentType(PaymentMode.PAYFORT,'init');
              this.selectedCardId = this.cards ? (this.cards.length > 0 ? this.cards[this.cards.length-1].card_id : "") : "";
              localStorage.setItem('cardId',this.selectedCardId);
               break;
             }
             if (this.paymentOptions[opt].value != PaymentMode.CASH && this.paymentOptions[opt].enabled && this.paymentOptions[opt].value === PaymentMode.VISTA){
              this.setPaymentType(PaymentMode.VISTA,'init');
              this.selectedCardId = this.cards ? (this.cards.length > 0 ? this.cards[this.cards.length-1].card_id : "") : "";
              localStorage.setItem('cardId',this.selectedCardId);
               break;
            }
            if(this.paymentOptions[opt].value != PaymentMode.CASH && this.paymentOptions[opt].enabled && this.paymentOptions[opt].value === PaymentMode.AUTHORIZE_NET){
              this.setPaymentType(PaymentMode.AUTHORIZE_NET,'init');
              this.selectedCardId = this.cards ? (this.cards.length > 0 ? this.cards[this.cards.length-1].card_id : "") : "";
              localStorage.setItem('cardId',this.selectedCardId);
               break;
            }
            if(this.paymentOptions[opt].value != PaymentMode.CASH && this.paymentOptions[opt].enabled && this.paymentOptions[opt].value === PaymentMode.FAC){
              this.setPaymentType(PaymentMode.FAC,'init');
              this.selectedCardId = this.cards ? (this.cards.length > 0 ? this.cards[this.cards.length-1].card_id : "") : "";
              localStorage.setItem('cardId',this.selectedCardId);
               break;
            }
            if(this.paymentOptions[opt].value != PaymentMode.CASH && this.paymentOptions[opt].enabled && this.paymentOptions[opt].value === PaymentMode.STRIPE){
              this.setPaymentType(PaymentMode.STRIPE,'init');
              this.selectedCardId = this.cards ? (this.cards.length > 0 ? this.cards[this.cards.length-1].card_id : "") : "";
              localStorage.setItem('cardId',this.selectedCardId);
               break;
            }
            if (this.paymentOptions[opt].value === PaymentMode.CASH && this.paymentOptions[opt].enabled) {
              if(this.appConfig.payment_method_autoselect){
                this.setPaymentType(PaymentMode.CASH.toString());
              }
              break;
            }
          }
        }
     }
    } else {
      this.cards = [];
      let lastPaymentMethod = this.sessionService.get("appData").vendor_details.last_payment_method;
      lastPaymentMethod = lastPaymentMethod ? Number(lastPaymentMethod) : lastPaymentMethod;
      let paymentModeIndex = this.paymentOptions.findIndex((res) => {
        return res.value === lastPaymentMethod && res.enabled
      })
      if(paymentModeIndex > -1)
        this.setPaymentType(this.paymentOptions[paymentModeIndex].value,'init')

      else{
        let cashIndex = this.paymentOptions.findIndex((res) => {
          return res.value === PaymentMode.CASH && res.enabled
        })
         if (cashIndex > -1 && this.appConfig.payment_method_autoselect)
            this.setPaymentType(PaymentMode.CASH.toString());
         else{
            this.paymentMethod = this.paymentOptions[0] ? this.paymentOptions[0].value : '';
            if( this.paymentMethod && this.appConfig.payment_method_autoselect){
              this.setPaymentType(this.paymentMethod);
            }
          }
      }
      // for (let opt = 0; opt < this.paymentOptions.length; opt++) {
      //   if (
      //     this.paymentOptions[opt].value === PaymentMode.CASH &&
      //     this.paymentOptions[opt].enabled
      //   ) {
      //     if(this.appConfig.payment_method_autoselect){
      //       this.setPaymentType(PaymentMode.CASH.toString());
      //     }
      //     break;
      //   }
      // }
      // this.setPaymentType('8');
    }

    const appData = this.sessionService.get("appData");
    // appData['add_card_link'] = data.add_card_link;
    // this.sessionService.set('appData', appData);
  }

  removeCardApi(data) {
    this.loader.show();
    data.marketplace_reference_id = this.sessionService.getString(
      "marketplace_reference_id"
    );
    data.marketplace_user_id = this.sessionService.get(
      "appData"
    ).vendor_details.marketplace_user_id;
    data.vendor_id = this.sessionService.get(
      "appData"
    ).vendor_details.vendor_id;
    data.access_token = this.sessionService.get(
      "appData"
    ).vendor_details.app_access_token;

    this.paymentService.removeCard(data).subscribe(response => {
      if (response.status === 200) {
        this.loader.hide();
        this.getCards(data.payment_method);
      } else {
        this.popup.showPopup(MessageType.ERROR, 3000, response.message, false);
      }
    });
  }

  public transactionIdPaypal = '';
  public transactionIdTelr = '';
  async createTask(data) {
    this.paymentOptions.forEach((element) => {
      if (element.value == this.paymentType) {
        this.selectedPaymentMethod = element;
        this.post_payment_enable = this.selectedPaymentMethod.payment_process_type == 1 ? true : false;
        return;
      }
    })
    if (
      this.userPaymentData.TIP_ENABLE_DISABLE === 1 &&
      this.userPaymentData.MINIMUM_TIP !== 0
    ) {
      if (this.userPaymentData.MINIMUM_TIP > 0 && this.tipValue === undefined) {
        const msg = (this.languageStrings.min_tip_amt_should_be || 'Minimum Tip amount should be $10.')
        .replace(
          "10",
          this.userPaymentData.MINIMUM_TIP.toFixed(this.appConfig.decimal_display_precision_point || 2)
        );
        const msg_1 = msg.replace(
          "TIP_TIP",
          this.terminology.TIP
        );
        this.popup.showPopup(MessageType.SUCCESS, 3000, msg_1, false);

        let payArray = [PaymentMode.LIME_LIGHT,PaymentMode.TWO_CHECKOUT,PaymentMode.CHECKOUT_COM, PaymentMode.VIVA,PaymentMode.PAYHERE, PaymentMode.AZUL, PaymentMode.CREDIMAX,PaymentMode.HYPERPAY, PaymentMode.MY_FATOORAH, PaymentMode.THETELLER, PaymentMode.PAYNET, PaymentMode.CURLEC, PaymentMode.TAP, PaymentMode.WIPAY, PaymentMode.PAGAR, PaymentMode.WHOOSH, PaymentMode.PAYU, PaymentMode.PAY_MOB, PaymentMode.SSL_COMMERZ,PaymentMode.PAYNOW,PaymentMode.FAC_3D,PaymentMode.MTN, PaymentMode.WECHAT, PaymentMode.ONEPAY,PaymentMode.PAGOPLUX, PaymentMode.MYBILLPAYMENT, PaymentMode.VALITOR, PaymentMode.TRUEVO, PaymentMode.PAYZEN, PaymentMode.FIRSTDATA, PaymentMode.BANKOPEN, PaymentMode.SQUARE, PaymentMode.ETISALAT, PaymentMode.SUNCASH, PaymentMode.GOCARDLESS, PaymentMode.ATH, PaymentMode.IPAY88, PaymentMode.PROXYPAY, PaymentMode.CYBERSOURCE, PaymentMode.ALFALAH, PaymentMode.CULQI, PaymentMode.NMI, PaymentMode.FLUTTERWAVE, PaymentMode.MPESA, PaymentMode.ADYEN, PaymentMode.PAYMARK, PaymentMode.HYPUR, PaymentMode.PAYTMV3, PaymentMode.PIXELPAY, PaymentMode.DOKU, PaymentMode.PEACH, PaymentMode.PAGUELOFACIL, PaymentMode.NOQOODY, PaymentMode.GTBANK, PaymentMode.URWAY, PaymentMode.VUKA, PaymentMode.VPOS, PaymentMode.CXPAY, PaymentMode.PAYKU, PaymentMode.BAMBORA, PaymentMode.PAYWAYONE ,PaymentMode.PLACETOPAY];

        if (payArray.includes(this.paymentMethod) && this.sessionService.paymentWinRef) {
          this.sessionService.paymentWinRef.close();
        }

        return;
      }
    }

    if (this.orderType && this.orderType == 'subscription' && this.paymentType == PaymentMode.CASH) {
      this.createRecurrenceTask(data);
      return;
    }

    if (this.orderType && this.orderType == 'subscription' && this.paymentType == PaymentMode.PAY_LATER) {
      this.createRecurrenceTask(data);
      return;
    }

    if (this.orderType && this.orderType == 'subscription' && this.paymentType == PaymentMode.WALLET && (Number(this.walletDetails.wallet_balance) < Number(data.amount))) {
      this.walletAddMoneyPopup = true;
      return;
    }

    if (this.orderType && this.orderType == 'subscription' && this.paymentType == PaymentMode.WALLET) {
      this.createRecurrenceTask(data);
      return;
    }

    if (this.paymentType == 128 && !this.transactionIdPayfort && this.selectedPaymentMethod.payment_process_type === 0 && this.NET_PAYABLE_AMOUNT > 0 && !this.isSourceCustom) {
      let dataRazorpay = this.makeCreateTaskData(data);
      if (!dataRazorpay.is_custom_order) {
        await this.validateOrderDataBeforePayment(dataRazorpay);
      }
      this.getRazorpay(undefined, 0);
      return;
    } else if (this.paymentType == 128 && !this.transactionIdPayfort && this.selectedPaymentMethod.payment_process_type === 2 && this.NET_PAYABLE_AMOUNT > 0) {
      let dataRazorpay = this.makeCreateTaskData(data);
      if (!dataRazorpay.is_custom_order) {
        await this.validateOrderDataBeforePayment(dataRazorpay);
      }
      this.getRazorpay(undefined, 2, dataRazorpay);
      return;
    }

    if (this.paymentType == PaymentMode.PAYPAL && !this.transactionIdPaypal && !this.post_payment_enable && this.NET_PAYABLE_AMOUNT > 0 && !this.isSourceCustom) {
      let dataRazorpay = this.makeCreateTaskData(data);
      if (!dataRazorpay.is_custom_order) {
        await this.validateOrderDataBeforePayment(dataRazorpay);
      }
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.paypalModal = true;
      this.triggerPayment = {
        'job_id': undefined,
        'payment_for': PaymentFor.CREATE_TASK,
        'orderCreationPayload': this.orderCreationPayload,
        'isSourceCustom': this.isSourceCustom,
        'debtAmountCheck': this.debtAmountCheck,
        'customerPlanId': this.customerPlanId
      }
      return;
    }
// telr
    if (this.paymentType == PaymentMode.TELR && !this.transactionIdTelr && !this.post_payment_enable && this.NET_PAYABLE_AMOUNT > 0 && !this.isSourceCustom) {
      let dataRazorpay = this.makeCreateTaskData(data);
      if (!dataRazorpay.is_custom_order) {
        await this.validateOrderDataBeforePayment(dataRazorpay);
      }
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.telrModal = true;
      this.triggerPayment = {
        'job_id': undefined,
        'payment_for': PaymentFor.CREATE_TASK,
        'orderCreationPayload': this.orderCreationPayload,
        'isSourceCustom': this.isSourceCustom,
        'debtAmountCheck': this.debtAmountCheck,
        'customerPlanId': this.customerPlanId
      }
      return;
    }

    if (this.paymentType == PaymentMode.PAYSTACK && !this.transactionIdPaystack && !this.post_payment_enable && this.NET_PAYABLE_AMOUNT > 0 && !this.isSourceCustom) {
      let dataPaystack = this.makeCreateTaskData(data);
      if (!dataPaystack.is_custom_order) {
        await this.validateOrderDataBeforePayment(dataPaystack);
      }
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.paystackModal = true;
      this.triggerPayment = {
        'job_id': undefined,
        'payment_for': PaymentFor.CREATE_TASK,
        'orderCreationPayload': this.orderCreationPayload,
        'isSourceCustom': this.isSourceCustom,
        'debtAmountCheck': this.debtAmountCheck,
        'customerPlanId': this.customerPlanId
      }
      return;
    }
    if (this.paymentType == PaymentMode.MPAISA && !this.transactionIdMPaisa && !this.post_payment_enable && this.NET_PAYABLE_AMOUNT > 0 && !this.isSourceCustom) {
      let dataMPaisa = this.makeCreateTaskData(data);
      if (!dataMPaisa.is_custom_order) {
        await this.validateOrderDataBeforePayment(dataMPaisa);
      }
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.mpaisaModal = true;
      this.triggerPayment = {
        'job_id': undefined,
        'payment_for': PaymentFor.CREATE_TASK,
        'orderCreationPayload': this.orderCreationPayload,
        'isSourceCustom': this.isSourceCustom,
        'debtAmountCheck': this.debtAmountCheck,
        'customerPlanId': this.customerPlanId
      }
      return;
    }
    // if (this.paymentType == PaymentMode.PAYTM_LINK && !this.transactionIdMPaytm && !this.post_payment_enable && this.NET_PAYABLE_AMOUNT > 0 && !this.isSourceCustom) {
    //   let dataPaytm = this.makeCreateTaskData(data);
    //   if (!dataPaytm.is_custom_order) {
    //     await this.validateOrderDataBeforePayment(dataPaytm);
    //   }
    //   this.triggerPayment = {
    //     'job_id': undefined,
    //     payment_for:PaymentFor.CREATE_TASK
    //   }
    //   return;
    // }
    if (this.paymentType == PaymentMode.INNSTAPAY && !this.transactionIdInnstapay && !this.post_payment_enable && this.NET_PAYABLE_AMOUNT > 0 && !this.isSourceCustom) {
      let innstapayData = this.makeCreateTaskData(data);
      if (!innstapayData.is_custom_order) {
        await this.validateOrderDataBeforePayment(innstapayData);
      }
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.innstapayModal = true;
      this.triggerPayment = {
        'job_id': undefined,
        'payment_for': PaymentFor.CREATE_TASK,
        'orderCreationPayload': this.orderCreationPayload,
        'isSourceCustom': this.isSourceCustom,
        'debtAmountCheck': this.debtAmountCheck,
        'customerPlanId': this.customerPlanId
      }
      return;
    }
    if (this.paymentType == PaymentMode.VIVA && !this.transactionIdviva && !this.post_payment_enable && this.NET_PAYABLE_AMOUNT > 0 && !this.isSourceCustom) {
      let vivaData = this.makeCreateTaskData(data);
      if (!vivaData.is_custom_order) {
        await this.validateOrderDataBeforePayment(vivaData);
      }
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.vivaModal = true;
      this.triggerPayment = {
        'job_id': undefined,
        'payment_for': PaymentFor.CREATE_TASK
      }
      return;
    }


    if (this.paymentType == PaymentMode.PAYU && !this.transactionIdPayu && !this.post_payment_enable && this.NET_PAYABLE_AMOUNT > 0 && !this.isSourceCustom) {
      let dataPayu = this.makeCreateTaskData(data);
      this.loader.show();
      if (!dataPayu.is_custom_order) {
        await this.validateOrderDataBeforePayment(dataPayu);
      }
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.payuModal = true;
      this.triggerPayment = {
        'job_id': undefined,
        'payment_for': PaymentFor.CREATE_TASK,
        'orderCreationPayload': this.orderCreationPayload,
        'isSourceCustom': this.isSourceCustom,
        'debtAmountCheck': this.debtAmountCheck,
        'customerPlanId': this.customerPlanId
      }
      return;
    }

    if (this.paymentType == PaymentMode.PAY_MOB && !this.transactionIdPayMob && !this.post_payment_enable && this.NET_PAYABLE_AMOUNT > 0 && !this.isSourceCustom) {
      let dataPayu = this.makeCreateTaskData(data);
      this.loader.show();
      if (!dataPayu.is_custom_order) {
        await this.validateOrderDataBeforePayment(dataPayu);
      }
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.payMobModal = true;
      this.triggerPayment = {
        'job_id': undefined,
        'payment_for': PaymentFor.CREATE_TASK,
        'orderCreationPayload': this.orderCreationPayload,
        'isSourceCustom': this.isSourceCustom,
        'debtAmountCheck': this.debtAmountCheck,
        'customerPlanId': this.customerPlanId
      }
      return;
    }
    // if (this.paymentType == PaymentMode.WIRE_CARD && !this.transactionIdWirecard && !this.post_payment_enable && this.NET_PAYABLE_AMOUNT > 0 && !this.isSourceCustom) {
    //   let dataPayu = this.makeCreateTaskData(data);
    //   this.loader.show();
    //   if (!dataPayu.is_custom_order) {
    //     await this.validateOrderDataBeforePayment(dataPayu);
    //   }
    //   this.wirecardModal = true;
    //   this.triggerPayment = {
    //     'job_id': undefined,
    //     'payment_for': PaymentFor.CREATE_TASK
    //   }
    //   return;
    // }
    if (this.paymentType == PaymentMode.SSL_COMMERZ && !this.transactionIdSslCommerz && !this.post_payment_enable && this.NET_PAYABLE_AMOUNT > 0 && !this.isSourceCustom) {
      let dataPayu = this.makeCreateTaskData(data);
      this.loader.show();
      if (!dataPayu.is_custom_order) {
        await this.validateOrderDataBeforePayment(dataPayu);
      }
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.sslCommerzModal = true;
      this.triggerPayment = {
        'job_id': undefined,
        'payment_for': PaymentFor.CREATE_TASK
      }
      return;
    }
    if (this.paymentType == PaymentMode.FAC_3D && !this.transactionIdFAC3D && !this.post_payment_enable && this.NET_PAYABLE_AMOUNT > 0 && !this.isSourceCustom) {
      let dataFAC3D = this.makeCreateTaskData(data);
      this.loader.show();
      if (!dataFAC3D.is_custom_order) {
        await this.validateOrderDataBeforePayment(dataFAC3D);
      }
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.fac3dModal = true;
      this.triggerPayment = {
        'job_id': undefined,
        'payment_for': PaymentFor.CREATE_TASK
      }
      return;
    }
    if (this.paymentType == PaymentMode.CHECKOUT_COM && !this.transactionIdCheckoutCom && !this.post_payment_enable && this.NET_PAYABLE_AMOUNT > 0 && !this.isSourceCustom) {
      let dataCheckout = this.makeCreateTaskData(data);
      this.loader.show();
      if (!dataCheckout.is_custom_order) {
        await this.validateOrderDataBeforePayment(dataCheckout);
      }
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.checkoutComModal = true;
      this.triggerPayment = {
        'job_id': undefined,
        'payment_for': PaymentFor.CREATE_TASK
      }
      return;
    }
    if (this.paymentType == PaymentMode.PAYHERE && !this.transactionIdPayHere && !this.post_payment_enable && this.NET_PAYABLE_AMOUNT > 0 && !this.isSourceCustom) {
      let dataCheckout = this.makeCreateTaskData(data);
      this.loader.show();
      if (!dataCheckout.is_custom_order) {
        await this.validateOrderDataBeforePayment(dataCheckout);
      }
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.payHereModal = true;
      this.triggerPayment = {
        'job_id': undefined,
        'payment_for': PaymentFor.CREATE_TASK
      }
      return;
    }
    if (this.paymentType == PaymentMode.AZUL && !this.transactionIdAzul && !(this.selectedPaymentMethod.payment_process_type == 1) && this.NET_PAYABLE_AMOUNT > 0 && !this.isSourceCustom) {
      let dataPayu = this.makeCreateTaskData(data);
      this.loader.show();
      if (!dataPayu.is_custom_order) {
        await this.validateOrderDataBeforePayment(dataPayu);
      }
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.azulModal = true;
      this.triggerPayment = {
        'job_id': undefined,
        'payment_for': PaymentFor.CREATE_TASK
      }
      return;
    }
    if (this.paymentType == PaymentMode.HYPERPAY && !this.transactionIdHyperPay && !(this.selectedPaymentMethod.payment_process_type == 1) && this.NET_PAYABLE_AMOUNT > 0 && !this.isSourceCustom) {
      let dataCheckout = this.makeCreateTaskData(data);
      this.loader.show();
      if (!dataCheckout.is_custom_order) {
        await this.validateOrderDataBeforePayment(dataCheckout);
      }
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.hyperPayModal = true;
      this.triggerPayment = {
        'job_id': undefined,
        'payment_for': PaymentFor.CREATE_TASK
      }
      return;
    }
    if (this.paymentType == PaymentMode.CREDIMAX && !this.transactionIdCredimax && !(this.selectedPaymentMethod.payment_process_type == 1) && this.NET_PAYABLE_AMOUNT > 0 && !this.isSourceCustom) {
      let dataPayu = this.makeCreateTaskData(data);
      this.loader.show();
      if (!dataPayu.is_custom_order) {
        await this.validateOrderDataBeforePayment(dataPayu);
      }
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.credimaxModal = true;
      this.triggerPayment = {
        'job_id': undefined,
        'payment_for': PaymentFor.CREATE_TASK
      }
      return;
    }
    if (this.paymentType == PaymentMode.MY_FATOORAH && !this.transactionIdFatoorah && !(this.selectedPaymentMethod.payment_process_type == 1) && this.NET_PAYABLE_AMOUNT > 0 && !this.isSourceCustom) {
      let dataPayu = this.makeCreateTaskData(data);
      this.loader.show();
      if (!dataPayu.is_custom_order) {
        await this.validateOrderDataBeforePayment(dataPayu);
      }
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.fatoorahModal = true;
      this.triggerPayment = {
        'job_id': undefined,
        'payment_for': PaymentFor.CREATE_TASK
      }
      return;
    }
    if (this.paymentType == PaymentMode.PAYNET && !this.transactionIdPaynet && !(this.selectedPaymentMethod.payment_process_type == 1) && this.NET_PAYABLE_AMOUNT > 0 && !this.isSourceCustom) {
      let dataPayu = this.makeCreateTaskData(data);
      this.loader.show();
      if (!dataPayu.is_custom_order) {
        await this.validateOrderDataBeforePayment(dataPayu);
      }
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.paynetModal = true;
      this.triggerPayment = {
        'job_id': undefined,
        'payment_for': PaymentFor.CREATE_TASK
      }
      return;
    }
    if (this.paymentType == PaymentMode.TAP && !this.transactionIdTap && !(this.selectedPaymentMethod.payment_process_type == 1) && this.NET_PAYABLE_AMOUNT > 0 && !this.isSourceCustom) {
      let dataPayu = this.makeCreateTaskData(data);
      this.loader.show();
      if (!dataPayu.is_custom_order) {
        await this.validateOrderDataBeforePayment(dataPayu);
      }
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.tapModal = true;
      this.triggerPayment = {
        'job_id': undefined,
        'payment_for': PaymentFor.CREATE_TASK
      }
      return;
    }
    if (this.paymentType == PaymentMode.CURLEC && !this.transactionIdCurlec && !(this.selectedPaymentMethod.payment_process_type == 1) && this.NET_PAYABLE_AMOUNT > 0 && !this.isSourceCustom) {
      let dataPayu = this.makeCreateTaskData(data);
      this.loader.show();
      if (!dataPayu.is_custom_order) {
        await this.validateOrderDataBeforePayment(dataPayu);
      }
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.curlecModal = true;
      this.triggerPayment = {
        'job_id': undefined,
        'payment_for': PaymentFor.CREATE_TASK
      }
      return;
    }
    if (this.paymentType == PaymentMode.WIPAY && !this.transactionIdWipay && !(this.selectedPaymentMethod.payment_process_type == 1) && this.NET_PAYABLE_AMOUNT > 0 && !this.isSourceCustom) {
      let dataPayu = this.makeCreateTaskData(data);
      this.loader.show();
      if (!dataPayu.is_custom_order) {
        await this.validateOrderDataBeforePayment(dataPayu);
      }
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.wipayModal = true;
      this.triggerPayment = {
        'job_id': undefined,
        'payment_for': PaymentFor.CREATE_TASK
      }
      return;
    }
    if (this.paymentType == PaymentMode.PAGAR && !this.transactionIdPagar && !(this.selectedPaymentMethod.payment_process_type == 1) && this.NET_PAYABLE_AMOUNT > 0 && !this.isSourceCustom) {
      let dataPayu = this.makeCreateTaskData(data);
      this.loader.show();
      if (!dataPayu.is_custom_order) {
        await this.validateOrderDataBeforePayment(dataPayu);
      }
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.pagarModal = true;
      this.triggerPayment = {
        'job_id': undefined,
        'payment_for': PaymentFor.CREATE_TASK
      }
      return;
    }
    if (this.paymentType == PaymentMode.WECHAT && !this.transactionIdWechat && !(this.selectedPaymentMethod.payment_process_type == 1) && this.NET_PAYABLE_AMOUNT > 0 && !this.isSourceCustom) {
      let dataPayu = this.makeCreateTaskData(data);
      this.loader.show();
      if (!dataPayu.is_custom_order) {
        await this.validateOrderDataBeforePayment(dataPayu);
      }
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.wechatModal = true;
      this.triggerPayment = {
        'job_id': undefined,
        'payment_for': PaymentFor.CREATE_TASK
      }
      return;
    }
    if (this.paymentType == PaymentMode.MYBILLPAYMENT && !this.transactionIdMybillpayment && !(this.selectedPaymentMethod.payment_process_type == 1) && this.NET_PAYABLE_AMOUNT > 0 && !this.isSourceCustom) {
      let dataPayu = this.makeCreateTaskData(data);
      this.loader.show();
      if (!dataPayu.is_custom_order) {
        await this.validateOrderDataBeforePayment(dataPayu);
      }
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.mybillpaymentModal = true;
      this.triggerPayment = {
        'job_id': undefined,
        'payment_for': PaymentFor.CREATE_TASK
      }
      return;
    }
    if (this.paymentType == PaymentMode.VALITOR && !this.transactionIdValitor && !(this.selectedPaymentMethod.payment_process_type == 1) && this.NET_PAYABLE_AMOUNT > 0 && !this.isSourceCustom) {
      let dataPayu = this.makeCreateTaskData(data);
      this.loader.show();
      if (!dataPayu.is_custom_order) {
        await this.validateOrderDataBeforePayment(dataPayu);
      }
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.valitorModal = true;
      this.triggerPayment = {
        'job_id': undefined,
        'payment_for': PaymentFor.CREATE_TASK
      }
      return;
    }
    if (this.paymentType == PaymentMode.BANKOPEN && !this.transactionIdBankOpen && !(this.selectedPaymentMethod.payment_process_type == 1) && this.NET_PAYABLE_AMOUNT > 0 && !this.isSourceCustom) {
      let dataPayu = this.makeCreateTaskData(data);
      this.loader.show();
      if (!dataPayu.is_custom_order) {
        await this.validateOrderDataBeforePayment(dataPayu);
      }
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.bankOpenModal = true;
      this.triggerPayment = {
        'job_id': undefined,
        'payment_for': PaymentFor.CREATE_TASK
      }
      return;
    }
    if (this.paymentType == PaymentMode.TRUEVO && !this.transactionIdTruevo && !(this.selectedPaymentMethod.payment_process_type == 1) && this.NET_PAYABLE_AMOUNT > 0 && !this.isSourceCustom) {
      let dataPayu = this.makeCreateTaskData(data);
      this.loader.show();
      if (!dataPayu.is_custom_order) {
        await this.validateOrderDataBeforePayment(dataPayu);
      }
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.truevoModal = true;
      this.triggerPayment = {
        'job_id': undefined,
        'payment_for': PaymentFor.CREATE_TASK
      }
      return;
    }
    if (this.paymentType == PaymentMode.PAYZEN && !this.transactionIdPayzen && !(this.selectedPaymentMethod.payment_process_type == 1) && this.NET_PAYABLE_AMOUNT > 0 && !this.isSourceCustom) {
      let dataPayu = this.makeCreateTaskData(data);
      this.loader.show();
      if (!dataPayu.is_custom_order) {
        await this.validateOrderDataBeforePayment(dataPayu);
      }
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.payzenModal = true;
      this.triggerPayment = {
        'job_id': undefined,
        'payment_for': PaymentFor.CREATE_TASK
      }
      return;
    }
    if (this.paymentType == PaymentMode.FIRSTDATA && !this.transactionIdFirstdata && !(this.selectedPaymentMethod.payment_process_type == 1) && this.NET_PAYABLE_AMOUNT > 0 && !this.isSourceCustom) {
      let dataPayu = this.makeCreateTaskData(data);
      this.loader.show();
      if (!dataPayu.is_custom_order) {
        await this.validateOrderDataBeforePayment(dataPayu);
      }
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.firstdataModal = true;
      this.triggerPayment = {
        'job_id': undefined,
        'payment_for': PaymentFor.CREATE_TASK
      }
      return;
    }
    if (this.paymentType == PaymentMode.SQUARE && !this.transactionIdSquare && !(this.selectedPaymentMethod.payment_process_type == 1) && this.NET_PAYABLE_AMOUNT > 0 && !this.isSourceCustom) {
      let dataPayu = this.makeCreateTaskData(data);
      this.loader.show();
      if (!dataPayu.is_custom_order) {
        await this.validateOrderDataBeforePayment(dataPayu);
      }
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.squareModal = true;
      this.triggerPayment = {
        'job_id': undefined,
        'payment_for': PaymentFor.CREATE_TASK
      }
      return;
    }
    if (this.paymentType == PaymentMode.MTN && !this.transactionIdMtn && !(this.selectedPaymentMethod.payment_process_type == 1) && this.NET_PAYABLE_AMOUNT > 0 && !this.isSourceCustom) {
      let dataPayu = this.makeCreateTaskData(data);
      this.loader.show();
      if (!dataPayu.is_custom_order) {
        await this.validateOrderDataBeforePayment(dataPayu);
      }
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.mtnModal = true;
      this.triggerPayment = {
        'job_id': undefined,
        'payment_for': PaymentFor.CREATE_TASK
      }
      return;
    }
    if (this.paymentType == PaymentMode.ONEPAY && !this.transactionIdOnepay && !(this.selectedPaymentMethod.payment_process_type == 1) && this.NET_PAYABLE_AMOUNT > 0 && !this.isSourceCustom) {
      let dataPayu = this.makeCreateTaskData(data);
      this.loader.show();
      if (!dataPayu.is_custom_order) {
        await this.validateOrderDataBeforePayment(dataPayu);
      }
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.onepayModal = true;
      this.triggerPayment = {
        'job_id': undefined,
        'payment_for': PaymentFor.CREATE_TASK
      }
      return;
    }
    if (this.paymentType == PaymentMode.PAGOPLUX && !this.transactionIdPagoplux && !(this.selectedPaymentMethod.payment_process_type == 1) && this.NET_PAYABLE_AMOUNT > 0 && !this.isSourceCustom) {
      let dataPayu = this.makeCreateTaskData(data);
      this.loader.show();
      if (!dataPayu.is_custom_order) {
        await this.validateOrderDataBeforePayment(dataPayu);
      }
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.pagopluxModal = true;
      this.triggerPayment = {
        'job_id': undefined,
        'payment_for': PaymentFor.CREATE_TASK
      }
      return;
    }
    if (this.paymentType == PaymentMode.WHOOSH && !this.transactionIdWhoosh && !(this.selectedPaymentMethod.payment_process_type == 1) && this.NET_PAYABLE_AMOUNT > 0 && !this.isSourceCustom) {
      let dataPayu = this.makeCreateTaskData(data);
      this.loader.show();
      if (!dataPayu.is_custom_order) {
        await this.validateOrderDataBeforePayment(dataPayu);
      }
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.whooshModal = true;
      this.triggerPayment = {
        'job_id': undefined,
        'payment_for': PaymentFor.CREATE_TASK
      }
      return;
    }
    if (this.paymentType == PaymentMode.THETELLER && !this.transactionIdTheteller && !(this.selectedPaymentMethod.payment_process_type == 1) && this.NET_PAYABLE_AMOUNT > 0 && !this.isSourceCustom) {
      let dataPayu = this.makeCreateTaskData(data);
      this.loader.show();
      if (!dataPayu.is_custom_order) {
        await this.validateOrderDataBeforePayment(dataPayu);
      }
      this.thetellerModal = true;
      this.triggerPayment = {
        'job_id': undefined,
        'payment_for': PaymentFor.CREATE_TASK
      }
      return;
    }
    if (this.paymentType == PaymentMode.STRIPE_IDEAL && !this.transactionIdStripeIdeal && !this.post_payment_enable && this.NET_PAYABLE_AMOUNT > 0 && !this.isSourceCustom) {
      let stripeIdealData = this.makeCreateTaskData(data);
      if (!stripeIdealData.is_custom_order) {
        await this.validateOrderDataBeforePayment(stripeIdealData);
      }
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.stripeIdealModal = true;
      this.triggerPayment = {
        'job_id': undefined,
        payment_for: PaymentFor.CREATE_TASK,
        'orderCreationPayload': this.orderCreationPayload,
        'isSourceCustom': this.isSourceCustom,
        'debtAmountCheck': this.debtAmountCheck,
        'customerPlanId': this.customerPlanId
      }
      return;
    }

    if (this.paymentType == PaymentMode.PAYNOW && !this.transactionIdPaynow && !this.post_payment_enable && this.NET_PAYABLE_AMOUNT > 0 && !this.isSourceCustom) {
      let dataPayu = this.makeCreateTaskData(data);
      this.loader.show();
      if (!dataPayu.is_custom_order) {
        await this.validateOrderDataBeforePayment(dataPayu);
      }
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.paynowModal = true;
      this.triggerPayment = {
        'job_id': undefined,
        'payment_for': PaymentFor.CREATE_TASK,
        'orderCreationPayload': this.orderCreationPayload,
        'isSourceCustom': this.isSourceCustom,
        'debtAmountCheck': this.debtAmountCheck,
        'customerPlanId': this.customerPlanId
      }
      return;
    }

    if (this.paymentType == PaymentMode.LIME_LIGHT && !this.transactionIdLimeLight && !this.post_payment_enable && this.NET_PAYABLE_AMOUNT > 0 && !this.isSourceCustom) {
      let dataPayu = this.makeCreateTaskData(data);
      this.loader.show();
      if (!dataPayu.is_custom_order) {
        await this.validateOrderDataBeforePayment(dataPayu);
      }
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.showLimeLightPopup = true;
      this.triggerPayment = {
        'job_id': undefined,
        'payment_for': PaymentFor.CREATE_TASK
      }
      return;
    }

    if (this.paymentType == PaymentMode.TWO_CHECKOUT && !this.transactionIdTwoCheckout && !this.post_payment_enable && this.NET_PAYABLE_AMOUNT > 0 && !this.isSourceCustom) {
      let dataPayu = this.makeCreateTaskData(data);
      this.loader.show();
      if (!dataPayu.is_custom_order) {
        await this.validateOrderDataBeforePayment(dataPayu);
      }
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.triggerPayment = {
        'job_id': undefined,
        'payment_for': PaymentFor.CREATE_TASK
      }
      return;
    }

    if (this.paymentType == PaymentMode.PAYFAST && !this.transactionIdPayFast && !this.post_payment_enable && this.NET_PAYABLE_AMOUNT > 0 && !this.isSourceCustom) {
      let payFastData = this.makeCreateTaskData(data);
      if (!payFastData.is_custom_order) {
        await this.validateOrderDataBeforePayment(payFastData);
      }
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.payFastModal = true;
      this.triggerPayment = {
        'job_id': undefined,
        'payment_for': PaymentFor.CREATE_TASK,
        'orderCreationPayload': this.orderCreationPayload,
        'isSourceCustom': this.isSourceCustom,
        'debtAmountCheck': this.debtAmountCheck,
        'customerPlanId': this.customerPlanId
      }
      return;
    }
    if (this.paymentType == PaymentMode.ETISALAT && !this.transactionIdEtisalat && !(this.selectedPaymentMethod.payment_process_type == 1) && this.NET_PAYABLE_AMOUNT > 0 && !this.isSourceCustom) {
      let dataPayu = this.makeCreateTaskData(data);
      this.loader.show();
      if (!dataPayu.is_custom_order) {
        await this.validateOrderDataBeforePayment(dataPayu);
      }
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.etisalatModal = true;
      this.triggerPayment = {
        'job_id': undefined,
        'payment_for': PaymentFor.CREATE_TASK
      }
      return;
    }

    if (this.paymentType == PaymentMode.SUNCASH && !this.transactionIdSuncash && !(this.selectedPaymentMethod.payment_process_type == 1) && this.NET_PAYABLE_AMOUNT > 0 && !this.isSourceCustom) {
      let dataPayu = this.makeCreateTaskData(data);
      this.loader.show();
      if (!dataPayu.is_custom_order) {
        await this.validateOrderDataBeforePayment(dataPayu);
      }
      this.suncashModal = true;
      this.triggerPayment = {
        'job_id': undefined,
        'payment_for': PaymentFor.CREATE_TASK
      }
      return;
    }

    if (this.paymentType == PaymentMode.GOCARDLESS && !this.transactionIdGocardless && !(this.selectedPaymentMethod.payment_process_type == 1) && this.NET_PAYABLE_AMOUNT > 0 && !this.isSourceCustom) {
      let dataPayu = this.makeCreateTaskData(data);
      this.loader.show();
      if (!dataPayu.is_custom_order) {
        await this.validateOrderDataBeforePayment(dataPayu);
      }
      this.gocardlessModal = true;
      this.triggerPayment = {
        'job_id': undefined,
        'payment_for': PaymentFor.CREATE_TASK
      }
      return;
    }

    if (this.paymentType == PaymentMode.ATH && !this.transactionIdAth && !(this.selectedPaymentMethod.payment_process_type == 1) && this.NET_PAYABLE_AMOUNT > 0 && !this.isSourceCustom) {
      let dataPayu = this.makeCreateTaskData(data);
      this.loader.show();
      if (!dataPayu.is_custom_order) {
        await this.validateOrderDataBeforePayment(dataPayu);
      }
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.athModal = true;
      this.triggerPayment = {
        'job_id': undefined,
        'payment_for': PaymentFor.CREATE_TASK
      }
      return;
    }

    if (this.paymentType == PaymentMode.IPAY88 && !this.transactionIdIpay && !(this.selectedPaymentMethod.payment_process_type == 1) && this.NET_PAYABLE_AMOUNT > 0 && !this.isSourceCustom) {
      let dataPayu = this.makeCreateTaskData(data);
      this.loader.show();
      if (!dataPayu.is_custom_order) {
        await this.validateOrderDataBeforePayment(dataPayu);
      }
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.ipayModal = true;
      this.triggerPayment = {
        'job_id': undefined,
        'payment_for': PaymentFor.CREATE_TASK
      }
      return;
    }

    if (this.paymentType == PaymentMode.PROXYPAY && !this.transactionIdProxypay && !(this.selectedPaymentMethod.payment_process_type == 1) && this.NET_PAYABLE_AMOUNT > 0 && !this.isSourceCustom) {
      let dataPayu = this.makeCreateTaskData(data);
      this.loader.show();
      if (!dataPayu.is_custom_order) {
        await this.validateOrderDataBeforePayment(dataPayu);
      }
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.proxypayModal = true;
      this.triggerPayment = {
        'job_id': undefined,
        'payment_for': PaymentFor.CREATE_TASK
      }
      return;
    }

    if (this.paymentType == PaymentMode.CYBERSOURCE && !this.transactionIdCybersource && !(this.selectedPaymentMethod.payment_process_type == 1) && this.NET_PAYABLE_AMOUNT > 0 && !this.isSourceCustom) {
      let dataPayu = this.makeCreateTaskData(data);
      this.loader.show();
      if (!dataPayu.is_custom_order) {
        await this.validateOrderDataBeforePayment(dataPayu);
      }
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.cybersourceModal = true;
      this.triggerPayment = {
        'job_id': undefined,
        'payment_for': PaymentFor.CREATE_TASK
      }
      return;
    }

    if (this.paymentType == PaymentMode.ALFALAH && !this.transactionIdAlfalah && !(this.selectedPaymentMethod.payment_process_type == 1) && this.NET_PAYABLE_AMOUNT > 0 && !this.isSourceCustom) {
      let dataPayu = this.makeCreateTaskData(data);
      this.loader.show();
      if (!dataPayu.is_custom_order) {
        await this.validateOrderDataBeforePayment(dataPayu);
      }
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.alfalahModal = true;
      this.triggerPayment = {
        'job_id': undefined,
        'payment_for': PaymentFor.CREATE_TASK
      }
      return;
    }

    if (this.paymentType == PaymentMode.CULQI && !this.transactionIdCulqi && !(this.selectedPaymentMethod.payment_process_type == 1) && this.NET_PAYABLE_AMOUNT > 0 && !this.isSourceCustom) {
      let dataPayu = this.makeCreateTaskData(data);
      this.loader.show();
      if (!dataPayu.is_custom_order) {
        await this.validateOrderDataBeforePayment(dataPayu);
      }
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.culqiModal = true;
      this.triggerPayment = {
        'job_id': undefined,
        'payment_for': PaymentFor.CREATE_TASK
      }
      return;
    }

    if (this.paymentType == PaymentMode.NMI && !this.transactionIdNmi && !(this.selectedPaymentMethod.payment_process_type == 1) && this.NET_PAYABLE_AMOUNT > 0 && !this.isSourceCustom) {
      let dataPayu = this.makeCreateTaskData(data);
      this.loader.show();
      if (!dataPayu.is_custom_order) {
        await this.validateOrderDataBeforePayment(dataPayu);
      }
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.nmiModal = true;
      this.triggerPayment = {
        'job_id': undefined,
        'payment_for': PaymentFor.CREATE_TASK
      }
      return;
    }

    if (this.paymentType == PaymentMode.FLUTTERWAVE && !this.transactionIdFlutterwave && !(this.selectedPaymentMethod.payment_process_type == 1) && this.NET_PAYABLE_AMOUNT > 0 && !this.isSourceCustom) {
      let dataPayu = this.makeCreateTaskData(data);
      this.loader.show();
      if (!dataPayu.is_custom_order) {
        await this.validateOrderDataBeforePayment(dataPayu);
      }
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.flutterwaveModal = true;
      this.triggerPayment = {
        'job_id': undefined,
        'payment_for': PaymentFor.CREATE_TASK
      }
      return;
    }

    if (this.paymentType == PaymentMode.MPESA && !this.transactionIdMpesa && !(this.selectedPaymentMethod.payment_process_type == 1) && this.NET_PAYABLE_AMOUNT > 0 && !this.isSourceCustom) {
      let dataPayu = this.makeCreateTaskData(data);
      this.loader.show();
      if (!dataPayu.is_custom_order) {
        await this.validateOrderDataBeforePayment(dataPayu);
      }
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.mpesaModal = true;
      this.triggerPayment = {
        'job_id': undefined,
        'payment_for': PaymentFor.CREATE_TASK
      }
      return;
    }

    if (this.paymentType == PaymentMode.ADYEN && !this.transactionIdAdyen && !(this.selectedPaymentMethod.payment_process_type == 1) && this.NET_PAYABLE_AMOUNT > 0 && !this.isSourceCustom) {
      let dataPayu = this.makeCreateTaskData(data);
      this.loader.show();
      if (!dataPayu.is_custom_order) {
        await this.validateOrderDataBeforePayment(dataPayu);
      }
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.adyenModal = true;
      this.triggerPayment = {
        'job_id': undefined,
        'payment_for': PaymentFor.CREATE_TASK
      }
      return;
    }

    if (this.paymentType == PaymentMode.PAYMARK && !this.transactionIdPaymark && !(this.selectedPaymentMethod.payment_process_type == 1) && this.NET_PAYABLE_AMOUNT > 0 && !this.isSourceCustom) {
      let dataPayu = this.makeCreateTaskData(data);
      this.loader.show();
      if (!dataPayu.is_custom_order) {
        await this.validateOrderDataBeforePayment(dataPayu);
      }
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.paymarkModal = true;
      this.triggerPayment = {
        'job_id': undefined,
        'payment_for': PaymentFor.CREATE_TASK
      }
      return;
    }
    if (this.paymentType == PaymentMode.HYPUR && !this.transactionIdHypur && !(this.selectedPaymentMethod.payment_process_type == 1) && this.NET_PAYABLE_AMOUNT > 0 && !this.isSourceCustom) {
      let dataPayu = this.makeCreateTaskData(data);
      this.loader.show();
      if (!dataPayu.is_custom_order) {
        await this.validateOrderDataBeforePayment(dataPayu);
      }
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.hypurModal = true;
      this.triggerPayment = {
        'job_id': undefined,
        'payment_for': PaymentFor.CREATE_TASK
      }
      return;
    }

    if (this.paymentType == PaymentMode.PIXELPAY && !this.transactionIdPixelpay && !(this.selectedPaymentMethod.payment_process_type == 1) && this.NET_PAYABLE_AMOUNT > 0 && !this.isSourceCustom) {
      let dataPayu = this.makeCreateTaskData(data);
      this.loader.show();
      if (!dataPayu.is_custom_order) {
        await this.validateOrderDataBeforePayment(dataPayu);
      }
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.pixelpayModal = true;
      this.triggerPayment = {
        'job_id': undefined,
        'payment_for': PaymentFor.CREATE_TASK
      }
      return;
    }

    if (this.paymentType == PaymentMode.DOKU && !this.transactionIdDoku && !(this.selectedPaymentMethod.payment_process_type == 1) && this.NET_PAYABLE_AMOUNT > 0 && !this.isSourceCustom) {
      let dataPayu = this.makeCreateTaskData(data);
      this.loader.show();
      if (!dataPayu.is_custom_order) {
        await this.validateOrderDataBeforePayment(dataPayu);
      }
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.dokuModal = true;
      this.triggerPayment = {
        'job_id': undefined,
        'payment_for': PaymentFor.CREATE_TASK
      }
      return;
    }

    if (this.paymentType == PaymentMode.PEACH && !this.transactionIdPeach && !(this.selectedPaymentMethod.payment_process_type == 1) && this.NET_PAYABLE_AMOUNT > 0 && !this.isSourceCustom) {
      let dataPayu = this.makeCreateTaskData(data);
      this.loader.show();
      if (!dataPayu.is_custom_order) {
        await this.validateOrderDataBeforePayment(dataPayu);
      }
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.peachModal = true;
      this.triggerPayment = {
        'job_id': undefined,
        'payment_for': PaymentFor.CREATE_TASK
      }
      return;
    }

    if (this.paymentType == PaymentMode.PAGUELOFACIL && !this.transactionIdPaguelofacil && !(this.selectedPaymentMethod.payment_process_type == 1) && this.NET_PAYABLE_AMOUNT > 0 && !this.isSourceCustom) {
      let dataPayu = this.makeCreateTaskData(data);
      this.loader.show();
      if (!dataPayu.is_custom_order) {
        await this.validateOrderDataBeforePayment(dataPayu);
      }
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.paguelofacilModal = true;
      this.triggerPayment = {
        'job_id': undefined,
        'payment_for': PaymentFor.CREATE_TASK
      }
      return;
    }

    if (this.paymentType == PaymentMode.NOQOODY && !this.transactionIdNoqoody && !(this.selectedPaymentMethod.payment_process_type == 1) && this.NET_PAYABLE_AMOUNT > 0 && !this.isSourceCustom) {
      let dataPayu = this.makeCreateTaskData(data);
      this.loader.show();
      if (!dataPayu.is_custom_order) {
        await this.validateOrderDataBeforePayment(dataPayu);
      }
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.noqoodyModal = true;
      this.triggerPayment = {
        'job_id': undefined,
        'payment_for': PaymentFor.CREATE_TASK
      }
      return;
    }

    if (this.paymentType == PaymentMode.GTBANK && !this.transactionIdGtbank && !(this.selectedPaymentMethod.payment_process_type == 1) && this.NET_PAYABLE_AMOUNT > 0 && !this.isSourceCustom) {
      let dataPayu = this.makeCreateTaskData(data);
      this.loader.show();
      if (!dataPayu.is_custom_order) {
        await this.validateOrderDataBeforePayment(dataPayu);
      }
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.gtbankModal = true;
      this.triggerPayment = {
        'job_id': undefined,
        'payment_for': PaymentFor.CREATE_TASK
      }
      return;
    }
    if (this.paymentType == PaymentMode.URWAY && !this.transactionIdUrway && !(this.selectedPaymentMethod.payment_process_type == 1) && this.NET_PAYABLE_AMOUNT > 0 && !this.isSourceCustom) {
      let dataPayu = this.makeCreateTaskData(data);
      this.loader.show();
      if (!dataPayu.is_custom_order) {
        await this.validateOrderDataBeforePayment(dataPayu);
      }
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.urwayModal = true;
      this.triggerPayment = {
        'job_id': undefined,
        'payment_for': PaymentFor.CREATE_TASK
      }
      return;
    }
    if (this.paymentType == PaymentMode.CXPAY && !this.transactionIdCxpay && !(this.selectedPaymentMethod.payment_process_type == 1) && this.NET_PAYABLE_AMOUNT > 0 && !this.isSourceCustom) {
      let dataPayu = this.makeCreateTaskData(data);
      this.loader.show();
      if (!dataPayu.is_custom_order) {
        await this.validateOrderDataBeforePayment(dataPayu);
      }
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.cxpayModal = true;
      this.triggerPayment = {
        'job_id': undefined,
        'payment_for': PaymentFor.CREATE_TASK
      }
      return;
    }
    if (this.paymentType == PaymentMode.PAYKU && !this.transactionIdPayku && !(this.selectedPaymentMethod.payment_process_type == 1) && this.NET_PAYABLE_AMOUNT > 0 && !this.isSourceCustom) {
      let dataPayu = this.makeCreateTaskData(data);
      this.loader.show();
      if (!dataPayu.is_custom_order) {
        await this.validateOrderDataBeforePayment(dataPayu);
      }
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.paykuModal = true;
      this.triggerPayment = {
        'job_id': undefined,
        'payment_for': PaymentFor.CREATE_TASK
      }
      return;
    }

    if (this.paymentType == PaymentMode.BAMBORA && !this.transactionIdBambora && !(this.selectedPaymentMethod.payment_process_type == 1) && this.NET_PAYABLE_AMOUNT > 0 && !this.isSourceCustom) {
      let dataPayu = this.makeCreateTaskData(data);
      this.loader.show();
      if (!dataPayu.is_custom_order) {
        await this.validateOrderDataBeforePayment(dataPayu);
      }
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.bamboraModal = true;
      this.triggerPayment = {
        'job_id': undefined,
        'payment_for': PaymentFor.CREATE_TASK
      }
      return;
    }

    if (this.paymentType == PaymentMode.PAYWAYONE && !this.transactionIdPaywayone && !(this.selectedPaymentMethod.payment_process_type == 1) && this.NET_PAYABLE_AMOUNT > 0 && !this.isSourceCustom) {
      let dataPayu = this.makeCreateTaskData(data);
      this.loader.show();
      if (!dataPayu.is_custom_order) {
        await this.validateOrderDataBeforePayment(dataPayu);
      }
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.paywayoneModal = true;
      this.triggerPayment = {
        'job_id': undefined,
        'payment_for': PaymentFor.CREATE_TASK
      }
      return;
    }

    if (this.paymentType == PaymentMode.PLACETOPAY && !this.transactionIdPlacetopay && !(this.selectedPaymentMethod.payment_process_type == 1) && this.NET_PAYABLE_AMOUNT > 0 && !this.isSourceCustom) {
      let dataPayu = this.makeCreateTaskData(data);
      this.loader.show();
      if (!dataPayu.is_custom_order) {
        await this.validateOrderDataBeforePayment(dataPayu);
      }
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.placetopayModal = true;
      this.triggerPayment = {
        'job_id': undefined,
        'payment_for': PaymentFor.CREATE_TASK
      }
      return;
    }

    if (this.paymentType == PaymentMode.VUKA && !this.transactionIdVuka && !(this.selectedPaymentMethod.payment_process_type == 1) && this.NET_PAYABLE_AMOUNT > 0 && !this.isSourceCustom) {
      let dataPayu = this.makeCreateTaskData(data);
      this.loader.show();
      if (!dataPayu.is_custom_order) {
        await this.validateOrderDataBeforePayment(dataPayu);
      }
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.vukaModal = true;
      this.triggerPayment = {
        'job_id': undefined,
        'payment_for': PaymentFor.CREATE_TASK
      }
      return;
    }

    if (this.paymentType == PaymentMode.VPOS && !this.transactionIdVpos && !(this.selectedPaymentMethod.payment_process_type == 1) && this.NET_PAYABLE_AMOUNT > 0 && !this.isSourceCustom) {
      let dataPayu = this.makeCreateTaskData(data);
      this.loader.show();
      if (!dataPayu.is_custom_order) {
        await this.validateOrderDataBeforePayment(dataPayu);
      }
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.vposModal = true;
      this.triggerPayment = {
        'job_id': undefined,
        'payment_for': PaymentFor.CREATE_TASK
      }
      return;
    }

    if (this.paymentType == PaymentMode.PAYTMV3 && !this.transactionIdPaytm && !(this.selectedPaymentMethod.payment_process_type == 1) && this.NET_PAYABLE_AMOUNT > 0 && !this.isSourceCustom) {
      let dataPayu = this.makeCreateTaskData(data);
      this.loader.show();
      if (!dataPayu.is_custom_order) {
        await this.validateOrderDataBeforePayment(dataPayu);
      }
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.paytmModal = true;
      this.triggerPayment = {
        'job_id': undefined,
        'payment_for': PaymentFor.CREATE_TASK
      }
      return;
    }

    if ((this.paymentType === 64 || this.paymentType === '64') && this.paytmData && this.paytmData.paytm_verified === 0) {
      this.getPaytmOtp();
      return;
    } else if (
      (this.paymentType === 64 || this.paymentType === "64") &&
      this.paytmData.paytm_verified === 1 &&
      (this.paytmData.wallet_balance === 0 ||
        this.paytmData.wallet_balance < data.amount)
    ) {
      this.popup.showPopup(
        MessageType.ERROR,
        3000,
        this.languageStrings.pls_add_balance_in_paytm || "Please add balance in Paytm Wallet.",
        false
      );
      return;
    }

    if (this.paymentType == 16384 && (Number(this.walletDetails.wallet_balance) < Number(this.NET_PAYABLE_AMOUNT))) {
      this.popup.showPopup(
        MessageType.ERROR,
        3000,
        "Please add balance in Wallet.",
        false
      );
      let balance = Number(this.NET_PAYABLE_AMOUNT) - Number(this.walletDetails.wallet_balance);
      this.sessionService.set('walletAddMoney', { balance: balance, redirect: 'payment', custom: this.isSourceCustom, repayment: +this.repaymentTransaction, debt_payment: +this.debtAmountCheck, customerPlanData: +this.customerPlanId });
      this.router.navigate(['wallet']);
      return;

    }

    if (this.paymentType != 2 || this.paymentType != 32 || this.paymentType != 262144) {
      this.fbEventPaymentSelection(this.paymentType);
    }

    //this.googleAnalyticsEventsService.emitEvent(
    //  GoogleAnalyticsEvent.go_to_payment,
    //  "Go to payment", '', ''
    //);
    this.loader.show();
    data = this.makeCreateTaskData(data);


    let response: any;
    if ((!this.isSourceCustom || (this.sessionService.get("config").business_model_type === "FREELANCER" && !this.customerPlanId))) {
      response = await this.createTaskApiCall(data);
    }
    else {
      response = {
        data: {
          job_id: this.sessionService.getByKey('app', 'payment').order_id,
          post_payment: 1
        }
      };
    }
    if (this.paymentType == PaymentMode.CASH && (this.isSourceCustom || this.isEditedTask) && (this.sessionService.get("config").business_model_type !== "FREELANCER" || this.customerPlanId)) {
      this.payViaCash(response.data.job_id);
      return;
    }
    if (this.paymentType == PaymentMode.PAYTM_LINK && (this.isSourceCustom || this.isEditedTask) && (this.sessionService.get("config").business_model_type !== "FREELANCER" || this.customerPlanId)) {
      this.payViaPaytmLink(response.data.job_id);
      return;
    }
    if (this.paymentType == PaymentMode.PAYTM && (this.isSourceCustom || this.isEditedTask) && (this.sessionService.get("config").business_model_type !== "FREELANCER" || this.customerPlanId)) {
      this.payViaPaytm(response.data.job_id, PaymentMode.PAYTM);
      return;
    }
    if (this.paymentType == PaymentMode.PAY_LATER && (this.isSourceCustom || this.isEditedTask) && (this.sessionService.get("config").business_model_type !== "FREELANCER" || this.customerPlanId)) {
      this.payViaPayLater(response.data.job_id);
      return;
    }
    if (this.paymentType == PaymentMode.WALLET && this.isSourceCustom && (this.sessionService.get("config").business_model_type !== "FREELANCER" || this.customerPlanId)) {
      this.payViaWallet(response.data.job_id);
      return
    }
    if (this.paymentType == 2 && this.NET_PAYABLE_AMOUNT > 0 && (this.isSourceCustom || this.isEditedTask || this.customerPlanId)) {
      this.payViaCard(response.data.job_id, this.paymentType);
      return;
    }
    if (this.paymentType == 262144 && this.NET_PAYABLE_AMOUNT > 0 && (this.isSourceCustom || this.isEditedTask) && (this.sessionService.get("config").business_model_type !== "FREELANCER" || this.customerPlanId)) {
      this.payViaCard(response.data.job_id, this.paymentType);
      return;
    }
    if (this.paymentType == PaymentMode.AUTHORIZE_NET && this.NET_PAYABLE_AMOUNT > 0 && this.isSourceCustom && (this.sessionService.get("config").business_model_type !== "FREELANCER" || this.customerPlanId)) {
      this.payViaCard(response.data.job_id, this.paymentType);
      return;
    }
    if (this.paymentType == PaymentMode.FAC && this.NET_PAYABLE_AMOUNT > 0 && this.isSourceCustom && (this.sessionService.get("config").business_model_type !== "FREELANCER" || this.customerPlanId)) {

      this.payViaCard(response.data.job_id, this.paymentType);

      return;
    }
    if (this.paymentType == PaymentMode.MPAISA && this.NET_PAYABLE_AMOUNT > 0 && (this.isSourceCustom || this.post_payment_enable || this.isEditedTask) && !this.transactionIdMPaisa) {
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.mpaisaModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'isEditedTask': this.isEditedTask ? 1 : undefined,
        'payment_for': this.repaymentTransaction ? PaymentFor.REPAYMENT : PaymentFor.CREATE_TASK,
        'orderCreationPayload': this.orderCreationPayload,
        'isSourceCustom': this.isSourceCustom,
        'debtAmountCheck': this.debtAmountCheck,
        'customerPlanId': this.customerPlanId
      }
      return;
    }

    if (this.paymentType == PaymentMode.PAYPAL && this.NET_PAYABLE_AMOUNT > 0 && (this.isSourceCustom || this.isEditedTask) && !this.transactionIdPaypal) {
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.paypalModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'isEditedTask': this.isEditedTask ? 1 : undefined,
        'payment_for': this.repaymentTransaction ? PaymentFor.REPAYMENT : PaymentFor.CREATE_TASK,
        'orderCreationPayload': this.orderCreationPayload,
        'isSourceCustom': this.isSourceCustom,
        'debtAmountCheck': this.debtAmountCheck,
        'customerPlanId': this.customerPlanId
      }
      if (this.sessionService.getByKey('app', 'payment') && this.sessionService.getByKey('app', 'payment').is_custom_order == 1)
        this.triggerPayment['payment_for'] = 10;
      return;
    }

    if (this.paymentType == PaymentMode.TELR && this.NET_PAYABLE_AMOUNT > 0 && (this.isSourceCustom || this.isEditedTask) && !this.transactionIdTelr) {
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.telrModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'isEditedTask': this.isEditedTask ? 1 : undefined,
        'payment_for': this.repaymentTransaction ? PaymentFor.REPAYMENT : PaymentFor.CREATE_TASK,
        'orderCreationPayload': this.orderCreationPayload,
        'isSourceCustom': this.isSourceCustom,
        'debtAmountCheck': this.debtAmountCheck,
        'customerPlanId': this.customerPlanId
      }
      if (this.sessionService.getByKey('app', 'payment') && this.sessionService.getByKey('app', 'payment').is_custom_order == 1)
        this.triggerPayment['payment_for'] = 10;
      return;
    }

    if (this.paymentType == PaymentMode.STRIPE_IDEAL && this.NET_PAYABLE_AMOUNT > 0 && (this.isSourceCustom || this.isEditedTask) && !this.transactionIdStripeIdeal) {
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.stripeIdealModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'isEditedTask': this.isEditedTask ? 1 : undefined,
        'payment_for': this.repaymentTransaction ? PaymentFor.REPAYMENT : PaymentFor.CREATE_TASK,
        'orderCreationPayload': this.orderCreationPayload,
        'isSourceCustom': this.isSourceCustom,
        'debtAmountCheck': this.debtAmountCheck,
        'customerPlanId': this.customerPlanId
      }
      return;
    }
    if (this.paymentType == PaymentMode.PAYSTACK && this.NET_PAYABLE_AMOUNT > 0 && (this.isSourceCustom || this.isEditedTask) && !this.transactionIdPaystack) {
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.paystackModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'isEditedTask': this.isEditedTask ? 1 : undefined,
        'payment_for': this.repaymentTransaction ? PaymentFor.REPAYMENT : PaymentFor.CREATE_TASK,
        'orderCreationPayload': this.orderCreationPayload,
        'isSourceCustom': this.isSourceCustom,
        'debtAmountCheck': this.debtAmountCheck,
        'customerPlanId': this.customerPlanId
      }
      if (this.sessionService.getByKey('app', 'payment') && this.sessionService.getByKey('app', 'payment').is_custom_order == 1)
        this.triggerPayment['payment_for'] = 10;
      return;
    }
    if (this.paymentType == PaymentMode.INNSTAPAY && this.NET_PAYABLE_AMOUNT > 0 && (this.isSourceCustom || this.post_payment_enable || this.isEditedTask) && !this.transactionIdInnstapay) {
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.innstapayModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'payment_method': this.paymentType,
        'isEditedTask': this.isEditedTask ? 1 : undefined,
        'payment_for': this.repaymentTransaction ? PaymentFor.REPAYMENT : PaymentFor.CREATE_TASK,
        'orderCreationPayload': this.orderCreationPayload,
        'isSourceCustom': this.isSourceCustom,
        'debtAmountCheck': this.debtAmountCheck,
        'customerPlanId': this.customerPlanId
      }
      if (this.sessionService.getByKey('app', 'payment') && this.sessionService.getByKey('app', 'payment').is_custom_order == 1)
        this.triggerPayment['payment_for'] = 10;
      return;
    }
    if (this.paymentType == PaymentMode.VIVA && this.NET_PAYABLE_AMOUNT > 0 && (this.isSourceCustom || this.post_payment_enable || this.isEditedTask) && !this.transactionIdviva) {
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.vivaModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'payment_method': this.paymentType,
        'isEditedTask': this.isEditedTask ? 1 : undefined,
        'payment_for': this.repaymentTransaction ? PaymentFor.REPAYMENT : PaymentFor.CREATE_TASK
      }
      if (this.sessionService.getByKey('app', 'payment') && this.sessionService.getByKey('app', 'payment').is_custom_order == 1)
        this.triggerPayment['payment_for'] = 10;
      return;
    }
    if (this.paymentType == PaymentMode.PAYFAST && this.NET_PAYABLE_AMOUNT > 0 && (this.isSourceCustom || this.post_payment_enable || this.isEditedTask) && !this.transactionIdPayFast) {
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.payFastModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'payment_method': this.paymentType,
        'isEditedTask': this.isEditedTask ? 1 : undefined,
        'payment_for': this.repaymentTransaction ? PaymentFor.REPAYMENT : PaymentFor.CREATE_TASK,
        'orderCreationPayload': this.orderCreationPayload,
        'isSourceCustom': this.isSourceCustom,
        'debtAmountCheck': this.debtAmountCheck,
        'customerPlanId': this.customerPlanId
      }
      if (this.sessionService.getByKey('app', 'payment') && this.sessionService.getByKey('app', 'payment').is_custom_order == 1)
        this.triggerPayment['payment_for'] = 10;
      return;
    }

    if (this.paymentType == PaymentMode.PAYU && this.NET_PAYABLE_AMOUNT > 0 && (this.isSourceCustom || this.post_payment_enable || this.isEditedTask) && !this.transactionIdPayu) {
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.payuModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'isEditedTask': this.isEditedTask ? 1 : undefined,
        'payment_for': this.repaymentTransaction ? PaymentFor.REPAYMENT : PaymentFor.CREATE_TASK,
        'orderCreationPayload': this.orderCreationPayload,
        'isSourceCustom': this.isSourceCustom,
        'debtAmountCheck': this.debtAmountCheck,
        'customerPlanId': this.customerPlanId
      }
      if (this.sessionService.getByKey('app', 'payment') && this.sessionService.getByKey('app', 'payment').is_custom_order == 1)
        this.triggerPayment['payment_for'] = 10;
      return;
    }

    if (this.paymentType == PaymentMode.PAY_MOB && this.NET_PAYABLE_AMOUNT > 0 && (this.isSourceCustom || this.post_payment_enable || this.isEditedTask) && !this.transactionIdPayMob) {
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.payMobModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'isEditedTask': this.isEditedTask ? 1 : undefined,
        'payment_for': this.repaymentTransaction ? PaymentFor.REPAYMENT : PaymentFor.CREATE_TASK,
        'orderCreationPayload': this.orderCreationPayload,
        'isSourceCustom': this.isSourceCustom,
        'debtAmountCheck': this.debtAmountCheck,
        'customerPlanId': this.customerPlanId
      }
      return;
    }
    // if (this.paymentType == PaymentMode.WIRE_CARD && this.NET_PAYABLE_AMOUNT > 0 && (this.isSourceCustom || this.post_payment_enable || this.isEditedTask) && !this.transactionIdWirecard) {
    //   this.wirecardModal = true;
    //   this.triggerPayment = {
    //     'job_id': response.data.job_id,
    //     'isEditedTask': this.isEditedTask ? 1 : undefined,
    //     'payment_for': this.repaymentTransaction ? PaymentFor.REPAYMENT : PaymentFor.CREATE_TASK
    //   }
    //   return;
    // }
    if (this.paymentType == PaymentMode.SSL_COMMERZ && this.NET_PAYABLE_AMOUNT > 0 && (this.isSourceCustom || this.post_payment_enable || this.isEditedTask) && !this.transactionIdSslCommerz) {
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.sslCommerzModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'isEditedTask': this.isEditedTask ? 1 : undefined,
        'payment_for': this.repaymentTransaction ? PaymentFor.REPAYMENT : PaymentFor.CREATE_TASK
      }
      return;
    }
    if (this.paymentType == PaymentMode.FAC_3D && this.NET_PAYABLE_AMOUNT > 0 && (this.isSourceCustom || this.post_payment_enable || this.isEditedTask) && !this.transactionIdFAC3D) {
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.fac3dModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'isEditedTask': this.isEditedTask ? 1 : undefined,
        'payment_for': this.repaymentTransaction ? PaymentFor.REPAYMENT : PaymentFor.CREATE_TASK
      }
      return;
    }
    if (this.paymentType == PaymentMode.CHECKOUT_COM && this.NET_PAYABLE_AMOUNT > 0 && (this.isSourceCustom || this.post_payment_enable || this.isEditedTask) && !this.transactionIdCheckoutCom) {
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.checkoutComModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'isEditedTask': this.isEditedTask ? 1 : undefined,
        'payment_for': this.repaymentTransaction ? PaymentFor.REPAYMENT : PaymentFor.CREATE_TASK
      }
      return;
    }
    if (this.paymentType == PaymentMode.PAYHERE && this.NET_PAYABLE_AMOUNT > 0 && (this.isSourceCustom || this.post_payment_enable || this.isEditedTask) && !this.transactionIdPayHere) {
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.payHereModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'isEditedTask': this.isEditedTask ? 1 : undefined,
        'payment_for': this.repaymentTransaction ? PaymentFor.REPAYMENT : PaymentFor.CREATE_TASK
      }
      return;
    }
    if (this.paymentType == PaymentMode.HYPERPAY && this.NET_PAYABLE_AMOUNT > 0 && (this.isSourceCustom || (this.selectedPaymentMethod.payment_process_type == 1) || this.isEditedTask) && !this.transactionIdHyperPay) {
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.hyperPayModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'isEditedTask': this.isEditedTask ? 1 : undefined,
        'payment_for': this.repaymentTransaction ? PaymentFor.REPAYMENT : PaymentFor.CREATE_TASK
      }
      return;
    }
    if (this.paymentType == PaymentMode.VIVA && this.NET_PAYABLE_AMOUNT > 0 && (this.isSourceCustom || this.post_payment_enable || this.isEditedTask) && !this.transactionIdviva) {
      this.vivaModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'isEditedTask': this.isEditedTask ? 1 : undefined,
        'payment_for': this.repaymentTransaction ? PaymentFor.REPAYMENT : PaymentFor.CREATE_TASK
      }
      return;
    }
    if (this.paymentType == PaymentMode.AZUL && this.NET_PAYABLE_AMOUNT > 0 && (this.isSourceCustom || (this.selectedPaymentMethod.payment_process_type == 1) || this.isEditedTask) && !this.transactionIdAzul) {
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.azulModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'isEditedTask': this.isEditedTask ? 1 : undefined,
        'payment_for': this.repaymentTransaction ? PaymentFor.REPAYMENT : PaymentFor.CREATE_TASK
      }
      return;
    }
    if (this.paymentType == PaymentMode.CREDIMAX && this.NET_PAYABLE_AMOUNT > 0 && (this.isSourceCustom || (this.selectedPaymentMethod.payment_process_type == 1) || this.isEditedTask) && !this.transactionIdCredimax) {
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.credimaxModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'isEditedTask': this.isEditedTask ? 1 : undefined,
        'payment_for': this.repaymentTransaction ? PaymentFor.REPAYMENT : PaymentFor.CREATE_TASK
      }
      return;
    }
    if (this.paymentType == PaymentMode.MY_FATOORAH && this.NET_PAYABLE_AMOUNT > 0 && (this.isSourceCustom || (this.selectedPaymentMethod.payment_process_type == 1) || this.isEditedTask) && !this.transactionIdFatoorah) {
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.fatoorahModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'isEditedTask': this.isEditedTask ? 1 : undefined,
        'payment_for': this.repaymentTransaction ? PaymentFor.REPAYMENT : PaymentFor.CREATE_TASK
      }
      return;
    }
    if (this.paymentType == PaymentMode.PAYNET && this.NET_PAYABLE_AMOUNT > 0 && (this.isSourceCustom || (this.selectedPaymentMethod.payment_process_type == 1) || this.isEditedTask) && !this.transactionIdPaynet) {
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.paynetModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'isEditedTask': this.isEditedTask ? 1 : undefined,
        'payment_for': this.repaymentTransaction ? PaymentFor.REPAYMENT : PaymentFor.CREATE_TASK
      }
      return;
    }
    if (this.paymentType == PaymentMode.TAP && this.NET_PAYABLE_AMOUNT > 0 && (this.isSourceCustom || (this.selectedPaymentMethod.payment_process_type == 1) || this.isEditedTask) && !this.transactionIdTap) {
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.tapModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'isEditedTask': this.isEditedTask ? 1 : undefined,
        'payment_for': this.repaymentTransaction ? PaymentFor.REPAYMENT : PaymentFor.CREATE_TASK
      }
      return;
    }
    if (this.paymentType == PaymentMode.CURLEC && this.NET_PAYABLE_AMOUNT > 0 && (this.isSourceCustom || (this.selectedPaymentMethod.payment_process_type == 1) || this.isEditedTask) && !this.transactionIdCurlec) {
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.curlecModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'isEditedTask': this.isEditedTask ? 1 : undefined,
        'payment_for': this.repaymentTransaction ? PaymentFor.REPAYMENT : PaymentFor.CREATE_TASK
      }
      return;
    }
    if (this.paymentType == PaymentMode.WIPAY && this.NET_PAYABLE_AMOUNT > 0 && (this.isSourceCustom || (this.selectedPaymentMethod.payment_process_type == 1) || this.isEditedTask) && !this.transactionIdWipay) {
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.wipayModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'isEditedTask': this.isEditedTask ? 1 : undefined,
        'payment_for': this.repaymentTransaction ? PaymentFor.REPAYMENT : PaymentFor.CREATE_TASK
      }
      return;
    }
    if (this.paymentType == PaymentMode.PAGAR && this.NET_PAYABLE_AMOUNT > 0 && (this.isSourceCustom || (this.selectedPaymentMethod.payment_process_type == 1) || this.isEditedTask) && !this.transactionIdPagar) {
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.pagarModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'isEditedTask': this.isEditedTask ? 1 : undefined,
        'payment_for': this.repaymentTransaction ? PaymentFor.REPAYMENT : PaymentFor.CREATE_TASK
      }
      return;
    }
    if (this.paymentType == PaymentMode.WECHAT && this.NET_PAYABLE_AMOUNT > 0 && (this.isSourceCustom || (this.selectedPaymentMethod.payment_process_type == 1) || this.isEditedTask) && !this.transactionIdWechat) {
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.wechatModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'isEditedTask': this.isEditedTask ? 1 : undefined,
        'payment_for': this.repaymentTransaction ? PaymentFor.REPAYMENT : PaymentFor.CREATE_TASK
      }
      return;
    }
    if (this.paymentType == PaymentMode.MYBILLPAYMENT && this.NET_PAYABLE_AMOUNT > 0 && (this.isSourceCustom || (this.selectedPaymentMethod.payment_process_type == 1) || this.isEditedTask) && !this.transactionIdMybillpayment) {
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.mybillpaymentModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'isEditedTask': this.isEditedTask ? 1 : undefined,
        'payment_for': this.repaymentTransaction ? PaymentFor.REPAYMENT : PaymentFor.CREATE_TASK
      }
      return;
    }
    if (this.paymentType == PaymentMode.VALITOR && this.NET_PAYABLE_AMOUNT > 0 && (this.isSourceCustom || (this.selectedPaymentMethod.payment_process_type == 1) || this.isEditedTask) && !this.transactionIdValitor) {
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.valitorModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'isEditedTask': this.isEditedTask ? 1 : undefined,
        'payment_for': this.repaymentTransaction ? PaymentFor.REPAYMENT : PaymentFor.CREATE_TASK
      }
      return;
    }
    if (this.paymentType == PaymentMode.BANKOPEN && this.NET_PAYABLE_AMOUNT > 0 && (this.isSourceCustom || (this.selectedPaymentMethod.payment_process_type == 1) || this.isEditedTask) && !this.transactionIdBankOpen) {
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.bankOpenModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'isEditedTask': this.isEditedTask ? 1 : undefined,
        'payment_for': this.repaymentTransaction ? PaymentFor.REPAYMENT : PaymentFor.CREATE_TASK
      }
      return;
    }
    if (this.paymentType == PaymentMode.TRUEVO && this.NET_PAYABLE_AMOUNT > 0 && (this.isSourceCustom || (this.selectedPaymentMethod.payment_process_type == 1) || this.isEditedTask) && !this.transactionIdTruevo) {
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.truevoModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'isEditedTask': this.isEditedTask ? 1 : undefined,
        'payment_for': this.repaymentTransaction ? PaymentFor.REPAYMENT : PaymentFor.CREATE_TASK
      }
      return;
    }
    if (this.paymentType == PaymentMode.PAYZEN && this.NET_PAYABLE_AMOUNT > 0 && (this.isSourceCustom || (this.selectedPaymentMethod.payment_process_type == 1) || this.isEditedTask) && !this.transactionIdPayzen) {
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.payzenModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'isEditedTask': this.isEditedTask ? 1 : undefined,
        'payment_for': this.repaymentTransaction ? PaymentFor.REPAYMENT : PaymentFor.CREATE_TASK
      }
      return;
    }
    if (this.paymentType == PaymentMode.FIRSTDATA && this.NET_PAYABLE_AMOUNT > 0 && (this.isSourceCustom || (this.selectedPaymentMethod.payment_process_type == 1) || this.isEditedTask) && !this.transactionIdFirstdata) {
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.firstdataModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'isEditedTask': this.isEditedTask ? 1 : undefined,
        'payment_for': this.repaymentTransaction ? PaymentFor.REPAYMENT : PaymentFor.CREATE_TASK
      }
      return;
    }
    if (this.paymentType == PaymentMode.SQUARE && this.NET_PAYABLE_AMOUNT > 0 && (this.isSourceCustom || (this.selectedPaymentMethod.payment_process_type == 1) || this.isEditedTask) && !this.transactionIdSquare) {
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.squareModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'isEditedTask': this.isEditedTask ? 1 : undefined,
        'payment_for': this.repaymentTransaction ? PaymentFor.REPAYMENT : PaymentFor.CREATE_TASK
      }
      return;
    }
    if (this.paymentType == PaymentMode.WHOOSH && this.NET_PAYABLE_AMOUNT > 0 && (this.isSourceCustom || (this.selectedPaymentMethod.payment_process_type == 1) || this.isEditedTask) && !this.transactionIdWhoosh) {
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.whooshModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'isEditedTask': this.isEditedTask ? 1 : undefined,
        'payment_for': this.repaymentTransaction ? PaymentFor.REPAYMENT : PaymentFor.CREATE_TASK
      }
      return;
    }
    if (this.paymentType == PaymentMode.MTN && this.NET_PAYABLE_AMOUNT > 0 && (this.isSourceCustom || (this.selectedPaymentMethod.payment_process_type == 1) || this.isEditedTask) && !this.transactionIdMtn) {
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.mtnModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'isEditedTask': this.isEditedTask ? 1 : undefined,
        'payment_for': this.repaymentTransaction ? PaymentFor.REPAYMENT : PaymentFor.CREATE_TASK
      }
      return;
    }
    if (this.paymentType == PaymentMode.ONEPAY && this.NET_PAYABLE_AMOUNT > 0 && (this.isSourceCustom || (this.selectedPaymentMethod.payment_process_type == 1) || this.isEditedTask) && !this.transactionIdOnepay) {
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.onepayModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'isEditedTask': this.isEditedTask ? 1 : undefined,
        'payment_for': this.repaymentTransaction ? PaymentFor.REPAYMENT : PaymentFor.CREATE_TASK
      }
      return;
    }
    if (this.paymentType == PaymentMode.PAGOPLUX && this.NET_PAYABLE_AMOUNT > 0 && (this.isSourceCustom || (this.selectedPaymentMethod.payment_process_type == 1) || this.isEditedTask) && !this.transactionIdPagoplux) {
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.pagopluxModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'isEditedTask': this.isEditedTask ? 1 : undefined,
        'payment_for': this.repaymentTransaction ? PaymentFor.REPAYMENT : PaymentFor.CREATE_TASK
      }
      return;
    }
    if (this.paymentType == PaymentMode.THETELLER && this.NET_PAYABLE_AMOUNT > 0 && (this.isSourceCustom || (this.selectedPaymentMethod.payment_process_type == 1) || this.isEditedTask) && !this.transactionIdTheteller) {
      this.thetellerModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'isEditedTask': this.isEditedTask ? 1 : undefined,
        'payment_for': this.repaymentTransaction ? PaymentFor.REPAYMENT : PaymentFor.CREATE_TASK
      }
      return;
    }
    if (this.paymentType == PaymentMode.PAYNOW && this.NET_PAYABLE_AMOUNT > 0 && (this.isSourceCustom || this.post_payment_enable || this.isEditedTask) && !this.transactionIdPaynow) {
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.paynowModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'isEditedTask': this.isEditedTask ? 1 : undefined,
        'payment_for': this.repaymentTransaction ? PaymentFor.REPAYMENT : PaymentFor.CREATE_TASK,
        'orderCreationPayload': this.orderCreationPayload,
        'isSourceCustom': this.isSourceCustom,
        'debtAmountCheck': this.debtAmountCheck,
        'customerPlanId': this.customerPlanId
      }
      return;
    }
    if (this.paymentType == PaymentMode.LIME_LIGHT && this.NET_PAYABLE_AMOUNT > 0 && (this.isSourceCustom || this.post_payment_enable || this.isEditedTask) && !this.transactionIdLimeLight) {
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.showLimeLightPopup = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'isEditedTask': this.isEditedTask ? 1 : undefined,
        'payment_for': this.repaymentTransaction ? PaymentFor.REPAYMENT : PaymentFor.CREATE_TASK
      }
      return;
    }
    if (this.paymentType == PaymentMode.TWO_CHECKOUT && this.NET_PAYABLE_AMOUNT > 0 && (this.isSourceCustom || this.post_payment_enable || this.isEditedTask) && !this.transactionIdTwoCheckout) {
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.showTwoCheckoutPopup = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'isEditedTask': this.isEditedTask ? 1 : undefined,
        'payment_for': this.repaymentTransaction ? PaymentFor.REPAYMENT : PaymentFor.CREATE_TASK
      }
      return;
    }
    if (this.paymentType == PaymentMode.ETISALAT && this.NET_PAYABLE_AMOUNT > 0 && (this.isSourceCustom || (this.selectedPaymentMethod.payment_process_type == 1) || this.isEditedTask) && !this.transactionIdEtisalat) {
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.etisalatModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'isEditedTask': this.isEditedTask ? 1 : undefined,
        'payment_for': this.repaymentTransaction ? PaymentFor.REPAYMENT : PaymentFor.CREATE_TASK
      }
      return;
    }
    if (this.paymentType == PaymentMode.SUNCASH && this.NET_PAYABLE_AMOUNT > 0 && (this.isSourceCustom || (this.selectedPaymentMethod.payment_process_type == 1) || this.isEditedTask) && !this.transactionIdSuncash) {
      this.suncashModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'isEditedTask': this.isEditedTask ? 1 : undefined,
        'payment_for': this.repaymentTransaction ? PaymentFor.REPAYMENT : PaymentFor.CREATE_TASK
      }
      return;
    }
    if (this.paymentType == PaymentMode.GOCARDLESS && this.NET_PAYABLE_AMOUNT > 0 && (this.isSourceCustom || (this.selectedPaymentMethod.payment_process_type == 1) || this.isEditedTask) && !this.transactionIdGocardless) {
      this.gocardlessModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'isEditedTask': this.isEditedTask ? 1 : undefined,
        'payment_for': this.repaymentTransaction ? PaymentFor.REPAYMENT : PaymentFor.CREATE_TASK
      }
      return;
    }
    if (this.paymentType == PaymentMode.ATH && this.NET_PAYABLE_AMOUNT > 0 && (this.isSourceCustom || (this.selectedPaymentMethod.payment_process_type == 1) || this.isEditedTask) && !this.transactionIdAth) {
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.athModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'isEditedTask': this.isEditedTask ? 1 : undefined,
        'payment_for': this.repaymentTransaction ? PaymentFor.REPAYMENT : PaymentFor.CREATE_TASK
      }
      return;
    }
    if (this.paymentType == PaymentMode.IPAY88 && this.NET_PAYABLE_AMOUNT > 0 && (this.isSourceCustom || (this.selectedPaymentMethod.payment_process_type == 1) || this.isEditedTask) && !this.transactionIdIpay) {
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.ipayModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'isEditedTask': this.isEditedTask ? 1 : undefined,
        'payment_for': this.repaymentTransaction ? PaymentFor.REPAYMENT : PaymentFor.CREATE_TASK
      }
      return;
    }

    if (this.paymentType == PaymentMode.PROXYPAY && this.NET_PAYABLE_AMOUNT > 0 && (this.isSourceCustom || (this.selectedPaymentMethod.payment_process_type == 1) || this.isEditedTask) && !this.transactionIdProxypay) {
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.proxypayModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'isEditedTask': this.isEditedTask ? 1 : undefined,
        'payment_for': this.repaymentTransaction ? PaymentFor.REPAYMENT : PaymentFor.CREATE_TASK
      }
      return;
    }

    if (this.paymentType == PaymentMode.CYBERSOURCE && this.NET_PAYABLE_AMOUNT > 0 && (this.isSourceCustom || (this.selectedPaymentMethod.payment_process_type == 1) || this.isEditedTask) && !this.transactionIdCybersource) {
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.cybersourceModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'isEditedTask': this.isEditedTask ? 1 : undefined,
        'payment_for': this.repaymentTransaction ? PaymentFor.REPAYMENT : PaymentFor.CREATE_TASK
      }
      return;
    }

    if (this.paymentType == PaymentMode.ALFALAH && this.NET_PAYABLE_AMOUNT > 0 && (this.isSourceCustom || (this.selectedPaymentMethod.payment_process_type == 1) || this.isEditedTask) && !this.transactionIdAlfalah) {
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.alfalahModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'isEditedTask': this.isEditedTask ? 1 : undefined,
        'payment_for': this.repaymentTransaction ? PaymentFor.REPAYMENT : PaymentFor.CREATE_TASK
      }
      return;
    }

    if (this.paymentType == PaymentMode.CULQI && this.NET_PAYABLE_AMOUNT > 0 && (this.isSourceCustom || (this.selectedPaymentMethod.payment_process_type == 1) || this.isEditedTask) && !this.transactionIdCulqi) {
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.culqiModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'isEditedTask': this.isEditedTask ? 1 : undefined,
        'payment_for': this.repaymentTransaction ? PaymentFor.REPAYMENT : PaymentFor.CREATE_TASK
      }
      return;
    }

    if (this.paymentType == PaymentMode.NMI && this.NET_PAYABLE_AMOUNT > 0 && (this.isSourceCustom || (this.selectedPaymentMethod.payment_process_type == 1) || this.isEditedTask) && !this.transactionIdNmi) {
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.nmiModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'isEditedTask': this.isEditedTask ? 1 : undefined,
        'payment_for': this.repaymentTransaction ? PaymentFor.REPAYMENT : PaymentFor.CREATE_TASK
      }
      return;
    }

    if (this.paymentType == PaymentMode.FLUTTERWAVE && this.NET_PAYABLE_AMOUNT > 0 && (this.isSourceCustom || (this.selectedPaymentMethod.payment_process_type == 1) || this.isEditedTask) && !this.transactionIdFlutterwave) {
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.flutterwaveModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'isEditedTask': this.isEditedTask ? 1 : undefined,
        'payment_for': this.repaymentTransaction ? PaymentFor.REPAYMENT : PaymentFor.CREATE_TASK
      }
      return;
    }

    if (this.paymentType == PaymentMode.MPESA && this.NET_PAYABLE_AMOUNT > 0 && (this.isSourceCustom || (this.selectedPaymentMethod.payment_process_type == 1) || this.isEditedTask) && !this.transactionIdMpesa) {
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.mpesaModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'isEditedTask': this.isEditedTask ? 1 : undefined,
        'payment_for': this.repaymentTransaction ? PaymentFor.REPAYMENT : PaymentFor.CREATE_TASK
      }
      return;
    }

    if (this.paymentType == PaymentMode.ADYEN && this.NET_PAYABLE_AMOUNT > 0 && (this.isSourceCustom || (this.selectedPaymentMethod.payment_process_type == 1) || this.isEditedTask) && !this.transactionIdAdyen) {
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.adyenModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'isEditedTask': this.isEditedTask ? 1 : undefined,
        'payment_for': this.repaymentTransaction ? PaymentFor.REPAYMENT : PaymentFor.CREATE_TASK
      }
      return;
    }

    if (this.paymentType == PaymentMode.PAYTMV3 && this.NET_PAYABLE_AMOUNT > 0 && (this.isSourceCustom || (this.selectedPaymentMethod.payment_process_type == 1) || this.isEditedTask) && !this.transactionIdPaytm) {
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.paytmModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'isEditedTask': this.isEditedTask ? 1 : undefined,
        'payment_for': this.repaymentTransaction ? PaymentFor.REPAYMENT : PaymentFor.CREATE_TASK
      }
      return;
    }

    if (this.paymentType == PaymentMode.PAYMARK && this.NET_PAYABLE_AMOUNT > 0 && (this.isSourceCustom || (this.selectedPaymentMethod.payment_process_type == 1) || this.isEditedTask) && !this.transactionIdPaymark) {
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.paymarkModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'isEditedTask': this.isEditedTask ? 1 : undefined,
        'payment_for': this.repaymentTransaction ? PaymentFor.REPAYMENT : PaymentFor.CREATE_TASK
      }
      return;
    }
    if (this.paymentType == PaymentMode.HYPUR && this.NET_PAYABLE_AMOUNT > 0 && (this.isSourceCustom || (this.selectedPaymentMethod.payment_process_type == 1) || this.isEditedTask) && !this.transactionIdHypur) {
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.hypurModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'isEditedTask': this.isEditedTask ? 1 : undefined,
        'payment_for': this.repaymentTransaction ? PaymentFor.REPAYMENT : PaymentFor.CREATE_TASK
      }
      return;
    }

    if (this.paymentType == PaymentMode.PIXELPAY && this.NET_PAYABLE_AMOUNT > 0 && (this.isSourceCustom || (this.selectedPaymentMethod.payment_process_type == 1) || this.isEditedTask) && !this.transactionIdPixelpay) {
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.pixelpayModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'isEditedTask': this.isEditedTask ? 1 : undefined,
        'payment_for': this.repaymentTransaction ? PaymentFor.REPAYMENT : PaymentFor.CREATE_TASK
      }
      return;
    }

    if (this.paymentType == PaymentMode.DOKU && this.NET_PAYABLE_AMOUNT > 0 && (this.isSourceCustom || (this.selectedPaymentMethod.payment_process_type == 1) || this.isEditedTask) && !this.transactionIdDoku) {
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.dokuModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'isEditedTask': this.isEditedTask ? 1 : undefined,
        'payment_for': this.repaymentTransaction ? PaymentFor.REPAYMENT : PaymentFor.CREATE_TASK
      }
      return;
    }

    if (this.paymentType == PaymentMode.PEACH && this.NET_PAYABLE_AMOUNT > 0 && (this.isSourceCustom || (this.selectedPaymentMethod.payment_process_type == 1) || this.isEditedTask) && !this.transactionIdPeach) {
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.peachModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'isEditedTask': this.isEditedTask ? 1 : undefined,
        'payment_for': this.repaymentTransaction ? PaymentFor.REPAYMENT : PaymentFor.CREATE_TASK
      }
      return;
    }

    if (this.paymentType == PaymentMode.PAGUELOFACIL && this.NET_PAYABLE_AMOUNT > 0 && (this.isSourceCustom || (this.selectedPaymentMethod.payment_process_type == 1) || this.isEditedTask) && !this.transactionIdPaguelofacil) {
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.paguelofacilModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'isEditedTask': this.isEditedTask ? 1 : undefined,
        'payment_for': this.repaymentTransaction ? PaymentFor.REPAYMENT : PaymentFor.CREATE_TASK
      }
      return;
    }

    if (this.paymentType == PaymentMode.NOQOODY && this.NET_PAYABLE_AMOUNT > 0 && (this.isSourceCustom || (this.selectedPaymentMethod.payment_process_type == 1) || this.isEditedTask) && !this.transactionIdNoqoody) {
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.noqoodyModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'isEditedTask': this.isEditedTask ? 1 : undefined,
        'payment_for': this.repaymentTransaction ? PaymentFor.REPAYMENT : PaymentFor.CREATE_TASK
      }
      return;
    }

    if (this.paymentType == PaymentMode.GTBANK && this.NET_PAYABLE_AMOUNT > 0 && (this.isSourceCustom || (this.selectedPaymentMethod.payment_process_type == 1) || this.isEditedTask) && !this.transactionIdGtbank) {
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.gtbankModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'isEditedTask': this.isEditedTask ? 1 : undefined,
        'payment_for': this.repaymentTransaction ? PaymentFor.REPAYMENT : PaymentFor.CREATE_TASK
      }
      return;
    }
    if (this.paymentType == PaymentMode.URWAY && this.NET_PAYABLE_AMOUNT > 0 && (this.isSourceCustom || (this.selectedPaymentMethod.payment_process_type == 1) || this.isEditedTask) && !this.transactionIdUrway) {
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.urwayModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'isEditedTask': this.isEditedTask ? 1 : undefined,
        'payment_for': this.repaymentTransaction ? PaymentFor.REPAYMENT : PaymentFor.CREATE_TASK
      }
      return;
    }
    if (this.paymentType == PaymentMode.CXPAY && this.NET_PAYABLE_AMOUNT > 0 && (this.isSourceCustom || (this.selectedPaymentMethod.payment_process_type == 1) || this.isEditedTask) && !this.transactionIdCxpay) {
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.cxpayModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'isEditedTask': this.isEditedTask ? 1 : undefined,
        'payment_for': this.repaymentTransaction ? PaymentFor.REPAYMENT : PaymentFor.CREATE_TASK
      }
      return;
    }

    if (this.paymentType == PaymentMode.PAYKU && this.NET_PAYABLE_AMOUNT > 0 && (this.isSourceCustom || (this.selectedPaymentMethod.payment_process_type == 1) || this.isEditedTask) && !this.transactionIdPayku) {
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.paykuModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'isEditedTask': this.isEditedTask ? 1 : undefined,
        'payment_for': this.repaymentTransaction ? PaymentFor.REPAYMENT : PaymentFor.CREATE_TASK
      }
      return;
    }

    if (this.paymentType == PaymentMode.BAMBORA && this.NET_PAYABLE_AMOUNT > 0 && (this.isSourceCustom || (this.selectedPaymentMethod.payment_process_type == 1) || this.isEditedTask) && !this.transactionIdBambora) {
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.bamboraModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'isEditedTask': this.isEditedTask ? 1 : undefined,
        'payment_for': this.repaymentTransaction ? PaymentFor.REPAYMENT : PaymentFor.CREATE_TASK
      }
      return;
    }

    if (this.paymentType == PaymentMode.PAYWAYONE && this.NET_PAYABLE_AMOUNT > 0 && (this.isSourceCustom || (this.selectedPaymentMethod.payment_process_type == 1) || this.isEditedTask) && !this.transactionIdPaywayone) {
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.paywayoneModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'isEditedTask': this.isEditedTask ? 1 : undefined,
        'payment_for': this.repaymentTransaction ? PaymentFor.REPAYMENT : PaymentFor.CREATE_TASK
      }
      return;
    }

    if (this.paymentType == PaymentMode.PLACETOPAY && this.NET_PAYABLE_AMOUNT > 0 && (this.isSourceCustom || (this.selectedPaymentMethod.payment_process_type == 1) || this.isEditedTask) && !this.transactionIdPlacetopay) {
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.placetopayModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'isEditedTask': this.isEditedTask ? 1 : undefined,
        'payment_for': this.repaymentTransaction ? PaymentFor.REPAYMENT : PaymentFor.CREATE_TASK
      }
      return;
    }

    if (this.paymentType == PaymentMode.VUKA && this.NET_PAYABLE_AMOUNT > 0 && (this.isSourceCustom || (this.selectedPaymentMethod.payment_process_type == 1) || this.isEditedTask) && !this.transactionIdVuka) {
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.vukaModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'isEditedTask': this.isEditedTask ? 1 : undefined,
        'payment_for': this.repaymentTransaction ? PaymentFor.REPAYMENT : PaymentFor.CREATE_TASK
      }
      return;
    }

    if (this.paymentType == PaymentMode.VPOS && this.NET_PAYABLE_AMOUNT > 0 && (this.isSourceCustom || (this.selectedPaymentMethod.payment_process_type == 1) || this.isEditedTask) && !this.transactionIdVpos) {
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.vposModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'isEditedTask': this.isEditedTask ? 1 : undefined,
        'payment_for': this.repaymentTransaction ? PaymentFor.REPAYMENT : PaymentFor.CREATE_TASK
      }
      return;
    }

    if (this.paymentType == 512 && this.NET_PAYABLE_AMOUNT > 0) {
      this.payViaBillPlz(response.data.job_id);
    } else if (this.paymentType == 128 && this.NET_PAYABLE_AMOUNT > 0 && ((this.selectedPaymentMethod.payment_process_type === 1) || this.isSourceCustom) && !this.transactionIdPayfort) {
      this.getRazorpay(response.data.job_id, 1);
    } else if (this.paymentType == PaymentMode.INNSTAPAY && this.NET_PAYABLE_AMOUNT > 0 && this.post_payment_enable && !this.transactionIdInnstapay) {
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.innstapayModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'payment_method': this.paymentType,
        'isEditedTask': this.isEditedTask ? 1 : undefined,
        'orderCreationPayload': this.orderCreationPayload,
        'isSourceCustom': this.isSourceCustom,
        'debtAmountCheck': this.debtAmountCheck,
        'customerPlanId': this.customerPlanId
      }

    }

    else if (this.paymentType == PaymentMode.STRIPE_IDEAL && this.NET_PAYABLE_AMOUNT > 0 && this.post_payment_enable && !this.transactionIdStripeIdeal) {
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.stripeIdealModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'payment_for': PaymentFor.CREATE_TASK,
        'orderCreationPayload': this.orderCreationPayload,
        'isSourceCustom': this.isSourceCustom,
        'debtAmountCheck': this.debtAmountCheck,
        'customerPlanId': this.customerPlanId
      }
    }
    else if (this.paymentType == PaymentMode.MPAISA && this.NET_PAYABLE_AMOUNT > 0 && this.post_payment_enable && !this.transactionIdMPaisa) {
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.mpaisaModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'payment_for': PaymentFor.CREATE_TASK,
        'orderCreationPayload': this.orderCreationPayload,
        'isSourceCustom': this.isSourceCustom,
        'debtAmountCheck': this.debtAmountCheck,
        'customerPlanId': this.customerPlanId
      }
    }
    else if (this.paymentType == PaymentMode.PAYFAST && this.NET_PAYABLE_AMOUNT > 0 && this.post_payment_enable && !this.transactionIdPayFast) {
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.payFastModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'payment_for': PaymentFor.CREATE_TASK,
        'orderCreationPayload': this.orderCreationPayload,
        'isSourceCustom': this.isSourceCustom,
        'debtAmountCheck': this.debtAmountCheck,
        'customerPlanId': this.customerPlanId
      }
    }
    else if (this.paymentType == PaymentMode.PAYPAL && this.post_payment_enable && this.NET_PAYABLE_AMOUNT > 0) {
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.paypalModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'payment_for': PaymentFor.CREATE_TASK,
        'orderCreationPayload': this.orderCreationPayload,
        'isSourceCustom': this.isSourceCustom,
        'debtAmountCheck': this.debtAmountCheck,
        'customerPlanId': this.customerPlanId
      }

    }

    else if (this.paymentType == PaymentMode.TELR && this.post_payment_enable && this.NET_PAYABLE_AMOUNT > 0) {
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.telrModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'payment_for': PaymentFor.CREATE_TASK,
        'orderCreationPayload': this.orderCreationPayload,
        'isSourceCustom': this.isSourceCustom,
        'debtAmountCheck': this.debtAmountCheck,
        'customerPlanId': this.customerPlanId
      }

    }

    else if (this.paymentType == PaymentMode.PAYSTACK && this.post_payment_enable && this.NET_PAYABLE_AMOUNT > 0) {
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.paystackModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'payment_for': this.repaymentTransaction ? PaymentFor.REPAYMENT : PaymentFor.CREATE_TASK,
        'isEditedTask': this.isEditedTask ? 1 : undefined,
        'orderCreationPayload': this.orderCreationPayload,
        'isSourceCustom': this.isSourceCustom,
        'debtAmountCheck': this.debtAmountCheck,
        'customerPlanId': this.customerPlanId
      }
      if (this.sessionService.getByKey('app', 'payment') && this.sessionService.getByKey('app', 'payment').is_custom_order == 1)
        this.triggerPayment['payment_for'] = 10;
    }
    else if (this.paymentType == PaymentMode.PAYU && this.NET_PAYABLE_AMOUNT > 0 && this.post_payment_enable && !this.transactionIdPayu) {
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.payuModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'payment_for': PaymentFor.CREATE_TASK,
        'orderCreationPayload': this.orderCreationPayload,
        'isSourceCustom': this.isSourceCustom,
        'debtAmountCheck': this.debtAmountCheck,
        'customerPlanId': this.customerPlanId
      }

    }
    else if (this.paymentType == PaymentMode.PAY_MOB && this.NET_PAYABLE_AMOUNT > 0 && this.post_payment_enable && !this.transactionIdPayMob) {
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.payMobModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'payment_for': PaymentFor.CREATE_TASK,
        'orderCreationPayload': this.orderCreationPayload,
        'isSourceCustom': this.isSourceCustom,
        'debtAmountCheck': this.debtAmountCheck,
        'customerPlanId': this.customerPlanId
      }
      if (this.sessionService.getByKey('app', 'payment') && this.sessionService.getByKey('app', 'payment').is_custom_order == 1)
        this.triggerPayment['payment_for'] = 10;

    }
    // else if (this.paymentType == PaymentMode.WIRE_CARD && this.NET_PAYABLE_AMOUNT > 0 && this.post_payment_enable && !this.transactionIdWirecard) {
    //   this.wirecardModal = true;
    //   this.triggerPayment = {
    //     'job_id': response.data.job_id,
    //     'payment_for': PaymentFor.CREATE_TASK
    //   }
    // }
    else if (this.paymentType == PaymentMode.SSL_COMMERZ && this.NET_PAYABLE_AMOUNT > 0 && this.post_payment_enable && !this.transactionIdSslCommerz) {
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.sslCommerzModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'payment_for': PaymentFor.CREATE_TASK
      }
    }
    else if (this.paymentType == PaymentMode.FAC_3D && this.NET_PAYABLE_AMOUNT > 0 && this.post_payment_enable && !this.transactionIdFAC3D) {
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.fac3dModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'payment_for': PaymentFor.CREATE_TASK
      }
    }
    else if (this.paymentType == PaymentMode.CHECKOUT_COM && this.NET_PAYABLE_AMOUNT > 0 && this.post_payment_enable && !this.transactionIdCheckoutCom) {
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.checkoutComModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'payment_for': PaymentFor.CREATE_TASK
      }
    }
    else if (this.paymentType == PaymentMode.PAYHERE && this.NET_PAYABLE_AMOUNT > 0 && this.post_payment_enable && !this.transactionIdPayHere) {
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.payHereModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'payment_for': PaymentFor.CREATE_TASK
      }
    }
    else if (this.paymentType == PaymentMode.HYPERPAY && this.NET_PAYABLE_AMOUNT > 0 && (this.selectedPaymentMethod.payment_process_type == 1) && !this.transactionIdHyperPay) {
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.hyperPayModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'payment_for': PaymentFor.CREATE_TASK
      }
    }
    else if (this.paymentType == PaymentMode.VIVA && this.NET_PAYABLE_AMOUNT > 0 && this.post_payment_enable && !this.transactionIdviva) {
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.vivaModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'payment_for': PaymentFor.CREATE_TASK
      }
    }
    else if (this.paymentType == PaymentMode.AZUL && this.NET_PAYABLE_AMOUNT > 0 && (this.selectedPaymentMethod.payment_process_type == 1) && !this.transactionIdAzul) {
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.azulModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'payment_for': PaymentFor.CREATE_TASK
      }
    }
    else if (this.paymentType == PaymentMode.CREDIMAX && this.NET_PAYABLE_AMOUNT > 0 && (this.selectedPaymentMethod.payment_process_type == 1) && !this.transactionIdCredimax) {
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.credimaxModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'payment_for': PaymentFor.CREATE_TASK
      }
    }
    else if (this.paymentType == PaymentMode.MY_FATOORAH && this.NET_PAYABLE_AMOUNT > 0 && (this.selectedPaymentMethod.payment_process_type == 1) && !this.transactionIdFatoorah) {
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.fatoorahModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'payment_for': PaymentFor.CREATE_TASK
      }
    }
    else if (this.paymentType == PaymentMode.PAYNET && this.NET_PAYABLE_AMOUNT > 0 && (this.selectedPaymentMethod.payment_process_type == 1) && !this.transactionIdPaynet) {
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.paynetModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'payment_for': PaymentFor.CREATE_TASK
      }
    }
    else if (this.paymentType == PaymentMode.TAP && this.NET_PAYABLE_AMOUNT > 0 && (this.selectedPaymentMethod.payment_process_type == 1) && !this.transactionIdTap) {
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.tapModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'payment_for': PaymentFor.CREATE_TASK
      }
    }
    else if (this.paymentType == PaymentMode.CURLEC && this.NET_PAYABLE_AMOUNT > 0 && (this.selectedPaymentMethod.payment_process_type == 1) && !this.transactionIdCurlec) {
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.curlecModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'payment_for': PaymentFor.CREATE_TASK
      }
    }
    else if (this.paymentType == PaymentMode.WIPAY && this.NET_PAYABLE_AMOUNT > 0 && (this.selectedPaymentMethod.payment_process_type == 1) && !this.transactionIdWipay) {
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.wipayModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'payment_for': PaymentFor.CREATE_TASK
      }
    }
    else if (this.paymentType == PaymentMode.PAGAR && this.NET_PAYABLE_AMOUNT > 0 && (this.selectedPaymentMethod.payment_process_type == 1) && !this.transactionIdPagar) {
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.pagarModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'payment_for': PaymentFor.CREATE_TASK
      }
    }
    else if (this.paymentType == PaymentMode.WECHAT && this.NET_PAYABLE_AMOUNT > 0 && (this.selectedPaymentMethod.payment_process_type == 1) && !this.transactionIdWechat) {
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.wechatModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'payment_for': PaymentFor.CREATE_TASK
      }
    }
    else if (this.paymentType == PaymentMode.MYBILLPAYMENT && this.NET_PAYABLE_AMOUNT > 0 && (this.selectedPaymentMethod.payment_process_type == 1) && !this.transactionIdMybillpayment) {
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.mybillpaymentModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'payment_for': PaymentFor.CREATE_TASK
      }
    }
    else if (this.paymentType == PaymentMode.VALITOR && this.NET_PAYABLE_AMOUNT > 0 && (this.selectedPaymentMethod.payment_process_type == 1) && !this.transactionIdValitor) {
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.valitorModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'payment_for': PaymentFor.CREATE_TASK
      }
    }
    else if (this.paymentType == PaymentMode.TRUEVO && this.NET_PAYABLE_AMOUNT > 0 && (this.selectedPaymentMethod.payment_process_type == 1) && !this.transactionIdTruevo) {
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.truevoModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'payment_for': PaymentFor.CREATE_TASK
      }
    }
    else if (this.paymentType == PaymentMode.PAYZEN && this.NET_PAYABLE_AMOUNT > 0 && (this.selectedPaymentMethod.payment_process_type == 1) && !this.transactionIdPayzen) {
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.payzenModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'payment_for': PaymentFor.CREATE_TASK
      }
    }
    else if (this.paymentType == PaymentMode.FIRSTDATA && this.NET_PAYABLE_AMOUNT > 0 && (this.selectedPaymentMethod.payment_process_type == 1) && !this.transactionIdFirstdata) {
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.firstdataModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'payment_for': PaymentFor.CREATE_TASK
      }
    }
    else if (this.paymentType == PaymentMode.BANKOPEN && this.NET_PAYABLE_AMOUNT > 0 && (this.selectedPaymentMethod.payment_process_type == 1) && !this.transactionIdBankOpen) {
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.bankOpenModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'payment_for': PaymentFor.CREATE_TASK
      }
    }
    else if (this.paymentType == PaymentMode.SQUARE && this.NET_PAYABLE_AMOUNT > 0 && (this.selectedPaymentMethod.payment_process_type == 1) && !this.transactionIdSquare) {
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.squareModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'payment_for': PaymentFor.CREATE_TASK
      }
    }
    else if (this.paymentType == PaymentMode.WHOOSH && this.NET_PAYABLE_AMOUNT > 0 && (this.selectedPaymentMethod.payment_process_type == 1) && !this.transactionIdWhoosh) {
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.whooshModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'payment_for': PaymentFor.CREATE_TASK
      }
    }
    else if (this.paymentType == PaymentMode.MTN && this.NET_PAYABLE_AMOUNT > 0 && (this.selectedPaymentMethod.payment_process_type == 1) && !this.transactionIdMtn) {
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.mtnModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'payment_for': PaymentFor.CREATE_TASK
      }
    }
    else if (this.paymentType == PaymentMode.ONEPAY && this.NET_PAYABLE_AMOUNT > 0 && (this.selectedPaymentMethod.payment_process_type == 1) && !this.transactionIdOnepay) {
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.onepayModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'payment_for': PaymentFor.CREATE_TASK
      }
    }
    else if (this.paymentType == PaymentMode.PAGOPLUX && this.NET_PAYABLE_AMOUNT > 0 && (this.selectedPaymentMethod.payment_process_type == 1) && !this.transactionIdPagoplux) {
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.pagopluxModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'payment_for': PaymentFor.CREATE_TASK
      }
    }
    else if (this.paymentType == PaymentMode.THETELLER && this.NET_PAYABLE_AMOUNT > 0 && (this.selectedPaymentMethod.payment_process_type == 1) && !this.transactionIdTheteller) {
      this.thetellerModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'payment_for': PaymentFor.CREATE_TASK
      }
    }
    else if (this.paymentType == PaymentMode.PAYNOW && this.NET_PAYABLE_AMOUNT > 0 && this.post_payment_enable && !this.transactionIdPaynow) {
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.paynowModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'payment_for': PaymentFor.CREATE_TASK,
        'orderCreationPayload': this.orderCreationPayload,
        'isSourceCustom': this.isSourceCustom,
        'debtAmountCheck': this.debtAmountCheck,
        'customerPlanId': this.customerPlanId
      }

    }
    else if (this.paymentType == PaymentMode.LIME_LIGHT && this.NET_PAYABLE_AMOUNT > 0 && this.post_payment_enable && !this.transactionIdLimeLight) {
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.showLimeLightPopup = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'payment_for': PaymentFor.CREATE_TASK
      }

    }
    else if (this.paymentType == PaymentMode.TWO_CHECKOUT && this.NET_PAYABLE_AMOUNT > 0 && this.post_payment_enable && !this.transactionIdTwoCheckout) {
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.showTwoCheckoutPopup = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'payment_for': PaymentFor.CREATE_TASK
      }

    }
    else if (this.paymentType == PaymentMode.ETISALAT && this.NET_PAYABLE_AMOUNT > 0 && (this.selectedPaymentMethod.payment_process_type == 1) && !this.transactionIdEtisalat) {
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.etisalatModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'payment_for': PaymentFor.CREATE_TASK
      }
    }
    else if (this.paymentType == PaymentMode.SUNCASH && this.NET_PAYABLE_AMOUNT > 0 && (this.selectedPaymentMethod.payment_process_type == 1) && !this.transactionIdSuncash) {
      this.suncashModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'payment_for': PaymentFor.CREATE_TASK
      }
    }
    else if (this.paymentType == PaymentMode.GOCARDLESS && this.NET_PAYABLE_AMOUNT > 0 && (this.selectedPaymentMethod.payment_process_type == 1) && !this.transactionIdGocardless) {
      this.gocardlessModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'payment_for': PaymentFor.CREATE_TASK
      }
    }
    else if (this.paymentType == PaymentMode.ATH && this.NET_PAYABLE_AMOUNT > 0 && (this.selectedPaymentMethod.payment_process_type == 1) && !this.transactionIdAth) {
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.athModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'payment_for': PaymentFor.CREATE_TASK
      }
    }
    else if (this.paymentType == PaymentMode.IPAY88 && this.NET_PAYABLE_AMOUNT > 0 && (this.selectedPaymentMethod.payment_process_type == 1) && !this.transactionIdIpay) {
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.ipayModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'payment_for': PaymentFor.CREATE_TASK
      }
    }
    else if (this.paymentType == PaymentMode.PROXYPAY && this.NET_PAYABLE_AMOUNT > 0 && (this.selectedPaymentMethod.payment_process_type == 1) && !this.transactionIdProxypay) {
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.proxypayModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'payment_for': PaymentFor.CREATE_TASK
      }
    }
    else if (this.paymentType == PaymentMode.CYBERSOURCE && this.NET_PAYABLE_AMOUNT > 0 && (this.selectedPaymentMethod.payment_process_type == 1) && !this.transactionIdCybersource) {
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.cybersourceModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'payment_for': PaymentFor.CREATE_TASK
      }
    }
    else if (this.paymentType == PaymentMode.ALFALAH && this.NET_PAYABLE_AMOUNT > 0 && (this.selectedPaymentMethod.payment_process_type == 1) && !this.transactionIdAlfalah) {
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.alfalahModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'payment_for': PaymentFor.CREATE_TASK
      }
    }
    else if (this.paymentType == PaymentMode.CULQI && this.NET_PAYABLE_AMOUNT > 0 && (this.selectedPaymentMethod.payment_process_type == 1) && !this.transactionIdCulqi) {
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.culqiModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'payment_for': PaymentFor.CREATE_TASK
      }
    }
    else if (this.paymentType == PaymentMode.NMI && this.NET_PAYABLE_AMOUNT > 0 && (this.selectedPaymentMethod.payment_process_type == 1) && !this.transactionIdNmi) {
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.nmiModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'payment_for': PaymentFor.CREATE_TASK
      }
    }
    else if (this.paymentType == PaymentMode.FLUTTERWAVE && this.NET_PAYABLE_AMOUNT > 0 && (this.selectedPaymentMethod.payment_process_type == 1) && !this.transactionIdFlutterwave) {
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.flutterwaveModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'payment_for': PaymentFor.CREATE_TASK
      }
    }
    else if (this.paymentType == PaymentMode.MPESA && this.NET_PAYABLE_AMOUNT > 0 && (this.selectedPaymentMethod.payment_process_type == 1) && !this.transactionIdMpesa) {
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.mpesaModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'payment_for': PaymentFor.CREATE_TASK
      }
    }
    else if (this.paymentType == PaymentMode.ADYEN && this.NET_PAYABLE_AMOUNT > 0 && (this.selectedPaymentMethod.payment_process_type == 1) && !this.transactionIdAdyen) {
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.adyenModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'payment_for': PaymentFor.CREATE_TASK
      }
    }
    else if (this.paymentType == PaymentMode.PAYTMV3 && this.NET_PAYABLE_AMOUNT > 0 && (this.selectedPaymentMethod.payment_process_type == 1) && !this.transactionIdPaytm) {
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.paytmModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'payment_for': PaymentFor.CREATE_TASK
      }
    }
    else if (this.paymentType == PaymentMode.PAYMARK && this.NET_PAYABLE_AMOUNT > 0 && (this.selectedPaymentMethod.payment_process_type == 1) && !this.transactionIdPaymark) {
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.paymarkModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'payment_for': PaymentFor.CREATE_TASK
      }
    }
    else if (this.paymentType == PaymentMode.HYPUR && this.NET_PAYABLE_AMOUNT > 0 && (this.selectedPaymentMethod.payment_process_type == 1) && !this.transactionIdHypur) {
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.hypurModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'payment_for': PaymentFor.CREATE_TASK
      }
    }
    else if (this.paymentType == PaymentMode.PIXELPAY && this.NET_PAYABLE_AMOUNT > 0 && (this.selectedPaymentMethod.payment_process_type == 1) && !this.transactionIdPixelpay) {
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.pixelpayModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'payment_for': PaymentFor.CREATE_TASK
      }
    }
    else if (this.paymentType == PaymentMode.DOKU && this.NET_PAYABLE_AMOUNT > 0 && (this.selectedPaymentMethod.payment_process_type == 1) && !this.transactionIdDoku) {
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.dokuModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'payment_for': PaymentFor.CREATE_TASK
      }
    }
    else if (this.paymentType == PaymentMode.PEACH && this.NET_PAYABLE_AMOUNT > 0 && (this.selectedPaymentMethod.payment_process_type == 1) && !this.transactionIdPeach) {
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.peachModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'payment_for': PaymentFor.CREATE_TASK
      }
    }
    else if (this.paymentType == PaymentMode.PAGUELOFACIL && this.NET_PAYABLE_AMOUNT > 0 && (this.selectedPaymentMethod.payment_process_type == 1) && !this.transactionIdPaguelofacil) {
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.paguelofacilModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'payment_for': PaymentFor.CREATE_TASK
      }
    }
    else if (this.paymentType == PaymentMode.NOQOODY && this.NET_PAYABLE_AMOUNT > 0 && (this.selectedPaymentMethod.payment_process_type == 1) && !this.transactionIdNoqoody) {
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.noqoodyModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'payment_for': PaymentFor.CREATE_TASK
      }
    }
    else if (this.paymentType == PaymentMode.GTBANK && this.NET_PAYABLE_AMOUNT > 0 && (this.selectedPaymentMethod.payment_process_type == 1) && !this.transactionIdGtbank) {
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.gtbankModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'payment_for': PaymentFor.CREATE_TASK
      }
    }
    else if (this.paymentType == PaymentMode.URWAY && this.NET_PAYABLE_AMOUNT > 0 && (this.selectedPaymentMethod.payment_process_type == 1) && !this.transactionIdUrway) {
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.urwayModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'payment_for': PaymentFor.CREATE_TASK
      }
    }
    else if (this.paymentType == PaymentMode.VUKA && this.NET_PAYABLE_AMOUNT > 0 && (this.selectedPaymentMethod.payment_process_type == 1) && !this.transactionIdVuka) {
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.vukaModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'payment_for': PaymentFor.CREATE_TASK
      }
    }
    else if (this.paymentType == PaymentMode.VPOS && this.NET_PAYABLE_AMOUNT > 0 && (this.selectedPaymentMethod.payment_process_type == 1) && !this.transactionIdVpos) {
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.vposModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'payment_for': PaymentFor.CREATE_TASK
      }
    }
    else if (this.paymentType == PaymentMode.CXPAY && this.NET_PAYABLE_AMOUNT > 0 && (this.selectedPaymentMethod.payment_process_type == 1) && !this.transactionIdCxpay) {
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.cxpayModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'payment_for': PaymentFor.CREATE_TASK
      }
    }
    else if (this.paymentType == PaymentMode.PAYKU && this.NET_PAYABLE_AMOUNT > 0 && (this.selectedPaymentMethod.payment_process_type == 1) && !this.transactionIdPayku) {
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.paykuModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'payment_for': PaymentFor.CREATE_TASK
      }
    }
    else if (this.paymentType == PaymentMode.BAMBORA && this.NET_PAYABLE_AMOUNT > 0 && (this.selectedPaymentMethod.payment_process_type == 1) && !this.transactionIdBambora) {
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.bamboraModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'payment_for': PaymentFor.CREATE_TASK
      }
    }
    else if (this.paymentType == PaymentMode.PAYWAYONE && this.NET_PAYABLE_AMOUNT > 0 && (this.selectedPaymentMethod.payment_process_type == 1) && !this.transactionIdPaywayone) {
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.paywayoneModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'payment_for': PaymentFor.CREATE_TASK
      }
    }
    else if (this.paymentType == PaymentMode.PLACETOPAY && this.NET_PAYABLE_AMOUNT > 0 && (this.selectedPaymentMethod.payment_process_type == 1) && !this.transactionIdPlacetopay) {
      this.orderCreationPayload = this.makeCreateTaskData(data);
      this.placetopayModal = true;
      this.triggerPayment = {
        'job_id': response.data.job_id,
        'payment_for': PaymentFor.CREATE_TASK
      }
    }
    else {
      this.afterCreateTaskSuccess(response);
    }

  }

  makeCreateTaskData(obj: any) {
    const checkoutData = this.sessionService.getByKey("app", "checkout") ? this.sessionService.getByKey("app", "checkout").cart : {};
    let data = Object.assign({}, obj);
    data.marketplace_reference_id = this.sessionService.getString("marketplace_reference_id");

    if(this.deliveryMethod == 2 && !this.appConfig.show_tip_in_pickup)
      data["tip"] = 0;
    else
      data.tip = +this.tipValue ? this.tipValue : undefined;

    data.marketplace_user_id = this.sessionService.get("appData").vendor_details.marketplace_user_id;
    data.vendor_id = this.sessionService.get("appData").vendor_details.vendor_id;
    data.access_token = this.sessionService.get("appData").vendor_details.app_access_token;
    data.currency_id = this.currency ? this.currency.currency_id : undefined;
    data.card_id = this.selectedCardId;
    data['customer_username'] = this.sessionService.get("appData").vendor_details.first_name;
    data['customer_email'] = this.sessionService.get("appData").vendor_details.email || "";
    data['customer_phone'] = this.sessionService.get("appData").vendor_details.phone_no;
    if(this.paylater_transaction &&  this.userPaymentData.TRANSACTIONAL_CHARGES_INFO  && this.userPaymentData.TRANSACTIONAL_CHARGES_INFO.PAYLATER){
        data.transaction_charges = this.userPaymentData.TRANSACTIONAL_CHARGES_INFO.PAYLATER.transaction_charges
    }
    if (checkoutData.lng && checkoutData.lat) {
      data['custom_pickup_address'] = checkoutData.address ? checkoutData.address : undefined;
      data['custom_pickup_latitude'] = checkoutData.lat ? checkoutData.lat : undefined;
      data['custom_pickup_longitude'] = checkoutData.lng ? checkoutData.lng : undefined;
      data['custom_pickup_name'] = checkoutData.name ? checkoutData.name : undefined;
      data['custom_pickup_email'] = checkoutData.email ? checkoutData.email : undefined;
      data['custom_pickup_phone'] = checkoutData.phone ? '+' + this.country_code + checkoutData.phone : undefined;
    }
    if (this.sessionService.get("config").is_menu_enabled) {
      data.is_app_menu_enabled = 1
    }
    if (this.paymentType == PaymentMode.STRIPE) {
      data.payment_method = PaymentMode.STRIPE;
    }
    data.transaction_id = this.transactionIdPayfort ? this.transactionIdPayfort : undefined;
    if (this.paymentType == PaymentMode.MPAISA) {
      data.transaction_id = this.transactionIdMPaisa ? this.transactionIdMPaisa : undefined;
      data.payment_method = PaymentMode.MPAISA;
    }
    if (this.paymentType == PaymentMode.PAYFAST) {
      data.transaction_id = this.transactionIdPayFast ? this.transactionIdPayFast : undefined;
      data.payment_method = PaymentMode.PAYFAST;
    }
    if (this.paymentType == PaymentMode.STRIPE_IDEAL) {
      data.transaction_id = this.transactionIdStripeIdeal ? this.transactionIdStripeIdeal : undefined;
      data.payment_method = PaymentMode.STRIPE_IDEAL;
    }
    if (this.paymentType == PaymentMode.INNSTAPAY) {
      data.transaction_id = this.transactionIdInnstapay ? this.transactionIdInnstapay : undefined;
      data.payment_method = PaymentMode.INNSTAPAY;
    }
    if (this.paymentType == PaymentMode.VIVA) {
      data.transaction_id = this.transactionIdviva ? this.transactionIdviva : undefined;
      data.payment_method = PaymentMode.VIVA;
    }
    if (this.paymentType == PaymentMode.PAYU) {
      data.transaction_id = this.transactionIdPayu ? this.transactionIdPayu : undefined;
      data.payment_method = PaymentMode.PAYU;
    }

    if (this.paymentType == PaymentMode.PAY_MOB) {
      data.transaction_id = this.transactionIdPayMob ? this.transactionIdPayMob : undefined;
      data.payment_method = PaymentMode.PAY_MOB;
    }
    // if (this.paymentType == PaymentMode.WIRE_CARD) {
    //   data.transaction_id = this.transactionIdWirecard ? this.transactionIdWirecard : undefined;
    //   data.payment_method = PaymentMode.WIRE_CARD;
    // }
    if (this.paymentType == PaymentMode.SSL_COMMERZ) {
      data.transaction_id = this.transactionIdSslCommerz ? this.transactionIdSslCommerz : undefined;
      data.payment_method = PaymentMode.SSL_COMMERZ;
    }
    if (this.paymentType == PaymentMode.AZUL) {
      data.transaction_id = this.transactionIdAzul ? this.transactionIdAzul : undefined;
      data.payment_method = PaymentMode.AZUL;
    }
    if (this.paymentType == PaymentMode.CREDIMAX) {
      data.transaction_id = this.transactionIdCredimax ? this.transactionIdCredimax : undefined;
      data.payment_method = PaymentMode.CREDIMAX;
    }
    if (this.paymentType == PaymentMode.MY_FATOORAH) {
      data.transaction_id = this.transactionIdFatoorah ? this.transactionIdFatoorah : undefined;
      data.payment_method = PaymentMode.MY_FATOORAH;
    }
    if (this.paymentType == PaymentMode.PAYNET) {
      data.transaction_id = this.transactionIdPaynet ? this.transactionIdPaynet : undefined;
      data.payment_method = PaymentMode.PAYNET;
    }
    if (this.paymentType == PaymentMode.TAP) {
      data.transaction_id = this.transactionIdTap ? this.transactionIdTap : undefined;
      data.payment_method = PaymentMode.TAP;
    }
    if (this.paymentType == PaymentMode.CURLEC) {
      data.transaction_id = this.transactionIdCurlec ? this.transactionIdCurlec : undefined;
      data.payment_method = PaymentMode.CURLEC;
    }
    if (this.paymentType == PaymentMode.WIPAY) {
      data.transaction_id = this.transactionIdWipay ? this.transactionIdWipay : undefined;
      data.payment_method = PaymentMode.WIPAY;
    }
    if (this.paymentType == PaymentMode.PAGAR) {
      data.transaction_id = this.transactionIdPagar ? this.transactionIdPagar : undefined;
      data.payment_method = PaymentMode.PAGAR;
    }
    if (this.paymentType == PaymentMode.WECHAT) {
      data.transaction_id = this.transactionIdWechat ? this.transactionIdWechat : undefined;
      data.payment_method = PaymentMode.WECHAT;
    }
    if (this.paymentType == PaymentMode.MYBILLPAYMENT) {
      data.transaction_id = this.transactionIdMybillpayment ? this.transactionIdMybillpayment : undefined;
      data.payment_method = PaymentMode.MYBILLPAYMENT;
    }
    if (this.paymentType == PaymentMode.VALITOR) {
      data.transaction_id = this.transactionIdValitor ? this.transactionIdValitor : undefined;
      data.payment_method = PaymentMode.VALITOR;
    }
    if (this.paymentType == PaymentMode.TRUEVO) {
      data.transaction_id = this.transactionIdTruevo ? this.transactionIdTruevo : undefined;
      data.payment_method = PaymentMode.TRUEVO;
    }
    if (this.paymentType == PaymentMode.PAYZEN) {
      data.transaction_id = this.transactionIdPayzen ? this.transactionIdPayzen : undefined;
      data.payment_method = PaymentMode.PAYZEN;
    }
    if (this.paymentType == PaymentMode.FIRSTDATA) {
      data.transaction_id = this.transactionIdFirstdata ? this.transactionIdFirstdata : undefined;
      data.payment_method = PaymentMode.FIRSTDATA;
    }
    if (this.paymentType == PaymentMode.BANKOPEN) {
      data.transaction_id = this.transactionIdBankOpen ? this.transactionIdBankOpen : undefined;
      data.payment_method = PaymentMode.BANKOPEN;
    }
    if (this.paymentType == PaymentMode.SQUARE) {
      data.transaction_id = this.transactionIdSquare ? this.transactionIdSquare : undefined;
      data.payment_method = PaymentMode.SQUARE;
    }
    if (this.paymentType == PaymentMode.WHOOSH) {
      data.transaction_id = this.transactionIdWhoosh ? this.transactionIdWhoosh : undefined;
      data.payment_method = PaymentMode.WHOOSH;
    }
    if (this.paymentType == PaymentMode.MTN) {
      data.transaction_id = this.transactionIdMtn ? this.transactionIdMtn : undefined;
      data.payment_method = PaymentMode.MTN;
    }
    if (this.paymentType == PaymentMode.ONEPAY) {
      data.transaction_id = this.transactionIdOnepay ? this.transactionIdOnepay : undefined;
      data.payment_method = PaymentMode.ONEPAY;
    }
    if (this.paymentType == PaymentMode.PAGOPLUX) {
      data.transaction_id = this.transactionIdPagoplux ? this.transactionIdPagoplux : undefined;
      data.payment_method = PaymentMode.PAGOPLUX;
    }
    if (this.paymentType == PaymentMode.THETELLER) {
      data.transaction_id = this.transactionIdTheteller ? this.transactionIdTheteller : undefined;
      data.payment_method = PaymentMode.THETELLER;
    }
    if (this.paymentType == PaymentMode.RAZORPAY && (this.selectedPaymentMethod.payment_process_type === 1)) {
      data.is_payment_done = this.transactionIdPayfort ? 1 : 0;
      data.payment_method = PaymentMode.RAZORPAY;
    }
    if (this.paymentType == PaymentMode.PAYNOW) {
      data.transaction_id = this.transactionIdPaynow ? this.transactionIdPaynow : undefined;
      data.payment_method = PaymentMode.PAYNOW;
    }
    if (this.paymentType == PaymentMode.LIME_LIGHT) {
      data.transaction_id = this.transactionIdLimeLight ? this.transactionIdLimeLight : undefined;
      data.payment_method = PaymentMode.LIME_LIGHT;
    }
    if (this.paymentType == PaymentMode.TWO_CHECKOUT) {
      data.transaction_id = this.transactionIdTwoCheckout ? this.transactionIdTwoCheckout : undefined;
      data.payment_method = PaymentMode.TWO_CHECKOUT;
    }
    if (this.paymentType == PaymentMode.FAC_3D) {
      data.transaction_id = this.transactionIdFAC3D ? this.transactionIdFAC3D : undefined;
      data.payment_method = PaymentMode.FAC_3D;
    }
    if (this.paymentType == PaymentMode.CHECKOUT_COM) {
      data.transaction_id = this.transactionIdCheckoutCom ? this.transactionIdCheckoutCom : undefined;
      data.payment_method = PaymentMode.CHECKOUT_COM;
    }
    if (this.paymentType == PaymentMode.PAYHERE) {
      data.transaction_id = this.transactionIdPayHere ? this.transactionIdPayHere : undefined;
      data.payment_method = PaymentMode.PAYHERE;
    }
    if (this.paymentType == PaymentMode.HYPERPAY) {
      data.transaction_id = this.transactionIdHyperPay ? this.transactionIdHyperPay : undefined;
      data.payment_method = PaymentMode.HYPERPAY;
    }

    if (this.paymentType == PaymentMode.BILLPLZ) {
      data.transaction_id = undefined;
      data.payment_method = PaymentMode.BILLPLZ;
      data.is_payment_done = 0;
    }

    if (this.paymentType == PaymentMode.FAC) {
      data.payment_method = 2048;
      data.fac_payment_flow = PaymentByUsing.USING_FAC;
    }

    if (this.paymentType == PaymentMode.ETISALAT) {
      data.transaction_id = this.transactionIdEtisalat ? this.transactionIdEtisalat : undefined;
      data.payment_method = PaymentMode.ETISALAT;
    }

    if (this.paymentType == PaymentMode.SUNCASH) {
      data.transaction_id = this.transactionIdSuncash ? this.transactionIdSuncash : undefined;
      data.payment_method = PaymentMode.SUNCASH;
    }

    if (this.paymentType == PaymentMode.GOCARDLESS) {
      data.transaction_id = this.transactionIdGocardless ? this.transactionIdGocardless : undefined;
      data.payment_method = PaymentMode.GOCARDLESS;
    }

    if (this.paymentType == PaymentMode.ATH) {
      data.transaction_id = this.transactionIdAth ? this.transactionIdAth : undefined;
      data.payment_method = PaymentMode.ATH;
    }

    if (this.paymentType == PaymentMode.IPAY88) {
      data.transaction_id = this.transactionIdIpay ? this.transactionIdIpay : undefined;
      data.payment_method = PaymentMode.IPAY88;
    }

    if (this.paymentType == PaymentMode.PROXYPAY) {
      data.transaction_id = this.transactionIdProxypay ? this.transactionIdProxypay : undefined;
      data.payment_method = PaymentMode.PROXYPAY;
    }

    if (this.paymentType == PaymentMode.CYBERSOURCE) {
      data.transaction_id = this.transactionIdCybersource ? this.transactionIdCybersource : undefined;
      data.payment_method = PaymentMode.CYBERSOURCE;
    }

    if (this.paymentType == PaymentMode.ALFALAH) {
      data.transaction_id = this.transactionIdAlfalah ? this.transactionIdAlfalah : undefined;
      data.payment_method = PaymentMode.ALFALAH;
    }

    if (this.paymentType == PaymentMode.CULQI) {
      data.transaction_id = this.transactionIdCulqi ? this.transactionIdCulqi : undefined;
      data.payment_method = PaymentMode.CULQI;
    }

    if (this.paymentType == PaymentMode.NMI) {
      data.transaction_id = this.transactionIdNmi ? this.transactionIdNmi : undefined;
      data.payment_method = PaymentMode.NMI;
    }

    if (this.paymentType == PaymentMode.FLUTTERWAVE) {
      data.transaction_id = this.transactionIdFlutterwave ? this.transactionIdFlutterwave : undefined;
      data.payment_method = PaymentMode.FLUTTERWAVE;
    }

    if (this.paymentType == PaymentMode.MPESA) {
      data.transaction_id = this.transactionIdMpesa ? this.transactionIdMpesa : undefined;
      data.payment_method = PaymentMode.MPESA;
    }

    if (this.paymentType == PaymentMode.ADYEN) {
      data.transaction_id = this.transactionIdAdyen ? this.transactionIdAdyen : undefined;
      data.payment_method = PaymentMode.ADYEN;
    }

    if (this.paymentType == PaymentMode.PAYTMV3) {
      data.transaction_id = this.transactionIdPaytm ? this.transactionIdPaytm : undefined;
      data.payment_method = PaymentMode.PAYTMV3;
    }

    if (this.paymentType == PaymentMode.PAYMARK) {
      data.transaction_id = this.transactionIdPaymark ? this.transactionIdPaymark : undefined;
      data.payment_method = PaymentMode.PAYMARK;
    }

    if (this.paymentType == PaymentMode.HYPUR) {
      data.transaction_id = this.transactionIdHypur ? this.transactionIdHypur : undefined;
      data.payment_method = PaymentMode.HYPUR;
    }

    if (this.paymentType == PaymentMode.PIXELPAY) {
      data.transaction_id = this.transactionIdPixelpay ? this.transactionIdPixelpay : undefined;
      data.payment_method = PaymentMode.PIXELPAY;
    }

    if (this.paymentType == PaymentMode.DOKU) {
      data.transaction_id = this.transactionIdDoku ? this.transactionIdDoku : undefined;
      data.payment_method = PaymentMode.DOKU;
    }

    if (this.paymentType == PaymentMode.PEACH) {
      data.transaction_id = this.transactionIdPeach ? this.transactionIdPeach : undefined;
      data.payment_method = PaymentMode.PEACH;
    }

    if (this.paymentType == PaymentMode.PAGUELOFACIL) {
      data.transaction_id = this.transactionIdPaguelofacil ? this.transactionIdPaguelofacil : undefined;
      data.payment_method = PaymentMode.PAGUELOFACIL;
    }

    if (this.paymentType == PaymentMode.NOQOODY) {
      data.transaction_id = this.transactionIdNoqoody ? this.transactionIdNoqoody : undefined;
      data.payment_method = PaymentMode.NOQOODY;
    }

    if (this.paymentType == PaymentMode.GTBANK) {
      data.transaction_id = this.transactionIdGtbank ? this.transactionIdGtbank : undefined;
      data.payment_method = PaymentMode.GTBANK;
    }

    if (this.paymentType == PaymentMode.URWAY) {
      data.transaction_id = this.transactionIdUrway ? this.transactionIdUrway : undefined;
      data.payment_method = PaymentMode.URWAY;
    }

    if (this.paymentType == PaymentMode.VUKA) {
      data.transaction_id = this.transactionIdVuka ? this.transactionIdVuka : undefined;
      data.payment_method = PaymentMode.VUKA;
    }

    if (this.paymentType == PaymentMode.VPOS) {
      data.transaction_id = this.transactionIdVpos ? this.transactionIdVpos : undefined;
      data.payment_method = PaymentMode.VPOS;
    }

    if (this.paymentType == PaymentMode.CXPAY) {
      data.transaction_id = this.transactionIdCxpay ? this.transactionIdCxpay : undefined;
      data.payment_method = PaymentMode.CXPAY;
    }

    if (this.paymentType == PaymentMode.PAYKU) {
      data.transaction_id = this.transactionIdPayku ? this.transactionIdPayku : undefined;
      data.payment_method = PaymentMode.PAYKU;
    }

    if (this.paymentType == PaymentMode.BAMBORA) {
      data.transaction_id = this.transactionIdBambora ? this.transactionIdBambora : undefined;
      data.payment_method = PaymentMode.BAMBORA;
    }

    if (this.paymentType == PaymentMode.PAYWAYONE) {
      data.transaction_id = this.transactionIdPaywayone ? this.transactionIdPaywayone : undefined;
      data.payment_method = PaymentMode.PAYWAYONE;
    }

    if (this.paymentType == PaymentMode.PLACETOPAY) {
      data.transaction_id = this.transactionIdPlacetopay ? this.transactionIdPlacetopay : undefined;
      data.payment_method = PaymentMode.PLACETOPAY;
    }

    let payArray = [PaymentMode.LIME_LIGHT, PaymentMode.TWO_CHECKOUT, PaymentMode.CHECKOUT_COM, PaymentMode.VIVA, PaymentMode.PAYHERE, PaymentMode.AZUL, PaymentMode.CREDIMAX, PaymentMode.HYPERPAY, PaymentMode.MY_FATOORAH, PaymentMode.THETELLER, PaymentMode.PAYNET, PaymentMode.CURLEC, PaymentMode.TAP, PaymentMode.WIPAY, PaymentMode.PAGAR, PaymentMode.WHOOSH, PaymentMode.MPAISA, PaymentMode.SSL_COMMERZ, PaymentMode.FAC_3D, PaymentMode.INNSTAPAY, PaymentMode.PAYFAST, PaymentMode.PAYNOW, PaymentMode.PAYU, PaymentMode.STRIPE_IDEAL, PaymentMode.PAY_MOB,PaymentMode.MTN, PaymentMode.WECHAT,PaymentMode.ONEPAY,PaymentMode.PAGOPLUX, PaymentMode.MYBILLPAYMENT, PaymentMode.VALITOR, PaymentMode.TRUEVO, PaymentMode.PAYZEN, PaymentMode.FIRSTDATA, PaymentMode.BANKOPEN, PaymentMode.SQUARE, PaymentMode.ETISALAT, PaymentMode.SUNCASH, PaymentMode.GOCARDLESS, PaymentMode.ATH, PaymentMode.IPAY88, PaymentMode.PROXYPAY, PaymentMode.CYBERSOURCE, PaymentMode.ALFALAH, PaymentMode.CULQI, PaymentMode.NMI, PaymentMode.FLUTTERWAVE, PaymentMode.MPESA, PaymentMode.ADYEN, PaymentMode.PAYMARK, PaymentMode.HYPUR, PaymentMode.PAYTMV3, PaymentMode.PIXELPAY, PaymentMode.DOKU, PaymentMode.PEACH, PaymentMode.PAGUELOFACIL, PaymentMode.NOQOODY, PaymentMode.GTBANK, PaymentMode.URWAY, PaymentMode.VUKA, PaymentMode.VPOS, PaymentMode.CXPAY, PaymentMode.PAYKU, PaymentMode.BAMBORA, PaymentMode.PAYWAYONE, PaymentMode.PLACETOPAY];

    if (payArray.includes(this.paymentType) && this.post_payment_enable) {
      data.transaction_id = undefined;
      data.payment_method = this.paymentType;
      data.is_payment_done = 0;
    }

    if (this.paymentMethod == PaymentMode.PAYSTACK) {
      data.transaction_id = this.transactionIdPaystack ? this.transactionIdPaystack : undefined;
      data.payment_method = PaymentMode.PAYSTACK;
      data.is_payment_done = this.transactionIdPaystack ? 1 : 0;
    }

    data.cvv = this.cvvPay ? this.cvvPay : undefined;
    if (this.formSettings.is_multi_currency_enabled) {
      data['is_multi_currency_enabled_app'] = this.formSettings.is_multi_currency_enabled;
    }
    if (this.billPromo.isPromo) {
      data.promo_id = this.billPromo.id;
    }
    else {
      data.referral_code = this.billPromo.code;
    }
    if (this.appConfig.product_view === 1) {
      data.user_id = this.sessionService.get("user_id");
    }
    else if (this.customOrderFlow) {
      if (this.vendorId) {
        data.user_id = this.sessionService.get("user_id")
      }
      else {
        data.user_id = this.sessionService.get("config").marketplace_user_id;
      }
    }
    else {
      data.user_id = this.sessionService.get("info") ? this.sessionService.get("info")["storefront_user_id"] : (this.sessionService.get("user_id") ? this.sessionService.get("user_id") : this.sessionService.get("config").marketplace_user_id);
    }
    if (this.sessionService.getString("deliveryMethod")) {
      const method = this.sessionService.getString("deliveryMethod");
      switch (Number(method)) {
        case 1:
          data["home_delivery"] = 1;
          break;
        case 2:
          data["self_pickup"] = 1;
          break;
        case 8:
          data["pick_and_drop"] = 1;
          break;
      }
    }
    if (this.sessionService.getByKey("app", "payment") && this.sessionService.getByKey("app", "payment").bill && !this.isSourceCustom) {
      data.delivery_charges_formula_fields = this.sessionService.getByKey("app", "payment").bill.DELIVERY_CHARGES_FORMULA_FIELDS;
    }
    if (this.sessionService.getString("ip_address")) {
      data.AppIP = this.sessionService.getString("ip_address");
    }
    //checkout template
    const checkoutTemplate = this.sessionService.getByKey('app', 'checkout_template') || [];
    data['checkout_template'] = JSON.stringify(checkoutTemplate);
    //loyalty points
    data['loyalty_points'] = (this.appliedLoyaltyPoints || this.appliedLoyaltyPoints == 0) ? this.appliedLoyaltyPoints : undefined;

    if (!data.is_scheduled) {
      data["job_pickup_datetime"] = moment().format(
        "YYYY-MM-DDTHH:mm:ss.SSS[Z]"
      );
    }
    if (data.is_custom_order && this.appConfig.onboarding_business_type !== OnboardingBusinessType.LAUNDRY) {
      data["job_delivery_datetime"] = "";
    }
    if (!this.NET_PAYABLE_AMOUNT && this.paymentType == 128) {
      data.payment_method = PaymentMode.CASH;
    }

    if (this.sessionService.get('info') && this.sessionService.get('info').is_order_agent_scheduling_enabled && this.sessionService.get('info').business_type == 2 && this.sessionService.get('info').pd_or_appointment != 2) {
      data['tookan_agent_id'] = this.sessionService.getString('selected_agent');
    }

    if (this.restaurantInfo && this.restaurantInfo.is_delivery_charge_surge_active && this.userPaymentData && this.userPaymentData.DELIVERY_CHARGE_SURGE_AMOUNT) {
      data['delivery_surge'] = this.userPaymentData.DELIVERY_CHARGE_SURGE_AMOUNT
    }
    if (this.customOrderFlow) {
      data["latitude"] = checkoutData.latitude;
      data["longitude"] = checkoutData.longitude;
    } else {
      data["latitude"] = checkoutData.job_pickup_latitude;
      data["longitude"] = checkoutData.job_pickup_longitude;
    }

    if (this.sessionService.get("config").business_model_type === "FREELANCER" && this.customOrderFlow) {
      data.user_id = this.sessionService.get("config").user_id;
      data.customer_address = "-";
      data.customer_username = this.sessionService.get("appData").vendor_details.first_name;
      data.customer_phone = this.sessionService.get("appData").vendor_details.phone_no;
      data.currency_id = this.sessionService.get("appData").formSettings[0].payment_settings[0].currency_id;
      data.project_id = this.sessionService.getByKey("app", "payment").project_id;
      data.job_pickup_name = "-";
      data.job_pickup_phone = this.sessionService.get("appData").vendor_details.phone_no;
      data.job_pickup_address = "-";
      data.job_description = JSON.stringify(this.sessionService.getByKey("app", "payment").updated_description);
      data.longitude = 22.32;
      data.latitude = 12.21;
      data.customer_email = this.sessionService.get("appData").vendor_details.email || "";
      data.job_pickup_datetime = this.sessionService.getByKey("app", "payment").project_start_date;
      data.job_delivery_datetime = this.sessionService.getByKey("app", "payment").project_end_date;
    }


    if (this.appConfig.onboarding_business_type === OnboardingBusinessType.LAUNDRY) {
      let laundryCheckoutData = {};
      let dataNew = {};
      if (!data.is_custom_order) {
        laundryCheckoutData = this.sessionService.get('laundryCheckoutData');
      }
      let oldData = JSON.parse(JSON.stringify(data));
      dataNew = { ...oldData, ...laundryCheckoutData };
      dataNew['promo_id'] = dataNew['promo_id'] ? dataNew['promo_id'].toString() : undefined;
      dataNew['customer_username'] = this.sessionService.get("appData").vendor_details.first_name;
      dataNew['customer_email'] = this.sessionService.get("appData").vendor_details.email || "";
      dataNew['customer_phone'] = this.sessionService.get("appData").vendor_details.phone_no;
      delete dataNew['home_delivery'];
      delete dataNew['vertical'];
      // delete dataNew['checkout_template']

      return dataNew;
    }
    return data;
  }

  private createTaskApiCall(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.sessionService.get('editJobId')) {
        this.paymentService.createTask(data).subscribe(response => {
          if (response.status === 200) {
            let sesData = this.sessionService.get("appData");
            sesData.vendor_details.last_payment_method = Number(data.payment_method);
            this.sessionService.set("appData",sesData);
            if(response.data.mapped_pages){
              let thankYouPageHtml = response.data.mapped_pages.find(el => el.type == PageType.THANKYOU);
              thankYouPageHtml = thankYouPageHtml ? thankYouPageHtml.template_data : undefined;
              this.sessionService.thankYouPageHtml = thankYouPageHtml;
              this.sessionService.set('OrderPlacedPage', thankYouPageHtml ? 1 : 0);
            }
            resolve(response);
          }
          else {
            this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.order_created_failure, 'Order Created Failure', '', '');
            this.loader.hide();

            if (response.data && response.data.unavailable_products && response.data.unavailable_products.length > 0) {
              this.show_unavailable_products = true;
              this.unavailable_products = response.data.unavailable_products;
            }
            else {
              this.popup.showPopup(MessageType.ERROR, 3000, response.message, false);
              setTimeout(() => {
                if (response.data.debt_amount > 0) {
                  this.router.navigate(['/debtAmount']);
                }
              }, 3000);
            }
          }
        });
      }
      else {
        data['prev_job_id'] = this.sessionService.get('editJobId');
        data['card_id'] = "";
        data['payment_method'] = "";
        this.paymentService.editTask(data).subscribe(response => {
          if (response.status === 200) {
            if (response.data.mapped_pages) {
              let thankYouPageHtml = response.data.mapped_pages.find(el => el.type == PageType.THANKYOU);
              thankYouPageHtml = thankYouPageHtml ? thankYouPageHtml.template_data : undefined;
              this.sessionService.thankYouPageHtml = thankYouPageHtml;
              this.sessionService.set('OrderPlacedPage', thankYouPageHtml ? 1 : 0);
            }
            resolve(response);
            this.sessionService.remove('editJobId');
          }
          else {
            this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.order_created_failure, 'Order Created Failure', '', '');
            this.loader.hide();
            this.popup.showPopup(MessageType.ERROR, 3000, response.message, false);
            setTimeout(() => {
              if (response.data.debt_amount > 0) {
                this.router.navigate(['/debtAmount']);
              }
            }, 3000);
          }

        });
      }

    })


  }
  goBack() {
    this.router.navigate(['checkout']);
    this.loader.show();
  }
  paymentUpdate(data) {
    if (data.bill) {
      this.billInfo = data.bill;
      this.billBool = false;
      this.setPayableAmount();
    }
  }

  hidePayFortPopup() {
    this.payfortBool = false;
  }

  getContentPayfort(event) {

    let frame = window.frames;
    // console.log(document.getElementById("payfortIframe").contentWindow.location.href);


    // console.log(JSON.stringify(event.contentWindow.location.href))

    // frame.title.subscribe((result)=>{
    //   console.log(result);
    // })
  }

  getContentVista(event) {

    let frame = window.frames;

  }

  getContentAuthorize(event) {

    let frame = window.frames;
    // console.log(document.getElementById("payfortIframe").contentWindow.location.href);


    // console.log(JSON.stringify(event.contentWindow.location.href))

    // frame.title.subscribe((result)=>{
    //   console.log(result);
    // })
  }

  getContentFac(event) {

    let frame = window.frames;
    // console.log(document.getElementById("payfortIframe").contentWindow.location.href);
  }

  successEventPayfort() {
    this.payfortBool = false;
    this.getCards(32);
  }
  successEventVista() {
    this.vistaBool = false;
    this.getCards(262144);
  }
  hideCvvPopup() {
    this.cvvPayfort = false;
    this.cvvPay = "";
  }

  cvvPayfortSubmit() {
    if (!this.cvvPay) {
      this.popup.showPopup(MessageType.ERROR, 1000, this.languageStrings.enter_cvv || "Enter CVV", false);
      return false;
    }
    this.paymentWindowRef = window.open('', '', "width=500,height=600,top=100,left=400");
    this.paymentWindowRef.document.title = 'Payment Process';
    this.paymentWindowRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
    let obj = {
      access_token: this.sessionService.get("appData").vendor_details.app_access_token,
      user_id: ((this.repaymentTransaction || this.isEditedTask) ? this.sessionService.get('repay_merchant') : this.sessionService.getString("user_id")) || undefined,
      vendor_card_id: this.selectedCardId,
      payment_method: 32,
      cvv: this.cvvPay,
      amount: this.NET_PAYABLE_AMOUNT,
      domain_name: window.location.host,
      customer_ip: this.sessionService.getString("ip_address")   //to be send accoring to new rules
    };
    if (this.customerPlanId) {
      obj['user_id'] = this.sessionService.get("config").marketplace_user_id ? this.sessionService.get("config").marketplace_user_id : undefined;
    }

    if (this.isSourceCustom) {
      if (this.isEditedTask) {
        obj['isEditedTask'] = 1;
      }
      obj['job_id'] = this.sessionService.getByKey('app', 'payment').order_id;
    }

    if (this.debtAmountCheck) {
      obj['payment_for'] = PaymentFor.DEBT_AMOUNT;
    }

    if (this.customerPlanId) {
      delete obj['job_id'];
      obj['payment_for'] = PaymentFor.CUSTOMER_SUBSCRIPTION_AMOUNT;
    }
    this.paymentService.payfortAuth(obj).subscribe(result => {
      this.hideCvvPopup();
      if (!result.data["3ds_url"]) {
        this.paymentWindowRef.close();
        this.popup.showPopup(
          MessageType.ERROR,
          2000,
          this.languageStrings.payment_failure || "Payment Failure",
          false
        );
        return false;
      }
      this.payfort3dUrl = result.data["3ds_url"] + '&customer_ip=' + this.sessionService.getString("ip_address")
      // this.payfort3dUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(
      //   result.data["3ds_url"]
      // );
      this.paymentWindowRef.location.href = this.payfort3dUrl;
      // this.payfort3dUrlBool = true;
    });
  }

  successPayfortTransaction() {
    // this.payfort3dUrlBool = false;
    if (this.paymentWindowRef) {
      setTimeout(() => { this.paymentWindowRef.close() }, 2000);
    }
    if (this.selectedPaymentMethod && this.selectedPaymentMethod.payment_process_type === 0 && this.paymentMethod == 128) {
      this.razorPayUrl = '';
      this.razorPayModal = false;
      this.taskViaPayment();
    } else if(this.selectedPaymentMethod && this.selectedPaymentMethod.payment_process_type !== 1 && this.paymentMethod == 128){
    this.taskViaPayment();
    }
  }

  successRazorpayTransaction() {
    setTimeout(() => {
      this.razorPayUrl = "";
      this.razorPayModal = false;
      this.afterCreateTaskSuccess('');
    }, 3000);
  }

  close3dver() {
    this.payfort3dUrl = "";
    // this.payfort3dUrlBool = false;
    this.cvvPay = "";
    this.razorPayUrl = "";
    this.razorPayModal = false;
    if (this.paymentType == 128 && this.selectedPaymentMethod && this.selectedPaymentMethod.payment_process_type === 2) {
      this.selectedPaymentMethod = null;
      return;
    }
    if (this.selectedPaymentMethod.payment_process_type === 1) {
      if ((!this.transactionIdPayfort && this.paymentType !== 32) || (!this.transactionIdPayfort && this.paymentType !== 262144)) {
        this.manupulateBrowserHistory();
        this.changeRouteWithParams();
      }
    }
  }

  // TODO BILL_PLZ PAYMENT INTEGRATION
  payViaBillPlz(job_id) {
    const obj = {
      vendor_id: this.sessionService.get("appData").vendor_details.vendor_id,
      marketplace_user_id: this.sessionService.get("config")
        .marketplace_user_id,
      user_id: (this.repaymentTransaction || this.isEditedTask) ? this.sessionService.get('repay_merchant') : this.sessionService.getString("user_id") || undefined,
      // 'description': 'Description not available',
      'payment_method': '512',
      // 'domain_name': window.location.origin,
      'access_token': this.sessionService.get('appData').vendor_details.app_access_token,
      'amount': this.NET_PAYABLE_AMOUNT,
      'job_id': job_id,
      'isEditedTask': this.isEditedTask ? 1 : undefined,
      'payment_for': this.repaymentTransaction ? PaymentFor.REPAYMENT : undefined
      // 'callback_url': environment.API_ENDPOINT,
      // 'redirect_url': location.href
    };
    if (this.sessionService.getByKey('app', 'payment') && this.sessionService.getByKey('app', 'payment').is_custom_order == 1)
      obj['payment_for'] = 10;
    if (this.debtAmountCheck) {
      obj['payment_for'] = PaymentFor.DEBT_AMOUNT;
    }
    if (this.customerPlanId) {
      obj['payment_for'] = PaymentFor.CUSTOMER_SUBSCRIPTION_AMOUNT;
    }
    this.paymentService.payViaBillPlz(obj).subscribe(result => {
      if (result.status === 200) {
        this.loader.hide();
        this.sessionService.set('payViaBillPlzTransactionId', result.data.transaction_id);
        this.manupulateBrowserHistory();
        window.open(result.data.url, '_self');
      } else {
        this.loader.hide();
        this.popup.showPopup(MessageType.ERROR, 2000, result.message, false);
      }
    });
  }

  payViaCash(job_id) {
    const obj = {
      vendor_id: this.sessionService.get("appData").vendor_details.vendor_id,
      marketplace_user_id: this.sessionService.get("config")
        .marketplace_user_id,
      user_id: (this.repaymentTransaction || this.isEditedTask) ? this.sessionService.get('repay_merchant') : this.sessionService.getString("user_id"),
      // 'description': 'Description not available',
      'payment_method': 8,
      // 'domain_name': window.location.origin,
      'access_token': this.sessionService.get('appData').vendor_details.app_access_token,
      'amount': this.NET_PAYABLE_AMOUNT,
      'job_id': job_id,
      'isEditedTask': this.isEditedTask ? 1 : undefined,
      'payment_for': this.repaymentTransaction ? PaymentFor.REPAYMENT : undefined
      // 'callback_url': environment.API_ENDPOINT,
      // 'redirect_url': location.href
    };
    if (this.paymentType == PaymentMode.FAC) {
    obj['fac_payment_flow'] = PaymentByUsing.USING_FAC;
    }
    if (this.sessionService.getByKey('app', 'payment') && this.sessionService.getByKey('app', 'payment').is_custom_order == 1) {
      const objData = {
        'amount': this.sessionService.getByKey('app', 'payment').amount,
        'plan_id': this.customerPlanId,
        'payment_method': obj.payment_method,
        'job_id': this.sessionService.getByKey('app', 'payment').job_id,
        'additionalPaymentId': this.sessionService.getByKey('app', 'payment').additionalpaymentId,
        'payment_for': 10
      };
      this.customerPlan(objData);
    }
    else {
      this.paymentService.payViaBillPlz(obj).subscribe(result => {
        if (result.status === 200) {
          this.afterCreateTaskSuccess('');

        } else {
          this.loader.hide();
          this.popup.showPopup(MessageType.ERROR, 2000, result.message, false);
        }
      });
    }
  }

  payViaPaytmLink(job_id) {
    const obj = {
      vendor_id: this.sessionService.get("appData").vendor_details.vendor_id,
      marketplace_user_id: this.sessionService.get("config")
        .marketplace_user_id,
      user_id: (this.repaymentTransaction || this.isEditedTask) ? this.sessionService.get('repay_merchant') : this.sessionService.getString("user_id"),
      'payment_method': this.paymentModes.PAYTM_LINK,
      'access_token': this.sessionService.get('appData').vendor_details.app_access_token,
      'amount': this.NET_PAYABLE_AMOUNT,
      'job_id': job_id,
      'isEditedTask': this.isEditedTask ? 1 : undefined,
      'payment_for': this.repaymentTransaction ? PaymentFor.REPAYMENT : undefined,
      'paytm_number': this.paytmLinkNumber
    };

    if (this.sessionService.getByKey('app', 'payment') && this.sessionService.getByKey('app', 'payment').is_custom_order == 1) {
      const objData = {
        'amount': this.sessionService.getByKey('app', 'payment').amount,
        'plan_id': this.customerPlanId,
        'payment_method': this.paymentModes.PAYTM_LINK,
        'job_id': this.sessionService.getByKey('app', 'payment').job_id,
        'additionalPaymentId': this.sessionService.getByKey('app', 'payment').additionalpaymentId,
        'payment_for': 10
      };
      this.customerPlan(objData);
    }
    else {
      this.paymentService.payViaBillPlz(obj).subscribe(result => {
        if (result.status === 200) {
          this.afterCreateTaskSuccess('');
        } else {
          this.loader.hide();
          this.popup.showPopup(MessageType.ERROR, 2000, result.message, false);
        }
      });
    }

  }

  /**
   *
   * additional amount payment (freelancer)
   */

  additionalCharges(obj) {
    if (this.sessionService.getByKey('app', 'payment') && this.sessionService.getByKey('app', 'payment').is_custom_order === 1) {
      this.paymentOptions.forEach((element) => {
        if (element.value == this.paymentType) {
          this.selectedPaymentMethod = element;
          this.post_payment_enable = this.selectedPaymentMethod.payment_process_type == 1 ? true : false;
          return;
        }
      })
    }
    this.loader.show();
    const config = this.sessionService.get('config');
    const appData = this.sessionService.get("appData");
    let objData = Object.assign({}, obj)
    const commonData = {
      access_token: appData.vendor_details.app_access_token,
      vendor_id: appData.vendor_details.vendor_id,
      marketplace_user_id: config.marketplace_user_id,
      job_id: obj.job_id,
      app_type: "WEB",
      additionalpaymentId: this.sessionService.getByKey('app', 'payment').additionalpaymentId
    }
    if (obj.transaction_id) {
      objData['transaction_id'] = obj.transaction_id;
    }
    if (obj.card_id) {
      objData['card_id'] = obj.card_id;
    }
    if (this.paymentType == PaymentMode.FAC) {
      objData['fac_payment_flow'] = PaymentByUsing.USING_FAC;
    }
    if (this.paymentType == PaymentMode.RAZORPAY) {
      let data = {
        'amount': this.NET_PAYABLE_AMOUNT,
        'app_access_token': this.sessionService.get('appData').vendor_details.app_access_token,
        'payment_for': this.sessionService.getByKey('app', 'payment').is_custom_order === 1 ? 10 : this.paymentfor,
        'user_id': this.loginResponse.vendor_details.user_id,
        'payment_method': PaymentMode.RAZORPAY,
        'currency': this.sessionService.get("config").payment_settings[0].code,
        'email': this.loginResponse.vendor_details.email || this.loginResponse.vendor_details.first_name,
        'name': this.loginResponse.vendor_details.first_name,
        'phone': this.loginResponse.vendor_details.phone_no
      };
      data = Object.assign(data, commonData)

      this.paymentService.getPaymentUrl(data).subscribe(response => {
        if (response.status === 200) {
          this.loader.hide();

          this.razorPayModal = true;
          this.razorPayUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(
            response.data.url + "&domain_name=" + window.location.origin
          );
        } else {
          this.loader.hide();
          this.popup.showPopup(MessageType.ERROR, 3000, response.message, false);
        }
      });
      this.post_payment_enable = true
      return;
    } else {
      let data = {
        app_version: config.app_version,
        marketplace_reference_id: config.marketplace_reference_id,
        domain_name: config.domain_name,
        reference_id: config.reference_id,
        user_id: config.user_id,
        language: config.language || "en",
        form_id: config.form_id,
        device_token: appData.vendor_details.app_access_token.device_token,
        app_access_token: appData.app_access_token,
        amount: obj.amount, // debt_amt
        payment_method: obj.payment_method, // method
        payment_for: obj.payment_for, // enum for debt is 6
        title: obj.title,
        description: obj.description
      }
      if (this.paymentType == PaymentMode.STRIPE && obj.card_id) {
        data['card_id'] = obj.card_id
      }
      data = Object.assign(data, commonData)
      this.paymentService.additionalChargesFreelancer(data).subscribe(
        (response) => {
          this.loader.hide();
          if (response.status == 200) {
            this.debtDataFromPayment = response.data;
            if (this.paymentType == PaymentMode.STRIPE && response.data.authentication_required == 1) {
              this.makePayment(response.data, response.message, true);
              return;
            }
            this.popup.showPopup('success', 2000, response.message, false);
            if (this.debtDataFromPayment && this.debtDataFromPayment.debt_amount == 0) {
              this.updateDebtAmount();
            }
            this.orderPlacedCartClear();
            this.changeRoute();
          } else {
            this.loader.hide();
            this.popup.showPopup('error', 2000, response.message, false);

          }

        }, (error) => {
          this.loader.hide();
          this.popup.showPopup('error', 2000, error.message, false);
          //  this.router.navigate(['/debtAmount']);
          console.error(error);
        });
    }
  }

  customerPlan(obj) {
    this.loader.show();
    let cust = this.sessionService.getByKey('app', 'payment') ? this.sessionService.getByKey('app', 'payment').is_custom_order : {};
    const objData = {
      'payment_method': obj.payment_method,
      'amount': obj.amount,
      'payment_for': cust === 1 ? 10 : PaymentFor.CUSTOMER_SUBSCRIPTION_AMOUNT,
      'plan_id': obj.plan_id,
      'job_id': cust === 1 ? obj.job_id : undefined,
      'additionalPaymentId': obj.additionalPaymentId
    };
    if (obj.transaction_id) {
      objData['transaction_id'] = obj.transaction_id;
    }
    if (obj.card_id) {
      objData['card_id'] = obj.card_id;
    }
    if (this.paymentType == PaymentMode.FAC) {
      objData['fac_payment_flow'] = PaymentByUsing.USING_FAC;
    }
    this.paymentService.paymentCreateCharge(objData).subscribe(
      (response) => {
        this.loader.hide();
        if (response.status == 200) {
          console.warn(response);
          this.orderPlacedCartClear();
          this.changeRoute();
        } else {
          this.loader.hide();
          this.popup.showPopup('error', 2000, response.message, false);

        }
      },
      (error) => {
        this.loader.hide();
        this.popup.showPopup('error', 2000, error.message, false);
        this.router.navigate(['/customerSubscription/subscriptionPlan']);
        console.error(error);
      })
  }

  onDebtPayment(obj) {
    this.loader.show();
    const objData = {
      'payment_method': obj.payment_method,
      'amount': obj.amount,
      'job_id': obj.job_id,
      'payment_for': PaymentFor.DEBT_AMOUNT,
    };
    if (obj.transaction_id) {
      objData['transaction_id'] = obj.transaction_id;
    }
    if (obj.card_id) {
      objData['card_id'] = obj.card_id;
    }
    if (this.paymentType == PaymentMode.FAC) {
      objData['fac_payment_flow'] = PaymentByUsing.USING_FAC;
    }
    this.paymentService.paymentCreateCharge(objData).subscribe(
      (response) => {
        this.loader.hide();
        if (response.status == 200) {
          this.debtDataFromPayment = response.data;
          if (this.paymentType == PaymentMode.STRIPE && response.data.authentication_required == 1) {
            this.makePayment(response.data, response.message, true);
            return;
          }
          this.popup.showPopup('success', 2000, response.message, false);
          if (this.debtDataFromPayment && this.debtDataFromPayment.debt_amount == 0) {
            this.updateDebtAmount();
          }
          this.orderPlacedCartClear();
          this.changeRoute();
        } else {
          this.loader.hide();
          this.popup.showPopup('error', 2000, response.message, false);

        }

      },
      (error) => {
        this.loader.hide();
        this.popup.showPopup('error', 2000, error.message, false);
        this.router.navigate(['/debtAmount']);
        console.error(error);
      });
  }

  payViaPayLater(job_id) {
    const obj = {
      vendor_id: this.sessionService.get("appData").vendor_details.vendor_id,
      marketplace_user_id: this.sessionService.get("config")
        .marketplace_user_id,
      user_id: (this.repaymentTransaction || this.isEditedTask) ? this.sessionService.get('repay_merchant') : this.sessionService.getString("user_id"),
      // 'description': 'Description not available',
      'payment_method': PaymentMode.PAY_LATER,
      // 'domain_name': window.location.origin,
      'access_token': this.sessionService.get('appData').vendor_details.app_access_token,
      'amount': this.NET_PAYABLE_AMOUNT,
      'job_id': job_id,
      'isEditedTask': this.isEditedTask ? 1 : undefined,
      'payment_for': this.repaymentTransaction ? PaymentFor.REPAYMENT : undefined
      // 'callback_url': environment.API_ENDPOINT,
      // 'redirect_url': location.href
    };
    if (this.debtAmountCheck) {
      obj['payment_for'] = PaymentFor.DEBT_AMOUNT;
    }
    if (this.sessionService.getByKey('app', 'payment') && this.sessionService.getByKey('app', 'payment').is_custom_order == 1)
      obj['payment_for'] = 10;
    this.paymentService.payViaBillPlz(obj).subscribe(result => {
      if (result.status === 200) {
        this.afterCreateTaskSuccess('');
      } else {
        this.loader.hide();
        this.popup.showPopup(MessageType.ERROR, 2000, result.message, false);
      }
    });
  }


  payViaWallet(job_id) {
    const obj = {
      vendor_id: this.sessionService.get("appData").vendor_details.vendor_id,
      marketplace_user_id: this.sessionService.get("config")
        .marketplace_user_id,
      user_id: (this.repaymentTransaction || this.isEditedTask) ? this.sessionService.get('repay_merchant') : this.sessionService.getString("user_id"),
      // 'description': 'Description not available',
      'payment_method': PaymentMode.WALLET,
      // 'domain_name': window.location.origin,
      'access_token': this.sessionService.get('appData').vendor_details.app_access_token,
      'amount': this.NET_PAYABLE_AMOUNT,
      'job_id': job_id,
      'payment_for': this.repaymentTransaction ? PaymentFor.REPAYMENT : undefined
      // 'callback_url': environment.API_ENDPOINT,
      // 'redirect_url': location.href
    };
    if(this.isSourceCustom && this.appConfig.onboarding_business_type === OnboardingBusinessType.LAUNDRY && this.sessionService.getByKey('app', 'payment') && this.sessionService.getByKey('app', 'payment').remaining_balance && this.sessionService.getByKey('app', 'payment').remaining_balance > 0){
      obj['isEditedTask'] = 1;
     }
    if (this.debtAmountCheck) {
      const objData = {
        'payment_method': obj.payment_method,
        'amount': obj.amount,
        'job_id': obj.job_id,
        'payment_for': PaymentFor.DEBT_AMOUNT,
      }
      this.onDebtPayment(objData);
    } else if (this.customerPlanId) {
      const objData = {
        'payment_method': obj.payment_method,
        'amount': obj.amount,
        'plan_id': this.customerPlanId,
        'payment_for': PaymentFor.CUSTOMER_SUBSCRIPTION_AMOUNT,
      }
      this.customerPlan(objData);
    }
    else if (this.sessionService.getByKey('app', 'payment') && this.sessionService.getByKey('app', 'payment').is_custom_order == 1) {
      const objData = {
        'amount': this.sessionService.getByKey('app', 'payment').amount,
        'plan_id': this.customerPlanId,
        'payment_method': obj.payment_method,
        'job_id': this.sessionService.getByKey('app', 'payment').job_id,
        'additionalPaymentId': this.sessionService.getByKey('app', 'payment').additionalpaymentId,
        'payment_for': 10
      };
      this.customerPlan(objData);
    }
    else {
      this.paymentService.payViaBillPlz(obj).subscribe(result => {
        if (result.status === 200) {
          this.afterCreateTaskSuccess('');
        } else {
          this.loader.hide();
          this.popup.showPopup(MessageType.ERROR, 2000, result.message, false);
        }
      });
    }

  }

  payViaCard(job_id, paymentType) {
    const obj = {
      vendor_id: this.sessionService.get("appData").vendor_details.vendor_id,
      marketplace_user_id: this.sessionService.get("config")
        .marketplace_user_id,
      user_id: (this.repaymentTransaction || this.isEditedTask) ? this.sessionService.get('repay_merchant') : this.sessionService.getString("user_id"),
      // 'description': 'Description not available',
      'payment_method': paymentType,
      // 'domain_name': window.location.origin,
      'access_token': this.sessionService.get('appData').vendor_details.app_access_token,

      'amount': this.NET_PAYABLE_AMOUNT,
      'job_id': job_id,
      'card_id': this.selectedCardId,
      'isEditedTask': this.isEditedTask ? 1 : undefined,
      'payment_for': this.repaymentTransaction ? PaymentFor.REPAYMENT : undefined
      // 'callback_url': environment.API_ENDPOINT,
      // 'redirect_url': location.href
    };
    if (paymentType == PaymentMode.FAC) {
    obj['fac_payment_flow'] = PaymentByUsing.USING_FAC;
    }
    if (this.debtAmountCheck) {
      const objData = {
        'payment_method': obj.payment_method,
        'amount': obj.amount,
        'job_id': obj.job_id,
        'payment_for': PaymentFor.DEBT_AMOUNT,
        'card_id': obj.card_id
      }
      this.onDebtPayment(objData);
    } else if (this.customerPlanId) {
      const objData = {
        'payment_method': obj.payment_method,
        'amount': obj.amount,
        'plan_id': this.customerPlanId,
        'payment_for': PaymentFor.CUSTOMER_SUBSCRIPTION_AMOUNT,
        'card_id': obj.card_id
      }
      this.customerPlan(objData);
    }
    else if (this.sessionService.getByKey('app', 'payment') && this.sessionService.getByKey('app', 'payment').is_custom_order == 1) {
      const objData = {
        'amount': this.sessionService.getByKey('app', 'payment').amount,
        'plan_id': this.customerPlanId,
        'payment_method': obj.payment_method,
        'card_id': obj.card_id,
        'job_id':this.sessionService.getByKey('app', 'payment').job_id,
        'additionalPaymentId': this.sessionService.getByKey('app', 'payment').additionalpaymentId,
        'payment_for': 10
      };
      this.customerPlan(objData);
    }
    else {
      this.paymentService.payViaStripe(obj).subscribe(result => {
        if (result.status === 200) {
          this.afterCreateTaskSuccess(result.data);
        }
        else {
          this.loader.hide();
          this.popup.showPopup(MessageType.ERROR, 2000, result.message, false);
        }
      },
        error => {
          console.error(error);
        });
    }

  }

  payViaPaytm(job_id, payment_method) {
    const obj = {
      vendor_id: this.sessionService.get("appData").vendor_details.vendor_id,
      marketplace_user_id: this.sessionService.get("config")
        .marketplace_user_id,
      user_id: (this.repaymentTransaction || this.isEditedTask) ? this.sessionService.get('repay_merchant') : this.sessionService.getString("user_id"),
      'payment_method': payment_method,
      'access_token': this.sessionService.get('appData').vendor_details.app_access_token,
      'amount': this.NET_PAYABLE_AMOUNT,
      'job_id': job_id,
      'isEditedTask': this.isEditedTask ? 1 : undefined,
      'payment_for': this.repaymentTransaction ? PaymentFor.REPAYMENT : undefined
    };
    if (this.debtAmountCheck) {
      const objData = {
        'payment_method': obj.payment_method,
        'amount': obj.amount,
        'job_id': obj.job_id,
        'payment_for': PaymentFor.DEBT_AMOUNT,
      }
      this.onDebtPayment(objData);
    } else if (this.customerPlanId) {
      const objData = {
        'amount': this.sessionService.getByKey('app', 'payment').amount,
        'plan_id': this.customerPlanId,
        'payment_method': obj.payment_method,
        'payment_for': PaymentFor.CUSTOMER_SUBSCRIPTION_AMOUNT
      };
      this.customerPlan(objData);
    }
    else if (this.sessionService.getByKey('app', 'payment') && this.sessionService.getByKey('app', 'payment').is_custom_order == 1) {
      const objData = {
        'amount': this.sessionService.getByKey('app', 'payment').amount,
        'plan_id': this.customerPlanId,
        'payment_method': obj.payment_method,
        'job_id': this.sessionService.getByKey('app', 'payment').job_id,
        'additionalPaymentId': this.sessionService.getByKey('app', 'payment').additionalpaymentId,
        'payment_for': 10
      };
      this.customerPlan(objData);
    }
    else {
      this.paymentService.payViaBillPlz(obj).subscribe(result => {
        if (result.status === 200) {
          this.afterCreateTaskSuccess('');
        } else {
          this.loader.hide();
          this.popup.showPopup(MessageType.ERROR, 2000, result.message, false);
        }
      });
    }

  }

  openpayViaBillPlz() {
    this.billPlzModal = true;
    this.billPlzForm = this.fb.group({
      billPlzMsgInput: ["", Validators.min(3)]
    });
  }
  /**
   * OPEN ADD MONEY DIALOG FOR PAYTM
   */
  addPaytmMoney(URL) {
    this.paytmAddMoneyPopup = true;
    this.paytmAddMoneylink = this.domSanitizer.bypassSecurityTrustResourceUrl(
      this.addPaytmMoneyUrl
    );
  }

  hidePaytmMoneyPopup() {
    this.paytmAddMoneyPopup = false;
  }
  getContentPaytmMoney(event) {
    let frame = window.frames;
  }

  // getFacPaymentUrl(job_id){
  //   this.loader.show();
  //   const obj = {
  //     'vendor_id': this.sessionService.get('appData').vendor_details.vendor_id,
  //     'marketplace_user_id': this.sessionService.get('config').marketplace_user_id,
  //     'user_id': this.sessionService.getString('user_id'),
  //     'domain_name': window.location.origin,
  //     'access_token': this.sessionService.get('appData').vendor_details.app_access_token,
  //     'amount': this.NET_PAYABLE_AMOUNT,
  //     'app_type': 'WEB',
  //     'job_id': job_id,
  //   };
  //   this.paymentService.getFacPaymentUrl(obj).subscribe(result => {

  //     if (result.status === 200) {
  //       // this.manupulateBrowserHistory();
  //       // window.open(result.data.paymentUrl, '_self');
  //       this.facBool = true;
  //       this.facPaymentUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(result.data.paymentUrl);
  //       this.loader.hide();
  //     } else {
  //       this.loader.hide();
  //       this.popup.showPopup('error', 2000, result.message, false);
  //     }
  //   }, error => {
  //     console.log('error', error);
  //     this.loader.hide();
  //     this.popup.showPopup('error', 2000, error.message, false);
  //   });

  // }


  /**
   * function combine if after success steps normal flow
   */
  afterCreateTaskSuccess(jobResponse,isDebt?) {
    let payArray = [PaymentMode.LIME_LIGHT,PaymentMode.TWO_CHECKOUT,PaymentMode.CHECKOUT_COM, PaymentMode.VIVA,PaymentMode.PAYHERE, PaymentMode.AZUL, PaymentMode.CREDIMAX,PaymentMode.HYPERPAY, PaymentMode.MY_FATOORAH, PaymentMode.THETELLER, PaymentMode.PAYNET, PaymentMode.CURLEC, PaymentMode.TAP, PaymentMode.WIPAY,PaymentMode.PAGAR, PaymentMode.WHOOSH,PaymentMode.MTN, PaymentMode.WECHAT,PaymentMode.ONEPAY,PaymentMode.PAGOPLUX, PaymentMode.MYBILLPAYMENT, PaymentMode.VALITOR, PaymentMode.TRUEVO, PaymentMode.PAYZEN, PaymentMode.FIRSTDATA, PaymentMode.BANKOPEN, PaymentMode.SQUARE, PaymentMode.ETISALAT, PaymentMode.SUNCASH, PaymentMode.GOCARDLESS, PaymentMode.ATH, PaymentMode.IPAY88, PaymentMode.PROXYPAY, PaymentMode.CYBERSOURCE, PaymentMode.ALFALAH, PaymentMode.CULQI, PaymentMode.NMI, PaymentMode.FLUTTERWAVE, PaymentMode.MPESA, PaymentMode.ADYEN, PaymentMode.PAYMARK, PaymentMode.HYPUR, PaymentMode.PAYTMV3, PaymentMode.PIXELPAY, PaymentMode.DOKU, PaymentMode.PEACH, PaymentMode.PAGUELOFACIL, PaymentMode.NOQOODY, PaymentMode.GTBANK, PaymentMode.URWAY, PaymentMode.VUKA, PaymentMode.VPOS, PaymentMode.CXPAY, PaymentMode.PAYKU, PaymentMode.BAMBORA, PaymentMode.PAYWAYONE, PaymentMode.PLACETOPAY];

    if(payArray.includes(this.paymentMethod) && isDebt) {
      return;
    }
    let msg = '';
    if (this.repaymentTransaction && this.paymentMethod != PaymentMode.PAYTM_LINK) {
      msg = 'Payment Successful.';
    } else if (this.paymentType == 128 && this.selectedPaymentMethod && this.selectedPaymentMethod.payment_process_type === 2) {
      msg = 'Payment Successful.';
    }
    else if (this.repaymentTransaction && this.paymentMethod == PaymentMode.PAYTM_LINK) {
      msg = this.languageStrings.payment_link_has_been_sent_successfully || 'Payment link has been sent successfully.';
    }
    else if (this.recurringEnabled) {
      msg = this.languageStrings.subscription_created_successfully || 'Subscription created successfully.';
    } else {
      const data = {
        currency: this.currency.code,
        value: this.NET_PAYABLE_AMOUNT
      };
      const adData = {
        currency: this.currency.code,
        value: this.NET_PAYABLE_AMOUNT,
        url: window.location.href,
        id: jobResponse ? jobResponse.job_id : '',
        type: 'CONVERSION'
      };
      this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.order_created_success, 'Order Created Success', '', Math.round(this.NET_PAYABLE_AMOUNT));
      this.fbPixelService.emitEvent('Purchase', data);
      this.googleAdWordsService.loadParticularScript(adData);
      (this.languageStrings.order_placed_msg = this.languageStrings.order_placed_msg || 'Your order has been placed.')
      .replace('ORDER_ORDER', this.terminology.ORDER);
      if ((this.appConfig.is_debt_enabled && this.debtAmountCheck) || (this.appConfig.is_customer_subscription_enabled && this.customerPlanId)) {
        msg = 'Payment Successful.';
      } else {
        msg = this.terminology.ORDER_PLACED || this.languageStrings.order_placed_msg || 'Your order has been placed.';
      }
    }
    this.orderPlacedCartClear();
    if (this.paymentType == PaymentMode.STRIPE && ((jobResponse.authentication_required == 1) || (jobResponse.data && jobResponse.data.authentication_required == 1))) {
      if (jobResponse.authentication_required) {
        this.makePayment(jobResponse, msg);
      }
      else {
        this.makePayment(jobResponse.data, msg);
      }
    }
    else {
      this.popup.showPopup(MessageType.SUCCESS, 3000, msg, false);
      this.changeRoute();
    }
  }

  makePayment(data, msg?, isDebtFlow?) {

    this.loader.show();

    this.stripe.handleCardPayment(
      data.client_secret,
      {
        payment_method: data.payment_method || data.card_token,
      }
    ).then((result) => {
      if (result.error) {
        // this.stripePaymentAuthorize = "initial";
        this.loader.hide();
        if (isDebtFlow) {
          if (this.debtDataFromPayment && this.debtDataFromPayment.debt_amount == 0) {
            this.updateDebtAmount();
          }
          this.orderPlacedCartClear();
        }
        if (!isDebtFlow) {
          msg = this.languageStrings.order_placed_but_transaction_failed_msg = (this.languageStrings.order_placed_but_transaction_failed_msg || 'Order has been placed but transaction has failed.'
          .replace('ORDER_ORDER', this.terminology.ORDER) || 'Order has been placed but transaction has failed.');
        } else {
          msg = 'Transaction Failed.'
        }
        this.changeRoute();
        this.popup.showPopup(MessageType.SUCCESS, 3000, msg, false);
      } else {
        this.loader.hide();
        this.popup.showPopup(MessageType.SUCCESS, 3000, msg, false);
        this.changeRoute();
        // The payment has succeeded. Display a success message.
      }
    });
  }
  /**
   * order placed and cart clear
   */
  orderPlacedCartClear() {
    localStorage.removeItem('tipVal');
    this.messageService.clearCartOnly();
    this.sessionService.removeByChildKey('app', 'cart');
    this.sessionService.removeByChildKey('app', 'category');
    this.sessionService.removeByChildKey('app', 'checkout');
    this.sessionService.removeByChildKey('app', 'payment');
    this.sessionService.removeByChildKey('app', 'customize');
    this.sessionService.removeByChildKey('app', 'cartProduct');
    this.sessionService.removeByChildKey('app', 'checkout_template');
    this.sessionService.remove('sellerArray');
    this.sessionService.remove('tip');
    this.sessionService.remove('laundryCheckoutSteps');
    this.sessionService.remove('laundryCheckoutData');
    this.sessionService.remove('customOrderFlow');
    this.sessionService.remove('noProductStoreData');
    this.sessionService.remove('editedOrderPayment');
    this.sessionService.remove('merchantPaymentMethods');
    this.sessionService.remove('freelancerCheckout');
    this.sessionService.remove('userDebtData');
    this.sessionService.remove('skipDebt');
    this.sessionService.remove('customerPlanSkipped');
    this.sessionService.remove('customerPlanData');
    this.sessionService.remove('repay_merchant');
    this.sessionService.remove('selected_agent');
    if (this.orderType == 'subscription') {
      this.sessionService.remove('orderType');
      this.sessionService.removeByChildKey('app', 'recurrenceData');
    }
    this.cartService.cartClearCall();
    if(this.sessionService.get('config').bumbl_domain_name && !this.sessionService.isPlatformServer())
    {
      (<any>window).mt('send', 'pageview', {email: this.sessionService.get('appData').vendor_details.email, itemincart : false});
    }
  }

  /**
   * change route when payment not done
   */
  changeRoute() {
    setTimeout(() => {
      this.loader.hide();
      if (this.debtDataFromPayment && this.debtDataFromPayment.debt_amount > 0) {
        let prevAmountObj = this.sessionService.get('appData');
        prevAmountObj.vendor_details.debt_amount = this.debtDataFromPayment.debt_amount;
        this.sessionService.set('appData', prevAmountObj);
        this.router.navigate(['/debtAmount']);
        return;
      }
      if ((this.sessionService.get('config').business_model_type === 'ECOM') &&
        (this.sessionService.get('config').nlevel_enabled === 2)) {
        this.router.navigate(['ecom/categories']);
      }
      else if ((this.sessionService.get('config').business_model_type === 'FREELANCER')) {
        this.router.navigate(['/']);
      }
      else {
        if (this.customerPlanId) {
          this.sessionService.get('appData').vendor_details.is_customer_subscription_plan_expired = 0;
        }
        if (this.sessionService.get('config').is_landing_page_enabled) {
          this.router.navigate(['']);
        } else {
          this.router.navigate(['list']);
        }

      }
    }, 1000);
  }

  /**
   * change route when payment not done with payment status
   */
  changeRouteWithParams() {
    const config = this.sessionService.get('config');
    const payment_params = {
      payment_status: 0
    };
    if (this.repaymentTransaction) {
      payment_params['repayment'] = 1
    }
    setTimeout(() => {
      this.loader.hide();
      this.orderPlacedCartClear();
      if (config.business_model_type === 'ECOM' &&
        config.nlevel_enabled === 2) {
        this.router.navigate(['ecom/categories'], { queryParams: payment_params });
      }
      else if (config.business_model_type === 'FREELANCER') {
        this.router.navigate(['/'], { queryParams: payment_params });
      }
      else {
        this.router.navigate(['list'], { queryParams: payment_params });
      }
    }, 200);
  }

  /**
   * manupulate bowser history for failed payment
   */
  manupulateBrowserHistory() {
    let domain = window.location.hostname;
    let url = ''
    if ((this.sessionService.get('config').business_model_type === 'ECOM') &&
      (this.sessionService.get('config').nlevel_enabled === 2)) {
      url = 'ecom/categories';
    }
    else {
      url = 'list';
    }

    if (
      domain === "localhost" ||
      domain === "dev-webapp.yelo.red" ||
      domain === "beta-webapp.yelo.red" ||
      domain === "127.0.0.1" ||
      domain === "dev.yelo.red"
    ) {
      history.replaceState('', '', location.origin + '/' + url + '?payment_status=0' + (this.repaymentTransaction ? '&repayment=1' : ''));
    } else {
      history.replaceState('', '', location.origin + '/' + this.languageSelected + '/' + url + '?payment_status=0' + (this.repaymentTransaction ? '&repayment=1' : ''));
    }
  }

  /**
   * apply loyalty points event
   */

  applyLoyaltyPoints(event) {
    this.appliedLoyaltyPointsTemp = event.points;
    this.getPaymentInfo(this.perTaskCost, -1, this.promoReferralData);
    this.loyatyApplied = true;
  }

  /**
   * validate order data before start payment
   * @param data order data
   */

  validateOrderDataBeforePayment(data): Promise<boolean> {
    if (this.appConfig.business_model_type === 'FREELANCER') return Promise.resolve(true);

    data['perform_validation'] = 1;
    const orderData = JSON.parse(JSON.stringify(data));
    if (orderData.delivery_surge) {
      delete orderData['delivery_surge'];
    }
    if (orderData.latitude) {
      delete orderData["latitude"];
    }
    if (orderData.longitude) {
      delete orderData["longitude"];
    }
    if(orderData.custom_pickup_address){
        orderData.custom_pickup_address = undefined;
        orderData.custom_pickup_longitude = undefined;
        orderData.custom_pickup_latitude = undefined;
        orderData.custom_pickup_name =undefined;
        orderData.custom_pickup_email=undefined;
        orderData.custom_pickup_phone=undefined;
    }
    return new Promise((resolve, reject) => {
      this.loader.show();
      this.paymentService.validateOrderData(orderData).subscribe(response => {
        if (response.status === 200) {
          this.loader.hide();
          resolve(true);
        }
        else {
          let payArray = [PaymentMode.LIME_LIGHT, PaymentMode.TWO_CHECKOUT, PaymentMode.CHECKOUT_COM, PaymentMode.PAYHERE, PaymentMode.AZUL, PaymentMode.CREDIMAX, PaymentMode.MY_FATOORAH, PaymentMode.THETELLER, PaymentMode.PAYNET, PaymentMode.CURLEC, PaymentMode.TAP, PaymentMode.WIPAY, PaymentMode.PAGAR, PaymentMode.WHOOSH, PaymentMode.PAYU, PaymentMode.PAY_MOB, PaymentMode.SSL_COMMERZ, PaymentMode.PAYNOW, PaymentMode.FAC_3D, PaymentMode.MTN, PaymentMode.WECHAT,PaymentMode.ONEPAY,PaymentMode.PAGOPLUX, PaymentMode.MYBILLPAYMENT, PaymentMode.VALITOR, PaymentMode.TRUEVO, PaymentMode.PAYZEN, PaymentMode.FIRSTDATA, PaymentMode.BANKOPEN, PaymentMode.SQUARE, PaymentMode.ETISALAT, PaymentMode.SUNCASH, PaymentMode.GOCARDLESS, PaymentMode.ATH, PaymentMode.IPAY88, PaymentMode.PROXYPAY, PaymentMode.CYBERSOURCE, PaymentMode.ALFALAH, PaymentMode.CULQI, PaymentMode.NMI, PaymentMode.FLUTTERWAVE, PaymentMode.MPESA, PaymentMode.ADYEN, PaymentMode.PAYMARK, PaymentMode.HYPUR, PaymentMode.PAYTMV3, PaymentMode.PIXELPAY, PaymentMode.DOKU, PaymentMode.PEACH, PaymentMode.PAGUELOFACIL, PaymentMode.NOQOODY, PaymentMode.GTBANK, PaymentMode.URWAY, PaymentMode.VUKA, PaymentMode.VPOS, PaymentMode.CXPAY, PaymentMode.PAYKU, PaymentMode.BAMBORA, PaymentMode.PAYWAYONE, PaymentMode.PLACETOPAY];

          if (payArray.includes(+this.paymentMethod) && this.sessionService.paymentWinRef) {
            this.sessionService.paymentWinRef.close();
          }

          this.loader.hide();
          if (response.data && response.data.unavailable_products && response.data.unavailable_products.length > 0) {
            this.show_unavailable_products = true;
            this.unavailable_products = response.data.unavailable_products;
          }
          else
            this.popup.showPopup(MessageType.ERROR, 3000, response.message, false);
        }
      });
    })
  }

  customDetailEvent(data) {
    this.paymentResponse(data.detail.detail);
  }
  /**
   * Payment response after response from iframe
   */

  paymentResponse(response) {
    switch (+response.payment_method) {
      case PaymentMode.VIVA:
        this.loader.show();
        if (response && response.status == 'success') {
          this.vivaModal = false;
          if (this.debtAmountCheck) {
            this.loader.show();
            const objData = {
              'transaction_id': response.transaction_id,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'job_id': this.sessionService.getByKey('app', 'payment').order_id,
              'payment_method': response.payment_method,
              'payment_for': PaymentFor.DEBT_AMOUNT,
            };
            this.onDebtPayment(objData);
          }
          if (this.customerPlanId) {
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'plan_id': this.customerPlanId,
              'payment_method': response.payment_method,
              'payment_for': PaymentFor.CUSTOMER_SUBSCRIPTION_AMOUNT
            };
            this.customerPlan(objData);
          }
          if (this.sessionService.getByKey('app', 'payment') && this.sessionService.getByKey('app', 'payment').is_custom_order == 1 && this.selectedPaymentMethod.payment_process_type != 2) {
            let trans_id;
            if (response.transactionId)
              trans_id = response.transactionId
            if (response.transaction_id)
              trans_id = response.transaction_id
            const objData = {
              'transaction_id': trans_id,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'plan_id': this.customerPlanId,
              'payment_method': response.payment_method,
              'job_id': this.sessionService.getByKey('app', 'payment').job_id,
              'additionalPaymentId': this.sessionService.getByKey('app', 'payment').additionalpaymentId,
              'payment_for': 10
            };
            this.customerPlan(objData);
          }
          if (this.post_payment_enable) {
            this.afterCreateTaskSuccess('');
          } else {
            this.transactionIdviva = response.transactionId
            this.taskViaPayment();
          }
        }
        else {
          this.hideVivaPopup();
        }
        break;
      case PaymentMode.PAYPAL:
        this.loader.show();
        if (response.status == 'success') {

          this.paypalModal = false;
          if (this.debtAmountCheck) {
            this.loader.show();
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'job_id': this.sessionService.getByKey('app', 'payment').order_id,
              'payment_method': response.payment_method,
              'payment_for': PaymentFor.DEBT_AMOUNT,
            };
            this.onDebtPayment(objData);
          }
          if (this.customerPlanId) {
            const objData = {
              'transaction_id': response.transaction_id,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'plan_id': this.customerPlanId,
              'payment_method': response.payment_method,
              'payment_for': PaymentFor.CUSTOMER_SUBSCRIPTION_AMOUNT
            };
            this.customerPlan(objData);
          }
          if (this.sessionService.getByKey('app', 'payment') && this.sessionService.getByKey('app', 'payment').is_custom_order == 1) {
            let trans_id;
            if (response.transactionId)
              trans_id = response.transactionId
            if (response.transaction_id)
              trans_id = response.transaction_id
            const objData = {
              'transaction_id': trans_id,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'plan_id': this.customerPlanId,
              'payment_method': response.payment_method,
              'job_id': this.sessionService.getByKey('app', 'payment').job_id,
              'additionalPaymentId': this.sessionService.getByKey('app', 'payment').additionalpaymentId,
              'payment_for': 10
            };
            this.customerPlan(objData);
          }
          if (this.post_payment_enable) {
            this.afterCreateTaskSuccess('');
          }
          else {
            this.transactionIdPaypal = response.transaction_id;
            this.taskViaPayment();
          }
        }
        else {
          this.loader.hide();
          this.hidePaypalPopup();
        }
        break;
        // ----------------
        case PaymentMode.TELR:
          // debugger
          this.loader.show();
          if (response.status == 'success') {
  
            this.telrModal = false;
            if (this.debtAmountCheck) {
              this.loader.show();
              const objData = {
                'transaction_id': response.transactionId,
                'amount': this.sessionService.getByKey('app', 'payment').amount,
                'job_id': this.sessionService.getByKey('app', 'payment').order_id,
                'payment_method': response.payment_method,
                'payment_for': PaymentFor.DEBT_AMOUNT,
              };
              this.onDebtPayment(objData);
            }
            if (this.customerPlanId) {
              const objData = {
                'transaction_id': response.transaction_id,
                'amount': this.sessionService.getByKey('app', 'payment').amount,
                'plan_id': this.customerPlanId,
                'payment_method': response.payment_method,
                'payment_for': PaymentFor.CUSTOMER_SUBSCRIPTION_AMOUNT
              };
              this.customerPlan(objData);
            }
            if (this.sessionService.getByKey('app', 'payment') && this.sessionService.getByKey('app', 'payment').is_custom_order == 1) {
              let trans_id;
              if (response.transactionId)
                trans_id = response.transactionId
              if (response.transaction_id)
                trans_id = response.transaction_id
              const objData = {
                'transaction_id': trans_id,
                'amount': this.sessionService.getByKey('app', 'payment').amount,
                'plan_id': this.customerPlanId,
                'payment_method': response.payment_method,
                'job_id': this.sessionService.getByKey('app', 'payment').job_id,
                'additionalPaymentId': this.sessionService.getByKey('app', 'payment').additionalpaymentId,
                'payment_for': 10
              };
              this.customerPlan(objData);
            }
            if (this.post_payment_enable) {
              this.afterCreateTaskSuccess('');
            }
            else {
              this.transactionIdTelr = response.transaction_id;
              this.taskViaPayment();
            }
          }
          else {
            this.loader.hide();
            this.hideTelrPopup();
          }
          break;
        // ------------

      case PaymentMode.INNSTAPAY:
        this.loader.show();
        if (response.status == 'success') {
          this.innstapayModal = false;
          if (this.debtAmountCheck) {
            this.loader.show();
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'job_id': this.sessionService.getByKey('app', 'payment').order_id,
              'payment_method': response.payment_method,
              'payment_for': PaymentFor.DEBT_AMOUNT,
            };
            this.onDebtPayment(objData);
          }
          if (this.customerPlanId) {
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'plan_id': this.customerPlanId,
              'payment_method': response.payment_method,
              'payment_for': PaymentFor.CUSTOMER_SUBSCRIPTION_AMOUNT
            };
            this.customerPlan(objData);
          }
          if (this.sessionService.getByKey('app', 'payment') && this.sessionService.getByKey('app', 'payment').is_custom_order == 1 && this.selectedPaymentMethod.payment_process_type != 2) {
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'plan_id': this.customerPlanId,
              'payment_method': response.payment_method,
              'job_id': this.sessionService.getByKey('app', 'payment').job_id,
              'additionalPaymentId': this.sessionService.getByKey('app', 'payment').additionalpaymentId,
              'payment_for': 10
            };
            this.customerPlan(objData);
          }
          if (this.post_payment_enable) {
            this.afterCreateTaskSuccess('');
          } else {
            this.transactionIdInnstapay = response.transactionId
            this.taskViaPayment();

          }
        }
        else {
          this.hideInnstapayPopup();
        }
        break;
      case PaymentMode.PAYFAST:

        this.loader.show();
        if (response.status == 'success') {
          this.payFastModal = false;
          if (this.debtAmountCheck) {
            this.loader.show();
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'job_id': this.sessionService.getByKey('app', 'payment').order_id,
              'payment_method': response.payment_method,
              'payment_for': PaymentFor.DEBT_AMOUNT,
            };
            this.onDebtPayment(objData);
          }
          if (this.customerPlanId) {
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'plan_id': this.customerPlanId,
              'payment_method': response.payment_method,
              'payment_for': PaymentFor.CUSTOMER_SUBSCRIPTION_AMOUNT
            };
            this.customerPlan(objData);
          }
          if (this.sessionService.getByKey('app', 'payment') && this.sessionService.getByKey('app', 'payment').is_custom_order == 1 && this.selectedPaymentMethod.payment_process_type != 2) {
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'plan_id': this.customerPlanId,
              'payment_method': response.payment_method,
              'job_id': this.sessionService.getByKey('app', 'payment').job_id,
              'additionalPaymentId': this.sessionService.getByKey('app', 'payment').additionalpaymentId,
              'payment_for': 10
            };
            this.customerPlan(objData);
          }
          if (this.post_payment_enable) {
            this.afterCreateTaskSuccess('');
          }
          else {
            this.transactionIdPayFast = response.transactionId;
            this.taskViaPayment();

          }

        }
        else {
          this.hidePayFastPopup();
        }
        break;
      case PaymentMode.PAYU:

        this.loader.show();
        if (response && response.status == 'success') {
          this.payuModal = false;
          if (this.debtAmountCheck) {
            this.loader.show();
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'job_id': this.sessionService.getByKey('app', 'payment').order_id,
              'payment_method': response.payment_method,
              'payment_for': PaymentFor.DEBT_AMOUNT,
            };
            this.onDebtPayment(objData);
          }
          if (this.customerPlanId) {
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'plan_id': this.customerPlanId,
              'payment_method': response.payment_method,
              'payment_for': PaymentFor.CUSTOMER_SUBSCRIPTION_AMOUNT
            };
            this.customerPlan(objData);
          }
          if (this.sessionService.getByKey('app', 'payment') && this.sessionService.getByKey('app', 'payment').is_custom_order == 1 && this.selectedPaymentMethod.payment_process_type != 2) {
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'plan_id': this.customerPlanId,
              'payment_method': response.payment_method,
              'job_id': this.sessionService.getByKey('app', 'payment').job_id,
              'additionalPaymentId': this.sessionService.getByKey('app', 'payment').additionalpaymentId,
              'payment_for': 10
            };
            this.customerPlan(objData);
          }
          if (this.post_payment_enable) {
            this.afterCreateTaskSuccess('');
          } else {
            this.transactionIdPayu = response.transactionId
            this.taskViaPayment();
          }
        }
        else {
          this.hidePayuPopup();
        }
        break;
      case PaymentMode.AUTHORIZE_NET:

        if (response && response.status == 'add_card_success') {
          this.authorizeNetModal = false;
          this.getCards(PaymentMode.AUTHORIZE_NET);
          this.popup.showPopup(MessageType.SUCCESS, 2000, this.languageStrings.card_successfully_added || "Card successfully added", false);
        }
        else {
          this.popup.showPopup(MessageType.ERROR, 2000, this.languageStrings.unable_to_add_card || "Unable to add card", false);
          this.authorizeNetModal = false;
        }
        break;
      /**to remove */
      case PaymentMode.VISTA:
        if (response && response.status == 'add_card_success') {
          this.vistaModal = false;
          this.getCards(PaymentMode.VISTA);
          this.popup.showPopup(MessageType.SUCCESS, 2000, this.languageStrings.card_successfully_added || "Card successfully added" , false);
        }
        else {
          this.popup.showPopup(MessageType.ERROR, 2000, this.languageStrings.unable_to_add_card || "Unable to add card", false);
          this.vistaModal = false;
        }
        break;
      case PaymentMode.FAC:

        if (response && response.status == 'add_card_success') {
          this.facModal = false;
          this.getCards(PaymentMode.FAC);
          this.popup.showPopup(MessageType.SUCCESS, 2000, this.languageStrings.card_successfully_added || "Card successfully added", false);
        }
        else {
          this.popup.showPopup(MessageType.ERROR, 2000, this.languageStrings.unable_to_add_card || "Unable to add card", false);
          this.facModal = false;
        }
        break;
      case PaymentMode.PAY_MOB:

        this.loader.show();
        if (response && response.status == 'success') {
          this.payMobModal = false;
          if (this.debtAmountCheck) {
            this.loader.show();
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'job_id': this.sessionService.getByKey('app', 'payment').order_id,
              'payment_method': response.payment_method,
              'payment_for': PaymentFor.DEBT_AMOUNT,
            };
            this.onDebtPayment(objData);
          }
          if (this.customerPlanId) {
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'plan_id': this.customerPlanId,
              'payment_method': response.payment_method,
              'payment_for': PaymentFor.CUSTOMER_SUBSCRIPTION_AMOUNT
            };
            this.customerPlan(objData);
          }
          if (this.sessionService.getByKey('app', 'payment') && this.sessionService.getByKey('app', 'payment').is_custom_order == 1 && this.selectedPaymentMethod.payment_process_type != 2) {
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'plan_id': this.customerPlanId,
              'payment_method': response.payment_method,
              'job_id': this.sessionService.getByKey('app', 'payment').job_id,
              'additionalPaymentId': this.sessionService.getByKey('app', 'payment').additionalpaymentId,
              'payment_for': 10
            };
            this.customerPlan(objData);
          }
          if (this.post_payment_enable) {
            this.afterCreateTaskSuccess('');
          } else {
            this.transactionIdPayMob = response.transactionId
            this.taskViaPayment();
          }
        }
        else {
          this.hidePayMobPopup();
        }
        break;
      // case PaymentMode.WIRE_CARD:

      //   this.loader.show();
      //   if (response && response.status == 'success') {
      //     this.wirecardModal = false;
      //     if (this.debtAmountCheck) {
      //       this.loader.show();
      //       const objData = {
      //         'transaction_id': response.transactionId,
      //         'amount': this.sessionService.getByKey('app', 'payment').amount,
      //         'job_id': this.sessionService.getByKey('app', 'payment').order_id,
      //         'payment_method': response.payment_method,
      //         'payment_for': PaymentFor.DEBT_AMOUNT,
      //       };
      //       this.onDebtPayment(objData);
      //     }
      //     if (this.post_payment_enable) {
      //       this.afterCreateTaskSuccess('');
      //     } else {
      //       this.transactionIdWirecard = response.transactionId
      //       this.taskViaPayment();
      //     }
      //   }
      //   else {
      //     this.hideWirecardPopup();
      // }
      // break;
      case PaymentMode.SSL_COMMERZ:

        this.loader.show();
        if (response && response.status == 'success') {
          this.sslCommerzModal = false;
          if (this.debtAmountCheck) {
            this.loader.show();
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'job_id': this.sessionService.getByKey('app', 'payment').order_id,
              'payment_method': response.payment_method,
              'payment_for': PaymentFor.DEBT_AMOUNT,
            };
            this.onDebtPayment(objData);
          }
          if (this.customerPlanId) {
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'plan_id': this.customerPlanId,
              'payment_method': response.payment_method,
              'payment_for': PaymentFor.CUSTOMER_SUBSCRIPTION_AMOUNT
            };
            this.customerPlan(objData);
          }
          if (this.sessionService.getByKey('app', 'payment') && this.sessionService.getByKey('app', 'payment').is_custom_order == 1 && this.selectedPaymentMethod.payment_process_type != 2) {
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'plan_id': this.customerPlanId,
              'payment_method': response.payment_method,
              'job_id': this.sessionService.getByKey('app', 'payment').job_id,
              'additionalPaymentId': this.sessionService.getByKey('app', 'payment').additionalpaymentId,
              'payment_for': 10
            };
            this.customerPlan(objData);
          }
          if (this.post_payment_enable) {
            this.afterCreateTaskSuccess('');
          } else {
            this.transactionIdSslCommerz = response.transactionId
            this.taskViaPayment();
          }
        }
        else {
          this.hideSslCommerzPopup();
        }
        break;
      case PaymentMode.FAC_3D:
        this.loader.show();
        if (response && response.status == 'add_card_success') {
          this.fac3dModal = false;
          if (this.debtAmountCheck) {
            this.loader.show();
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'job_id': this.sessionService.getByKey('app', 'payment').order_id,
              'payment_method': response.payment_method,
              'payment_for': PaymentFor.DEBT_AMOUNT,
            };
            this.onDebtPayment(objData);
          }
          if (this.customerPlanId) {
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'plan_id': this.customerPlanId,
              'payment_method': response.payment_method,
              'payment_for': PaymentFor.CUSTOMER_SUBSCRIPTION_AMOUNT
            };
            this.customerPlan(objData);
          }
          if (this.sessionService.getByKey('app', 'payment') && this.sessionService.getByKey('app', 'payment').is_custom_order == 1 && this.selectedPaymentMethod.payment_process_type != 2) {
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'plan_id': this.customerPlanId,
              'payment_method': response.payment_method,
              'job_id': this.sessionService.getByKey('app', 'payment').job_id,
              'additionalPaymentId': this.sessionService.getByKey('app', 'payment').additionalpaymentId,
              'payment_for': 10
            };
            this.customerPlan(objData);
          }
          if (this.post_payment_enable) {
            this.afterCreateTaskSuccess('');
          } else {
            this.transactionIdFAC3D = response.transactionId
            this.taskViaPayment();
          }
        }
        else {
          this.hideFAC3dPopup();
        }
        break;
      case PaymentMode.CHECKOUT_COM:
        this.loader.show();
        if (response && response.status == 'success') {
          this.checkoutComModal = false;
          if (this.debtAmountCheck) {
            this.loader.show();
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'job_id': this.sessionService.getByKey('app', 'payment').order_id,
              'payment_method': response.payment_method,
              'payment_for': PaymentFor.DEBT_AMOUNT,
            };
            this.onDebtPayment(objData);
          }
          if (this.customerPlanId) {
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'plan_id': this.customerPlanId,
              'payment_method': response.payment_method,
              'payment_for': PaymentFor.CUSTOMER_SUBSCRIPTION_AMOUNT
            };
            this.customerPlan(objData);
          }
          if (this.sessionService.getByKey('app', 'payment') && this.sessionService.getByKey('app', 'payment').is_custom_order == 1 && this.selectedPaymentMethod.payment_process_type != 2) {
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'plan_id': this.customerPlanId,
              'payment_method': response.payment_method,
              'job_id': this.sessionService.getByKey('app', 'payment').job_id,
              'additionalPaymentId': this.sessionService.getByKey('app', 'payment').additionalpaymentId,
              'payment_for': 10
            };
            this.customerPlan(objData);
          }
          if (this.post_payment_enable) {
            this.afterCreateTaskSuccess('');
          } else {
            this.transactionIdCheckoutCom = response.transactionId
            this.taskViaPayment();
          }
        }
        else {
          this.hideCheckoutComPopup();
        }
        break;
      case PaymentMode.PAYHERE:
        this.loader.show();
        if (response && response.status == 'success') {
          this.payHereModal = false;
          if (this.debtAmountCheck) {
            this.loader.show();
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'job_id': this.sessionService.getByKey('app', 'payment').order_id,
              'payment_method': response.payment_method,
              'payment_for': PaymentFor.DEBT_AMOUNT,
            };
            this.onDebtPayment(objData);
          }
          if (this.customerPlanId) {
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'plan_id': this.customerPlanId,
              'payment_method': response.payment_method,
              'payment_for': PaymentFor.CUSTOMER_SUBSCRIPTION_AMOUNT
            };
            this.customerPlan(objData);
          }
          if (this.sessionService.getByKey('app', 'payment') && this.sessionService.getByKey('app', 'payment').is_custom_order == 1 && this.selectedPaymentMethod.payment_process_type != 2) {
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'plan_id': this.customerPlanId,
              'payment_method': response.payment_method,
              'job_id': this.sessionService.getByKey('app', 'payment').job_id,
              'additionalPaymentId': this.sessionService.getByKey('app', 'payment').additionalpaymentId,
              'payment_for': 10
            };
            this.customerPlan(objData);
          }
          if (this.post_payment_enable) {
            this.afterCreateTaskSuccess('');
          } else {
            this.transactionIdPayHere = response.transactionId
            this.taskViaPayment();
          }
        }
        else {
          this.hidePayHerePopup();
        }
        break;
      case PaymentMode.AZUL:

        this.loader.show();
        if (response && response.status == 'success') {
          this.azulModal = false;
          if (this.debtAmountCheck) {
            this.loader.show();
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'job_id': this.sessionService.getByKey('app', 'payment').order_id,
              'payment_method': response.payment_method,
              'payment_for': PaymentFor.DEBT_AMOUNT,
            };
            this.onDebtPayment(objData);
          }
          if (this.customerPlanId) {
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'plan_id': this.customerPlanId,
              'payment_method': response.payment_method,
              'payment_for': PaymentFor.CUSTOMER_SUBSCRIPTION_AMOUNT
            };
            this.customerPlan(objData);
          }
          if (this.sessionService.getByKey('app', 'payment') && this.sessionService.getByKey('app', 'payment').is_custom_order == 1 && this.selectedPaymentMethod.payment_process_type != 2) {
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'plan_id': this.customerPlanId,
              'payment_method': response.payment_method,
              'job_id': this.sessionService.getByKey('app', 'payment').job_id,
              'additionalPaymentId': this.sessionService.getByKey('app', 'payment').additionalpaymentId,
              'payment_for': 10
            };
            this.customerPlan(objData);
          }
          if (this.selectedPaymentMethod.payment_process_type == 1) {
            this.afterCreateTaskSuccess('');
          } else {
            this.transactionIdAzul = response.transactionId
            this.taskViaPayment();
          }
        }
        else {
          this.hideAzulPopup();
        }
        break;
      case PaymentMode.HYPERPAY:
        this.loader.show();
        if (response && response.status == 'success') {
          this.hyperPayModal = false;
          if (this.debtAmountCheck) {
            this.loader.show();
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'job_id': this.sessionService.getByKey('app', 'payment').order_id,
              'payment_method': response.payment_method,
              'payment_for': PaymentFor.DEBT_AMOUNT,
            };
            this.onDebtPayment(objData);
          }
          if (this.customerPlanId) {
            this.loader.show();
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'payment_method': response.payment_method,
              'payment_for': PaymentFor.CUSTOMER_SUBSCRIPTION_AMOUNT,
            };
            this.customerPlan(objData);
          }
          if (this.sessionService.getByKey('app', 'payment') && this.sessionService.getByKey('app', 'payment').is_custom_order == 1 && this.selectedPaymentMethod.payment_process_type != 2) {
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'plan_id': this.customerPlanId,
              'payment_method': response.payment_method,
              'job_id': this.sessionService.getByKey('app', 'payment').job_id,
              'additionalPaymentId': this.sessionService.getByKey('app', 'payment').additionalpaymentId,
              'payment_for': 10
            };
            this.customerPlan(objData);
          }
          if (this.selectedPaymentMethod.payment_process_type == 1) {
            this.afterCreateTaskSuccess('');
          } else {
            this.transactionIdHyperPay = response.transactionId
            this.taskViaPayment();
          }
        }
        else {
          this.hideHyperpayPopup();
        }
        break;
      case PaymentMode.CREDIMAX:
        this.loader.show();
        if (response && response.status == 'success') {
          this.credimaxModal = false;
          if (this.debtAmountCheck) {
            this.loader.show();
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'job_id': this.sessionService.getByKey('app', 'payment').order_id,
              'payment_method': response.payment_method,
              'payment_for': PaymentFor.DEBT_AMOUNT,
            };
            this.onDebtPayment(objData);
          }
          if (this.sessionService.getByKey('app', 'payment') && this.sessionService.getByKey('app', 'payment').is_custom_order == 1 && this.selectedPaymentMethod.payment_process_type != 2) {
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'plan_id': this.customerPlanId,
              'payment_method': response.payment_method,
              'job_id': this.sessionService.getByKey('app', 'payment').job_id,
              'additionalPaymentId': this.sessionService.getByKey('app', 'payment').additionalpaymentId,
              'payment_for': 10
            };
            this.customerPlan(objData);
          }
          if (this.selectedPaymentMethod.payment_process_type == 1) {
            this.afterCreateTaskSuccess('');
          } else {
            this.transactionIdCredimax = response.transactionId
            this.taskViaPayment();
          }
        }
        else {
          this.hideCredimaxPopup();
        }
        break;
      case PaymentMode.MY_FATOORAH:
        this.loader.show();
        if (response && response.status == 'success') {
          this.fatoorahModal = false;
          if (this.debtAmountCheck) {
            this.loader.show();
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'job_id': this.sessionService.getByKey('app', 'payment').order_id,
              'payment_method': response.payment_method,
              'payment_for': PaymentFor.DEBT_AMOUNT,
            };
            this.onDebtPayment(objData);
          }
          if (this.customerPlanId) {
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'plan_id': this.customerPlanId,
              'payment_method': response.payment_method,
              'payment_for': PaymentFor.CUSTOMER_SUBSCRIPTION_AMOUNT
            };
            this.customerPlan(objData);
          }
          if (this.sessionService.getByKey('app', 'payment') && this.sessionService.getByKey('app', 'payment').is_custom_order == 1 && this.selectedPaymentMethod.payment_process_type != 2) {
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'plan_id': this.customerPlanId,
              'payment_method': response.payment_method,
              'job_id': this.sessionService.getByKey('app', 'payment').job_id,
              'additionalPaymentId': this.sessionService.getByKey('app', 'payment').additionalpaymentId,
              'payment_for': 10
            };
            this.customerPlan(objData);
          }
          if (this.selectedPaymentMethod.payment_process_type == 1) {
            this.afterCreateTaskSuccess('');
          } else {
            this.transactionIdFatoorah = response.transactionId
            this.taskViaPayment();
          }
        }
        else {
          this.hideFatoorahPopup();
        }
        break;
      case PaymentMode.PAYNET:
        this.loader.show();
        if (response && response.status == 'success') {
          this.paynetModal = false;
          if (this.debtAmountCheck) {
            this.loader.show();
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'job_id': this.sessionService.getByKey('app', 'payment').order_id,
              'payment_method': response.payment_method,
              'payment_for': PaymentFor.DEBT_AMOUNT,
            };
            this.onDebtPayment(objData);
          }
          if (this.customerPlanId) {
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'plan_id': this.customerPlanId,
              'payment_method': response.payment_method,
              'payment_for': PaymentFor.CUSTOMER_SUBSCRIPTION_AMOUNT
            };
            this.customerPlan(objData);
          }
          if (this.sessionService.getByKey('app', 'payment') && this.sessionService.getByKey('app', 'payment').is_custom_order == 1 && this.selectedPaymentMethod.payment_process_type != 2) {
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'plan_id': this.customerPlanId,
              'payment_method': response.payment_method,
              'job_id': this.sessionService.getByKey('app', 'payment').job_id,
              'additionalPaymentId': this.sessionService.getByKey('app', 'payment').additionalpaymentId,
              'payment_for': 10
            };
            this.customerPlan(objData);
          }
          if (this.selectedPaymentMethod.payment_process_type == 1) {
            this.afterCreateTaskSuccess('');
          } else {
            this.transactionIdPaynet = response.transactionId
            this.taskViaPayment();
          }
        }
        else {
          this.hidePaynetPopup();
        }
        break;
      case PaymentMode.TAP:
        this.loader.show();
        if (response && response.status == 'success') {
          this.tapModal = false;
          if (this.debtAmountCheck) {
            this.loader.show();
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'job_id': this.sessionService.getByKey('app', 'payment').order_id,
              'payment_method': response.payment_method,
              'payment_for': PaymentFor.DEBT_AMOUNT,
            };
            this.onDebtPayment(objData);
          }
          if (this.customerPlanId) {
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'plan_id': this.customerPlanId,
              'payment_method': response.payment_method,
              'payment_for': PaymentFor.CUSTOMER_SUBSCRIPTION_AMOUNT
            };
            this.customerPlan(objData);
          }
          if (this.sessionService.getByKey('app', 'payment') && this.sessionService.getByKey('app', 'payment').is_custom_order == 1 && this.selectedPaymentMethod.payment_process_type != 2) {
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'plan_id': this.customerPlanId,
              'payment_method': response.payment_method,
              'job_id': this.sessionService.getByKey('app', 'payment').job_id,
              'additionalPaymentId': this.sessionService.getByKey('app', 'payment').additionalpaymentId,
              'payment_for': 10
            };
            this.customerPlan(objData);
          }
          if (this.selectedPaymentMethod.payment_process_type == 1) {
            this.afterCreateTaskSuccess('');
          } else {
            this.transactionIdTap = response.transactionId
            this.taskViaPayment();
          }
        }
        else {
          this.hideTapPopup();
        }
        break;
      case PaymentMode.CURLEC:
        this.loader.show();
        if (response && response.status == 'success') {
          this.curlecModal = false;
          if (this.debtAmountCheck) {
            this.loader.show();
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'job_id': this.sessionService.getByKey('app', 'payment').order_id,
              'payment_method': response.payment_method,
              'payment_for': PaymentFor.DEBT_AMOUNT,
            };
            this.onDebtPayment(objData);
          }
          if (this.customerPlanId) {
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'plan_id': this.customerPlanId,
              'payment_method': response.payment_method,
              'payment_for': PaymentFor.CUSTOMER_SUBSCRIPTION_AMOUNT
            };
            this.customerPlan(objData);
          }
          if (this.sessionService.getByKey('app', 'payment') && this.sessionService.getByKey('app', 'payment').is_custom_order == 1 && this.selectedPaymentMethod.payment_process_type != 2) {
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'plan_id': this.customerPlanId,
              'payment_method': response.payment_method,
              'job_id': this.sessionService.getByKey('app', 'payment').job_id,
              'additionalPaymentId': this.sessionService.getByKey('app', 'payment').additionalpaymentId,
              'payment_for': 10
            };
            this.customerPlan(objData);
          }
          if (this.selectedPaymentMethod.payment_process_type == 1) {
            this.afterCreateTaskSuccess('');
          } else {
            this.transactionIdCurlec = response.transactionId
            this.taskViaPayment();
          }
        }
        else {
          this.hideCurlecPopup();
        }
        break;
      case PaymentMode.WIPAY:
        this.loader.show();
        if (response && response.status == 'success') {
          this.wipayModal = false;
          if (this.debtAmountCheck) {
            this.loader.show();
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'job_id': this.sessionService.getByKey('app', 'payment').order_id,
              'payment_method': response.payment_method,
              'payment_for': PaymentFor.DEBT_AMOUNT,
            };
            this.onDebtPayment(objData);
          }
          if (this.customerPlanId) {
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'plan_id': this.customerPlanId,
              'payment_method': response.payment_method,
              'payment_for': PaymentFor.CUSTOMER_SUBSCRIPTION_AMOUNT
            };
            this.customerPlan(objData);
          }
          if (this.sessionService.getByKey('app', 'payment') && this.sessionService.getByKey('app', 'payment').is_custom_order == 1 && this.selectedPaymentMethod.payment_process_type != 2) {
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'plan_id': this.customerPlanId,
              'payment_method': response.payment_method,
              'job_id': this.sessionService.getByKey('app', 'payment').job_id,
              'additionalPaymentId': this.sessionService.getByKey('app', 'payment').additionalpaymentId,
              'payment_for': 10
            };
            this.customerPlan(objData);
          }
          if (this.selectedPaymentMethod.payment_process_type == 1) {
            this.afterCreateTaskSuccess('');
          } else {
            this.transactionIdWipay = response.transactionId
            this.taskViaPayment();
          }
        }
        else {
          this.hideWipayPopup();
        }
        break;
      case PaymentMode.PAGAR:
        this.loader.show();
        if (response && response.status == 'success') {
          this.pagarModal = false;
          if (this.debtAmountCheck) {
            this.loader.show();
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'job_id': this.sessionService.getByKey('app', 'payment').order_id,
              'payment_method': response.payment_method,
              'payment_for': PaymentFor.DEBT_AMOUNT,
            };
            this.onDebtPayment(objData);
          }
          if (this.customerPlanId) {
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'plan_id': this.customerPlanId,
              'payment_method': response.payment_method,
              'payment_for': PaymentFor.CUSTOMER_SUBSCRIPTION_AMOUNT
            };
            this.customerPlan(objData);
          }
          if (this.sessionService.getByKey('app', 'payment') && this.sessionService.getByKey('app', 'payment').is_custom_order == 1 && this.selectedPaymentMethod.payment_process_type != 2) {
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'plan_id': this.customerPlanId,
              'payment_method': response.payment_method,
              'job_id': this.sessionService.getByKey('app', 'payment').job_id,
              'additionalPaymentId': this.sessionService.getByKey('app', 'payment').additionalpaymentId,
              'payment_for': 10
            };
            this.customerPlan(objData);
          }
          if (this.selectedPaymentMethod.payment_process_type == 1) {
            this.afterCreateTaskSuccess('');
          } else {
            this.transactionIdPagar = response.transactionId
            this.taskViaPayment();
          }
        }
        else {
          this.hidePagarPopup();
        }
        break;
      case PaymentMode.WECHAT:
        this.loader.show();
        if (response && response.status == 'success') {
          this.wechatModal = false;
          if (this.debtAmountCheck) {
            this.loader.show();
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'job_id': this.sessionService.getByKey('app', 'payment').order_id,
              'payment_method': response.payment_method,
              'payment_for': PaymentFor.DEBT_AMOUNT,
            };
            this.onDebtPayment(objData);
          }
          if (this.customerPlanId) {
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'plan_id': this.customerPlanId,
              'payment_method': response.payment_method,
              'payment_for': PaymentFor.CUSTOMER_SUBSCRIPTION_AMOUNT
            };
            this.customerPlan(objData);
          }
          if (this.sessionService.getByKey('app', 'payment') && this.sessionService.getByKey('app', 'payment').is_custom_order == 1 && this.selectedPaymentMethod.payment_process_type != 2) {
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'plan_id': this.customerPlanId,
              'payment_method': response.payment_method,
              'job_id': this.sessionService.getByKey('app', 'payment').job_id,
              'additionalPaymentId': this.sessionService.getByKey('app', 'payment').additionalpaymentId,
              'payment_for': 10
            };
            this.customerPlan(objData);
          }
          if (this.selectedPaymentMethod.payment_process_type == 1) {
            this.afterCreateTaskSuccess('');
          } else {
            this.transactionIdWechat = response.transactionId
            this.taskViaPayment();
          }
        }
        else {
          this.hideWechatPopup();
        }
        break;
      case PaymentMode.MYBILLPAYMENT:
        this.loader.show();
        if (response && response.status == 'success') {
          this.mybillpaymentModal = false;
          if (this.debtAmountCheck) {
            this.loader.show();
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'job_id': this.sessionService.getByKey('app', 'payment').order_id,
              'payment_method': response.payment_method,
              'payment_for': PaymentFor.DEBT_AMOUNT,
            };
            this.onDebtPayment(objData);
          }
          if (this.customerPlanId) {
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'plan_id': this.customerPlanId,
              'payment_method': response.payment_method,
              'payment_for': PaymentFor.CUSTOMER_SUBSCRIPTION_AMOUNT
            };
            this.customerPlan(objData);
          }
          if (this.sessionService.getByKey('app', 'payment') && this.sessionService.getByKey('app', 'payment').is_custom_order == 1 && this.selectedPaymentMethod.payment_process_type != 2) {
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'plan_id': this.customerPlanId,
              'payment_method': response.payment_method,
              'job_id': this.sessionService.getByKey('app', 'payment').job_id,
              'additionalPaymentId': this.sessionService.getByKey('app', 'payment').additionalpaymentId,
              'payment_for': 10
            };
            this.customerPlan(objData);
          }
          if (this.selectedPaymentMethod.payment_process_type == 1) {
            this.afterCreateTaskSuccess('');
          } else {
            this.transactionIdMybillpayment = response.transactionId
            this.taskViaPayment();
          }
        }
        else {
          this.hideMybillpaymentPopup();
        }
        break;
      case PaymentMode.VALITOR:
        this.loader.show();
        if (response && response.status == 'success') {
          this.valitorModal = false;
          if (this.debtAmountCheck) {
            this.loader.show();
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'job_id': this.sessionService.getByKey('app', 'payment').order_id,
              'payment_method': response.payment_method,
              'payment_for': PaymentFor.DEBT_AMOUNT,
            };
            this.onDebtPayment(objData);
          }
          if (this.customerPlanId) {
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'plan_id': this.customerPlanId,
              'payment_method': response.payment_method,
              'payment_for': PaymentFor.CUSTOMER_SUBSCRIPTION_AMOUNT
            };
            this.customerPlan(objData);
          }
          if (this.sessionService.getByKey('app', 'payment') && this.sessionService.getByKey('app', 'payment').is_custom_order == 1 && this.selectedPaymentMethod.payment_process_type != 2) {
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'plan_id': this.customerPlanId,
              'payment_method': response.payment_method,
              'job_id': this.sessionService.getByKey('app', 'payment').job_id,
              'additionalPaymentId': this.sessionService.getByKey('app', 'payment').additionalpaymentId,
              'payment_for': 10
            };
            this.customerPlan(objData);
          }
          if (this.selectedPaymentMethod.payment_process_type == 1) {
            this.afterCreateTaskSuccess('');
          } else {
            this.transactionIdValitor = response.transactionId
            this.taskViaPayment();
          }
        }
        else {
          this.hideValitorPopup();
        }
        break;
      case PaymentMode.TRUEVO:
        this.loader.show();
        if (response && response.status == 'success') {
          this.truevoModal = false;
          if (this.debtAmountCheck) {
            this.loader.show();
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'job_id': this.sessionService.getByKey('app', 'payment').order_id,
              'payment_method': response.payment_method,
              'payment_for': PaymentFor.DEBT_AMOUNT,
            };
            this.onDebtPayment(objData);
          }
          if (this.customerPlanId) {
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'plan_id': this.customerPlanId,
              'payment_method': response.payment_method,
              'payment_for': PaymentFor.CUSTOMER_SUBSCRIPTION_AMOUNT
            };
            this.customerPlan(objData);
          }
          if (this.sessionService.getByKey('app', 'payment') && this.sessionService.getByKey('app', 'payment').is_custom_order == 1 && this.selectedPaymentMethod.payment_process_type != 2) {
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'plan_id': this.customerPlanId,
              'payment_method': response.payment_method,
              'job_id': this.sessionService.getByKey('app', 'payment').job_id,
              'additionalPaymentId': this.sessionService.getByKey('app', 'payment').additionalpaymentId,
              'payment_for': 10
            };
            this.customerPlan(objData);
          }
          if (this.selectedPaymentMethod.payment_process_type == 1) {
            this.afterCreateTaskSuccess('');
          } else {
            this.transactionIdTruevo = response.transactionId
            this.taskViaPayment();
          }
        }
        else {
          this.hideTruevoPopup();
        }
        break;
      case PaymentMode.PAYZEN:
        this.loader.show();
        if (response && response.status == 'success') {
          this.payzenModal = false;
          if (this.debtAmountCheck) {
            this.loader.show();
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'job_id': this.sessionService.getByKey('app', 'payment').order_id,
              'payment_method': response.payment_method,
              'payment_for': PaymentFor.DEBT_AMOUNT,
            };
            this.onDebtPayment(objData);
          }
          if (this.customerPlanId) {
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'plan_id': this.customerPlanId,
              'payment_method': response.payment_method,
              'payment_for': PaymentFor.CUSTOMER_SUBSCRIPTION_AMOUNT
            };
            this.customerPlan(objData);
          }
          if (this.sessionService.getByKey('app', 'payment') && this.sessionService.getByKey('app', 'payment').is_custom_order == 1) {
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'plan_id': this.customerPlanId,
              'payment_method': response.payment_method,
              'job_id': this.sessionService.getByKey('app', 'payment').job_id,
              'additionalPaymentId': this.sessionService.getByKey('app', 'payment').additionalpaymentId,
              'payment_for': 10
            };
            this.customerPlan(objData);
          }
          if (this.selectedPaymentMethod.payment_process_type == 1) {
            this.afterCreateTaskSuccess('');
          } else {
            this.transactionIdPayzen = response.transactionId
            this.taskViaPayment();
          }
        }
        else {
          this.hidePayzenPopup();
        }
        break;
      case PaymentMode.FIRSTDATA:
        this.loader.show();
        if (response && response.status == 'success') {
          this.firstdataModal = false;
          if (this.debtAmountCheck) {
            this.loader.show();
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'job_id': this.sessionService.getByKey('app', 'payment').order_id,
              'payment_method': response.payment_method,
              'payment_for': PaymentFor.DEBT_AMOUNT,
            };
            this.onDebtPayment(objData);
          }
          if (this.customerPlanId) {
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'plan_id': this.customerPlanId,
              'payment_method': response.payment_method,
              'payment_for': PaymentFor.CUSTOMER_SUBSCRIPTION_AMOUNT
            };
            this.customerPlan(objData);
          }
          if (this.sessionService.getByKey('app', 'payment') && this.sessionService.getByKey('app', 'payment').is_custom_order == 1 && this.selectedPaymentMethod.payment_process_type != 2) {
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'plan_id': this.customerPlanId,
              'payment_method': response.payment_method,
              'job_id': this.sessionService.getByKey('app', 'payment').job_id,
              'additionalPaymentId': this.sessionService.getByKey('app', 'payment').additionalpaymentId,
              'payment_for': 10
            };
            this.customerPlan(objData);
          }
          if (this.selectedPaymentMethod.payment_process_type == 1) {
            this.afterCreateTaskSuccess('');
          } else {
            this.transactionIdFirstdata = response.transactionId
            this.taskViaPayment();
          }
        }
        else {
          this.hideFirstDataPopup();
        }
        break;
      case PaymentMode.SQUARE:
        this.loader.show();
        if (response && response.status == 'success') {
          this.squareModal = false;
          if (this.debtAmountCheck) {
            this.loader.show();
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'job_id': this.sessionService.getByKey('app', 'payment').order_id,
              'payment_method': response.payment_method,
              'payment_for': PaymentFor.DEBT_AMOUNT,
            };
            this.onDebtPayment(objData);
          }
          if (this.customerPlanId) {
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'plan_id': this.customerPlanId,
              'payment_method': response.payment_method,
              'payment_for': PaymentFor.CUSTOMER_SUBSCRIPTION_AMOUNT
            };
            this.customerPlan(objData);
          }
          if (this.sessionService.getByKey('app', 'payment') && this.sessionService.getByKey('app', 'payment').is_custom_order == 1 && this.selectedPaymentMethod.payment_process_type != 2) {
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'plan_id': this.customerPlanId,
              'payment_method': response.payment_method,
              'job_id': this.sessionService.getByKey('app', 'payment').job_id,
              'additionalPaymentId': this.sessionService.getByKey('app', 'payment').additionalpaymentId,
              'payment_for': 10
            };
            this.customerPlan(objData);
          }
          if (this.selectedPaymentMethod.payment_process_type == 1) {
            this.afterCreateTaskSuccess('');
          } else {
            this.transactionIdSquare = response.transactionId
            this.taskViaPayment();
          }
        }
        else {
          this.hideSquarePopup();
        }
        break;
      case PaymentMode.WHOOSH:
        this.loader.show();
        if (response && response.status == 'success') {
          this.whooshModal = false;
          if (this.debtAmountCheck) {
            this.loader.show();
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'job_id': this.sessionService.getByKey('app', 'payment').order_id,
              'payment_method': response.payment_method,
              'payment_for': PaymentFor.DEBT_AMOUNT,
            };
            this.onDebtPayment(objData);
          }
          if (this.customerPlanId) {
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'plan_id': this.customerPlanId,
              'payment_method': response.payment_method,
              'payment_for': PaymentFor.CUSTOMER_SUBSCRIPTION_AMOUNT
            };
            this.customerPlan(objData);
          }
          if (this.sessionService.getByKey('app', 'payment') && this.sessionService.getByKey('app', 'payment').is_custom_order == 1 && this.selectedPaymentMethod.payment_process_type != 2) {
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'plan_id': this.customerPlanId,
              'payment_method': response.payment_method,
              'job_id': this.sessionService.getByKey('app', 'payment').job_id,
              'additionalPaymentId': this.sessionService.getByKey('app', 'payment').additionalpaymentId,
              'payment_for': 10
            };
            this.customerPlan(objData);
          }
          if (this.selectedPaymentMethod.payment_process_type == 1) {
            this.afterCreateTaskSuccess('');
          } else {
            this.transactionIdWhoosh = response.transactionId
            this.taskViaPayment();
          }
        }
        else {
          this.hideWhooshPopup();
        }
        break;
      case PaymentMode.MTN:
        this.loader.show();
        if (response && response.status == 'success') {
          this.mtnModal = false;
          if (this.debtAmountCheck) {
            this.loader.show();
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'job_id': this.sessionService.getByKey('app', 'payment').order_id,
              'payment_method': response.payment_method,
              'payment_for': PaymentFor.DEBT_AMOUNT,
            };
            this.onDebtPayment(objData);
          }
          if (this.customerPlanId) {
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'plan_id': this.customerPlanId,
              'payment_method': response.payment_method,
              'payment_for': PaymentFor.CUSTOMER_SUBSCRIPTION_AMOUNT
            };
            this.customerPlan(objData);
          }
          if (this.sessionService.getByKey('app', 'payment') && this.sessionService.getByKey('app', 'payment').is_custom_order == 1 && this.selectedPaymentMethod.payment_process_type != 2) {
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'plan_id': this.customerPlanId,
              'payment_method': response.payment_method,
              'job_id': this.sessionService.getByKey('app', 'payment').job_id,
              'additionalPaymentId': this.sessionService.getByKey('app', 'payment').additionalpaymentId,
              'payment_for': 10
            };
            this.customerPlan(objData);
          }
          if (this.selectedPaymentMethod.payment_process_type == 1) {
            this.afterCreateTaskSuccess('');
          } else {
            this.transactionIdMtn = response.transactionId
            this.taskViaPayment();
          }
        }
        else {
          this.hideMtnPopup();
        }
        break;
      case PaymentMode.ONEPAY:
        this.loader.show();
        if (response && response.status == 'success') {
          this.onepayModal = false;
          if (this.debtAmountCheck) {
            this.loader.show();
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'job_id': this.sessionService.getByKey('app', 'payment').order_id,
              'payment_method': response.payment_method,
              'payment_for': PaymentFor.DEBT_AMOUNT,
            };
            this.onDebtPayment(objData);
          }
          if (this.customerPlanId) {
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'plan_id': this.customerPlanId,
              'payment_method': response.payment_method,
              'payment_for': PaymentFor.CUSTOMER_SUBSCRIPTION_AMOUNT
            };
            this.customerPlan(objData);
          }
          if (this.sessionService.getByKey('app', 'payment') && this.sessionService.getByKey('app', 'payment').is_custom_order == 1 && this.selectedPaymentMethod.payment_process_type != 2) {
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'plan_id': this.customerPlanId,
              'payment_method': response.payment_method,
              'job_id': this.sessionService.getByKey('app', 'payment').job_id,
              'additionalPaymentId': this.sessionService.getByKey('app', 'payment').additionalpaymentId,
              'payment_for': 10
            };
            this.customerPlan(objData);
          }
          if (this.selectedPaymentMethod.payment_process_type == 1) {
            this.afterCreateTaskSuccess('');
          } else {
            this.transactionIdOnepay = response.transactionId
            this.taskViaPayment();
          }
        }
        else {
          this.hideOnePayPopup();
        }
        break;
      case PaymentMode.PAGOPLUX:
        this.loader.show();
        if (response && response.status == 'success') {
          this.pagopluxModal = false;
          if (this.debtAmountCheck) {
            this.loader.show();
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'job_id': this.sessionService.getByKey('app', 'payment').order_id,
              'payment_method': response.payment_method,
              'payment_for': PaymentFor.DEBT_AMOUNT,
            };
            this.onDebtPayment(objData);
          }
          if (this.customerPlanId) {
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'plan_id': this.customerPlanId,
              'payment_method': response.payment_method,
              'payment_for': PaymentFor.CUSTOMER_SUBSCRIPTION_AMOUNT
            };
            this.customerPlan(objData);
          }
          if (this.sessionService.getByKey('app', 'payment') && this.sessionService.getByKey('app', 'payment').is_custom_order == 1 && this.selectedPaymentMethod.payment_process_type != 2) {
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'plan_id': this.customerPlanId,
              'payment_method': response.payment_method,
              'job_id': this.sessionService.getByKey('app', 'payment').job_id,
              'additionalPaymentId': this.sessionService.getByKey('app', 'payment').additionalpaymentId,
              'payment_for': 10
            };
            this.customerPlan(objData);
          }
          if (this.selectedPaymentMethod.payment_process_type == 1) {
            this.afterCreateTaskSuccess('');
          } else {
            this.transactionIdPagoplux = response.transactionId
            this.taskViaPayment();
          }
        }
        else {
          this.hidePagopluxPopup();
        }
        break;
      case PaymentMode.STRIPE_IDEAL:
        this.loader.show();
        if (response.status == 'success') {
          this.stripeIdealModal = false;
          if (this.debtAmountCheck) {
            this.loader.show();
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'job_id': this.sessionService.getByKey('app', 'payment').order_id,
              'payment_method': response.payment_method,
              'payment_for': PaymentFor.DEBT_AMOUNT,
            };
            this.onDebtPayment(objData);
          }
          if (this.customerPlanId) {
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'plan_id': this.customerPlanId,
              'payment_method': response.payment_method,
              'payment_for': PaymentFor.CUSTOMER_SUBSCRIPTION_AMOUNT
            };
            this.customerPlan(objData);
          }
          if (this.sessionService.getByKey('app', 'payment') && this.sessionService.getByKey('app', 'payment').is_custom_order == 1 && this.selectedPaymentMethod.payment_process_type != 2) {
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'plan_id': this.customerPlanId,
              'payment_method': response.payment_method,
              'job_id': this.sessionService.getByKey('app', 'payment').job_id,
              'additionalPaymentId': this.sessionService.getByKey('app', 'payment').additionalpaymentId,
              'payment_for': 10
            };
            this.customerPlan(objData);
          }
          if (this.post_payment_enable) {
            this.afterCreateTaskSuccess('');
          } else {
            this.transactionIdStripeIdeal = response.transactionId;
            this.taskViaPayment();
          }
        } else {
          this.hideStripeIdealPopup();
        }
        break;
      case PaymentMode.BANKOPEN:
        this.loader.show();
        if (response && response.status == 'success') {
          this.bankOpenModal = false;
          if (this.debtAmountCheck) {
            this.loader.show();
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'job_id': this.sessionService.getByKey('app', 'payment').order_id,
              'payment_method': response.payment_method,
              'payment_for': PaymentFor.DEBT_AMOUNT,
            };
            this.onDebtPayment(objData);
          }
          if (this.customerPlanId) {
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'plan_id': this.customerPlanId,
              'payment_method': response.payment_method,
              'payment_for': PaymentFor.CUSTOMER_SUBSCRIPTION_AMOUNT
            };
            this.customerPlan(objData);
          }
          if (this.sessionService.getByKey('app', 'payment') && this.sessionService.getByKey('app', 'payment').is_custom_order == 1 && this.selectedPaymentMethod.payment_process_type != 2) {
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'plan_id': this.customerPlanId,
              'payment_method': response.payment_method,
              'job_id': this.sessionService.getByKey('app', 'payment').job_id,
              'additionalPaymentId': this.sessionService.getByKey('app', 'payment').additionalpaymentId,
              'payment_for': 10
            };
            this.customerPlan(objData);
          }
          if (this.selectedPaymentMethod.payment_process_type == 1) {
            this.afterCreateTaskSuccess('');
          } else {
            this.transactionIdBankOpen = response.transactionId
            this.taskViaPayment();
          }
        }
        else {
          this.hidePaymentPopup(this.bankOpenModal, this.transactionIdBankOpen);
        }
        break;
      case PaymentMode.MPAISA:
        this.loader.show();
        if (response.status == 'success') {
          this.mpaisaModal = false;
          if (this.debtAmountCheck) {
            this.loader.show();
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'job_id': this.sessionService.getByKey('app', 'payment').order_id,
              'payment_method': response.payment_method,
              'payment_for': PaymentFor.DEBT_AMOUNT,
            };
            this.onDebtPayment(objData);
          }
          if (this.customerPlanId) {
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'plan_id': this.customerPlanId,
              'payment_method': response.payment_method,
              'payment_for': PaymentFor.CUSTOMER_SUBSCRIPTION_AMOUNT
            };
            this.customerPlan(objData);
          }
          if (this.sessionService.getByKey('app', 'payment') && this.sessionService.getByKey('app', 'payment').is_custom_order == 1 && this.selectedPaymentMethod.payment_process_type != 2) {
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'plan_id': this.customerPlanId,
              'payment_method': response.payment_method,
              'job_id': this.sessionService.getByKey('app', 'payment').job_id,
              'additionalPaymentId': this.sessionService.getByKey('app', 'payment').additionalpaymentId,
              'payment_for': 10
            };
            this.customerPlan(objData);
          }
          if (this.post_payment_enable) {
            this.afterCreateTaskSuccess('');
          } else {
            this.transactionIdMPaisa = response.transactionId;
            this.taskViaPayment();
          }
        }
        else {
          this.hideMPaisaPopup();
        }
        break;
      case PaymentMode.PAYSTACK:
        this.loader.show();
        if (response.status == 'success') {

          this.paystackModal = false;
          if (this.debtAmountCheck) {
            this.loader.show();
            const objData = {
              'transaction_id': response.transaction_id,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'job_id': this.sessionService.getByKey('app', 'payment').order_id,
              'payment_method': response.payment_method,
              'payment_for': PaymentFor.DEBT_AMOUNT,
            };
            this.onDebtPayment(objData);
          }
          if (this.customerPlanId) {
            const objData = {
              'transaction_id': response.transaction_id,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'plan_id': this.customerPlanId,
              'payment_method': response.payment_method,
              'payment_for': PaymentFor.CUSTOMER_SUBSCRIPTION_AMOUNT
            };
            this.customerPlan(objData);
          }
          if (this.sessionService.getByKey('app', 'payment') && this.sessionService.getByKey('app', 'payment').is_custom_order == 1 && this.selectedPaymentMethod.payment_process_type != 2) {
            const objData = {
              'transaction_id': response.transaction_id,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'plan_id': this.customerPlanId,
              'payment_method': response.payment_method,
              'job_id': this.sessionService.getByKey('app', 'payment').job_id,
              'additionalPaymentId': this.sessionService.getByKey('app', 'payment').additionalpaymentId,
              'payment_for': 10
            };
            this.customerPlan(objData);
          }
          if (this.post_payment_enable) {
            this.afterCreateTaskSuccess('');
          }
          else {
            this.transactionIdPaystack = response.transaction_id;
            this.taskViaPayment();
          }
        }
        else {
          this.loader.hide();
          this.hidePaystackPopup();
        }
        break;
      case PaymentMode.PAYNOW:

        this.loader.show();
        if (response && response.status == 'success') {
          this.paynowModal = false;
          if (this.debtAmountCheck) {
            this.loader.show();
            const objData = {
              'transaction_id': response.transactionId ? response.transactionId : response.transaction_id,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'job_id': this.sessionService.getByKey('app', 'payment').order_id,
              'payment_method': response.payment_method,
              'payment_for': PaymentFor.DEBT_AMOUNT,
            };
            this.onDebtPayment(objData);
          }
          if (this.customerPlanId) {
            const objData = {
              'transaction_id': response.transactionId ? response.transactionId : response.transaction_id,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'plan_id': this.customerPlanId,
              'payment_method': response.payment_method,
              'payment_for': PaymentFor.CUSTOMER_SUBSCRIPTION_AMOUNT
            };
            this.customerPlan(objData);
          }
          if (this.sessionService.getByKey('app', 'payment') && this.sessionService.getByKey('app', 'payment').is_custom_order == 1 && this.selectedPaymentMethod.payment_process_type != 2) {
            const objData = {
              'transaction_id': response.transactionId ? response.transactionId : response.transaction_id,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'plan_id': this.customerPlanId,
              'payment_method': response.payment_method,
              'job_id': this.sessionService.getByKey('app', 'payment').job_id,
              'additionalPaymentId': this.sessionService.getByKey('app', 'payment').additionalpaymentId,
              'payment_for': 10
            };
            this.customerPlan(objData);
          }
          if (this.post_payment_enable) {
            this.afterCreateTaskSuccess('');
          } else {
            this.transactionIdPaynow = response.transactionId ? response.transactionId : response.transaction_id;
            this.taskViaPayment();
          }
        }
        else {
          this.hidePaynowPopup();
        }
        break;

      case PaymentMode.LIME_LIGHT:
        this.loader.show();
        let paymentForDebt;
        if (response) {
          // if (response && response.status == 'success') {
          this.showLimeLightPopup = false;
          if (this.debtAmountCheck) {
            paymentForDebt = PaymentFor.DEBT_AMOUNT;
            this.loader.show();
            const objData = {
              'transaction_id': response.transactionID,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'job_id': this.sessionService.getByKey('app', 'payment').order_id,
              'payment_method': response.payment_method,
              'payment_for': paymentForDebt,
            };
            this.onDebtPayment(objData);
          }
          if (this.customerPlanId) {
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'plan_id': this.customerPlanId,
              'payment_method': response.payment_method,
              'payment_for': PaymentFor.CUSTOMER_SUBSCRIPTION_AMOUNT
            };
            this.customerPlan(objData);
          }
          if (this.sessionService.getByKey('app', 'payment') && this.sessionService.getByKey('app', 'payment').is_custom_order == 1 && this.selectedPaymentMethod.payment_process_type != 2) {
            let trans_id;
            if (response.transactionId)
              trans_id = response.transactionId
            if (response.transactionID)
              trans_id = response.transactionID
            const objData = {
              'transaction_id': trans_id,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'plan_id': this.customerPlanId,
              'payment_method': response.payment_method,
              'job_id': this.sessionService.getByKey('app', 'payment').job_id,
              'additionalPaymentId': this.sessionService.getByKey('app', 'payment').additionalpaymentId,
              'payment_for': 10
            };
            this.customerPlan(objData);
          }
          // this.paynowModal = false;
          if (this.post_payment_enable && paymentForDebt === 6) {
            this.afterCreateTaskSuccess('', paymentForDebt);
          } else if (this.post_payment_enable) {
            this.afterCreateTaskSuccess('');
          }
          else {
            this.transactionIdLimeLight = response.transactionID;
            this.taskViaPayment();
          }
        }
        else {
          this.popup.showPopup(MessageType.ERROR, 2000, response.message, false);
          this.hideLimelightPopup();
        }
        break;

      case PaymentMode.TWO_CHECKOUT:
        this.loader.show();
        let payForDebt;
        if (response.transactionID) {
          this.showTwoCheckoutPopup = false;
          if (this.debtAmountCheck) {
            payForDebt = PaymentFor.DEBT_AMOUNT;
            this.loader.show();
            const objData = {
              'transaction_id': response.transactionID,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'job_id': this.sessionService.getByKey('app', 'payment').order_id,
              'payment_method': response.payment_method,
              'payment_for': payForDebt,
            };
            this.onDebtPayment(objData);
          }
          if (this.customerPlanId) {
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'plan_id': this.customerPlanId,
              'payment_method': response.payment_method,
              'payment_for': PaymentFor.CUSTOMER_SUBSCRIPTION_AMOUNT
            };
            this.customerPlan(objData);
          }
          if (this.sessionService.getByKey('app', 'payment') && this.sessionService.getByKey('app', 'payment').is_custom_order == 1 && this.selectedPaymentMethod.payment_process_type != 2) {
            let trans_id;
            if (response.transactionId)
              trans_id = response.transactionId
            if (response.transactionID)
              trans_id = response.transactionID
            const objData = {
              'transaction_id': trans_id,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'plan_id': this.customerPlanId,
              'payment_method': response.payment_method,
              'job_id': this.sessionService.getByKey('app', 'payment').job_id,
              'additionalPaymentId': this.sessionService.getByKey('app', 'payment').additionalpaymentId,
              'payment_for': 10
            };
            this.customerPlan(objData);
          }
          if (this.post_payment_enable && payForDebt === 6) {
            this.afterCreateTaskSuccess('', payForDebt);
          } else if (this.post_payment_enable) {
            this.afterCreateTaskSuccess('');
          }
          else {
            this.transactionIdTwoCheckout = response.transactionID;
            this.taskViaPayment();
          }
        }
        else {
          this.popup.showPopup(MessageType.ERROR, 2000, response.message, false);
          this.hideTwoCheckoutPopup();
        }
        break;

      case PaymentMode.ETISALAT:
        this.loader.show();
        if (response && response.status == 'success') {
          this.etisalatModal = false;
          if (this.debtAmountCheck) {
            this.loader.show();
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'job_id': this.sessionService.getByKey('app', 'payment').order_id,
              'payment_method': response.payment_method,
              'payment_for': PaymentFor.DEBT_AMOUNT,
            };
            this.onDebtPayment(objData);
          }
          if (this.customerPlanId) {
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'plan_id': this.customerPlanId,
              'payment_method': response.payment_method,
              'payment_for': PaymentFor.CUSTOMER_SUBSCRIPTION_AMOUNT
            };
            this.customerPlan(objData);
          }
          if (this.sessionService.getByKey('app', 'payment') && this.sessionService.getByKey('app', 'payment').is_custom_order == 1 && this.selectedPaymentMethod.payment_process_type != 2) {
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'plan_id': this.customerPlanId,
              'payment_method': response.payment_method,
              'job_id': this.sessionService.getByKey('app', 'payment').job_id,
              'additionalPaymentId': this.sessionService.getByKey('app', 'payment').additionalpaymentId,
              'payment_for': 10
            };
            this.customerPlan(objData);
          }
          if (this.selectedPaymentMethod.payment_process_type == 1) {
            this.afterCreateTaskSuccess('');
          } else {
            this.transactionIdEtisalat = response.transactionId
            this.taskViaPayment();
          }
        }
        else {
          this.hidePaymentPopup(this.etisalatModal, this.transactionIdEtisalat);
        }
        break;

      case PaymentMode.SUNCASH:
        this.loader.show();
        if (response && response.status == 'success') {
          this.suncashModal = false;
          if (this.debtAmountCheck) {
            this.loader.show();
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'job_id': this.sessionService.getByKey('app', 'payment').order_id,
              'payment_method': response.payment_method,
              'payment_for': PaymentFor.DEBT_AMOUNT,
            };
            this.onDebtPayment(objData);
          }
          if (this.customerPlanId) {
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'plan_id': this.customerPlanId,
              'payment_method': response.payment_method,
              'payment_for': PaymentFor.CUSTOMER_SUBSCRIPTION_AMOUNT
            };
            this.customerPlan(objData);
          }
          if (this.sessionService.getByKey('app', 'payment') && this.sessionService.getByKey('app', 'payment').is_custom_order == 1) {
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'plan_id': this.customerPlanId,
              'payment_method': response.payment_method,
              'job_id': this.sessionService.getByKey('app', 'payment').job_id,
              'additionalPaymentId': this.sessionService.getByKey('app', 'payment').additionalpaymentId,
              'payment_for': 10
            };
            this.customerPlan(objData);
          }
          if (this.selectedPaymentMethod.payment_process_type == 1) {
            this.afterCreateTaskSuccess('');
          } else {
            this.transactionIdSuncash = response.transactionId
            this.taskViaPayment();
          }
        }
        else {
          this.hidePaymentPopup(this.suncashModal, this.transactionIdSuncash);
        }
        break;

      case PaymentMode.THETELLER:
        this.loader.show();
        if (response && response.status == 'success') {
          this.thetellerModal = false;
          if (this.debtAmountCheck) {
            this.loader.show();
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'job_id': this.sessionService.getByKey('app', 'payment').order_id,
              'payment_method': response.payment_method,
              'payment_for': PaymentFor.DEBT_AMOUNT,
            };
            this.onDebtPayment(objData);
          }
          if (this.customerPlanId) {
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'plan_id': this.customerPlanId,
              'payment_method': response.payment_method,
              'payment_for': PaymentFor.CUSTOMER_SUBSCRIPTION_AMOUNT
            };
            this.customerPlan(objData);
          }
          if (this.sessionService.getByKey('app', 'payment') && this.sessionService.getByKey('app', 'payment').is_custom_order == 1) {
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'plan_id': this.customerPlanId,
              'payment_method': response.payment_method,
              'job_id': this.sessionService.getByKey('app', 'payment').job_id,
              'additionalPaymentId': this.sessionService.getByKey('app', 'payment').additionalpaymentId,
              'payment_for': 10
            };
            this.customerPlan(objData);
          }
          if (this.selectedPaymentMethod.payment_process_type == 1) {
            this.afterCreateTaskSuccess('');
          } else {
            this.transactionIdSuncash = response.transactionId
            this.taskViaPayment();
          }
        }
        else {
          this.hideThetellerPopup();
        }
        break;

      case PaymentMode.GOCARDLESS:
        this.loader.show();
        if (response && response.status == 'success') {
          this.gocardlessModal = false;
          if (this.debtAmountCheck) {
            this.loader.show();
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'job_id': this.sessionService.getByKey('app', 'payment').order_id,
              'payment_method': response.payment_method,
              'payment_for': PaymentFor.DEBT_AMOUNT,
            };
            this.onDebtPayment(objData);
          }
          if (this.customerPlanId) {
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'plan_id': this.customerPlanId,
              'payment_method': response.payment_method,
              'payment_for': PaymentFor.CUSTOMER_SUBSCRIPTION_AMOUNT
            };
            this.customerPlan(objData);
          }
          if (this.sessionService.getByKey('app', 'payment') && this.sessionService.getByKey('app', 'payment').is_custom_order == 1) {
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'plan_id': this.customerPlanId,
              'payment_method': response.payment_method,
              'job_id': this.sessionService.getByKey('app', 'payment').job_id,
              'additionalPaymentId': this.sessionService.getByKey('app', 'payment').additionalpaymentId,
              'payment_for': 10
            };
            this.customerPlan(objData);
          }
          if (this.selectedPaymentMethod.payment_process_type == 1) {
            this.afterCreateTaskSuccess('');
          } else {
            this.transactionIdGocardless = response.transactionId
            this.taskViaPayment();
          }
        }
        else {
          this.hidePaymentPopup(this.gocardlessModal, this.transactionIdGocardless);
        }
        break;

      case PaymentMode.ATH:
        this.loader.show();
        if (response && response.status == 'success') {
          this.athModal = false;
          if (this.debtAmountCheck) {
            this.loader.show();
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'job_id': this.sessionService.getByKey('app', 'payment').order_id,
              'payment_method': response.payment_method,
              'payment_for': PaymentFor.DEBT_AMOUNT,
            };
            this.onDebtPayment(objData);
          }
          if (this.customerPlanId) {
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'plan_id': this.customerPlanId,
              'payment_method': response.payment_method,
              'payment_for': PaymentFor.CUSTOMER_SUBSCRIPTION_AMOUNT
            };
            this.customerPlan(objData);
          }
          if (this.sessionService.getByKey('app', 'payment') && this.sessionService.getByKey('app', 'payment').is_custom_order == 1 && this.selectedPaymentMethod.payment_process_type != 2) {
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'plan_id': this.customerPlanId,
              'payment_method': response.payment_method,
              'job_id': this.sessionService.getByKey('app', 'payment').job_id,
              'additionalPaymentId': this.sessionService.getByKey('app', 'payment').additionalpaymentId,
              'payment_for': 10
            };
            this.customerPlan(objData);
          }
          if (this.selectedPaymentMethod.payment_process_type == 1) {
            this.afterCreateTaskSuccess('');
          } else {
            this.transactionIdAth = response.transactionId
            this.taskViaPayment();
          }
        }
        else {
          this.hidePaymentPopup(this.athModal, this.transactionIdAth);
        }
        break;

      case PaymentMode.IPAY88:
        this.loader.show();
        if (response && response.status == 'success') {
          this.ipayModal = false;
          if (this.debtAmountCheck) {
            this.loader.show();
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'job_id': this.sessionService.getByKey('app', 'payment').order_id,
              'payment_method': response.payment_method,
              'payment_for': PaymentFor.DEBT_AMOUNT,
            };
            this.onDebtPayment(objData);
          }
          if (this.customerPlanId) {
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'plan_id': this.customerPlanId,
              'payment_method': response.payment_method,
              'payment_for': PaymentFor.CUSTOMER_SUBSCRIPTION_AMOUNT
            };
            this.customerPlan(objData);
          }
          if (this.sessionService.getByKey('app', 'payment') && this.sessionService.getByKey('app', 'payment').is_custom_order == 1 && this.selectedPaymentMethod.payment_process_type != 2) {
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'plan_id': this.customerPlanId,
              'payment_method': response.payment_method,
              'job_id': this.sessionService.getByKey('app', 'payment').job_id,
              'additionalPaymentId': this.sessionService.getByKey('app', 'payment').additionalpaymentId,
              'payment_for': 10
            };
            this.customerPlan(objData);
          }
          if (this.selectedPaymentMethod.payment_process_type == 1) {
            this.afterCreateTaskSuccess('');
          } else {
            this.transactionIdIpay = response.transactionId
            this.taskViaPayment();
          }
        }
        else {
          this.hidePaymentPopup(this.ipayModal, this.transactionIdIpay);
        }
        break;

      case PaymentMode.PROXYPAY:
        this.loader.show();
        if (response && response.status == 'success') {
          this.proxypayModal = false;
          if (this.debtAmountCheck) {
            this.loader.show();
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'job_id': this.sessionService.getByKey('app', 'payment').order_id,
              'payment_method': response.payment_method,
              'payment_for': PaymentFor.DEBT_AMOUNT,
            };
            this.onDebtPayment(objData);
          }
          if (this.customerPlanId) {
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'plan_id': this.customerPlanId,
              'payment_method': response.payment_method,
              'payment_for': PaymentFor.CUSTOMER_SUBSCRIPTION_AMOUNT
            };
            this.customerPlan(objData);
          }
          if (this.sessionService.getByKey('app', 'payment') && this.sessionService.getByKey('app', 'payment').is_custom_order == 1 && this.selectedPaymentMethod.payment_process_type != 2) {
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'plan_id': this.customerPlanId,
              'payment_method': response.payment_method,
              'job_id': this.sessionService.getByKey('app', 'payment').job_id,
              'additionalPaymentId': this.sessionService.getByKey('app', 'payment').additionalpaymentId,
              'payment_for': 10
            };
            this.customerPlan(objData);
          }
          if (this.selectedPaymentMethod.payment_process_type == 1) {
            this.afterCreateTaskSuccess('');
          } else {
            this.transactionIdProxypay = response.transactionId
            this.taskViaPayment();
          }
        }
        else {
          this.hidePaymentPopup(this.proxypayModal, this.transactionIdProxypay);
        }
        break;

      case PaymentMode.CYBERSOURCE:
        this.loader.show();
        if (response && response.status == 'success') {
          this.cybersourceModal = false;
          if (this.debtAmountCheck) {
            this.loader.show();
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'job_id': this.sessionService.getByKey('app', 'payment').order_id,
              'payment_method': response.payment_method,
              'payment_for': PaymentFor.DEBT_AMOUNT,
            };
            this.onDebtPayment(objData);
          }
          if (this.customerPlanId) {
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'plan_id': this.customerPlanId,
              'payment_method': response.payment_method,
              'payment_for': PaymentFor.CUSTOMER_SUBSCRIPTION_AMOUNT
            };
            this.customerPlan(objData);
          }
          if (this.sessionService.getByKey('app', 'payment') && this.sessionService.getByKey('app', 'payment').is_custom_order == 1 && this.selectedPaymentMethod.payment_process_type != 2) {
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'plan_id': this.customerPlanId,
              'payment_method': response.payment_method,
              'job_id': this.sessionService.getByKey('app', 'payment').job_id,
              'additionalPaymentId': this.sessionService.getByKey('app', 'payment').additionalpaymentId,
              'payment_for': 10
            };
            this.customerPlan(objData);
          }
          if (this.selectedPaymentMethod.payment_process_type == 1) {
            this.afterCreateTaskSuccess('');
          } else {
            this.transactionIdCybersource = response.transactionId
            this.taskViaPayment();
          }
        }
        else {
          this.hidePaymentPopup(this.cybersourceModal, this.transactionIdCybersource);
        }
        break;

      case PaymentMode.ALFALAH:
        this.loader.show();
        if (response && response.status == 'success') {
          this.alfalahModal = false;
          if (this.debtAmountCheck) {
            this.loader.show();
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'job_id': this.sessionService.getByKey('app', 'payment').order_id,
              'payment_method': response.payment_method,
              'payment_for': PaymentFor.DEBT_AMOUNT,
            };
            this.onDebtPayment(objData);
          }
          if (this.customerPlanId) {
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'plan_id': this.customerPlanId,
              'payment_method': response.payment_method,
              'payment_for': PaymentFor.CUSTOMER_SUBSCRIPTION_AMOUNT
            };
            this.customerPlan(objData);
          }
          if (this.sessionService.getByKey('app', 'payment') && this.sessionService.getByKey('app', 'payment').is_custom_order == 1 && this.selectedPaymentMethod.payment_process_type != 2) {
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'plan_id': this.customerPlanId,
              'payment_method': response.payment_method,
              'job_id': this.sessionService.getByKey('app', 'payment').job_id,
              'additionalPaymentId': this.sessionService.getByKey('app', 'payment').additionalpaymentId,
              'payment_for': 10
            };
            this.customerPlan(objData);
          }
          if (this.selectedPaymentMethod.payment_process_type == 1) {
            this.afterCreateTaskSuccess('');
          } else {
            this.transactionIdAlfalah = response.transactionId
            this.taskViaPayment();
          }
        }
        else {
          this.alfalahModal = false;
          this.hidePaymentPopup(this.alfalahModal, this.transactionIdAlfalah);
        }
        break;

      case PaymentMode.CULQI:
        this.loader.show();
        if (response && response.status == 'success') {
          this.culqiModal = false;
          if (this.debtAmountCheck) {
            this.loader.show();
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'job_id': this.sessionService.getByKey('app', 'payment').order_id,
              'payment_method': response.payment_method,
              'payment_for': PaymentFor.DEBT_AMOUNT,
            };
            this.onDebtPayment(objData);
          }
          if (this.customerPlanId) {
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'plan_id': this.customerPlanId,
              'payment_method': response.payment_method,
              'payment_for': PaymentFor.CUSTOMER_SUBSCRIPTION_AMOUNT
            };
            this.customerPlan(objData);
          }
          if (this.sessionService.getByKey('app', 'payment') && this.sessionService.getByKey('app', 'payment').is_custom_order == 1 && this.selectedPaymentMethod.payment_process_type != 2) {
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'plan_id': this.customerPlanId,
              'payment_method': response.payment_method,
              'job_id': this.sessionService.getByKey('app', 'payment').job_id,
              'additionalPaymentId': this.sessionService.getByKey('app', 'payment').additionalpaymentId,
              'payment_for': 10
            };
            this.customerPlan(objData);
          }
          if (this.selectedPaymentMethod.payment_process_type == 1) {
            this.afterCreateTaskSuccess('');
          } else {
            this.transactionIdCulqi = response.transactionId
            this.taskViaPayment();
          }
        }
        else {
          this.hidePaymentPopup(this.culqiModal, this.transactionIdCulqi);
        }
        break;
      case PaymentMode.NMI:
        this.loader.show();
        if (response && response.status == 'success') {
          this.nmiModal = false;
          if (this.debtAmountCheck) {
            this.loader.show();
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'job_id': this.sessionService.getByKey('app', 'payment').order_id,
              'payment_method': response.payment_method,
              'payment_for': PaymentFor.DEBT_AMOUNT,
            };
            this.onDebtPayment(objData);
          }
          if (this.customerPlanId) {
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'plan_id': this.customerPlanId,
              'payment_method': response.payment_method,
              'payment_for': PaymentFor.CUSTOMER_SUBSCRIPTION_AMOUNT
            };
            this.customerPlan(objData);
          }
          if (this.sessionService.getByKey('app', 'payment') && this.sessionService.getByKey('app', 'payment').is_custom_order == 1 && this.selectedPaymentMethod.payment_process_type != 2) {
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'plan_id': this.customerPlanId,
              'payment_method': response.payment_method,
              'job_id': this.sessionService.getByKey('app', 'payment').job_id,
              'additionalPaymentId': this.sessionService.getByKey('app', 'payment').additionalpaymentId,
              'payment_for': 10
            };
            this.customerPlan(objData);
          }
          if (this.selectedPaymentMethod.payment_process_type == 1) {
            this.afterCreateTaskSuccess('');
          } else {
            this.transactionIdNmi = response.transactionId
            this.taskViaPayment();
          }
        }
        else {
          this.hidePaymentPopup(this.nmiModal, this.transactionIdNmi);
        }
        break;

      case PaymentMode.FLUTTERWAVE:
        this.loader.show();
        if (response && response.status == 'success') {
          this.flutterwaveModal = false;
          if (this.debtAmountCheck) {
            this.loader.show();
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'job_id': this.sessionService.getByKey('app', 'payment').order_id,
              'payment_method': response.payment_method,
              'payment_for': PaymentFor.DEBT_AMOUNT,
            };
            this.onDebtPayment(objData);
          }
          if (this.customerPlanId) {
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'plan_id': this.customerPlanId,
              'payment_method': response.payment_method,
              'payment_for': PaymentFor.CUSTOMER_SUBSCRIPTION_AMOUNT
            };
            this.customerPlan(objData);
          }
          if (this.sessionService.getByKey('app', 'payment') && this.sessionService.getByKey('app', 'payment').is_custom_order == 1 && this.selectedPaymentMethod.payment_process_type != 2) {
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'plan_id': this.customerPlanId,
              'payment_method': response.payment_method,
              'job_id': this.sessionService.getByKey('app', 'payment').job_id,
              'additionalPaymentId': this.sessionService.getByKey('app', 'payment').additionalpaymentId,
              'payment_for': 10
            };
            this.customerPlan(objData);
          }
          if (this.selectedPaymentMethod.payment_process_type == 1) {
            this.afterCreateTaskSuccess('');
          } else {
            this.transactionIdFlutterwave = response.transactionId
            this.taskViaPayment();
          }
        }
        else {
          this.hidePaymentPopup(this.flutterwaveModal, this.transactionIdFlutterwave);
        }
        break;

      case PaymentMode.MPESA:
        this.loader.show();
        if (response && response.status == 'success') {
          this.mpesaModal = false;
          if (this.debtAmountCheck) {
            this.loader.show();
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'job_id': this.sessionService.getByKey('app', 'payment').order_id,
              'payment_method': response.payment_method,
              'payment_for': PaymentFor.DEBT_AMOUNT,
            };
            this.onDebtPayment(objData);
          }
          if (this.customerPlanId) {
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'plan_id': this.customerPlanId,
              'payment_method': response.payment_method,
              'payment_for': PaymentFor.CUSTOMER_SUBSCRIPTION_AMOUNT
            };
            this.customerPlan(objData);
          }
          if (this.sessionService.getByKey('app', 'payment') && this.sessionService.getByKey('app', 'payment').is_custom_order == 1 && this.selectedPaymentMethod.payment_process_type != 2) {
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'plan_id': this.customerPlanId,
              'payment_method': response.payment_method,
              'job_id': this.sessionService.getByKey('app', 'payment').job_id,
              'additionalPaymentId': this.sessionService.getByKey('app', 'payment').additionalpaymentId,
              'payment_for': 10
            };
            this.customerPlan(objData);
          }
          if (this.selectedPaymentMethod.payment_process_type == 1) {
            this.afterCreateTaskSuccess('');
          } else {
            this.transactionIdMpesa = response.transactionId
            this.taskViaPayment();
          }
        }
        else {
          this.hidePaymentPopup(this.mpesaModal, this.transactionIdMpesa);
        }
        break;

      case PaymentMode.ADYEN:
        this.loader.show();
        if (response && response.status == 'success') {
          this.adyenModal = false;
          if (this.debtAmountCheck) {
            this.loader.show();
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'job_id': this.sessionService.getByKey('app', 'payment').order_id,
              'payment_method': response.payment_method,
              'payment_for': PaymentFor.DEBT_AMOUNT,
            };
            this.onDebtPayment(objData);
          }
          if (this.customerPlanId) {
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'plan_id': this.customerPlanId,
              'payment_method': response.payment_method,
              'payment_for': PaymentFor.CUSTOMER_SUBSCRIPTION_AMOUNT
            };
            this.customerPlan(objData);
          }
          if (this.sessionService.getByKey('app', 'payment') && this.sessionService.getByKey('app', 'payment').is_custom_order == 1 && this.selectedPaymentMethod.payment_process_type != 2) {
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'plan_id': this.customerPlanId,
              'payment_method': response.payment_method,
              'job_id': this.sessionService.getByKey('app', 'payment').job_id,
              'additionalPaymentId': this.sessionService.getByKey('app', 'payment').additionalpaymentId,
              'payment_for': 10
            };
            this.customerPlan(objData);
          }
          if (this.selectedPaymentMethod.payment_process_type == 1) {
            this.afterCreateTaskSuccess('');
          } else {
            this.transactionIdAdyen = response.transactionId
            this.taskViaPayment();
          }
        }
        else {
          this.hidePaymentPopup(this.adyenModal, this.transactionIdAdyen);
        }
        break;

      case PaymentMode.PAYMARK:
        this.loader.show();
        if (response && response.status == 'success') {
          this.paymarkModal = false;
          if (this.debtAmountCheck) {
            this.loader.show();
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'job_id': this.sessionService.getByKey('app', 'payment').order_id,
              'payment_method': response.payment_method,
              'payment_for': PaymentFor.DEBT_AMOUNT,
            };
            this.onDebtPayment(objData);
          }
          if (this.customerPlanId) {
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'plan_id': this.customerPlanId,
              'payment_method': response.payment_method,
              'payment_for': PaymentFor.CUSTOMER_SUBSCRIPTION_AMOUNT
            };
            this.customerPlan(objData);
          }
          if (this.sessionService.getByKey('app', 'payment') && this.sessionService.getByKey('app', 'payment').is_custom_order == 1 && this.selectedPaymentMethod.payment_process_type != 2) {
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'plan_id': this.customerPlanId,
              'payment_method': response.payment_method,
              'job_id': this.sessionService.getByKey('app', 'payment').job_id,
              'additionalPaymentId': this.sessionService.getByKey('app', 'payment').additionalpaymentId,
              'payment_for': 10
            };
            this.customerPlan(objData);
          }
          if (this.selectedPaymentMethod.payment_process_type == 1) {
            this.afterCreateTaskSuccess('');
          } else {
            this.transactionIdPaymark = response.transactionId
            this.taskViaPayment();
          }
        }
        else {
          this.hidePaymentPopup(this.paymarkModal, this.transactionIdPaymark);
        }
        break;
      case PaymentMode.HYPUR:
        this.loader.show();
        if (response && response.status == 'success') {
          this.hypurModal = false;
          if (this.debtAmountCheck) {
            this.loader.show();
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'job_id': this.sessionService.getByKey('app', 'payment').order_id,
              'payment_method': response.payment_method,
              'payment_for': PaymentFor.DEBT_AMOUNT,
            };
            this.onDebtPayment(objData);
          }
          if (this.customerPlanId) {
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'plan_id': this.customerPlanId,
              'payment_method': response.payment_method,
              'payment_for': PaymentFor.CUSTOMER_SUBSCRIPTION_AMOUNT
            };
            this.customerPlan(objData);
          }
          if (this.sessionService.getByKey('app', 'payment') && this.sessionService.getByKey('app', 'payment').is_custom_order == 1 && this.selectedPaymentMethod.payment_process_type != 2) {
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'plan_id': this.customerPlanId,
              'payment_method': response.payment_method,
              'job_id': this.sessionService.getByKey('app', 'payment').job_id,
              'additionalPaymentId': this.sessionService.getByKey('app', 'payment').additionalpaymentId,
              'payment_for': 10
            };
            this.customerPlan(objData);
          }
          if (this.selectedPaymentMethod.payment_process_type == 1) {
            this.afterCreateTaskSuccess('');
          } else {
            this.transactionIdHypur = response.transactionId
            this.taskViaPayment();
          }
        }
        else {
          this.hidePaymentPopup(this.hypurModal, this.transactionIdHypur);
        }
        break;

      case PaymentMode.PAYTMV3:
        this.loader.show();
        if (response && response.status == 'success') {
          this.paytmModal = false;
          if (this.debtAmountCheck) {
            this.loader.show();
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'job_id': this.sessionService.getByKey('app', 'payment').order_id,
              'payment_method': response.payment_method,
              'payment_for': PaymentFor.DEBT_AMOUNT,
            };
            this.onDebtPayment(objData);
          }
          if (this.customerPlanId) {
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'plan_id': this.customerPlanId,
              'payment_method': response.payment_method,
              'payment_for': PaymentFor.CUSTOMER_SUBSCRIPTION_AMOUNT
            };
            this.customerPlan(objData);
          }
          if (this.sessionService.getByKey('app', 'payment') && this.sessionService.getByKey('app', 'payment').is_custom_order == 1 && this.selectedPaymentMethod.payment_process_type != 2) {
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'plan_id': this.customerPlanId,
              'payment_method': response.payment_method,
              'job_id': this.sessionService.getByKey('app', 'payment').job_id,
              'additionalPaymentId': this.sessionService.getByKey('app', 'payment').additionalpaymentId,
              'payment_for': 10
            };
            this.customerPlan(objData);
          }
          if (this.selectedPaymentMethod.payment_process_type == 1) {
            this.afterCreateTaskSuccess('');
          } else {
            this.transactionIdPaytm = response.transactionId
            this.taskViaPayment();
          }
        }
        else {
          this.hidePaymentPopup(this.paytmModal, this.transactionIdPaytm);
        }
        break;

      case PaymentMode.PIXELPAY:
        this.loader.show();
        if (response && response.status == 'success') {
          this.pixelpayModal = false;
          if (this.debtAmountCheck) {
            this.loader.show();
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'job_id': this.sessionService.getByKey('app', 'payment').order_id,
              'payment_method': response.payment_method,
              'payment_for': PaymentFor.DEBT_AMOUNT,
            };
            this.onDebtPayment(objData);
          }
          if (this.customerPlanId) {
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'plan_id': this.customerPlanId,
              'payment_method': response.payment_method,
              'payment_for': PaymentFor.CUSTOMER_SUBSCRIPTION_AMOUNT
            };
            this.customerPlan(objData);
          }
          if (this.sessionService.getByKey('app', 'payment') && this.sessionService.getByKey('app', 'payment').is_custom_order == 1 && this.selectedPaymentMethod.payment_process_type != 2) {
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'plan_id': this.customerPlanId,
              'payment_method': response.payment_method,
              'job_id': this.sessionService.getByKey('app', 'payment').job_id,
              'additionalPaymentId': this.sessionService.getByKey('app', 'payment').additionalpaymentId,
              'payment_for': 10
            };
            this.customerPlan(objData);
          }
          if (this.selectedPaymentMethod.payment_process_type == 1) {
            this.afterCreateTaskSuccess('');
          } else {
            this.transactionIdPixelpay = response.transactionId
            this.taskViaPayment();
          }
        }
        else {
          this.hidePaymentPopup(this.pixelpayModal, this.transactionIdPixelpay);
        }
        break;

      case PaymentMode.DOKU:
        this.loader.show();
        if (response && response.status == 'success') {
          this.dokuModal = false;
          if (this.debtAmountCheck) {
            this.loader.show();
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'job_id': this.sessionService.getByKey('app', 'payment').order_id,
              'payment_method': response.payment_method,
              'payment_for': PaymentFor.DEBT_AMOUNT,
            };
            this.onDebtPayment(objData);
          }
          if (this.customerPlanId) {
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'plan_id': this.customerPlanId,
              'payment_method': response.payment_method,
              'payment_for': PaymentFor.CUSTOMER_SUBSCRIPTION_AMOUNT
            };
            this.customerPlan(objData);
          }
          if (this.sessionService.getByKey('app', 'payment') && this.sessionService.getByKey('app', 'payment').is_custom_order == 1 && this.selectedPaymentMethod.payment_process_type != 2) {
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'plan_id': this.customerPlanId,
              'payment_method': response.payment_method,
              'job_id': this.sessionService.getByKey('app', 'payment').job_id,
              'additionalPaymentId': this.sessionService.getByKey('app', 'payment').additionalpaymentId,
              'payment_for': 10
            };
            this.customerPlan(objData);
          }
          if (this.selectedPaymentMethod.payment_process_type == 1) {
            this.afterCreateTaskSuccess('');
          } else {
            this.transactionIdDoku = response.transactionId
            this.taskViaPayment();
          }
        }
        else {
          this.hidePaymentPopup(this.dokuModal, this.transactionIdDoku);
        }
        break;

      case PaymentMode.PEACH:
        this.loader.show();
        if (response && response.status == 'success') {
          this.peachModal = false;
          if (this.debtAmountCheck) {
            this.loader.show();
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'job_id': this.sessionService.getByKey('app', 'payment').order_id,
              'payment_method': response.payment_method,
              'payment_for': PaymentFor.DEBT_AMOUNT,
            };
            this.onDebtPayment(objData);
          }
          if (this.customerPlanId) {
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'plan_id': this.customerPlanId,
              'payment_method': response.payment_method,
              'payment_for': PaymentFor.CUSTOMER_SUBSCRIPTION_AMOUNT
            };
            this.customerPlan(objData);
          }
          if (this.sessionService.getByKey('app', 'payment') && this.sessionService.getByKey('app', 'payment').is_custom_order == 1 && this.selectedPaymentMethod.payment_process_type != 2) {
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'plan_id': this.customerPlanId,
              'payment_method': response.payment_method,
              'job_id': this.sessionService.getByKey('app', 'payment').job_id,
              'additionalPaymentId': this.sessionService.getByKey('app', 'payment').additionalpaymentId,
              'payment_for': 10
            };
            this.customerPlan(objData);
          }
          if (this.selectedPaymentMethod.payment_process_type == 1) {
            this.afterCreateTaskSuccess('');
          } else {
            this.transactionIdPeach = response.transactionId
            this.taskViaPayment();
          }
        }
        else {
          this.hidePaymentPopup(this.peachModal, this.transactionIdPeach);
        }
        break;

      case PaymentMode.PAGUELOFACIL:
        this.loader.show();
        if (response && response.status == 'success') {
          this.paguelofacilModal = false;
          if (this.debtAmountCheck) {
            this.loader.show();
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'job_id': this.sessionService.getByKey('app', 'payment').order_id,
              'payment_method': response.payment_method,
              'payment_for': PaymentFor.DEBT_AMOUNT,
            };
            this.onDebtPayment(objData);
          }
          if (this.customerPlanId) {
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'plan_id': this.customerPlanId,
              'payment_method': response.payment_method,
              'payment_for': PaymentFor.CUSTOMER_SUBSCRIPTION_AMOUNT
            };
            this.customerPlan(objData);
          }
          if (this.sessionService.getByKey('app', 'payment') && this.sessionService.getByKey('app', 'payment').is_custom_order == 1 && this.selectedPaymentMethod.payment_process_type != 2) {
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'plan_id': this.customerPlanId,
              'payment_method': response.payment_method,
              'job_id': this.sessionService.getByKey('app', 'payment').job_id,
              'additionalPaymentId': this.sessionService.getByKey('app', 'payment').additionalpaymentId,
              'payment_for': 10
            };
            this.customerPlan(objData);
          }
          if (this.selectedPaymentMethod.payment_process_type == 1) {
            this.afterCreateTaskSuccess('');
          } else {
            this.transactionIdPaguelofacil = response.transactionId
            this.taskViaPayment();
          }
        }
        else {
          this.hidePaymentPopup(this.paguelofacilModal, this.transactionIdPaguelofacil);
        }
        break;

      case PaymentMode.NOQOODY:
        this.loader.show();
        if (response && response.status == 'success') {
          this.noqoodyModal = false;
          if (this.debtAmountCheck) {
            this.loader.show();
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'job_id': this.sessionService.getByKey('app', 'payment').order_id,
              'payment_method': response.payment_method,
              'payment_for': PaymentFor.DEBT_AMOUNT,
            };
            this.onDebtPayment(objData);
          }
          if (this.customerPlanId) {
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'plan_id': this.customerPlanId,
              'payment_method': response.payment_method,
              'payment_for': PaymentFor.CUSTOMER_SUBSCRIPTION_AMOUNT
            };
            this.customerPlan(objData);
          }
          if (this.sessionService.getByKey('app', 'payment') && this.sessionService.getByKey('app', 'payment').is_custom_order == 1 && this.selectedPaymentMethod.payment_process_type != 2) {
            const objData = {
              'transaction_id': response.transactionId,
              'amount': this.sessionService.getByKey('app', 'payment').amount,
              'plan_id': this.customerPlanId,
              'payment_method': response.payment_method,
              'job_id': this.sessionService.getByKey('app', 'payment').job_id,
              'additionalPaymentId': this.sessionService.getByKey('app', 'payment').additionalpaymentId,
              'payment_for': 10
            };
            this.customerPlan(objData);
          }
          if (this.selectedPaymentMethod.payment_process_type == 1) {
            this.afterCreateTaskSuccess('');
          } else {
            this.transactionIdNoqoody = response.transactionId
            this.taskViaPayment();
          }
        }
        else {
          this.hidePaymentPopup(this.noqoodyModal, this.transactionIdNoqoody);
        }
        break;

        case PaymentMode.GTBANK:
          this.loader.show();
          if (response && response.status == 'success') {
            this.gtbankModal = false;
            if (this.debtAmountCheck) {
              this.loader.show();
              const objData = {
                'transaction_id': response.transactionId,
                'amount': this.sessionService.getByKey('app', 'payment').amount,
                'job_id': this.sessionService.getByKey('app', 'payment').order_id,
                'payment_method': response.payment_method,
                'payment_for': PaymentFor.DEBT_AMOUNT,
              };
              this.onDebtPayment(objData);
            }
            if (this.customerPlanId) {
              const objData = {
                'transaction_id': response.transactionId,
                'amount': this.sessionService.getByKey('app', 'payment').amount,
                'plan_id': this.customerPlanId,
                'payment_method': response.payment_method,
                'payment_for': PaymentFor.CUSTOMER_SUBSCRIPTION_AMOUNT
              };
              this.customerPlan(objData);
            }
            if (this.sessionService.getByKey('app', 'payment') && this.sessionService.getByKey('app', 'payment').is_custom_order == 1 && this.selectedPaymentMethod.payment_process_type != 2) {
              const objData = {
                'transaction_id': response.transactionId,
                'amount': this.sessionService.getByKey('app', 'payment').amount,
                'plan_id': this.customerPlanId,
                'payment_method': response.payment_method,
                'job_id': this.sessionService.getByKey('app', 'payment').job_id,
                'additionalPaymentId': this.sessionService.getByKey('app', 'payment').additionalpaymentId,
                'payment_for': 10
              };
              this.customerPlan(objData);
            }
            if (this.selectedPaymentMethod.payment_process_type == 1) {
              this.afterCreateTaskSuccess('');
            } else {
              this.transactionIdGtbank = response.transactionId;
              this.taskViaPayment();
            }
          }
          else {
            this.hidePaymentPopup(this.gtbankModal, this.transactionIdGtbank);
          }
          break;


        case PaymentMode.URWAY:
          this.loader.show();
          if (response && response.status == 'success') {
            this.urwayModal = false;
            if (this.debtAmountCheck) {
              this.loader.show();
              const objData = {
                'transaction_id': response.transactionId,
                'amount': this.sessionService.getByKey('app', 'payment').amount,
                'job_id': this.sessionService.getByKey('app', 'payment').order_id,
                'payment_method': response.payment_method,
                'payment_for': PaymentFor.DEBT_AMOUNT,
              };
              this.onDebtPayment(objData);
            }
            if (this.customerPlanId) {
              const objData = {
                'transaction_id': response.transactionId,
                'amount': this.sessionService.getByKey('app', 'payment').amount,
                'plan_id': this.customerPlanId,
                'payment_method': response.payment_method,
                'payment_for': PaymentFor.CUSTOMER_SUBSCRIPTION_AMOUNT
              };
              this.customerPlan(objData);
            }
            if (this.sessionService.getByKey('app', 'payment') && this.sessionService.getByKey('app', 'payment').is_custom_order == 1 && this.selectedPaymentMethod.payment_process_type != 2) {
              const objData = {
                'transaction_id': response.transactionId,
                'amount': this.sessionService.getByKey('app', 'payment').amount,
                'plan_id': this.customerPlanId,
                'payment_method': response.payment_method,
                'job_id': this.sessionService.getByKey('app', 'payment').job_id,
                'additionalPaymentId': this.sessionService.getByKey('app', 'payment').additionalpaymentId,
                'payment_for': 10
              };
              this.customerPlan(objData);
            }
            if (this.selectedPaymentMethod.payment_process_type == 1) {
              this.afterCreateTaskSuccess('');
            } else {
              this.transactionIdUrway = response.transactionId
              this.taskViaPayment();
            }
          }
          else {
            this.hidePaymentPopup(this.urwayModal, this.transactionIdUrway);
          }
          break;
  
          case PaymentMode.VUKA:
            this.loader.show();
            if (response && response.status == 'success') {
              this.vukaModal = false;
              if (this.debtAmountCheck) {
                this.loader.show();
                const objData = {
                  'transaction_id': response.transactionId,
                  'amount': this.sessionService.getByKey('app', 'payment').amount,
                  'job_id': this.sessionService.getByKey('app', 'payment').order_id,
                  'payment_method': response.payment_method,
                  'payment_for': PaymentFor.DEBT_AMOUNT,
                };
                this.onDebtPayment(objData);
              }
              if (this.customerPlanId) {
                const objData = {
                  'transaction_id': response.transactionId,
                  'amount': this.sessionService.getByKey('app', 'payment').amount,
                  'plan_id': this.customerPlanId,
                  'payment_method': response.payment_method,
                  'payment_for': PaymentFor.CUSTOMER_SUBSCRIPTION_AMOUNT
                };
                this.customerPlan(objData);
              }
              if (this.sessionService.getByKey('app', 'payment') && this.sessionService.getByKey('app', 'payment').is_custom_order == 1 && this.selectedPaymentMethod.payment_process_type != 2) {
                const objData = {
                  'transaction_id': response.transactionId,
                  'amount': this.sessionService.getByKey('app', 'payment').amount,
                  'plan_id': this.customerPlanId,
                  'payment_method': response.payment_method,
                  'job_id': this.sessionService.getByKey('app', 'payment').job_id,
                  'additionalPaymentId': this.sessionService.getByKey('app', 'payment').additionalpaymentId,
                  'payment_for': 10
                };
                this.customerPlan(objData);
              }
              if (this.selectedPaymentMethod.payment_process_type == 1) {
                this.afterCreateTaskSuccess('');
              } else {
                this.transactionIdVuka = response.transactionId
                this.taskViaPayment();
              }
            }
            else {
              this.hidePaymentPopup(this.vukaModal, this.transactionIdVuka);
            }
            break;
          case PaymentMode.CXPAY:
            this.loader.show();
            if (response && response.status == 'success') {
              this.cxpayModal = false;
              if (this.debtAmountCheck) {
                this.loader.show();
                const objData = {
                  'transaction_id': response.transactionId,
                  'amount': this.sessionService.getByKey('app', 'payment').amount,
                  'job_id': this.sessionService.getByKey('app', 'payment').order_id,
                  'payment_method': response.payment_method,
                  'payment_for': PaymentFor.DEBT_AMOUNT,
                };
                this.onDebtPayment(objData);
              }
              if (this.customerPlanId) {
                const objData = {
                  'transaction_id': response.transactionId,
                  'amount': this.sessionService.getByKey('app', 'payment').amount,
                  'plan_id': this.customerPlanId,
                  'payment_method': response.payment_method,
                  'payment_for': PaymentFor.CUSTOMER_SUBSCRIPTION_AMOUNT
                };
                this.customerPlan(objData);
              }
              if (this.sessionService.getByKey('app', 'payment') && this.sessionService.getByKey('app', 'payment').is_custom_order == 1 && this.selectedPaymentMethod.payment_process_type != 2) {
                const objData = {
                  'transaction_id': response.transactionId,
                  'amount': this.sessionService.getByKey('app', 'payment').amount,
                  'plan_id': this.customerPlanId,
                  'payment_method': response.payment_method,
                  'job_id': this.sessionService.getByKey('app', 'payment').job_id,
                  'additionalPaymentId': this.sessionService.getByKey('app', 'payment').additionalpaymentId,
                  'payment_for': 10
                };
                this.customerPlan(objData);
              }
              if (this.selectedPaymentMethod.payment_process_type == 1) {
                this.afterCreateTaskSuccess('');
              } else {
                this.transactionIdCxpay = response.transactionId
                this.taskViaPayment();
              }
            }
            else {
              this.hidePaymentPopup(this.cxpayModal, this.transactionIdCxpay);
            }
            break;
    
            case PaymentMode.VPOS:
              this.loader.show();
              if (response && response.status == 'success') {
                this.vposModal = false;
                if (this.debtAmountCheck) {
                  this.loader.show();
                  const objData = {
                    'transaction_id': response.transactionId,
                    'amount': this.sessionService.getByKey('app', 'payment').amount,
                    'job_id': this.sessionService.getByKey('app', 'payment').order_id,
                    'payment_method': response.payment_method,
                    'payment_for': PaymentFor.DEBT_AMOUNT,
                  };
                  this.onDebtPayment(objData);
                }
                if (this.customerPlanId) {
                  const objData = {
                    'transaction_id': response.transactionId,
                    'amount': this.sessionService.getByKey('app', 'payment').amount,
                    'plan_id': this.customerPlanId,
                    'payment_method': response.payment_method,
                    'payment_for': PaymentFor.CUSTOMER_SUBSCRIPTION_AMOUNT
                  };
                  this.customerPlan(objData);
                }
                if (this.sessionService.getByKey('app', 'payment') && this.sessionService.getByKey('app', 'payment').is_custom_order == 1 && this.selectedPaymentMethod.payment_process_type != 2) {
                  const objData = {
                    'transaction_id': response.transactionId,
                    'amount': this.sessionService.getByKey('app', 'payment').amount,
                    'plan_id': this.customerPlanId,
                    'payment_method': response.payment_method,
                    'job_id': this.sessionService.getByKey('app', 'payment').job_id,
                    'additionalPaymentId': this.sessionService.getByKey('app', 'payment').additionalpaymentId,
                    'payment_for': 10
                  };
                  this.customerPlan(objData);
                }
                if (this.selectedPaymentMethod.payment_process_type == 1) {
                  this.afterCreateTaskSuccess('');
                } else {
                  this.transactionIdVpos = response.transactionId
                  this.taskViaPayment();
                }
              }
              else {
                this.hidePaymentPopup(this.vposModal, this.transactionIdVpos);
              }
              break;
              case PaymentMode.PAYKU:
                this.loader.show();
                if (response && response.status == 'success') {
                  this.paykuModal = false;
                  if (this.debtAmountCheck) {
                    this.loader.show();
                    const objData = {
                      'transaction_id': response.transactionId,
                      'amount': this.sessionService.getByKey('app', 'payment').amount,
                      'job_id': this.sessionService.getByKey('app', 'payment').order_id,
                      'payment_method': response.payment_method,
                      'payment_for': PaymentFor.DEBT_AMOUNT,
                    };
                    this.onDebtPayment(objData);
                  }
                  if (this.customerPlanId) {
                    const objData = {
                      'transaction_id': response.transactionId,
                      'amount': this.sessionService.getByKey('app', 'payment').amount,
                      'plan_id': this.customerPlanId,
                      'payment_method': response.payment_method,
                      'payment_for': PaymentFor.CUSTOMER_SUBSCRIPTION_AMOUNT
                    };
                    this.customerPlan(objData);
                  }
                  if (this.sessionService.getByKey('app', 'payment') && this.sessionService.getByKey('app', 'payment').is_custom_order == 1 && this.selectedPaymentMethod.payment_process_type != 2) {
                    const objData = {
                      'transaction_id': response.transactionId,
                      'amount': this.sessionService.getByKey('app', 'payment').amount,
                      'plan_id': this.customerPlanId,
                      'payment_method': response.payment_method,
                      'job_id': this.sessionService.getByKey('app', 'payment').job_id,
                      'additionalPaymentId': this.sessionService.getByKey('app', 'payment').additionalpaymentId,
                      'payment_for': 10
                    };
                    this.customerPlan(objData);
                  }
                  if (this.selectedPaymentMethod.payment_process_type == 1) {
                    this.afterCreateTaskSuccess('');
                  } else {
                    this.transactionIdPayku = response.transactionId
                    this.taskViaPayment();
                  }
                }
                else {
                  this.hidePaymentPopup(this.paykuModal, this.transactionIdPayku);
                }
                break;     
      
                case PaymentMode.BAMBORA:
                  this.loader.show();
                  if (response && response.status == 'success') {
                    this.bamboraModal = false;
                    if (this.debtAmountCheck) {
                      this.loader.show();
                      const objData = {
                        'transaction_id': response.transactionId,
                        'amount': this.sessionService.getByKey('app', 'payment').amount,
                        'job_id': this.sessionService.getByKey('app', 'payment').order_id,
                        'payment_method': response.payment_method,
                        'payment_for': PaymentFor.DEBT_AMOUNT,
                      };
                      this.onDebtPayment(objData);
                    }
                    if (this.customerPlanId) {
                      const objData = {
                        'transaction_id': response.transactionId,
                        'amount': this.sessionService.getByKey('app', 'payment').amount,
                        'plan_id': this.customerPlanId,
                        'payment_method': response.payment_method,
                        'payment_for': PaymentFor.CUSTOMER_SUBSCRIPTION_AMOUNT
                      };
                      this.customerPlan(objData);
                    }
                    if (this.sessionService.getByKey('app', 'payment') && this.sessionService.getByKey('app', 'payment').is_custom_order == 1 && this.selectedPaymentMethod.payment_process_type != 2) {
                      const objData = {
                        'transaction_id': response.transactionId,
                        'amount': this.sessionService.getByKey('app', 'payment').amount,
                        'plan_id': this.customerPlanId,
                        'payment_method': response.payment_method,
                        'job_id': this.sessionService.getByKey('app', 'payment').job_id,
                        'additionalPaymentId': this.sessionService.getByKey('app', 'payment').additionalpaymentId,
                        'payment_for': 10
                      };
                      this.customerPlan(objData);
                    }
                    if (this.selectedPaymentMethod.payment_process_type == 1) {
                      this.afterCreateTaskSuccess('');
                    } else {
                      this.transactionIdBambora = response.transactionId
                      this.taskViaPayment();
                    }
                  }
                  else {
                    this.hidePaymentPopup(this.bamboraModal, this.transactionIdBambora);
                  }
                  break;     
        
                  case PaymentMode.PAYWAYONE:
                    this.loader.show();
                    if (response && response.status == 'success') {
                      this.paywayoneModal = false;
                      if (this.debtAmountCheck) {
                        this.loader.show();
                        const objData = {
                          'transaction_id': response.transactionId,
                          'amount': this.sessionService.getByKey('app', 'payment').amount,
                          'job_id': this.sessionService.getByKey('app', 'payment').order_id,
                          'payment_method': response.payment_method,
                          'payment_for': PaymentFor.DEBT_AMOUNT,
                        };
                        this.onDebtPayment(objData);
                      }
                      if (this.customerPlanId) {
                        const objData = {
                          'transaction_id': response.transactionId,
                          'amount': this.sessionService.getByKey('app', 'payment').amount,
                          'plan_id': this.customerPlanId,
                          'payment_method': response.payment_method,
                          'payment_for': PaymentFor.CUSTOMER_SUBSCRIPTION_AMOUNT
                        };
                        this.customerPlan(objData);
                      }
                      if (this.sessionService.getByKey('app', 'payment') && this.sessionService.getByKey('app', 'payment').is_custom_order == 1 && this.selectedPaymentMethod.payment_process_type != 2) {
                        const objData = {
                          'transaction_id': response.transactionId,
                          'amount': this.sessionService.getByKey('app', 'payment').amount,
                          'plan_id': this.customerPlanId,
                          'payment_method': response.payment_method,
                          'job_id': this.sessionService.getByKey('app', 'payment').job_id,
                          'additionalPaymentId': this.sessionService.getByKey('app', 'payment').additionalpaymentId,
                          'payment_for': 10
                        };
                        this.customerPlan(objData);
                      }
                      if (this.selectedPaymentMethod.payment_process_type == 1) {
                        this.afterCreateTaskSuccess('');
                      } else {
                        this.transactionIdPaywayone = response.transactionId
                        this.taskViaPayment();
                      }
                    }
                    else {
                      this.hidePaymentPopup(this.paywayoneModal, this.transactionIdPaywayone);
                    }
                    break;     
          
                    case PaymentMode.PLACETOPAY:
                      this.loader.show();
                      if (response && response.status == 'success') {
                        this.placetopayModal = false;
                        if (this.debtAmountCheck) {
                          this.loader.show();
                          const objData = {
                            'transaction_id': response.transactionId,
                            'amount': this.sessionService.getByKey('app', 'payment').amount,
                            'job_id': this.sessionService.getByKey('app', 'payment').order_id,
                            'payment_method': response.payment_method,
                            'payment_for': PaymentFor.DEBT_AMOUNT,
                          };
                          this.onDebtPayment(objData);
                        }
                        if (this.customerPlanId) {
                          const objData = {
                            'transaction_id': response.transactionId,
                            'amount': this.sessionService.getByKey('app', 'payment').amount,
                            'plan_id': this.customerPlanId,
                            'payment_method': response.payment_method,
                            'payment_for': PaymentFor.CUSTOMER_SUBSCRIPTION_AMOUNT
                          };
                          this.customerPlan(objData);
                        }
                        if (this.sessionService.getByKey('app', 'payment') && this.sessionService.getByKey('app', 'payment').is_custom_order == 1 && this.selectedPaymentMethod.payment_process_type != 2) {
                          const objData = {
                            'transaction_id': response.transactionId,
                            'amount': this.sessionService.getByKey('app', 'payment').amount,
                            'plan_id': this.customerPlanId,
                            'payment_method': response.payment_method,
                            'job_id': this.sessionService.getByKey('app', 'payment').job_id,
                            'additionalPaymentId': this.sessionService.getByKey('app', 'payment').additionalpaymentId,
                            'payment_for': 10
                          };
                          this.customerPlan(objData);
                        }
                        if (this.selectedPaymentMethod.payment_process_type == 1) {
                          this.afterCreateTaskSuccess('');
                        } else {
                          this.transactionIdPlacetopay = response.transactionId
                          this.taskViaPayment();
                        }
                      }
                      else {
                        this.hidePaymentPopup(this.placetopayModal, this.transactionIdPlacetopay);
                      }
                      break;     
            
                  default:
                    break;
    }
  }

  /**
   * function to hide payment popup
   */
  hidePaypalPopup() {
    this.paypalModal = false;
    if (this.paymentType == PaymentMode.PAYPAL && this.selectedPaymentMethod && this.selectedPaymentMethod.payment_process_type === 2) {
      this.selectedPaymentMethod = null;
      this.transactionIdPaypal = '';
      this.loader.hide();
      return;
    }
    if (this.post_payment_enable) {
      this.manupulateBrowserHistory();
      this.changeRouteWithParams();
    }
  }
  hideTelrPopup() {
    this.telrModal = false;
    if (this.paymentType == PaymentMode.TELR && this.selectedPaymentMethod && this.selectedPaymentMethod.payment_process_type === 2) {
      this.selectedPaymentMethod = null;
      this.transactionIdTelr = '';
      this.loader.hide();
      return;
    }
    if (this.post_payment_enable) {
      this.manupulateBrowserHistory();
      this.changeRouteWithParams();
    }
  }

  hidePaystackPopup() {
    this.paystackModal = false;
    if (this.post_payment_enable) {
      this.manupulateBrowserHistory();
      this.changeRouteWithParams();
    } else {
      this.transactionIdPaystack = '';
      this.selectedPaymentMethod = null;
      this.loader.hide();
    }
  }

  hideInnstapayPopup() {
    this.innstapayModal = false;
    if (this.post_payment_enable) {
      this.manupulateBrowserHistory();
      this.changeRouteWithParams();
    } else {
      this.transactionIdInnstapay = '';
      this.selectedPaymentMethod = null;
      this.loader.hide();
    }

  }


  hideFacPopup() {
    this.facModal = false;
    if (this.post_payment_enable) {
      this.manupulateBrowserHistory();
      this.changeRouteWithParams();
    } else {
      this.transactionIdFac = '';
      this.loader.hide();
    }
  }

  hideVistaPopup() {
    this.vistaModal = false;
    if (this.post_payment_enable) {
      this.manupulateBrowserHistory();
      this.changeRouteWithParams();
    } else {
      this.transactionIdVista = '';
      this.loader.hide();
    }
  }

  hideVistaMoneyPopup() {
    this.vistaMoneyModal = false;
    if (this.post_payment_enable) {
      this.manupulateBrowserHistory();
      this.changeRouteWithParams();
    } else {
      this.transactionIdVistaMoney = '';
      this.loader.hide();
    }
  }

  hideMPaisaPopup() {
    this.mpaisaModal = false;
    if (this.post_payment_enable) {
      this.manupulateBrowserHistory();
      this.changeRouteWithParams();
    } else {
      this.transactionIdMPaisa = '';
      this.selectedPaymentMethod = null;
      this.loader.hide();
    }
  }
  hidePayFastPopup() {
    this.payFastModal = false;
    if (this.post_payment_enable) {
      this.manupulateBrowserHistory();
      this.changeRouteWithParams();
    } else {
      this.transactionIdPayFast = '';
      this.selectedPaymentMethod = null;
      this.loader.hide();
    }
  }

  hidePayuPopup() {
    this.payuModal = false;
    if (this.post_payment_enable) {
      this.manupulateBrowserHistory();
      this.changeRouteWithParams();
    } else {
      this.transactionIdPayu = '';
      this.selectedPaymentMethod = null;
      this.loader.hide();
    }
  }
  hideLimelightPopup() {

    this.showLimeLightPopup = false;
    if (this.post_payment_enable) {
      this.manupulateBrowserHistory();
      this.changeRouteWithParams();
    } else {
      this.transactionIdLimeLight = '';
      this.selectedPaymentMethod = null;
      this.loader.hide();
    }

  }

  hideVivaPopup() {
    this.vivaModal = false;
    if (this.post_payment_enable) {
      this.manupulateBrowserHistory();
      this.changeRouteWithParams();
    } else {
      this.popup.showPopup(MessageType.ERROR, 3000, 'Transaction Failed', false)
      this.transactionIdviva = '';
      this.selectedPaymentMethod = null;
      this.loader.hide();
    }
  }

  hideTwoCheckoutPopup() {

    this.showTwoCheckoutPopup = false;
    if (this.post_payment_enable) {
      this.manupulateBrowserHistory();
      this.changeRouteWithParams();
    } else {
      this.transactionIdTwoCheckout = '';
      this.selectedPaymentMethod = null;
      this.loader.hide();
    }
    this.ref.detectChanges();

  }

  hidePaymentPopup(modalRef,transactionRef) {
    modalRef = false;
    // console.log(this.selectedPaymentMethod)
    // debugger
    if (this.selectedPaymentMethod && this.selectedPaymentMethod.payment_process_type == 1) {
      this.manupulateBrowserHistory();
      this.changeRouteWithParams();
    } else {
      transactionRef = '';
      this.selectedPaymentMethod = null;
      this.loader.hide();
    }
    this.popup.showPopup(MessageType.ERROR, 2000, 'Transaction Failed', false);
  }


  hidePayMobPopup() {
    this.payMobModal = false;
    if (this.post_payment_enable) {
      this.manupulateBrowserHistory();
      this.changeRouteWithParams();
    } else {
      this.transactionIdPayMob = '';
      this.selectedPaymentMethod = null;
      this.loader.hide();
    }
  }
  // hideWirecardPopup() {
  //   this.wirecardModal = false;
  //   if (this.post_payment_enable) {
  //     this.manupulateBrowserHistory();
  //     this.changeRouteWithParams();
  //   } else {
  //     this.transactionIdWirecard = '';
  //     this.loader.hide();
  //   }
  // }
  hideSslCommerzPopup() {
    this.sslCommerzModal = false;
    if (this.post_payment_enable) {
      this.manupulateBrowserHistory();
      this.changeRouteWithParams();
    } else {
      this.transactionIdSslCommerz = '';
      this.selectedPaymentMethod = null;
      this.loader.hide();
    }
  }
  hideFAC3dPopup() {
    this.fac3dModal = false;
    if (this.post_payment_enable) {
      this.manupulateBrowserHistory();
      this.changeRouteWithParams();
    } else {
      this.transactionIdFAC3D = '';
      this.selectedPaymentMethod = null;
      this.loader.hide();
    }
    this.popup.showPopup(MessageType.ERROR, 2000, 'Transaction Failed', false);
  }
  hideCheckoutComPopup() {
    this.checkoutComModal = false;
    if (this.post_payment_enable) {
      this.manupulateBrowserHistory();
      this.changeRouteWithParams();
    } else {
      this.transactionIdCheckoutCom = '';
      this.selectedPaymentMethod = null;
      this.loader.hide();
    }
    this.popup.showPopup(MessageType.ERROR, 2000, 'Transaction Failed', false);
  }
  hidePayHerePopup() {
    this.payHereModal = false;
    if (this.post_payment_enable) {
      this.manupulateBrowserHistory();
      this.changeRouteWithParams();
    } else {
      this.transactionIdPayHere = '';
      this.selectedPaymentMethod = null;
      this.loader.hide();
    }
    this.popup.showPopup(MessageType.ERROR, 2000, 'Transaction Failed', false);
  }
  hideAzulPopup() {
    this.azulModal = false;
    if (this.selectedPaymentMethod.payment_process_type == 1) {
      this.manupulateBrowserHistory();
      this.changeRouteWithParams();
    } else {
      this.transactionIdAzul = '';
      this.selectedPaymentMethod = null;
      this.loader.hide();
    }
    this.popup.showPopup(MessageType.ERROR, 2000, 'Transaction Failed', false);
  }
  hideCredimaxPopup() {
    this.credimaxModal = false;
    if (this.selectedPaymentMethod.payment_process_type == 1) {
      this.manupulateBrowserHistory();
      this.changeRouteWithParams();
    } else {
      this.transactionIdCredimax = '';
      this.selectedPaymentMethod = null;
      this.loader.hide();
    }
    this.popup.showPopup(MessageType.ERROR, 2000, 'Transaction Failed', false);
  }
  hideFatoorahPopup() {
    this.fatoorahModal = false;
    if (this.selectedPaymentMethod.payment_process_type == 1) {
      this.manupulateBrowserHistory();
      this.changeRouteWithParams();
    } else {
      this.transactionIdFatoorah = '';
      this.selectedPaymentMethod = null;
      this.loader.hide();
    }
    this.popup.showPopup(MessageType.ERROR, 2000, 'Transaction Failed', false);
  }
  hidePaynetPopup() {
    this.paynetModal = false;
    if (this.selectedPaymentMethod.payment_process_type == 1) {
      this.manupulateBrowserHistory();
      this.changeRouteWithParams();
    } else {
      this.transactionIdPaynet = '';
      this.selectedPaymentMethod = null;
      this.loader.hide();
    }
    this.popup.showPopup(MessageType.ERROR, 2000, 'Transaction Failed', false);
  }
  hideTapPopup() {
    this.tapModal = false;
    if (this.selectedPaymentMethod.payment_process_type == 1) {
      this.manupulateBrowserHistory();
      this.changeRouteWithParams();
    } else {
      this.transactionIdTap = '';
      this.selectedPaymentMethod = null;
      this.loader.hide();
    }
    this.popup.showPopup(MessageType.ERROR, 2000, 'Transaction Failed', false);
  }
  hideCurlecPopup() {
    this.curlecModal = false;
    if (this.selectedPaymentMethod.payment_process_type == 1) {
      this.manupulateBrowserHistory();
      this.changeRouteWithParams();
    } else {
      this.transactionIdCurlec = '';
      this.selectedPaymentMethod = null;
      this.loader.hide();
    }
    this.popup.showPopup(MessageType.ERROR, 2000, 'Transaction Failed', false);
  }
  hideWipayPopup() {
    this.wipayModal = false;
    if (this.selectedPaymentMethod.payment_process_type == 1) {
      this.manupulateBrowserHistory();
      this.changeRouteWithParams();
    } else {
      this.transactionIdWipay = '';
      this.selectedPaymentMethod = null;
      this.loader.hide();
    }
    this.popup.showPopup(MessageType.ERROR, 2000, 'Transaction Failed', false);
  }
  hidePagarPopup() {
    this.pagarModal = false;
    if (this.selectedPaymentMethod.payment_process_type == 1) {
      this.manupulateBrowserHistory();
      this.changeRouteWithParams();
    } else {
      this.transactionIdPagar = '';
      this.selectedPaymentMethod = null;
      this.loader.hide();
    }
    this.popup.showPopup(MessageType.ERROR, 2000, 'Transaction Failed', false);
  }
  hideWechatPopup() {
    this.wechatModal = false;
    if (this.selectedPaymentMethod.payment_process_type == 1) {
      this.manupulateBrowserHistory();
      this.changeRouteWithParams();
    } else {
      this.transactionIdWechat = '';
      this.selectedPaymentMethod = null;
      this.loader.hide();
    }
    this.popup.showPopup(MessageType.ERROR, 2000, 'Transaction Failed', false);
  }
  hideMybillpaymentPopup() {
    this.mybillpaymentModal = false;
    if (this.selectedPaymentMethod.payment_process_type == 1) {
      this.manupulateBrowserHistory();
      this.changeRouteWithParams();
    } else {
      this.transactionIdMybillpayment = '';
      this.selectedPaymentMethod = null;
      this.loader.hide();
    }
    this.popup.showPopup(MessageType.ERROR, 2000, 'Transaction Failed', false);
  }
  hideValitorPopup() {
    this.valitorModal = false;
    if (this.selectedPaymentMethod.payment_process_type == 1) {
      this.manupulateBrowserHistory();
      this.changeRouteWithParams();
    } else {
      this.transactionIdValitor = '';
      this.selectedPaymentMethod = null;
      this.loader.hide();
    }
    this.popup.showPopup(MessageType.ERROR, 2000, 'Transaction Failed', false);
  }
  hideTruevoPopup() {
    this.truevoModal = false;
    if (this.selectedPaymentMethod.payment_process_type == 1) {
      this.manupulateBrowserHistory();
      this.changeRouteWithParams();
    } else {
      this.transactionIdTruevo = '';
      this.selectedPaymentMethod = null;
      this.loader.hide();
    }
    this.popup.showPopup(MessageType.ERROR, 2000, 'Transaction Failed', false);
  }
  hidePayzenPopup() {
    this.payzenModal = false;
    if (this.selectedPaymentMethod.payment_process_type == 1) {
      this.manupulateBrowserHistory();
      this.changeRouteWithParams();
    } else {
      this.transactionIdPayzen = '';
      this.selectedPaymentMethod = null;
      this.loader.hide();
    }
    this.popup.showPopup(MessageType.ERROR, 2000, 'Transaction Failed', false);
  }
  hideFirstDataPopup() {
    this.firstdataModal = false;
    if (this.selectedPaymentMethod.payment_process_type == 1) {
      this.manupulateBrowserHistory();
      this.changeRouteWithParams();
    } else {
      this.transactionIdFirstdata = '';
      this.selectedPaymentMethod = null;
      this.loader.hide();
    }
    this.popup.showPopup(MessageType.ERROR, 2000, 'Transaction Failed', false);
  }
  hideSquarePopup() {
    this.squareModal = false;
    if (this.selectedPaymentMethod.payment_process_type == 1) {
      this.manupulateBrowserHistory();
      this.changeRouteWithParams();
    } else {
      this.transactionIdSquare = '';
      this.selectedPaymentMethod = null;
      this.loader.hide();
    }
    this.popup.showPopup(MessageType.ERROR, 2000, 'Transaction Failed', false);
  }
  hideMtnPopup() {
    this.mtnModal = false;
    if (this.selectedPaymentMethod.payment_process_type == 1) {
      this.manupulateBrowserHistory();
      this.changeRouteWithParams();
    } else {
      this.transactionIdMtn = '';
      this.selectedPaymentMethod = null;
      this.loader.hide();
    }
    this.popup.showPopup(MessageType.ERROR, 2000, 'Transaction Failed', false);
  }
  hideOnePayPopup() {
    this.onepayModal = false;
    if (this.selectedPaymentMethod.payment_process_type == 1) {
      this.manupulateBrowserHistory();
      this.changeRouteWithParams();
    } else {
      this.transactionIdOnepay = '';
      this.selectedPaymentMethod = null;
      this.loader.hide();
    }
    this.popup.showPopup(MessageType.ERROR, 2000, 'Transaction Failed', false);
  }
  hidePagopluxPopup() {
    this.pagopluxModal = false;
    if (this.selectedPaymentMethod.payment_process_type == 1) {
      this.manupulateBrowserHistory();
      this.changeRouteWithParams();
    } else {
      this.transactionIdPagoplux = '';
      this.selectedPaymentMethod = null;
      this.loader.hide();
    }
    this.popup.showPopup(MessageType.ERROR, 2000, 'Transaction Failed', false);
  }
  hideWhooshPopup() {
    this.whooshModal = false;
    if (this.selectedPaymentMethod.payment_process_type == 1) {
      this.manupulateBrowserHistory();
      this.changeRouteWithParams();
    } else {
      this.transactionIdWhoosh = '';
      this.selectedPaymentMethod = null;
      this.loader.hide();
    }
      this.popup.showPopup(MessageType.ERROR, 2000, 'Transaction Failed', false);
  }
  hideThetellerPopup() {
    this.thetellerModal = false;
    if (this.selectedPaymentMethod.payment_process_type == 1) {
      this.manupulateBrowserHistory();
      this.changeRouteWithParams();
    } else {
      this.transactionIdTheteller = '';
      this.loader.hide();
    }
    this.popup.showPopup(MessageType.ERROR, 2000, 'Transaction Failed', false);
  }
  hideHyperpayPopup() {
    this.hyperPayModal = false;
    if (this.selectedPaymentMethod.payment_process_type == 1) {
      this.manupulateBrowserHistory();
      this.changeRouteWithParams();
      this.popup.showPopup(MessageType.ERROR, 2000, 'Transaction Failed', false);

    } else {
      this.transactionIdHyperPay = '';
      this.selectedPaymentMethod = null;
      this.loader.hide();
      this.popup.showPopup(MessageType.ERROR, 2000, 'Transaction Failed', false);
      this.popup.hidePopup()
      // Observable.interval(1000).subscribe(x => {
        this.ngOnInit();
      // });

    }
    
  }
  hidePaynowPopup() {
    this.paynowModal = false;
    if (this.post_payment_enable) {
      this.manupulateBrowserHistory();
      this.changeRouteWithParams();
    } else {
      this.transactionIdPaynow = '';
      this.selectedPaymentMethod = null;
      this.loader.hide();
    }
  }

  hideAuthorizeNetPopup() {
    this.authorizeNetModal = false;
    this.popup.showPopup(MessageType.ERROR, 2000, this.languageStrings.unable_to_add_card || "Unable to add card", false);
  }
  hideVistaaPopup() {
    this.vistaModal = false;
    this.popup.showPopup(MessageType.ERROR, 2000, this.languageStrings.unable_to_add_card || "Unable to add card", false);
  }

  openWindowInCenter(url, title, w, h, t) {
    // Fixes dual-screen position                         Most browsers      Firefox
    let dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : window.screenX;
    let dualScreenTop = window.screenTop != undefined ? window.screenTop : window.screenY;

    let width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
    let height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

    let systemZoom = width / window.screen.availWidth;
    let left = (width - w) / 2 / systemZoom + dualScreenLeft
    let top = (height - h) / 2 / systemZoom + dualScreenTop + t;

    let payArray = [PaymentMode.LIME_LIGHT, PaymentMode.TWO_CHECKOUT, PaymentMode.CHECKOUT_COM, PaymentMode.PAYHERE, PaymentMode.AZUL, PaymentMode.CREDIMAX, PaymentMode.MY_FATOORAH, PaymentMode.THETELLER, PaymentMode.PAYNET, PaymentMode.CURLEC, PaymentMode.TAP, PaymentMode.WIPAY, PaymentMode.PAGAR, PaymentMode.WHOOSH, PaymentMode.PAYU, PaymentMode.PAY_MOB, PaymentMode.SSL_COMMERZ, PaymentMode.PAYNOW, PaymentMode.FAC_3D,PaymentMode.MTN, PaymentMode.WECHAT,PaymentMode.ONEPAY,PaymentMode.PAGOPLUX, PaymentMode.MYBILLPAYMENT, PaymentMode.VALITOR, PaymentMode.TRUEVO, PaymentMode.PAYZEN, PaymentMode.FIRSTDATA, PaymentMode.BANKOPEN, PaymentMode.SQUARE, PaymentMode.ETISALAT, PaymentMode.SUNCASH, PaymentMode.GOCARDLESS, PaymentMode.ATH, PaymentMode.IPAY88, PaymentMode.PROXYPAY, PaymentMode.CYBERSOURCE, PaymentMode.ALFALAH, PaymentMode.CULQI, PaymentMode.NMI, PaymentMode.FLUTTERWAVE, PaymentMode.MPESA, PaymentMode.ADYEN, PaymentMode.PAYMARK, PaymentMode.HYPUR, PaymentMode.PAYTMV3, PaymentMode.PIXELPAY, PaymentMode.PEACH, PaymentMode.PAGUELOFACIL, PaymentMode.NOQOODY, PaymentMode.GTBANK, PaymentMode.URWAY, PaymentMode.VUKA, PaymentMode.VPOS, PaymentMode.CXPAY, PaymentMode.PAYKU, PaymentMode.BAMBORA, PaymentMode.PAYWAYONE, PaymentMode.PLACETOPAY];

    if (payArray.includes(+this.paymentMethod)) {
      this.sessionService.paymentWinRef = window.open(url, '', 'scrollbars=yes, width=' + w / systemZoom + ', height=' + h / systemZoom + ', top=' + top + ', left=' + left);
      // Puts focus on the newWindow
      if (window.focus) this.sessionService.paymentWinRef.focus();
    }

    if(this.paymentMethod == PaymentMode.DOKU) {
      this.sessionService.paymentWinRef = window.open(url, '_blank');
      // Puts focus on the newWindow
      if (window.focus) this.sessionService.paymentWinRef.focus();
    }

    if (this.paymentMethod == PaymentMode.HYPERPAY) {
        this.sessionService.paymentWinRef = window.open(url, '', 'scrollbars=yes, width=' + w / systemZoom + ', height=' + h / systemZoom + ', top=' + top + ', left=' + left);
        // Puts focus on the newWindow
        if (window.focus) this.sessionService.paymentWinRef.focus();
      
      // else this.popup.showPopup(MessageType.ERROR, 3000, 'Currency not supported', false);
    }
    if (this.paymentMethod == PaymentMode.VIVA) {
      // if (this.formSettings.payment_settings[0].code === 'EUR') {
      this.sessionService.paymentWinRef = window.open(url, '', 'scrollbars=yes, width=' + w / systemZoom + ', height=' + h / systemZoom + ', top=' + top + ', left=' + left);
      // Puts focus on the newWindow
      if (window.focus) this.sessionService.paymentWinRef.focus();
      // }
      // else this.popup.showPopup(MessageType.ERROR, 3000, 'Currency not supported', false);
    }
    // if (this.paymentMethod == PaymentMode.PAYHERE) {
    //   this.sessionService.payHereWinRef = window.open(url, '', 'scrollbars=yes, width=' + w / systemZoom + ', height=' + h / systemZoom + ', top=' + top + ', left=' + left);
    //   // Puts focus on the newWindow
    //   if (window.focus) this.sessionService.payHereWinRef.focus();
    // }
    // if (this.paymentMethod == PaymentMode.AZUL) {
    //   this.sessionService.paymentWinRef = window.open(url, '', 'scrollbars=yes, width=' + w / systemZoom + ', height=' + h / systemZoom + ', top=' + top + ', left=' + left);
    //   // Puts focus on the newWindow
    //   if (window.focus) this.sessionService.paymentWinRef.focus();
    // }
    // if (this.paymentMethod == PaymentMode.CREDIMAX) {
    //   this.sessionService.paymentWinRef = window.open(url, '', 'scrollbars=yes, width=' + w / systemZoom + ', height=' + h / systemZoom + ', top=' + top + ', left=' + left);
    //   // Puts focus on the newWindow
    //   if (window.focus) this.sessionService.paymentWinRef.focus();
    // }
    // if (this.paymentMethod == PaymentMode.MY_FATOORAH) {
    //   this.sessionService.paym = window.open(url, '', 'scrollbars=yes, width=' + w / systemZoom + ', height=' + h / systemZoom + ', top=' + top + ', left=' + left);
    //   // Puts focus on the newWindow
    //   if (window.focus) this.sessionService.fatoorahWinRef.focus();
    // }
    // if (this.paymentMethod == PaymentMode.TAP) {
    //   this.sessionService.tapWinRef = window.open(url, '', 'scrollbars=yes, width=' + w / systemZoom + ', height=' + h / systemZoom + ', top=' + top + ', left=' + left);
    //   // Puts focus on the newWindow
    //   if (window.focus) this.sessionService.tapWinRef.focus();
    // }
    // if (this.paymentMethod == PaymentMode.THETELLER) {
    //   this.sessionService.thetellerWinRef = window.open(url, '', 'scrollbars=yes, width=' + w / systemZoom + ', height=' + h / systemZoom + ', top=' + top + ', left=' + left);
    //   // Puts focus on the newWindow
    //   if (window.focus) this.sessionService.thetellerWinRef.focus();
    // }
    // if (this.paymentMethod == PaymentMode.PAYNET) {
    //   this.sessionService.paynetWinRef = window.open(url, '', 'scrollbars=yes, width=' + w / systemZoom + ', height=' + h / systemZoom + ', top=' + top + ', left=' + left);
    //   // Puts focus on the newWindow
    //   if (window.focus) this.sessionService.paynetWinRef.focus();
    // }
    // if (this.paymentMethod == PaymentMode.CURLEC) {
    //   this.sessionService.curlecWinRef = window.open(url, '', 'scrollbars=yes, width=' + w / systemZoom + ', height=' + h / systemZoom + ', top=' + top + ', left=' + left);
    //   // Puts focus on the newWindow
    //   if (window.focus) this.sessionService.curlecWinRef.focus();
    // }
    // if (this.paymentMethod == PaymentMode.WIPAY) {
    //   this.sessionService.wipayWinRef = window.open(url, '', 'scrollbars=yes, width=' + w / systemZoom + ', height=' + h / systemZoom + ', top=' + top + ', left=' + left);
    //   // Puts focus on the newWindow
    //   if (window.focus) this.sessionService.wipayWinRef.focus();
    // }
  }

  /**
   * get wallet details
   */
  getWalletDetails() {
    const data = {
      marketplace_user_id: this.appConfig.marketplace_user_id,
      access_token: this.sessionService.get('appData').vendor_details.app_access_token,
      vendor_id: this.sessionService.get('appData').vendor_details.vendor_id,
      need_balance_only: 1
    }
    this.paymentService.getWalletBalance(data).subscribe(response => {
      if (response.status === 200) {

        this.walletDetails = response.data;
      } else {
        this.walletDetails = {};
      }
    });
  }


  removeCardAuthorizeNet(data, cardDetail) {
    this.loader.show();
    data.marketplace_user_id = this.sessionService.get(
      "appData"
    ).vendor_details.marketplace_user_id.toString();
    data.user_id = this.sessionService.get("user_id").toString();
    data.is_active = "0";
    data.access_token = this.sessionService.get(
      "appData"
    ).vendor_details.app_access_token;
    data.vendor_id = this.sessionService.get("appData").vendor_details.vendor_id;
    data.brand = cardDetail.brand,
      data.expiry_date = cardDetail.expiry_date,
      data.last4_digits = cardDetail.last4_digits.toString(),
      this.paymentService.removeAuthorizeCard(data).subscribe(response => {
        if (response.status === 200) {
          this.loader.hide();
          this.getCards(data.payment_method);
        } else {
          this.popup.showPopup(MessageType.ERROR, 3000, response.message, false);
        }
      });
  }
  removeCardFac(data, cardDetail) {
    this.loader.show();
    data.marketplace_user_id = this.sessionService.get(
      "appData"
    ).vendor_details.marketplace_user_id.toString();
    data.user_id = this.sessionService.get("user_id").toString();
    data.is_active = "0";
    data.access_token = this.sessionService.get(
      "appData"
    ).vendor_details.app_access_token;
    data.vendor_id = this.sessionService.get("appData").vendor_details.vendor_id;
    data.brand = cardDetail.brand,
      data.expiry_date = cardDetail.expiry_date,
      data.last4_digits = cardDetail.last4_digits.toString(),
      this.paymentService.removeFacCard(data).subscribe(response => {
        if (response.status === 200) {
          this.loader.hide();
          this.getCards(data.payment_method);
        } else {
          this.popup.showPopup("error", 3000, response.message, false);
        }
      });
  }

  hideFacPopUp() {
    this.facModal = false;
  }

  /**
   * got it event for payment hold
   * @param event
   */
  gotItEvent(event) {

    if (event.data.type === 'Add Card') {
      this.holdPaymentCheck = false;
      this.showAddCard('holdData');
    } else if (event.data.type === 'Select Card') {
      this.holdPaymentCheck = false;
      this.setPaymentType(event.data.method, 'init', 'holdData');
    } else {
      this.holdPaymentCheck = false;
    }
  }

  /**
   * check vendor payment override over merchant gateways
   */

  checkCustomerMethodsOverride(methodsArray): any[] {

    methodsArray.forEach((res) => {
      if (res.value == PaymentMode.CASH && !res.enabled && this.loginResponse.vendor_details.vendor_cash_tag_enabled) {
        res.enabled = 1;
      }
      if (res.value == PaymentMode.PAY_LATER && !res.enabled && this.loginResponse.vendor_details.vendor_paylater_tag_enabled) {
        res.enabled = 1;
      }
    })

    return methodsArray
  }
  /**
 * function to hide payment popup
 */

  hideStripeIdealPopup() {
    this.stripeIdealModal = false;
    if (this.post_payment_enable) {
      this.manupulateBrowserHistory();
      this.changeRouteWithParams();
    } else {
      this.transactionIdStripeIdeal = '';
      this.selectedPaymentMethod = null;
      this.loader.hide();
    }
  }


  createRecurrenceTask(data) {
    let recurrenceData = this.sessionService.getByKey('app', 'recurrenceData');
    const obj = {
      vendor_id: this.sessionService.get("appData").vendor_details.vendor_id,
      marketplace_user_id: this.sessionService.get("config")
        .marketplace_user_id,
      user_id: this.sessionService.getString("user_id"),
      // 'payment_preference': this.paymentMethod.toString(),
      'access_token': this.sessionService.get('appData').vendor_details.app_access_token,
      // 'amount': this.NET_PAYABLE_AMOUNT,
      ...recurrenceData,
      // 'product_json': this.getProductApiData(),
      'request_body': JSON.stringify(this.makeCreateTaskData(data))
    };
    delete obj['is_recurring_enabled'];
    this.loader.show();
    this.paymentService.createRecurrenceTask(obj).subscribe(result => {
      if (result.status === 200) {
        this.afterCreateTaskSuccess('');
      } else {
        this.loader.hide();
        this.popup.showPopup(MessageType.ERROR, 2000, result.message, false);
      }
    }, (error) => {
      this.loader.hide();
      this.popup.showPopup(MessageType.ERROR, 2000, error.message, false);
    });
  }
  hideTransactionalPopup() {
    this.transactional_check = false;
  }
  addTransactional() {
    this.sessionService.set('mpaisaTransaction', true);
    this.transactional_amount = true;
    this.transactional_check = false;
    //  this.sessionService.set('transactionalCheck', 1);
  }
  addNow() {
    let balance = Number(this.billAmount) - Number(this.walletDetails.wallet_balance);
    this.sessionService.set('walletAddMoney', { balance: balance, redirect: 'payment', custom: this.isSourceCustom });
    this.router.navigate(['wallet']);
    return;
  }

  addLater() {
    const payload = this.getTaskbyYelo();
    this.createRecurrenceTask(payload);
    this.walletAddMoneyPopup = false;
  }

  hideWalletAddMoneyPopup() {
    this.walletAddMoneyPopup = false;
  }

  initPaytmPhoneNumberForm() {
    this.country_code = '91';
    this.paytmNumberForm = this.fb.group({
      'phone_number': ['', [Validators.minLength(PhoneMinMaxValidation.MIN_LENGTH),
      Validators.maxLength(PhoneMinMaxValidation.MAX_LENGTH)]]
    })
    if (!this.paytmLinkNumber) {
      const checkoutData = this.sessionService.getByKey("app", "checkout").cart;
      if (checkoutData.job_pickup_phone) {
        let num;
        if (checkoutData.job_pickup_phone.split(' ')[0].split('+')[1]) {
          num = checkoutData.job_pickup_phone;
          this.paytmLinkNumber = num;
          this.phoneNumberCheck(this.paytmLinkNumber);
        }
        else {
          num = parseInt(checkoutData.job_pickup_phone) ? '+' + this.country_code + ' ' + parseInt(checkoutData.job_pickup_phone) : '';
          this.paytmLinkNumber = this.paytmNumberForm.controls.phone_number.value ? '+' + this.country_code + ' ' + this.paytmNumberForm.controls.phone_number.value : '';
        }
        this.paytmNumberForm.controls.phone_number.setValue(num);

      }
      else {
        let data = JSON.parse(JSON.stringify(this.sessionService.get('appData').vendor_details));
        this.phoneNumberCheck(data.phone_no);
      }
      this.paytmLinkNumber = this.paytmNumberForm.controls.phone_number.value ? '+' + this.country_code + ' ' + this.paytmNumberForm.controls.phone_number.value : '';
      this.phoneNumberCheck(this.paytmLinkNumber);
    }
    else {
      this.phoneNumberCheck(this.paytmLinkNumber);
    }
  }
  hidePaytmPhoneNumberPopup() {
    this.showPhoneNumberPopupForPaytm = false;
  }
  savePaytmNumber() {
    this.country_code = '91';
    this.showPhoneNumberPopupForPaytm = false;
    this.paytmLinkNumber = this.paytmNumberForm.controls.phone_number.value ? '+' + this.country_code + ' ' + this.paytmNumberForm.controls.phone_number.value : '';
  }
  phoneNumberCheck(phone_no) {
    const phone = phone_no.trim();
    if (phone.indexOf(' ') > -1) {
      this.phoneCopy = phone.split(' ')[1];
      this.paytmNumberForm.controls.phone_number.setValue(this.phoneCopy);
      this.country_code = phone.split(' ')[0].split('+')[1];
    } else {
      for (let i = 0; i < this.countries.length; i++) {
        if (phone.indexOf(this.countries[i]) > -1) {
          const m = phone.slice(this.countries[i].length, phone.length);
          if (this.countries[i] === '+1' && m.length === 10) {
            this.phoneCopy = m;
            this.paytmNumberForm.controls.phone_number.setValue(this.phoneCopy);
            this.country_code = this.countries[i].split('+')[1];
            return;
          } else if (this.countries[i] !== '+1') {
            this.phoneCopy = m;
            this.paytmNumberForm.controls.phone_number.setValue(this.phoneCopy);
            this.country_code = this.countries[i].split('+')[1];
            return;
          }
        } else {
          this.phoneCopy = phone.split(' ')[1];
          this.paytmNumberForm.controls.phone_number.setValue(this.phoneCopy);
          this.country_code = phone.split(' ')[0].split('+')[1];
        }
      }
    }
  }
}
