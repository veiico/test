/**
 * Created by mba-214 on 18/10/18.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { ProfileService } from '../../profile.service';
import { ChangePasswordComponent } from './change-password.component';
import { SharedModule } from '../../../../modules/shared.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [
    ChangePasswordComponent
  ],
  exports: [
    ChangePasswordComponent
  ],
  providers: [
    ProfileService
  ]
})
export class ChangePasswordModule {
}
