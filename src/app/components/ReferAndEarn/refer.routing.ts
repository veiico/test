/**
 * Created by cl-macmini-51 on 02/05/18.
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReferComponent } from './refer.component';
import { ReferParentComponent } from './refer-parent.component';

export const routes: Routes = [

  {
    path: '',
    component: ReferParentComponent,
    children: [
      {
        path: '',
        component: ReferComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReferRoutingModule { }
