import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnepayComponent } from './onepay.component';
import { PaymentService } from '../../components/payment/payment.service';

@NgModule({
  declarations: [OnepayComponent],
  imports: [
    CommonModule
  ],
  exports: [OnepayComponent],
  providers: [PaymentService]
})
export class OnepayModule { }
