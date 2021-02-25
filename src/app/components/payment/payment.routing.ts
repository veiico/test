/**
 * Created by cl-macmini-51 on 02/05/18.
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PaymentComponent } from './payment.component';

export const routes: Routes = [
  {
    path: '',
    component: PaymentComponent,
    children: []
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes)],
  exports: [ RouterModule ]
})
export class PaymentRoutingModule {}
