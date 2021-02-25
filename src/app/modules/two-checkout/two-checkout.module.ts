import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TwoCheckoutComponent } from './two-checkout.component';
import { ModalModule } from '../../components/modal/modal.module';
import { PopupModule } from '../popup/popup.module';
import { TwoCheckoutService } from './two-checkout.service';

@NgModule({
  declarations: [TwoCheckoutComponent],
  imports: [
    CommonModule,
    ModalModule,
    PopupModule
  ],
  exports: [TwoCheckoutComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [TwoCheckoutService]
})
export class TwoCheckoutModule { }
