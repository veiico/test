/**
 * Created by cl-macmini-51 on 02/05/18.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrivacyPolicyRoutingModule } from './privacy-policy.routing';
import { PrivacyPolicyComponent } from './privacy-policy.component';
import { SharedModule } from '../../modules/shared.module';
import { FooterModule } from '../../modules/footer/footer.module';


@NgModule({
  imports: [
    CommonModule,
    PrivacyPolicyRoutingModule,
    SharedModule,
    FooterModule
  ],
  declarations: [
    PrivacyPolicyComponent
  ],
  providers: [
  ]
})
export class PrivacyPolicyModule {
}
