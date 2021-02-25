import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Inject, Injector, NgModule, PLATFORM_ID } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { LoginService } from '../../../components/login/login.service';
import { DynamicFuguTelInputModule } from '../fugu-tel-input/fugu-tel-input.module';
import { DynamicGoogleLoginModule } from '../google-login/google-login.module';
import { DynamicJwCommonModule } from '../jw-common/jw-common.module';
import { DynamicPhoneEmailHybridModule } from '../phone-email-hybrid/phone-email-hybrid.module';
import { DynamicLoginComponent } from './login.component';

const customElementTupleArray: [any, string][] = [
    [DynamicLoginComponent, 'app-login-dynamic'],
]
declare var require: any;
@NgModule({
    imports: [
        CommonModule,
        DynamicJwCommonModule,
        RouterModule,
        DynamicFuguTelInputModule,
        FormsModule,
        ReactiveFormsModule,
        DynamicPhoneEmailHybridModule,
        DynamicGoogleLoginModule
    ],
    declarations: [
        DynamicLoginComponent,
    ],
    exports: [
        DynamicLoginComponent
    ],
    entryComponents: [DynamicLoginComponent],
    providers: [
        LoginService
    ]
})
export class DynamicLoginModule {
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
