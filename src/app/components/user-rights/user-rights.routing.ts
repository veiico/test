/**
 * Created by cl-macmini-51 on 02/05/18.
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserRightsComponent } from './user-rights.component';

export const routes: Routes = [
  {
    path: '',
    component: UserRightsComponent,
    children: []
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes)],
  exports: [ RouterModule ]
})
export class UserRightsRoutingModule {}
