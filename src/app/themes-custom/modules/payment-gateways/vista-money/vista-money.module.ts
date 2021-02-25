import { CommonModule, isPlatformBrowser } from '@angular/common';
import { NgModule, Injector, Inject, PLATFORM_ID } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material';

import { DynamicVistaMoneyComponent } from './vista-money.component';
import { ModalModule } from '../../../../components/modal/modal.module';
import { VistaService } from '../../../../modules/vista/vista.service';
import { VistaModule } from '../../../../modules/vista/vista.module';

const customElementTupleArray: [any, string][] = [
  [DynamicVistaMoneyComponent, 'app-vista-money-dynamic'],
];
declare var require: any;
@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    ReactiveFormsModule,
    FormsModule,
    ModalModule,
    VistaModule
  ],
  declarations: [
    DynamicVistaMoneyComponent
  ],
  exports: [
    DynamicVistaMoneyComponent
  ],
  entryComponents: [
    DynamicVistaMoneyComponent
  ],
  providers: [
    VistaService
  ]
})
export class DynamicVistaMoneyModule {
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
