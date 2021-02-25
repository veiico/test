import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MerchantProfileComponent } from './merchantProfile.component';

export const routes: Routes = [
  {
    path: '',
    component: MerchantProfileComponent,
    children: []
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes)],
  exports: [ RouterModule ]
})
export class MerchantProfileRoutingModule {}
