import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Inject, Injector, NgModule, PLATFORM_ID } from '@angular/core';

import { ValidationService } from '../../../services/validation.service';
import { DynamicPopupModule } from '../popup/popup.module';
import { DynamicControlMessagesComponent } from './components/control-messages';


const customElementTupleArray: [any, string][] = [
  [DynamicControlMessagesComponent, 'app-control-messages-dynamic']
]
declare var require: any;

@NgModule({
  imports: [
    CommonModule,
    DynamicPopupModule
  ],
  declarations: [DynamicControlMessagesComponent],
  exports: [DynamicControlMessagesComponent, DynamicPopupModule],
  entryComponents: [DynamicControlMessagesComponent],
  providers: [ValidationService]
})
export class DynamicJwCommonModule {
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
