import { CommonModule } from '@angular/common';
import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material';

import { ModalModule } from '../../components/modal/modal.module';
import { WirecardComponent } from './wirecard.component';
import { WirecardService } from './wirecard.service';


@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    ReactiveFormsModule,
    FormsModule,
    ModalModule
  ],
  declarations: [
    WirecardComponent
  ],
  exports: [
    WirecardComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    WirecardService
  ]
})
export class WirecardModule {
}
