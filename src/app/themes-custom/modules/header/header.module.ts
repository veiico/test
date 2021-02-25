import { CommonModule, isPlatformBrowser } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Inject, Injector, NgModule, PLATFORM_ID } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AppCartService } from '../../../components/catalogue/components/app-cart/app-cart.service';
import { HeaderService } from '../../../components/header/header.service';
import { JwCommonModule } from '../../../modules/jw-common/jw-common.module';
import { DateTimeFormatPipeModule } from '../../../modules/pipe.module';
import { DynamicJwCommonModule } from '../jw-common/jw-common.module';
import { DynamicLoginModule } from '../login/login.module';
import { DynamicPhoneEmailHybridModule } from '../phone-email-hybrid/phone-email-hybrid.module';
import { DynamicSignupModule } from '../signup/signup.module';
import { DynamicNotificationsComponent } from './components/notifications/notifications.component';
import { DynamicHeaderComponent } from './header.component';
import { DynamicDeliveryModesModule } from '../restaurants-new/components/delivery-modes/delivery-modes.module';
import { DynamicOtpVerificationModule } from '../otp-verification/otp-verification.module';


const customElementTupleArray: [any, string][] = [
  [DynamicNotificationsComponent, 'app-notifications-dynamic'],
  [DynamicHeaderComponent, 'app-header-dynamic']
]
declare var require: any;
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    JwCommonModule,
    ReactiveFormsModule,
    DynamicSignupModule,
    DynamicLoginModule,
    DynamicJwCommonModule,
    DynamicPhoneEmailHybridModule,
    RouterModule,
    DynamicDeliveryModesModule,
    DateTimeFormatPipeModule,
    DynamicOtpVerificationModule
  ],
  declarations: [
    DynamicHeaderComponent,
    DynamicNotificationsComponent
  ],
  exports: [
    DynamicHeaderComponent,
    DynamicNotificationsComponent
  ],
  entryComponents: [
    DynamicHeaderComponent,
    DynamicNotificationsComponent
  ],
  providers: [
    HeaderService,
    AppCartService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DynamicHeaderModule {
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
