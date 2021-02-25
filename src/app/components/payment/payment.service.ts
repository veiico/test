import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { ApiService } from "../../services/api.service";
import { SessionService } from "../../services/session.service";
import { OnboardingBusinessType, PaymentMode } from "../../enums/enum";

@Injectable()
export class PaymentService {
  customOrderFlow: boolean;
  public payuWinRef;

  constructor(
    private apiService: ApiService,
    private sessionService: SessionService
  ) {
    this.customOrderFlow = this.sessionService.getString("customOrderFlow")
      ? Boolean(this.sessionService.getString("customOrderFlow"))
      : false;
  }

  getAllCards(payload): Observable<any> {
    const apiObj = {
      url: "get_customer_cards",
      body: payload
    };
    return this.apiService.post(apiObj);
  }
  getActivePaymentOption(): Observable<any> {

    const payload = {
      "access_token":this.sessionService.get("appData").vendor_details.app_access_token || this.sessionService.get('config').marketplace_user_id,
      marketplace_user_id: this.sessionService.get('config').marketplace_user_id,
      "user_id" : this.sessionService.get("user_id") || this.sessionService.get('config').marketplace_user_id,
      "vendor_id": this.sessionService.get("appData").vendor_details.vendor_id
    }
    const apiObj = {
      url: "payment/getActivePaymentMethods",
      body: payload
    }
    return this.apiService.post(apiObj);
  }


  getPaymentBillInfo(payload): Observable<any> {
    payload.is_app_product_tax_enabled = 1;
    const apiObj = {
      url: "get_bill_breakdown",
      body: payload
    };
    return this.apiService.post(apiObj);
  }
  sendPaymentTask(payload): Observable<any> {
    const apiObj = {
      url: "send_payment_for_task_webapp",
      body: payload
    };
    return this.apiService.post(apiObj);
  }
  applyPromoCode(payload): Observable<any> {
    const apiObj = {
      url: "apply_promo_code",
      body: payload
    };
    return this.apiService.post(apiObj);
  }

  applyTip(payload): Observable<any> {
    const apiObj = {
      url: "apply_promo_code",
      body: payload
    };
    return this.apiService.post(apiObj);
  }
  applyReferral(payload): Observable<any> {
    const apiObj = {
      url: "apply_referral",
      body: payload
    };
    return this.apiService.post(apiObj);
  }
  removeCard(payload): Observable<any> {
    const apiObj = {
      url: "delete_customer_card",
      body: payload
    };
    return this.apiService.post(apiObj);
  }
  removeAuthorizeCard(payload): Observable<any> {
    const apiObj = {
      url: "authorizeNet/deleteCard",
      body: payload
    };
    return this.apiService.post(apiObj);
  }
  removeFacCard(payload): Observable<any> {
    const apiObj = {
      url: "facPayment/deleteCreditCards",
      body: payload
    };
    return this.apiService.post(apiObj);
  }
  createTask(payload): Observable<any> {
    const config = this.sessionService.get("config");
    if(config.onboarding_business_type == OnboardingBusinessType.FOOD && payload.amount == 0 ){
      payload.card_id = '';
      payload.payment_method = 8;
    }
    const apiObj = {};
    if (config.business_model_type === "ECOM" && config.nlevel_enabled === 2) {
      apiObj["url"] = "createTaskViaVendorECOM";
      payload.user_id = JSON.parse(payload.products)[0].seller_id;
      apiObj["body"] = payload;
    } else {
      if (this.sessionService.getString("customOrderFlow")) {
        if(payload.self_pickup)
        {
          payload.self_pickup = undefined;
        }
        if(payload.pick_and_drop)
        {
          payload.pick_and_drop = undefined
        }
        payload.home_delivery = 1;

        if (config.onboarding_business_type === OnboardingBusinessType.LAUNDRY) {
          apiObj["url"] = "laundry/createTaskForCustomOrder";
        }   else {
          apiObj["url"] = "task/customOrder";
        }
      } else if (config.onboarding_business_type === OnboardingBusinessType.LAUNDRY) {
        apiObj["url"] = "laundry/createTask";
      }
      else if (config.business_model_type === 'FREELANCER') {
        //freelancer payment default case

        apiObj["url"] = "freelancer/acceptBidByVendor";
        payload = this.createFreelancerDefaultObject(payload)
      }
      else {
        if (config.is_menu_enabled) {
          payload.is_app_menu_enabled = 1;
        }
        payload.is_app_product_tax_enabled = 1;
        apiObj["url"] = "create_task_via_vendor_v2";
      }
      apiObj["body"] = payload;
    }
    return this.apiService.post(apiObj);
  }

  editTask(payload): Observable<any> {
    const config = this.sessionService.get("config");
    const apiObj = {};
    if (config.business_model_type === "ECOM" && config.nlevel_enabled === 2) {
      apiObj["url"] = "createTaskViaVendorECOM";
      payload.user_id = JSON.parse(payload.products)[0].seller_id;
      apiObj["body"] = payload;
    } else {
      if (this.sessionService.getString("customOrderFlow")) {
        if(payload.self_pickup)
          payload.self_pickup = undefined;
        if(payload.home_delivery)
          payload.home_delivery = undefined
        if(payload.pick_and_drop)
          payload.pick_and_drop = undefined
        if (config.onboarding_business_type === OnboardingBusinessType.LAUNDRY) {
          apiObj["url"] = "laundry/createTaskForCustomOrder";
        } else {
          apiObj["url"] = "task/customOrder";
        }
      } else if (config.onboarding_business_type === OnboardingBusinessType.LAUNDRY) {
        apiObj["url"] = "laundry/createTask";
      }
      else if (config.business_model_type === 'FREELANCER') {
        //freelancer payment default case
        apiObj["url"] = "freelancer/acceptBidByVendor";
        payload = this.createFreelancerDefaultObject(payload)
      }
      else {
        if (config.is_menu_enabled) {
          payload.is_app_menu_enabled = 1;
        }
        payload.is_app_product_tax_enabled = 1; // temporary key untill app get live
        //payload.tz = moment.tz.guess();
        apiObj["url"] = "task/updateOrder";
      }
      apiObj["body"] = payload;
    }
    //payload['domain_name'] = payload['domain_name'] || this.sessionService.getString('domain'); // 'hyperlocal.taxi-hawk.com';
    // if (this.sessionService.get('config') && this.sessionService.get('config').is_dual_user_enable === 1) {
    //   payload['dual_user_key'] = 1;
    // } else {
    //   payload['dual_user_key'] = 0;
    // }
    return this.apiService.put(apiObj);
  }


  private createFreelancerDefaultObject(data) {
    const freelancerCheckout = this.sessionService.get('freelancerCheckout');
    const config = this.sessionService.get('config');
    // delete data.user_id;
    if (!data.card_id)
      delete data.card_id;
    return {
      ...data,
      bid_id: freelancerCheckout.bid_id,
      project_id: freelancerCheckout.project_id,
    }
  }

  addCustomerCard(data): Observable<any> {
    const apiObj = {
      url: "stripe/insertCardDetails",
      body: data
    };
    return this.apiService.post(apiObj);
  }
  getSetupIntent(data) {
    const apiObj = {
      url: 'stripe/setupIntent',
       body: data
      };

  return this.apiService.post(apiObj);
  }
  payfortAuth(data) {
    const apiObj = {
      url: "payFort/initiatePayfortPayment",
      body: data
    };
    return this.apiService.getWithoutPostToGet(apiObj);
  }

  getRazorPayLink(data) {
    const apiObj = {
      url: "razorPay/razorpayPayment",
      body: data
    };
    return this.apiService.post(apiObj);
  }

  getPaymentUrl(data) {
    // debugger
    let payment_data = this.sessionService.getByKey('app', 'payment')
    if(payment_data && payment_data.is_custom_order == 1){
      if(data.payment_method != PaymentMode.RAZORPAY){
        data.job_id = undefined;
      }
      data.payment_for = 10;
      data.user_id = payment_data.user_id_merchant;
    }
    const apiObj = {
      url: "payment/getPaymentUrl",
      body: data
    };
    return this.apiService.post(apiObj);
  }

  getPayuLink(data) {
    const apiObj = {
      url: "payULatam/getPaymentData",
      body: data
    };
    return this.apiService.post(apiObj);
  }

  getWalletDetails(data) {
    const apiObj = {
      url: "paytm/checkBalance",
      body: data
    };
    return this.apiService.post(apiObj);
  }

  getPaytmOtp(data) {
    const apiObj = {
      url: "paytm/request_otp",
      body: data
    };
    return this.apiService.post(apiObj);
  }

  verifyPaytmOtp(data) {
    const apiObj = {
      url: "paytm/login_with_otp",
      body: data
    };
    return this.apiService.post(apiObj);
  }

  payViaBillPlz(data) {
    const apiObj = {
      url: "initiate_payment",
      body: data
    };
    return this.apiService.post(apiObj);
  }

  payViaStripe(data) {
    const apiObj = {
      url: "initiate_payment",
      body: data
    };
    return this.apiService.post(apiObj);
  }

  checkBillPlzStatus(data) {
    const apiObj = {
      url: "billplz/get_billplz_charge_status",
      body: data
    };
    return this.apiService.post(apiObj);
  }

  /**
   * validate order data before payment
   * @param payload data
   */
  validateOrderData(payload): Observable<any> {
    payload.vendor_id = this.sessionService.get(
      "appData"
    ).vendor_details.vendor_id;
    payload.access_token = this.sessionService.get(
      "appData"
    ).vendor_details.app_access_token;
    payload.user_id = this.sessionService.get("user_id");
    if (
      this.sessionService.get("config") &&
      this.sessionService.get("config").is_dual_user_enable === 1
    ) {
      payload["dual_user_key"] = 1;
    } else {
      payload["dual_user_key"] = 0;
    }
    if(this.sessionService.getString("deliveryMethod") && Number(this.sessionService.getString("deliveryMethod")) == 2){
      payload["self_pickup"] = 1;
    }
    if(this.sessionService.get('editJobId')){
      payload['prev_job_id'] = this.sessionService.get('editJobId');
    }
    if(payload.address_info)
    {
      payload.address_info = undefined;
    }
    const apiObj = {
      url: "order/serviceableCheck",
      body: payload
    };
    return this.apiService.postWithoutDOmain(apiObj);
  }
  getFacPaymentUrl(data) {
    const apiObj = {
      url: '/facPayment/getAuthorizationToken',
      body: data
    };
    return this.apiService.post(apiObj);
  }
  capturePayment(data) {
    const apiObj = {
      url: '/facPayment/capturePayment',
      body: data
    };
    return this.apiService.post(apiObj);
  }

  getWalletBalance(data) {
    const apiObj = {
      url: 'vendor/getWalletTxnHistory',
      body: data
    };
    return this.apiService.post(apiObj);
  }

  getBillBreakdownFreelancer(project_id: number, bid_id: number) {
    const config = this.sessionService.get('config');
    const appData = this.sessionService.get("appData");
    const apiObj = {
      url: 'freelancer/getBillBreakDown',
      body: {
        access_token: appData.vendor_details.app_access_token,
        vendor_id: appData.vendor_details.vendor_id,
        marketplace_user_id: config.marketplace_user_id,
        project_id,
        bid_id
      }
    };
    return this.apiService.post(apiObj);
  }

  paymentCreateCharge(objData) {
    const config = this.sessionService.get('config');
    const appData = this.sessionService.get("appData");

    const apiObj = {
      url: 'payment/createCharge',
      body: {
        access_token: appData.vendor_details.app_access_token,
        vendor_id: appData.vendor_details.vendor_id,
        marketplace_user_id: config.marketplace_user_id,
        job_id: objData.job_id,
        app_version: config.app_version,
        marketplace_reference_id: config.marketplace_reference_id,
        domain_name:config.domain_name ,
        reference_id: config.reference_id,
        user_id: config.user_id,
        language:config.language || "en",
        form_id: config.form_id,
        device_token: appData.vendor_details.app_access_token.device_token,
        app_access_token: appData.app_access_token,
        amount: objData.amount, // debt_amt
        payment_method: objData.payment_method, // method
        payment_for: objData.payment_for, // enum for debt is 6
        app_type: "WEB"
      }
    };
    if(objData.card_id) {
      apiObj.body['card_id'] = objData.card_id
    }
    if(objData.fac_payment_flow) {
      apiObj.body['fac_payment_flow'] = objData.fac_payment_flow
    }
    if(objData.transaction_id) {
      apiObj.body['transaction_id'] = objData.transaction_id
    }
    if(objData.additionalPaymentId){
      apiObj.body['additionalpaymentId'] = objData.additionalPaymentId
    }
    if(objData.plan_id){
      apiObj.body['plan_id'] = objData.plan_id
    }

    return this.apiService.post(apiObj);
  }

  createRecurrenceTask(data){

    const apiObj = {
      url: "/recurring/saveRecurringTask",
      body: data
    };
    return this.apiService.post(apiObj);

  }

  testWirecard(data) {

    const apiObj = {
      url: "/tc",
      body: data
    };
    return this.apiService.post(apiObj);

  }
  testSslCommerz(data) {

    const apiObj = {
      url: "/tc",
      body: data
    };
    return this.apiService.post(apiObj);
  }

  additionalChargesFreelancer(objData){
    const apiObj = {
      url: 'payment/createCharge',
      body: objData
    };
    if(objData.card_id) {
      apiObj.body['card_id'] = objData.card_id
    }
    if(objData.fac_payment_flow) {
      apiObj.body['fac_payment_flow'] = objData.fac_payment_flow
    }
    if(objData.transaction_id) {
      apiObj.body['transaction_id'] = objData.transaction_id
    }
    return this.apiService.post(apiObj);
  }
}
