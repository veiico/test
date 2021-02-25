/**
 * Created by cl-macmini-51 on 01/06/18.
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductDetailsComponent } from './product-details.component';

export const routes: Routes = [
  {
    path: '',
    component: ProductDetailsComponent,
    children: []
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes)],
  exports: [ RouterModule ]
})
export class ProductDetailsRoutingModule {}
