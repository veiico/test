import { CommonModule, isPlatformBrowser } from '@angular/common';
import { NgModule, Injector, Inject, PLATFORM_ID } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material';

import { DynamicMPaisaComponent } from './mpaisa.component';
import { ModalModule } from '../../../../components/modal/modal.module';
import { MPaisaService } from '../../../../modules/mpaisa/mpaisa.service';

const customElementTupleArray: [any, string][] = [
  [DynamicMPaisaComponent, 'app-mpaisa-dynamic'],
];
declare var require: any;
@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    ReactiveFormsModule,
    FormsModule,
    ModalModule
  ],
  declarations: [
    DynamicMPaisaComponent
  ],
  exports: [
    DynamicMPaisaComponent
  ],
  entryComponents: [
    DynamicMPaisaComponent
  ],
  providers: [
    MPaisaService
  ]
})
export class DynamicMPaisaModule {
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
