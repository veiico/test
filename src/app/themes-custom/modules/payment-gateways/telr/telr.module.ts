import { CommonModule, isPlatformBrowser } from '@angular/common';
import { NgModule, Injector, Inject, PLATFORM_ID } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material';
import { ModalModule } from '../../../../components/modal/modal.module';
import { TelrService } from '../../../../modules/telr/telr.service';

import { DynamicTelrComponent } from './telr.component';

const customElementTupleArray: [any, string][] = [
  [DynamicTelrComponent, 'app-telr-dynamic'],
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
    DynamicTelrComponent
  ],
  exports: [
    DynamicTelrComponent
  ],
  providers: [
 TelrService
  ],
  entryComponents: [
    DynamicTelrComponent
  ]
})

export class DynamicTelrModule {
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
