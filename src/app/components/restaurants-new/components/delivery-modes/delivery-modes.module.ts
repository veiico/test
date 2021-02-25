/**
 * Created by cl-macmini-51 on 16/08/18.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DeliveryModesComponent } from './delivery-modes.component';
import { TooltipModule } from 'primeng/tooltip';


@NgModule({
  imports: [
    CommonModule,
    TooltipModule
  ],
  declarations: [
    DeliveryModesComponent
  ],
  providers: [],
  exports: [
    DeliveryModesComponent
  ]
})
export class DeliveryModesModule {
}
