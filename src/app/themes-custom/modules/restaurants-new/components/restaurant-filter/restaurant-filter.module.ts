import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Inject, Injector, NgModule, PLATFORM_ID } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { RadioButtonModule } from 'primeng/radiobutton';

import { RestaurantFilterService } from '../../../../../components/restaurants-new/components/restaurant-filter/restaurant-filter.service';
import { DynamicRestaurantFilterComponent } from './restaurant-filter.component';


const customElementTupleArray: [any, string][] = [
    [DynamicRestaurantFilterComponent, 'app-merchant-filter-dynamic'],
]
declare var require: any;

@NgModule({
    imports: [
        CommonModule,
        CheckboxModule,
        ReactiveFormsModule,
        RadioButtonModule
    ],
    declarations: [
        DynamicRestaurantFilterComponent
    ],
    providers: [
        RestaurantFilterService
    ],
    exports: [DynamicRestaurantFilterComponent],
    entryComponents: [DynamicRestaurantFilterComponent]
})
export class DynamicRestaurantFilterModule {
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
