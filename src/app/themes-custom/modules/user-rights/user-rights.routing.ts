import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DynamicUserRightsComponent } from './user-rights.component';

export const routes: Routes = [
  {
    path: '',
    component: DynamicUserRightsComponent,
    children: []
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DynamicUserRightsRoutingModule { }
