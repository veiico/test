import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WhooshComponent } from './whoosh.component';
import { PaymentService } from '../../components/payment/payment.service';

@NgModule({
  declarations: [WhooshComponent],
  imports: [
    CommonModule
  ],
  exports: [WhooshComponent],
  providers: [PaymentService]
})
export class WhooshModule { }
