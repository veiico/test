import { CommonModule } from '@angular/common';
import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material';

import { ModalModule } from '../../components/modal/modal.module';
import { SslCommerzComponent } from './sslCommerz.component';
import { SslCommerzService } from './sslCommerz.service';


@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    ReactiveFormsModule,
    FormsModule,
    ModalModule
  ],
  declarations: [
    SslCommerzComponent
  ],
  exports: [
    SslCommerzComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    SslCommerzService
  ]
})
export class SslCommerzModule {
}
