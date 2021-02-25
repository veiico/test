import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerVerificationPopupComponent } from './customer-verification-popup.component';
import { ModalModule } from '../modal/modal.module';

@NgModule({
  declarations: [CustomerVerificationPopupComponent],
  imports: [
    CommonModule,
    ModalModule
  ],
  exports:[CustomerVerificationPopupComponent]
})
export class CustomerVerificationPopupModule { }
