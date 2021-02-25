import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyFatooraComponent } from './my-fatoora.component';
import { ModalModule } from '../../components/modal/modal.module';
// import { MyFatooraService } from './my-fatoora.service';
import { PaymentService } from '../../components/payment/payment.service';

@NgModule({
  declarations: [MyFatooraComponent],
  imports: [
    CommonModule,
    ModalModule
  ],
  exports: [MyFatooraComponent],
  providers: [PaymentService]
})
export class MyFatooraModule { }
