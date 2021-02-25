import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThetellerComponent } from './theteller.component';
import { ModalModule } from '../../components/modal/modal.module';
import { PaymentService } from '../../components/payment/payment.service';
// import { ThetellerService } from './theteller.service';

@NgModule({
  declarations: [ThetellerComponent],
  imports: [
    CommonModule,
    ModalModule
  ],
  exports: [ThetellerComponent],
  providers: [PaymentService]
})
export class ThetellerModule { }
