import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Inject, Injector, NgModule, PLATFORM_ID } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FuguIntelInputService } from '../../../components/fugu-tel-input/fugu-tel-input.service';
import { JwCommonModule } from '../../../modules/jw-common/jw-common.module';
import { DynamicFuguTelInputComponent } from './fugu-tel-input.component';


const customElementTupleArray: [any, string][] = [
    [DynamicFuguTelInputComponent, 'app-fugu-tel-input-dynamic'],
]
declare var require: any;


@NgModule({
    imports: [
        CommonModule,
        JwCommonModule,
        FormsModule,
        ReactiveFormsModule
    ],
    declarations: [
        DynamicFuguTelInputComponent,
    ],
    exports: [
        DynamicFuguTelInputComponent
    ],
    entryComponents: [
        DynamicFuguTelInputComponent
    ],
    providers: [
        FuguIntelInputService
    ]
})
export class DynamicFuguTelInputModule {
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
