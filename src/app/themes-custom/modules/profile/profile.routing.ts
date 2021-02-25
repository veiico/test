import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DynamicProfileComponent } from './profile.component';


export const routes: Routes = [
  {
    path: '',
    component: DynamicProfileComponent,
    children: []
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes)],
  exports: [ RouterModule ]
})
export class DynamicProfileRoutingModule {}
