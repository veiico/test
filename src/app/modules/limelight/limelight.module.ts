import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { ModalModule } from '../../components/modal/modal.module';
import { PopupModule } from '../popup/popup.module';
import { LimelightComponent } from './limelight.component';
import { LimeLightService } from './limelight.service';



@NgModule({
  imports: [
    CommonModule,
    ModalModule,
    PopupModule
  ],
  declarations: [
    LimelightComponent
  ],
  exports: [
    LimelightComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    LimeLightService
  ]
})
export class LimeLightModule {
}
