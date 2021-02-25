import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagopluxComponent } from './pagoplux.component';
import { PaymentService } from '../../components/payment/payment.service';

@NgModule({
  declarations: [PagopluxComponent],
  imports: [
    CommonModule
  ],
  exports: [PagopluxComponent],
  providers: [PaymentService]
})
export class PagopluxModule { }
