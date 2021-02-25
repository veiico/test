import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Inject, Injector, NgModule, PLATFORM_ID } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material';

import { ModalModule } from '../../../../components/modal/modal.module';
import { FacService } from '../../../../modules/fac/fac.service';
import { DynamicFacComponent } from './fac.component';
// import { DynamicFacCardListComponent } from './get-card.component';
// import { DynamicFacAddCardComponent } from './add-card.component';
import { FacModule } from '../../../../modules/fac/fac.module';


const customElementTupleArray: [any, string][] = [
  [DynamicFacComponent, 'app-fac-dynamic'],
]
declare var require: any;


@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    ReactiveFormsModule,
    FormsModule,
    ModalModule,
    FacModule
  ],
  declarations: [
    DynamicFacComponent,
    // DynamicFacCardListComponent,
    // DynamicFacAddCardComponent
   
  ],
  exports: [
    DynamicFacComponent,
    // DynamicFacCardListComponent,
    // DynamicFacAddCardComponent
   
  ],
  providers: [
    FacService
  ],
  entryComponents: [DynamicFacComponent]
})
export class DynamicFacModule {
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
