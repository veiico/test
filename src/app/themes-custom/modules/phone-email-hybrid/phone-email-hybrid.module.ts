import { CommonModule, isPlatformBrowser } from '@angular/common';
import { NgModule, Injector, Inject, PLATFORM_ID } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';


import { DynamicPhoneEmailHybridComponent } from './phone-email-hybrid.component';
import { ValidationService } from '../../../services/validation.service';

const customElementTupleArray: [any, string][] = [
  [DynamicPhoneEmailHybridComponent, 'app-phone-email-hybrid-dynamic'],
];
declare var require: any;

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  declarations: [
    DynamicPhoneEmailHybridComponent
  ],
  exports: [
    DynamicPhoneEmailHybridComponent
  ],
  entryComponents:[DynamicPhoneEmailHybridComponent],
  providers: [ValidationService]
})
export class DynamicPhoneEmailHybridModule {

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
