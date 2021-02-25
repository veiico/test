import { CommonModule, isPlatformBrowser } from '@angular/common';
import { NgModule, Injector, Inject, PLATFORM_ID } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';

import { ModalModule } from '../../../components/modal/modal.module';
import { JwCommonModule } from '../../../modules/jw-common/jw-common.module';
import { DynamicPreorderTimeComponent } from './components/preorder-time/preorder-time.component';

const customElementTupleArray: [any, string][] = [
  [DynamicPreorderTimeComponent, 'app-preorder-time-dynamic'],
]
declare var require: any;
@NgModule({
  imports: [
    CommonModule,
    ModalModule,
    CalendarModule,
    FormsModule,
    ReactiveFormsModule,
    JwCommonModule
  ],
  declarations: [DynamicPreorderTimeComponent],
  exports: [DynamicPreorderTimeComponent],
  entryComponents: [DynamicPreorderTimeComponent]
})
export class DynamicPreorderTimeModule {
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
