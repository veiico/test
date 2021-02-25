import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DynamicCatalogueComponent } from './catalogue.component';

export const routes: Routes = [
  {
    path: '',
    component: DynamicCatalogueComponent,
    children: []
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes)],
  exports: [ RouterModule ]
})
export class DynamicCatalogueRoutingModule {}
