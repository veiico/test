import { NgModule, Injector, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { DynamicCustomerVerificationPopupComponent } from './customer-verification-popup.component';
import { DynamicModalModule } from '../modal/modal.module';


const customElementTupleArray: [any, string][] = [
  [DynamicCustomerVerificationPopupComponent, 'app-customer-verification-popup-dynamic'],
]
declare var require: any;

@NgModule({
  declarations: [DynamicCustomerVerificationPopupComponent],
  imports: [
    CommonModule,
    DynamicModalModule
  ],
  exports: [DynamicCustomerVerificationPopupComponent],
  entryComponents: [DynamicCustomerVerificationPopupComponent],
})
export class DynamicCustomerVerificationPopupModule {
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
