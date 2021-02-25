import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Inject, Injector, NgModule, PLATFORM_ID } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { JwCommonModule } from '../../../modules/jw-common/jw-common.module';
import { ValidationService } from '../../../services/validation.service';
import { DynamicApplyLoyatyPointsComponent } from './components/basic/apply-loyalty-points.component';
import { DynamicLaundryLoyaltyComponent } from './components/laundry-loyalty/laundry-loyalty.component';


const customElementTupleArray: [any, string][] = [
  [DynamicApplyLoyatyPointsComponent, 'app-apply-loyalty-points-dynamic'],
  [DynamicLaundryLoyaltyComponent, 'app-laundry-loyalty-dynamic'],
]
declare var require: any;

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    JwCommonModule
  ],
  providers: [ValidationService],
  declarations: [
    DynamicApplyLoyatyPointsComponent,
    DynamicLaundryLoyaltyComponent
  ],
  exports: [
    DynamicApplyLoyatyPointsComponent,
    DynamicLaundryLoyaltyComponent
  ],
  entryComponents: [
    DynamicApplyLoyatyPointsComponent,
    DynamicLaundryLoyaltyComponent
  ]
})
export class DynamicApplyLoyatyPointsModule {
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
