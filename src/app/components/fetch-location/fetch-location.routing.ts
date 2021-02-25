/**
 * Created by cl-macmini-51 on 21/05/18.
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FetchLocationComponent } from './fetch-location.component';

export const routes: Routes = [
  {
    path: '',
    component: FetchLocationComponent,
    children: []
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes)],
  exports: [ RouterModule ]
})
export class FetchLocationRoutingModule {}
