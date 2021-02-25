import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Inject, Injector, NgModule, PLATFORM_ID } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material';

import { ModalModule } from '../../../../components/modal/modal.module';
import { InnstapayService } from '../../../../modules/innstapay/innstapay.service';
import { DynamicInnstapayComponent } from './innstapay.component';

const customElementTupleArray: [any, string][] = [
  [DynamicInnstapayComponent, 'app-innstapay-dynamic'],
]
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
    DynamicInnstapayComponent
  ],
  exports: [
    DynamicInnstapayComponent
  ],
  providers: [
    InnstapayService
  ],
  entryComponents:[DynamicInnstapayComponent]
})
export class DynamicInnstapayModule {
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
