import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Inject, Injector, NgModule, PLATFORM_ID } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { CalendarModule } from 'primeng/calendar';

import { FuguTelInputModule } from '../../../components/fugu-tel-input/fugu-tel-input.module';
import { SignupService } from '../../../components/signup/signup.service';
import { JwCommonModule } from '../../../modules/jw-common/jw-common.module';
import { DynamicCustomerSubscriptionModule } from '../customer-subscription/customer-subscription.module';
import { DynamicSignupComponent } from './signup.component';


const customElementTupleArray: [any, string][] = [
    [DynamicSignupComponent, 'app-signup-dynamic'],
];
declare var require: any;

@NgModule({
    imports: [
        CommonModule,
        JwCommonModule,
        RouterModule,
        FuguTelInputModule,
        FormsModule,
        MatCheckboxModule,
        OwlDateTimeModule,
        OwlNativeDateTimeModule,
        ReactiveFormsModule,
        DynamicCustomerSubscriptionModule,
        CalendarModule
    ],
    declarations: [
        DynamicSignupComponent,
    ],
    exports: [
        DynamicSignupComponent
    ],
    entryComponents: [
        DynamicSignupComponent
    ],
    providers: [
        SignupService
    ]
})
export class DynamicSignupModule {

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
