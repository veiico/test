import { NgModule, Injector, Inject, PLATFORM_ID, CompilerFactory } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { DynamicQuickLookComponent } from './quickLook.component';

const customElementTupleArray: [any, string][] = [
  [DynamicQuickLookComponent, 'app-quick-look-dynamic'],
]
declare var require: any;

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    DynamicQuickLookComponent
  ],
  exports: [
    DynamicQuickLookComponent
  ],
  providers: [

  ],
  entryComponents: [
    DynamicQuickLookComponent
  ],
})

export class DynamicQuickLookModule {
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
