import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NLevelCategoryComponent } from './components/n-level-category/n-level-category.component';
import { NLevelCategoryPathComponent } from './components/n-level-category-path/n-level-category-path.component';

@NgModule({
    imports: [
        CommonModule,
    ],
    providers: [],
    declarations: [NLevelCategoryComponent, NLevelCategoryPathComponent],
    exports: [NLevelCategoryComponent, NLevelCategoryPathComponent]
})
export class NLevelCatalogueModule { }
