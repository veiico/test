import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { serviceTimePipe } from '../pipes/serviceTime.pipe';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    serviceTimePipe
  ],
  exports: [
    serviceTimePipe
  ]
})
export class ServiceTimePipeModule {}
