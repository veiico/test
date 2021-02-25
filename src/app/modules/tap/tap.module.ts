import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TapComponent } from './tap.component';
import { ModalModule } from '../../components/modal/modal.module';
import { PaymentService } from '../../components/payment/payment.service';
// import { TapService } from './tap.service';


@NgModule({
  declarations: [TapComponent],
  imports: [
    CommonModule,
    ModalModule
  ],
  exports: [TapComponent],
  providers: [PaymentService]
})
export class TapModule { }

