import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Inject, Injector, NgModule, PLATFORM_ID } from '@angular/core';
import { BannerService } from '../../../../../components/restaurants-new/components/banner/banner.service';

import { DynamicBannerComponent } from './banner.component';
import { DynamicCompilerService } from '../../../../../services/dynamic-compiler.service';

const customElementTupleArray: [any, string][] = [
  [DynamicBannerComponent, 'app-banner-dynamic'],
]
declare var require: any;

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    DynamicBannerComponent
  ],
  providers: [
    BannerService,
    DynamicCompilerService
  ],
  exports: [DynamicBannerComponent],
  entryComponents: [DynamicBannerComponent]
})
export class DynamicBannerModule {
  
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
