import { NgModule, Injector, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FuguTelInputModule } from '../../../../app/components/fugu-tel-input/fugu-tel-input.module';
import { JwCommonModule } from '../../../../app/modules/jw-common/jw-common.module';
import { OtpVerificationService } from '../../../../app/components/otp-verification/otp-verification.service';
import { OtpVerificationDynamicComponent } from './otp-verification.component';

const customElementTupleArray: [any, string][] = [
    [OtpVerificationDynamicComponent, 'app-otp-verification-dynamic'],
  ]
  declare var require: any;

@NgModule({
  declarations: [OtpVerificationDynamicComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FuguTelInputModule,
    JwCommonModule
  ],
  providers: [ 
    OtpVerificationService,
],
exports:[OtpVerificationDynamicComponent],
entryComponents: [OtpVerificationDynamicComponent]
})
export class DynamicOtpVerificationModule { 
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
