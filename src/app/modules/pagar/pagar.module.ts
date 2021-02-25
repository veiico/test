import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagarComponent } from './pagar.component';
import { PaymentService } from '../../components/payment/payment.service';

@NgModule({
  declarations: [PagarComponent],
  imports: [
    CommonModule
  ],
  exports: [PagarComponent],
  providers: [PaymentService]
})
export class PagarModule { }
