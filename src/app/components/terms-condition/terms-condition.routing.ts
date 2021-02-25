/**
 * Created by cl-macmini-51 on 02/05/18.
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TermsConditionComponent } from './terms-condition.component';

export const routes: Routes = [
  {
    path: '',
    component: TermsConditionComponent,
    children: []
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes)],
  exports: [ RouterModule ]
})
export class TermsConditionRoutingModule {}
