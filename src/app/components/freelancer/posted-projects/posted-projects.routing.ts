/**
 * Created by cl-macmini-51 on 25/07/18.
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PostedProjectComponents } from './posted-projects.component';

export const routes: Routes = [
  {
    path: '',
    component: PostedProjectComponents
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes)],
  exports: [ RouterModule ]
})
export class PostedProjectRoutingModule {}
