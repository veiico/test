import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AzulComponent } from './azul.component';
import { MatButtonModule } from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ModalModule } from '../../components/modal/modal.module';
// import { AzulService } from './azul.service';
import { PaymentService } from '../../components/payment/payment.service';

@NgModule({
  declarations: [AzulComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    ReactiveFormsModule,
    FormsModule,
    ModalModule
  ],
  exports: [AzulComponent],
  providers: [PaymentService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AzulModule { }
