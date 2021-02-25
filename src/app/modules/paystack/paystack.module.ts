import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from '../../components/modal/modal.module';
import { PaystackComponent } from './paystack.component';
import { PaystackService } from './paystack.service';


@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    ReactiveFormsModule,
    FormsModule,
    ModalModule
  ],
  declarations: [
    PaystackComponent
  ],
  exports: [
    PaystackComponent
  ],
  providers: [
    PaystackService
  ]
})
export class PaystackModule {
}
