import { CommonModule, isPlatformBrowser } from '@angular/common';
import { NgModule, Injector, Inject, PLATFORM_ID } from '@angular/core';
import { DynamicNLevelCategoryComponent } from './components/n-level-category/n-level-category.component';
import { DynamicNLevelCategoryPathComponent } from './components/n-level-category-path/n-level-category-path.component';


const customElementTupleArray: [any, string][] = [
    [DynamicNLevelCategoryComponent, 'app-n-level-category-dynamic'],
    [DynamicNLevelCategoryPathComponent, 'app-n-level-category-path-dynamic']
]
declare var require: any;

@NgModule({
    imports: [
        CommonModule,
    ],
    providers: [],
    declarations: [DynamicNLevelCategoryComponent, DynamicNLevelCategoryPathComponent],
    exports: [DynamicNLevelCategoryComponent, DynamicNLevelCategoryPathComponent],
    entryComponents: [DynamicNLevelCategoryComponent, DynamicNLevelCategoryPathComponent]
})
export class DynamicNLevelCatalogueModule {
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
