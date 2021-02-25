import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Inject, Injector, NgModule, PLATFORM_ID } from '@angular/core';

import { ModalModule } from '../../../../components/modal/modal.module';
import { PayuService } from '../../../../modules/payu/payu.service';
import { PopupModule } from '../../../../modules/popup/popup.module';
import { DynamicPayuComponent } from './payu.component';


const customElementTupleArray: [any, string][] = [
  [DynamicPayuComponent, 'app-payu-dynamic'],
];
declare var require: any;
@NgModule({
  imports: [
    CommonModule,
    ModalModule,
    PopupModule
  ],
  declarations: [
    DynamicPayuComponent
  ],
  exports: [
    DynamicPayuComponent
  ],
  providers: [
    PayuService
  ],
  entryComponents: [DynamicPayuComponent]
})
export class DynamicPayuModule {
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
