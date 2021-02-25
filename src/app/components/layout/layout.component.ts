import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import * as $ from 'jquery';

import { SessionService } from '../../services/session.service';
import { Router } from '../../../../node_modules/@angular/router';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss',
    "../../../../node_modules/primeicons/primeicons.css",
    "../../../../node_modules/primeng/resources/themes/omega/theme.css",
    "../../../../node_modules/primeng/resources/primeng.min.css"],
  encapsulation: ViewEncapsulation.None
})
export class LayoutComponent implements OnInit {
  data;
  domain;
  payment;
  languageStrings: any={};
  constructor(private sessionService: SessionService, private router: Router) {

  }

  ngOnInit() {
    this.sessionService.langStringsPromise.then(() =>
    {
     this.languageStrings = this.sessionService.languageStrings;
    });
    this.data = this.sessionService.get('config');
    this.domain = window.location.hostname;
    if (!this.sessionService.isPlatformServer()) {
      this.checkForDebt();
    }
 
  }

  checkForDebt() {
    let isPayment = location.pathname.indexOf('/payment');
    let appData = this.sessionService.get('appData');
    if(this.data.is_debt_enabled && appData &&  appData.vendor_details.debt_amount > 0 && this.data.is_debt_payment_compulsory && (isPayment == -1) && !(this.data.is_guest_checkout_enabled &&  (appData &&  parseInt(appData.vendor_details.is_guest_account)))) {
      this.router.navigate(['/debtAmount']);
    }else if(this.data.is_customer_subscription_enabled && appData && parseInt(appData.vendor_details.is_customer_subscription_plan_expired) && this.data.is_customer_subscription_mandatory && (isPayment == -1) && !(this.data.is_guest_checkout_enabled &&  (appData  && parseInt(appData.vendor_details.is_guest_account)))){
      this.router.navigate(['/customerSubscription/subscriptionPlan']);
    }
  }
}
