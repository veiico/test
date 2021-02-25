import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Inject, Injector, NgModule, PLATFORM_ID } from '@angular/core';

import { CustomerSubscriptionService } from '../../../components/customer-subscription/customer-subscription.service';
import { DecimalConfigPipeModule } from '../../../modules/decimal-config-pipe.module';
import { StripeModule } from '../../../modules/stripe/stripe.module';
import { DynamicCustomerSubscriptionComponent } from './customer-subscription.component';

const customElementTupleArray: [any, string][] = [
  [DynamicCustomerSubscriptionComponent, 'app-customer-subscription-dynamic'],
];
declare var require: any;

@NgModule({
  imports: [
    CommonModule,
    StripeModule,
    DecimalConfigPipeModule
  ],
  declarations: [
    DynamicCustomerSubscriptionComponent
  ],
  entryComponents: [DynamicCustomerSubscriptionComponent],
  providers: [
    CustomerSubscriptionService
  ]
})
export class DynamicCustomerSubscriptionModule {
  constructor(private injector: Injector, @Inject(PLATFORM_ID) platformId: Object) {
    if (isPlatformBrowser(platformId)) {
      const { createCustomElement } = require('@angular/elements');

      for (const [component, selector] of customElementTupleArray) {
        const elemExist = customElements.get(selector)
        if (!elemExist) {
          const el = createCustomElement(component, { injector: this.injector });
          customElements.define(selector, el);
        }
      }
    }
  }
}
