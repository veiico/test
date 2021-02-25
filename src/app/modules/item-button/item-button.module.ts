import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemButtonComponent } from './item-button.component';
import { LogisticsUtilityModule } from '../logistics-utility.module';


@NgModule({
  imports: [
    CommonModule,
    LogisticsUtilityModule
  ],
  declarations: [
    ItemButtonComponent
  ],
  exports: [
    ItemButtonComponent
  ],
  providers: [
  ]
})
export class ItemButtonModule { }
