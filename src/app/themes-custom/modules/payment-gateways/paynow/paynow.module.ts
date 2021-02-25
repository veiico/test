import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Inject, Injector, NgModule, PLATFORM_ID } from '@angular/core';

import { ModalModule } from '../../../../components/modal/modal.module';
import { PaynowService } from '../../../../modules/paynow/paynow.service';
import { PopupModule } from '../../../../modules/popup/popup.module';
import { DynamicPaynowComponent } from './paynow.component';


const customElementTupleArray: [any, string][] = [
  [DynamicPaynowComponent, 'app-paynow-dynamic'],
];
declare var require: any;
@NgModule({
  imports: [
    CommonModule,
    ModalModule,
    PopupModule
  ],
  declarations: [
    DynamicPaynowComponent
  ],
  exports: [
    DynamicPaynowComponent
  ],
  providers: [
    PaynowService
  ],
  entryComponents: [DynamicPaynowComponent]
})
export class DynamicPaynowModule {
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
