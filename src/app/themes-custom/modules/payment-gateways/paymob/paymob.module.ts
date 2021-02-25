import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Inject, Injector, NgModule, PLATFORM_ID } from '@angular/core';
import { ModalModule } from '../../../../components/modal/modal.module';
import { PayMobService } from '../../../../modules/paymob/paymob.service';
import { PopupModule } from '../../../../modules/popup/popup.module';

import { DynamicPayMobComponent } from './paymob.component';


const customElementTupleArray: [any, string][] = [
  [DynamicPayMobComponent, 'app-paymob-dynamic'],
];
declare var require: any;


@NgModule({
  imports: [
    CommonModule,
    ModalModule,
    PopupModule
  ],
  declarations: [
    DynamicPayMobComponent
  ],
  exports: [
    DynamicPayMobComponent
  ],
  entryComponents: [
    DynamicPayMobComponent
  ],
  providers: [
    PayMobService
  ]
})

export class DynamicPayMobModule {
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
