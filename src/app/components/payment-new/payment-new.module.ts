/**
 * Created by cl-macmini-51 on 02/05/18.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { PaymentNewComponent } from './payment-new.component';
import { CheckoutLaundryModule } from '../laundry-checkout/laundry-checkout.module';
import { PaymentModule } from '../payment/payment.module';
import { ModalModule } from '../modal/modal.module';
import { DebtModule } from '../show-debt/show-debt.module';

const paymentNewRoutes: Routes = [
  {
    path: '',
    component: PaymentNewComponent,
    children: []
  }
]

@NgModule({
  imports: [
    CommonModule,
    CheckoutLaundryModule,
    PaymentModule,
    RouterModule.forChild(paymentNewRoutes)
  ],
  declarations: [
    PaymentNewComponent
  ],
  providers: [

  ]
})
export class PaymentNewModule {
}
