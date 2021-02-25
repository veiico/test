import { CommonModule, isPlatformBrowser } from '@angular/common';
import { NgModule, Injector, Inject, PLATFORM_ID } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material';

import { DynamicStripeidealComponent } from './stripeideal.component';
import { ModalModule } from '../../../../components/modal/modal.module';
import { StripeidealService } from '../../../../modules/stripeideal/stripeideal.service';

const customElementTupleArray: [any, string][] = [
  [DynamicStripeidealComponent, 'app-stripeideal-dynamic'],
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
    DynamicStripeidealComponent
  ],
  exports: [
    DynamicStripeidealComponent
  ],
  entryComponents: [
    DynamicStripeidealComponent
  ],
  providers: [
    StripeidealService
  ]
})
export class DynamicStripeIdealModule {
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
