import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DynamicPaymentComponent } from './payment.component';

export const routes: Routes = [
  {
    path: '',
    component: DynamicPaymentComponent,
    children: []
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DynamicPaymentRoutingModule { }
