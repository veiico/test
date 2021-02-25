import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaynetComponent } from './paynet.component';
// import { PaynetService } from './paynet.service';
import { PaymentService } from '../../components/payment/payment.service';

@NgModule({
  declarations: [PaynetComponent],
  imports: [
    CommonModule
  ],
  exports: [PaynetComponent],
  providers: [PaymentService]
})
export class PaynetModule { }
