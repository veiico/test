import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MpesaComponent } from './mpesa.component';

@NgModule({
  declarations: [MpesaComponent],
  imports: [
    CommonModule
  ],
  exports: [MpesaComponent]
})
export class MpesaModule { }
