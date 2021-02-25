/**
 * Created by cl-macmini-51 on 26/07/18.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedLoadModule } from '../../modules/shared-load.module';
import { EmailVerificationRoutingModule } from './email-verification.routing';

import { EmailVerificationComponent } from './email-verification.component';

import { EmailVerificationService } from './email-verification.service'
import { FooterModule } from '../../modules/footer/footer.module';

@NgModule({
  imports: [
    CommonModule,
    EmailVerificationRoutingModule,
    SharedLoadModule,
    FooterModule
  ],
  declarations: [
    EmailVerificationComponent
  ],
  providers: [
    EmailVerificationService
  ]
})
export class EmailVerificationModule {}
