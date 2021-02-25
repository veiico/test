import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonService } from '../../../../../app/services/common.service';
import { SessionService } from '../../../../../app/services/session.service';
import { DebtService } from '../../services/show-debt.service';
import { LoaderService } from '../../../../../app/services/loader.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
@Component({
  selector: 'app-debt-amount',
  templateUrl: './debt-amount.component.html',
  styleUrls: ['./debt-amount.component.scss', '../../../profile/profile.component.scss']
})
export class DebtAmountComponent implements OnInit {
  @Output() onDebtAction: EventEmitter<any> = new EventEmitter<any>();
  public appConfig: any;
  public terminology: any;
  public direction: string;
  public currency: string;
  public debtAmount;
  public headerData;
  public appData;
  public debtData;
  public isPlatformServer;
  languageStrings: any={};

  constructor(public commonService: CommonService ,
    protected sessionService: SessionService,
    protected debtService: DebtService,
    protected loader: LoaderService ,
    protected location: Location,
    protected router: Router) { }

  ngOnInit() {
 
    this.isPlatformServer = this.sessionService.isPlatformServer();
    this.headerData = this.sessionService.get('config');
    this.sessionService.langStringsPromise.then(() =>
    {
     this.languageStrings = this.sessionService.languageStrings;
     this.languageStrings.amount_pending_from_your_past_order=(this.languageStrings.amount_pending_from_your_past_order || 'Amount is pending from your past order.').replace('ORDER_ORDER',this.headerData.terminology.ORDER);
    });
    this.setConfigData();
    this.sessionService.remove('skipDebt');
    this.sessionService.remove('userDebtData');
    this.sessionService.remove("payViaBillPlzTransactionId");

  }

  fetchDebtDetails() {
    const obj = {
      access_token: this.sessionService.get('appData').app_access_token,
      marketplace_user_id: this.sessionService.get('appData').vendor_details.marketplace_user_id,
      vendor_id: this.sessionService.get('appData').vendor_details.vendor_id
    };
    this.debtService.getDebtDetails(obj).subscribe(
      (response:any) => {

        if(response.status == 200) {
          this.debtAmount = response.data.debt_amount;
          if(this.debtAmount % 1 != 0) {
            this.debtAmount = this.debtAmount.toFixed(this.appConfig.decimal_display_precision_point);
          }
        }
      },
      (error) => {

      })
  }

  setConfigData() {
    this.appConfig = this.sessionService.get('config');
    this.terminology = this.appConfig.terminology;
    this.currency = this.appConfig.payment_settings[0].symbol;
    this.appData = this.sessionService.get('appData');
    if (this.sessionService.get('appData') && !this.isPlatformServer) {
      this.debtAmount = this.sessionService.get('appData').vendor_details.debt_amount;
      this.fetchDebtDetails();
    }
  }

  redirectToPayment() {
    this.loader.show();
    const obj = {
      marketplace_user_id: this.sessionService.get('appData').vendor_details.marketplace_user_id,
    };
    if (this.sessionService.get('appData')) {
      obj['vendor_id'] = this.sessionService.get('appData').vendor_details.vendor_id;
      obj['access_token'] = this.sessionService.get('appData').vendor_details.app_access_token;
    }
    this.debtService.getDebtList(obj).subscribe(
      (response: any) => {
        // this.loader.hide();
        // this.onDebtAction.emit('hide');
        this.sessionService.set('skipDebt', 0);
        this.debtData = response.data; //use outer job_id
        const obj = { jobId: response.data.job_id  , amount : response.data.debt_amount};
        this.sessionService.set('userDebtData',obj);
        const chekoutData = {
          amount: response.data.debt_amount
        };
        let payload = {
          return_enabled: 0,
          is_scheduled: 0
        };
        chekoutData['cart'] = payload;
        this.sessionService.setByKey('app', 'checkout', chekoutData);
        this.sessionService.setByKey('app', 'payment', {
          amount:  response.data.debt_amount,
          subtotal:  response.data.debt_amount,
          order_id: response.data.job_id
        });
        this.router.navigate(['/payment'], {
          queryParams: { redir_source: 'CUSTOM', debt_payment: 1}
        });
      },
      (error) => {
        this.loader.hide();
        console.error(error);
      });
  }

  goBack() {
    if(this.headerData.is_customer_subscription_enabled && this.appData.vendor_details && parseInt(this.appData.vendor_details.is_customer_subscription_plan_expired) && !(this.headerData.is_guest_checkout_enabled &&  (this.appData  && parseInt(this.appData.vendor_details.is_guest_account)))){
      this.sessionService.remove('customerPlanSkipped');
      this.router.navigate(['/customerSubscription/subscriptionPlan']);
    }else{
      this.location.back();
    }
    this.sessionService.set('skipDebt', 1);
    this.onDebtAction.emit('hide');
  }
}
