import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SubscriptionOrdersComponent } from './components/subscription-orders/subscription-orders.component';



export const routes: Routes = [
  {
    path: '',
    component: SubscriptionOrdersComponent,
    children: []
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes)],
  exports: [ RouterModule ]
})
export class SubscriptionsRoutingModule {}
