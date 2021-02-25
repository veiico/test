import { NgModule, Injector, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { DynamicOrderPlacedPopupComponent } from './order-placed-popup.component';
import { JwCommonModule } from '../../../modules/jw-common/jw-common.module';
import { ModalModule } from '../../../components/modal/modal.module';


const customElementTupleArray: [any, string][] = [
  [DynamicOrderPlacedPopupComponent, 'app-order-placed-popup-dynamic'],
]
declare var require: any;

@NgModule({
  declarations: [DynamicOrderPlacedPopupComponent],
  imports: [
    CommonModule,
    JwCommonModule,
    ModalModule
  ],
  exports: [DynamicOrderPlacedPopupComponent],
  entryComponents: [DynamicOrderPlacedPopupComponent],
})
export class DynamicOrderPlacedPopupModule {
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
