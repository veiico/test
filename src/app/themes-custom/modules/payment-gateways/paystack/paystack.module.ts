import { CommonModule, isPlatformBrowser } from '@angular/common';
import { NgModule, Injector, Inject, PLATFORM_ID } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material';
import { ModalModule } from '../../../../components/modal/modal.module';
import { DynamicPaystackComponent } from './paystack.component';
import { PaystackService } from '../../../../modules/paystack/paystack.service';

const customElementTupleArray: [any, string][] = [
  [DynamicPaystackComponent, 'app-paystack-dynamic'],
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
    DynamicPaystackComponent
  ],
  exports: [
    DynamicPaystackComponent
  ],
  providers: [
    PaystackService
  ],
  entryComponents: [
    DynamicPaystackComponent
  ]
})

export class DynamicPaystackModule {
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
