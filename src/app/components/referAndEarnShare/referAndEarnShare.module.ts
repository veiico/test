/**
 * Created by cl-macmini-51 on 09/10/18.
 */
/**
 * Created by cl-macmini-51 on 02/05/18.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../modules/shared.module';

import { ReferAndEarnShareComponent } from './referAndEarnShare.component';
import { ReferAndEarnShareService } from './referAndEarnShare.service';
import { ReferAndEarnShareRoutingModule } from './referAndEarnShare.routing';
import { FooterModule } from '../../modules/footer/footer.module';



@NgModule({
  imports: [
    CommonModule,
    ReferAndEarnShareRoutingModule,
    SharedModule,
    FooterModule
  ],
  declarations: [
    ReferAndEarnShareComponent
  ],
  providers: [
    ReferAndEarnShareService
  ]
})
export class ReferAndEarnShareModule {
}
