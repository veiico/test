import { CommonModule, isPlatformBrowser } from '@angular/common';
import { NgModule, Injector, Inject, PLATFORM_ID } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material';
import { ModalModule } from '../../../../components/modal/modal.module';
import { PaypalService } from '../../../../modules/paypal/paypal.service';

import { DynamicPaypalComponent } from './paypal.component';

const customElementTupleArray: [any, string][] = [
  [DynamicPaypalComponent, 'app-paypal-dynamic'],
];
declare var require: any;
@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    ReactiveFormsModule,
    FormsModule,
    ModalModule
  ],
  declarations: [
    DynamicPaypalComponent
  ],
  exports: [
    DynamicPaypalComponent
  ],
  providers: [
    PaypalService
  ],
  entryComponents: [
    DynamicPaypalComponent
  ]
})

export class DynamicPaypalModule {
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
