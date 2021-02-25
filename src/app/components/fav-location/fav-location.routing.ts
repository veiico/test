/**
 * Created by cl-macmini-51 on 21/05/18.
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FavLocationComponent } from './fav-location.component';

export const routes: Routes = [
  {
    path: '',
    component: FavLocationComponent,
    children: []
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes)],
  exports: [ RouterModule ]
})
export class FavLocationRoutingModule {}
