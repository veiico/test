import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurlecComponent } from './curlec.component';
// import { CurlecService } from './curlec.service';
import { PaymentService } from '../../components/payment/payment.service';

@NgModule({
  declarations: [CurlecComponent],
  imports: [
    CommonModule
  ],
  exports: [CurlecComponent],
  providers: [PaymentService]
})
export class CurlecModule { }
