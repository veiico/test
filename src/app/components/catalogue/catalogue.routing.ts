/**
 * Created by cl-macmini-51 on 20/04/18.
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CatalogueComponent } from './catalogue.component';

export const routes: Routes = [
  {
    path: '',
    component: CatalogueComponent,
    children: []
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes)],
  exports: [ RouterModule ]
})
export class CatalogueRoutingModule {}
