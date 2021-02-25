import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PayhereComponent } from './payhere.component';
import { MatButtonModule } from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ModalModule } from '../../components/modal/modal.module';
import { PayhereService } from './payhere.service';

@NgModule({
  declarations: [PayhereComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    ReactiveFormsModule,
    FormsModule,
    ModalModule
  ],
  exports: [PayhereComponent],
  // schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [PayhereService]
})
export class PayhereModule { }
