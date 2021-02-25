/**
 * Created by cl-macmini-51 on 24/07/18.
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FreelancerSecondLevelCatComponent } from './second-level-cat.component';

export const routes: Routes = [
  {
    path: '',
    component: FreelancerSecondLevelCatComponent,
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes)],
  exports: [ RouterModule ]
})
export class FreeLancerSecondLevelCatRoutingModule {}
