
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RestaurantFilterComponent } from './restaurant-filter.component';
import { CheckboxModule } from 'primeng/checkbox';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RestaurantFilterService } from './restaurant-filter.service';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
    imports: [
        CommonModule,
        CheckboxModule,
        ReactiveFormsModule,
        RadioButtonModule
    ],
    declarations: [
        RestaurantFilterComponent
    ],
    providers: [
        RestaurantFilterService
    ],
    exports: [RestaurantFilterComponent]
})
export class RestaurantFilterModule {
}
