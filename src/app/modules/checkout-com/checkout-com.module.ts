import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckoutComComponent } from './checkout-com.component';
import { ModalModule } from '../../components/modal/modal.module';
import { PopupModule } from '../popup/popup.module';
import { CheckoutComService } from './checkout-com.service';
import { MatButtonModule } from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@NgModule({
  declarations: [CheckoutComComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    ReactiveFormsModule,
    FormsModule,
    ModalModule
  ],
  exports: [CheckoutComComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [CheckoutComService]
})
export class CheckoutComModule { }
