/**
 * Created by cl-macmini-51 on 02/05/18.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../modules/shared.module';

import { UserRightsRoutingModule } from './user-rights.routing';
import { UserRightsComponent } from './user-rights.component';

import { PopupModalService } from '../../modules/popup/services/popup-modal.service';
import { UserRightsService } from './user-rights.service';
import { FooterModule } from '../../modules/footer/footer.module';


@NgModule({
  imports: [
    CommonModule,
    UserRightsRoutingModule,
    SharedModule,
    FooterModule
  ],
  declarations: [
    UserRightsComponent
  ],
  providers: [
    PopupModalService,
    UserRightsService
  ]
})
export class UserRightsModule {
}
