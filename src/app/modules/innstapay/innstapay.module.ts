import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InnstapayService } from './innstapay.service';
import { InnstapayComponent } from './innstapay.component';
import { ModalModule } from '../../components/modal/modal.module';


@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    ReactiveFormsModule,
    FormsModule,
    ModalModule
  ],
  declarations: [
    InnstapayComponent
  ],
  exports: [
    InnstapayComponent
  ],
  providers: [
    InnstapayService
  ]
})
export class InnstapayModule {
}
