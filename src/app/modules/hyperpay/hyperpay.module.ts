import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HyperpayComponent } from './hyperpay.component';
import { HyperPayService } from './hyperpay.service';
// import { FormsModule } from '@angular/forms';
// import { ModalModule } from 'src/app/components/modal/modal.module';

@NgModule({
  declarations: [HyperpayComponent],
  imports: [
    CommonModule,
    // FormsModule,
    // ModalModule
  ],
  exports: [HyperpayComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [HyperPayService]
})
export class HyperpayModule { }
