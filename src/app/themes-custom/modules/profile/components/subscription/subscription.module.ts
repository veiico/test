import { CommonModule, isPlatformBrowser } from '@angular/common';
import { NgModule, Injector, Inject, PLATFORM_ID } from '@angular/core';

import { DynamicSubscriptionComponent } from './subscription.component';


const customElementTupleArray: [any, string][] = [
  [DynamicSubscriptionComponent, 'app-subscription-dynamic'],
]
declare var require: any;

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    DynamicSubscriptionComponent
  ],
  exports: [
    DynamicSubscriptionComponent
  ],
  providers: [],
  entryComponents: [DynamicSubscriptionComponent]
})
export class DynamicSubscriptionModule {
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
