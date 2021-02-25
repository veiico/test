import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaytmComponent } from './paytm.component';

@NgModule({
  declarations: [PaytmComponent],
  imports: [
    CommonModule
  ],
  exports: [PaytmComponent]
})
export class PaytmModule { }
