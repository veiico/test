/**
 * Created by cl-macmini-51 on 20/04/18.
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OftenBoughtComponent } from './often-bought.component';

export const routes: Routes = [
  {
    path: '',
    component: OftenBoughtComponent,
    children: []
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes)],
  exports: [ RouterModule ]
})
export class OftenBoughtRoutingModule {}
