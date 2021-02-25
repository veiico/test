import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DynamicRestaurantsNewComponent } from './restaurants-new.component';


export const routes: Routes = [
  {
    path: '',
    component: DynamicRestaurantsNewComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DynamicRestaurantsNewRoutingModule { }
