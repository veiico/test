import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderPlacedPopupComponent } from './order-placed-popup.component';
import { JwCommonModule } from '../../modules/jw-common/jw-common.module';
import { ModalModule } from '../modal/modal.module';

@NgModule({
  declarations: [OrderPlacedPopupComponent],
  imports: [
    CommonModule,
    JwCommonModule,
    ModalModule
    ],
  exports:[OrderPlacedPopupComponent],
})
export class OrderPlacedPopupModule { }
