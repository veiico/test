import { NgModule, Injector, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { DynamicModalComponent } from './modal.component';
import { ModalModule } from '../../../components/modal/modal.module';

const customElementTupleArray: [any, string][] = [
  [DynamicModalComponent, 'app-modal-dynamic']
]
declare var require: any;


@NgModule({
  imports: [
    CommonModule,
    ModalModule
  ],
  declarations: [
    DynamicModalComponent,
  ],
  providers: [

  ],
  exports: [DynamicModalComponent],
  entryComponents:[DynamicModalComponent]
})
export class DynamicModalModule {
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
