/**
 * Created by cl-macmini-51 on 26/07/18.
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewBidsComponents } from './view-bids.component';

export const routes: Routes = [
  {
    path: '',
    component: ViewBidsComponents
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes)],
  exports: [ RouterModule ]
})
export class ViewBidsRoutingModule {}
