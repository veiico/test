/**
 * Created by cl-macmini-51 on 09/10/18.
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReferAndEarnShareComponent } from './referAndEarnShare.component';

export const routes: Routes = [
  {
    path: '',
    component: ReferAndEarnShareComponent,
    children: []
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes)],
  exports: [ RouterModule ]
})
export class ReferAndEarnShareRoutingModule {}
