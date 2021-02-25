import { NgModule, Injector, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

import { DynamicDeliveryModesComponent } from './delivery-modes.component';
import { TooltipModule } from 'primeng/tooltip';
import { DynamicCompilerService } from '../../../../../services/dynamic-compiler.service';

const customElementTupleArray: [any, string][] = [
  [DynamicDeliveryModesComponent, 'app-delivery-modes-dynamic'],
]
declare var require: any;

@NgModule({
  imports: [
    CommonModule,
    TooltipModule
  ],
  declarations: [
    DynamicDeliveryModesComponent
  ],
  providers: [DynamicCompilerService],
  exports: [
    DynamicDeliveryModesComponent
  ],
  entryComponents: [
    DynamicDeliveryModesComponent
  ]
})
export class DynamicDeliveryModesModule {
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
