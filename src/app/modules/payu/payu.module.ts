/**
 * Created by mba-214 on 02/11/18.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PayuService } from './payu.service';
import { PayuComponent } from './payu.component';
import { ModalModule } from '../../components/modal/modal.module';
import { PopupModule } from '../popup/popup.module';


@NgModule({
  imports: [
    CommonModule,
    ModalModule,
    PopupModule
  ],
  declarations: [
    PayuComponent
  ],
  exports: [
    PayuComponent
  ],
  providers: [
    PayuService
  ]
})
export class PayuModule {
}
