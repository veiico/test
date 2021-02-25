/**
 * Created by mba-214 on 02/11/18.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerSubscriptionService } from './customer-subscription.service';
import { CustomerSubscriptionComponent } from './customer-subscription.component';
import { StripeModule } from '../../modules/stripe/stripe.module';
import { DecimalConfigPipeModule } from '../../modules/decimal-config-pipe.module';
import { Routes, RouterModule } from '@angular/router';
import { CustomerSubscriptionPlanComponent } from './component/customer-subscription-plan/customer-subscription-plan.component';
import { DateTimeFormatPipeModule } from '../../modules/pipe.module';
export const routes: Routes = [
  {
    path: 'subscriptionPlan',
    component: CustomerSubscriptionPlanComponent,
    children: []
  }
];
@NgModule({
  imports: [
    CommonModule,
    StripeModule,
    DecimalConfigPipeModule,
    RouterModule.forChild(routes),
    DateTimeFormatPipeModule
  ],
  declarations: [
    CustomerSubscriptionComponent,
    CustomerSubscriptionPlanComponent
  ],
  exports: [
    CustomerSubscriptionComponent,
    CustomerSubscriptionPlanComponent
  ],
  providers: [
    CustomerSubscriptionService
  ]
})
export class CustomerSubscriptionModule {}
