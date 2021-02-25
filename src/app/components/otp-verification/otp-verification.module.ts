import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OtpPlusChangePasswordComponent } from './otp-plus-change-password/otp-plus-change-password.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OtpVerificationService } from './otp-verification.service'
import { FuguTelInputModule } from '../fugu-tel-input/fugu-tel-input.module';
import { JwCommonModule } from '../../../app/modules/jw-common/jw-common.module';

@NgModule({
  declarations: [OtpPlusChangePasswordComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FuguTelInputModule,
    JwCommonModule
  ],
  providers: [ 
    OtpVerificationService,
],
exports:[OtpPlusChangePasswordComponent]
})
export class OtpVerificationModule { }
