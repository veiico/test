import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Inject, Injector, NgModule, PLATFORM_ID } from '@angular/core';

import { DynamicShowOrderAdditionalInfoComponent } from './show-order-additional-info.component';

const customElementTupleArray: [any, string][] = [
  [DynamicShowOrderAdditionalInfoComponent, 'app-show-order-additonal-info-dynamic'],
]
declare var require: any;

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [],
  declarations: [DynamicShowOrderAdditionalInfoComponent],
  exports: [DynamicShowOrderAdditionalInfoComponent],
  entryComponents: [DynamicShowOrderAdditionalInfoComponent]
})
export class DynamicShowOrderAdditonalInfoModule {
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
