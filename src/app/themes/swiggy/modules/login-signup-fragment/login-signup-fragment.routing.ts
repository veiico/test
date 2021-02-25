import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginSignupFragmentComponent } from './login-signup-fragment.component';

export const routes: Routes = [
  {
    path: '',
    component: LoginSignupFragmentComponent,
    children: []
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes)],
  exports: [ RouterModule ]
})
export class LoginSignupFragmentRoutingModule {}
