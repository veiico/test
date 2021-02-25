/**
 * Created by cl-macmini-51 on 20/07/18.
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FreelancerHomepageComponent } from './freelancer-homepage.component';
import { FreelancerHomeComponent } from '../home/home.component';


export const routes: Routes = [
  {
    path: '',
    component: FreelancerHomepageComponent,
},
// {
//   path: 'home',
//   component: FreelancerHomeComponent,
// }

];

@NgModule({
  imports: [ RouterModule.forChild(routes)],
  exports: [ RouterModule ]
})
export class FreeLancerHomePageRoutingModule {}
