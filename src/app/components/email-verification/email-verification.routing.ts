/**
 * Created by cl-macmini-51 on 26/07/18.
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmailVerificationComponent } from './email-verification.component';

export const routes: Routes = [
  {
    path: '',
    component: EmailVerificationComponent,
    children: []
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes)],
  exports: [ RouterModule ]
})
export class EmailVerificationRoutingModule {}
