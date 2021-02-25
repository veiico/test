import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WipayComponent } from './wipay.component';
import { PaymentService } from '../../components/payment/payment.service';

@NgModule({
  declarations: [WipayComponent],
  imports: [
    CommonModule
  ],
  exports: [WipayComponent],
  providers: [PaymentService]
})
export class WipayModule { }
