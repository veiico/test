import { Component, OnInit } from '@angular/core';
import { CustomerSubscriptionService } from '../../customer-subscription.service';
import { SessionService } from '../../../../services/session.service';
import { LoaderService } from '../../../../../app/services/loader.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { OnboardingBusinessType } from '../../../../enums/enum'

@Component({
  selector: 'app-customer-subscription-plan',
  templateUrl: './customer-subscription-plan.component.html',
  styleUrls: ['./customer-subscription-plan.component.scss','../../../profile/profile.component.scss']
})
export class CustomerSubscriptionPlanComponent implements OnInit {

  public  availablePlans: [];
  public activatePlan: [];
  public currency = "$";
  public customer_subscription_mandatory: number = 0;
  public appConfig;
  public terminology: any = {};
  public freelancerFlow: Boolean = false;
  languageStrings: any={};

  constructor(private customerSubscriptionService:CustomerSubscriptionService,
    private sessionService: SessionService,
    private router: Router,
    protected loader: LoaderService ,
    protected location: Location,) { }

  ngOnInit() {
    this.appConfig = this.sessionService.get('config');
    this.sessionService.langStringsPromise.then(() =>
    {
     this.languageStrings = this.sessionService.languageStrings;
     this.languageStrings.allowed_orders=(this.languageStrings.allowed_orders || 'Allowed Orders').replace('ORDER_ORDER',this.appConfig.terminology.ORDER)
     this.languageStrings.allowed_projects=(this.languageStrings.allowed_projects || 'Allowed Projects').replace('PROJECT_PROJECT',this.appConfig.terminology.PROJECT)
    });
    this.getCustomerSubscriptionPlans();
    this.currency = this.appConfig['payment_settings'][0].symbol;
    this.sessionService.remove('customerPlanSkipped');
    this.sessionService.remove('customerPlanData');
    this.customer_subscription_mandatory = this.appConfig.is_customer_subscription_mandatory;
    this.freelancerFlow = this.appConfig.onboarding_business_type == OnboardingBusinessType.FREELANCER ? true : false;
    if (this.appConfig.terminology) {
      this.terminology = this.appConfig.terminology;
    }
  }

  getCustomerSubscriptionPlans(){
    this.loader.show();
    this.customerSubscriptionService.getSubscriptionPlans().subscribe(response => {
      this.loader.hide();
      this.availablePlans = response.data.plans;
      this.activatePlan = response.data.customerPlan;
    },
    error => {
      this.loader.hide();
      console.error(error);
    });
  }

  choosePlan(plan){
    this.loader.show();
    this.sessionService.set('customerPlanSkipped', 0);
    const obj = { amount : plan.amount };
    this.sessionService.set('customerPlanData',obj);
    const chekoutData = {
      amount: plan.amount
    };
    let payload = {
      return_enabled: 0,
      is_scheduled: 0
    };
    chekoutData['cart'] = payload;
    this.sessionService.setByKey('app', 'checkout', chekoutData);
    this.sessionService.setByKey('app', 'payment', {
      amount:  plan.amount,
      subtotal:  plan.amount
    });
    this.router.navigate(['/payment'],{
      queryParams: { redir_source: 'CUSTOM',customerPlanData : plan.plan_id}
    });
  }
  

  goBack() {
    this.location.back();
    this.sessionService.set('customerPlanSkipped', 1);
  }

}