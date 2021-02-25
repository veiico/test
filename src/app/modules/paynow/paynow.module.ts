import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from '../../components/modal/modal.module';
import { PopupModule } from '../popup/popup.module';
import { PaynowComponent } from './paynow.component';
import { PaynowService } from './paynow.service';


@NgModule({
  imports: [
    CommonModule,
    ModalModule,
    PopupModule
  ],
  declarations: [
    PaynowComponent
  ],
  exports: [
    PaynowComponent
  ],
  providers: [
    PaynowService
  ]
})
export class PaynowModule {
}
