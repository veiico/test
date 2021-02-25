import { CommonModule, isPlatformBrowser } from '@angular/common';
import { NgModule, Injector, Inject, PLATFORM_ID } from '@angular/core';

import { DynamicPopupModalComponent } from './components/popup-modal/popup-modal.component';
import { DynamicPopUpComponent } from './components/popup/popup.component';
import { PopupModalService } from '../../../modules/popup/services/popup-modal.service';
import { PopUpService } from '../../../modules/popup/services/popup.service';

const customElementTupleArray: [any, string][] = [
  [DynamicPopupModalComponent, 'app-pop-up-modal-dynamic'],
  [DynamicPopUpComponent, 'app-pop-up-dynamic']
]
declare var require: any;
@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    DynamicPopupModalComponent,
    DynamicPopUpComponent
  ],
  exports: [
    DynamicPopupModalComponent,
    DynamicPopUpComponent
  ],
  entryComponents: [
    DynamicPopupModalComponent,
    DynamicPopUpComponent],
  providers: [
    PopupModalService,
    PopUpService
  ]
})
export class DynamicPopupModule {

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
