import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DynamicOrdersComponent } from './orders.component';

export const routes: Routes = [
  {
    path: '',
    component: DynamicOrdersComponent,
    children: []
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DynamicOrdersRoutingModule { }
