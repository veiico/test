import { CommonModule, isPlatformBrowser } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Inject, Injector, NgModule, PLATFORM_ID } from '@angular/core';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { CarouselModule } from 'primeng/carousel';
import { BusinessCategoriesService } from '../../../../../components/restaurants-new/components/business-categories/business-categories.service';

import { DynamicBusinessCategoriesComponent } from './business-categories.component';
import { DynamicCompilerService } from '../../../../../services/dynamic-compiler.service';

const customElementTupleArray: [any, string][] = [
  [DynamicBusinessCategoriesComponent, 'app-business-categories-dynamic'],
]
declare var require: any;


@NgModule({
  imports: [CommonModule, TooltipModule, CarouselModule],
  declarations: [DynamicBusinessCategoriesComponent],
  providers: [
    BusinessCategoriesService,
    DynamicCompilerService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [DynamicBusinessCategoriesComponent],
  entryComponents:[DynamicBusinessCategoriesComponent]
})
export class DynamicBusinessCategoriesModule {
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
