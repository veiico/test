import { DynamicJwCommonModule } from '../../../jw-common/jw-common.module';
import { DynamicChangePasswordComponent } from './change-password.component';
import { NgModule, Injector, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProfileService } from '../../../../../components/profile/profile.service';

const customElementTupleArray: [any, string][] = [
  [DynamicChangePasswordComponent, 'app-change-password-dynamic'],
];
declare var require: any;
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DynamicJwCommonModule
  ],
  declarations: [
    DynamicChangePasswordComponent
  ],
  exports: [
    DynamicChangePasswordComponent
  ],
  providers: [
    ProfileService
  ],
  entryComponents:[DynamicChangePasswordComponent]
})
export class DynamicChangePasswordModule {
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
