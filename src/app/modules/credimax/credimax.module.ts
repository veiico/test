import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CredimaxComponent } from './credimax.component';
// import { CredimaxService } from './credimax.service';
import { ModalModule } from '../../components/modal/modal.module';
// import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PaymentService } from '../../components/payment/payment.service';

@NgModule({
  declarations: [CredimaxComponent],
  imports: [
    CommonModule,
    ModalModule
  ],
  exports: [CredimaxComponent],
  providers: [PaymentService]
})
export class CredimaxModule { }
