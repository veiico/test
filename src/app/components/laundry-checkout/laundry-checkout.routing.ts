/**
 * Created by mba-214 on 23/10/18.
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CheckOutLaundryComponent } from './laundry-checkout.component';

export const routes: Routes = [
  {
    path: '',
    component: CheckOutLaundryComponent,
    children: []
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes)],
  exports: [ RouterModule ]
})
export class CheckoutLaundryRoutingModule {}
