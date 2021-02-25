import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from '../../components/modal/modal.module';
import { PopupModule } from '../popup/popup.module';
import { PayMobComponent } from './paymob.component';
import { PayMobService } from './paymob.service';


@NgModule({
  imports: [
    CommonModule,
    ModalModule,
    PopupModule
  ],
  declarations: [
    PayMobComponent
  ],
  exports: [
    PayMobComponent
  ],
  providers: [
    PayMobService
  ]
})
export class PayMobModule {
}
