/**
 * Created by cl-macmini-51 on 02/05/18.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TermsConditionRoutingModule } from './terms-condition.routing';
import { TermsConditionComponent } from './terms-condition.component';
import { SharedModule } from '../../modules/shared.module';
import { TermsConditionService } from './terms-condition.service';
import { FooterModule } from '../../modules/footer/footer.module';


@NgModule({
  imports: [
    CommonModule,
    TermsConditionRoutingModule,
    SharedModule,
    FooterModule
  ],
  declarations: [
    TermsConditionComponent
  ],
  providers: [
    TermsConditionService
  ]
})
export class TermsConditionModule {
}
