/**
 * Created by cl-macmini-51 on 20/07/18.
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FreelancerHomeComponent } from './home.component';

export const routes: Routes = [
  {
    path: '',
    component: FreelancerHomeComponent,
}
];

@NgModule({
  imports: [ RouterModule.forChild(routes)],
  exports: [ RouterModule ]
})
export class FreeLancerHomeRoutingModule {}
