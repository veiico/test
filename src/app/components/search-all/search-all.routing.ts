/**
 * Created by cl-macmini-51 on 22/06/18.
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SearchAllComponent } from './search-all.component';

export const routes: Routes = [
  {
    path: '',
    component: SearchAllComponent,
    children: []
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes)],
  exports: [ RouterModule ]
})
export class SearchAllRoutingModule {}
