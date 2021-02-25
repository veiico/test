import { CommonModule, isPlatformBrowser } from '@angular/common';
import { NgModule, Injector, Inject, PLATFORM_ID } from '@angular/core';
import { DecimalConfigPipeModule } from '../../../modules/decimal-config-pipe.module';

import { DynamicPaymentHoldOverlayComponent } from './components/hold-overlay/hold-overlay.component';

const customElementTupleArray: [any, string][] = [
  [DynamicPaymentHoldOverlayComponent, 'app-hold-overlay-dynamic'],
];
declare var require: any;

@NgModule({
  imports: [
    CommonModule,
    DecimalConfigPipeModule
  ],
  declarations: [
    DynamicPaymentHoldOverlayComponent
  ],
  exports: [
    DynamicPaymentHoldOverlayComponent
  ],
  providers: [],
  entryComponents: [
    DynamicPaymentHoldOverlayComponent
  ],
})

export class DynamicPaymentHoldModule {
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
