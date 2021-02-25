import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Inject, Injector, NgModule, PLATFORM_ID } from '@angular/core';

import { GoogleLoginService } from '../../../components/google-login/google-login.service';
import { DynamicGoogleLoginComponent } from './google-login.component';


const customElementTupleArray: [any, string][] = [
    [DynamicGoogleLoginComponent, 'app-google-login-dynamic']
]
declare var require: any;


@NgModule({
    imports: [CommonModule],
    declarations: [DynamicGoogleLoginComponent],
    exports: [DynamicGoogleLoginComponent],
    entryComponents: [DynamicGoogleLoginComponent],
    providers: [GoogleLoginService]
})
export class DynamicGoogleLoginModule {

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
