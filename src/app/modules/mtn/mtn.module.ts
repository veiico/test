import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MtnComponent } from './mtn.component';
import { PaymentService } from '../../components/payment/payment.service';

@NgModule({
  declarations: [MtnComponent],
  imports: [
    CommonModule
  ],
  exports: [MtnComponent],
  providers: [PaymentService]
})
export class MtnModule { }
