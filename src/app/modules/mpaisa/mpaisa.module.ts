import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material';

import { ModalModule } from '../../components/modal/modal.module';
import { MPaisaComponent } from './mpaisa.component';
import { MPaisaService } from './mpaisa.service';


@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    ReactiveFormsModule,
    FormsModule,
    ModalModule
  ],
  declarations: [
    MPaisaComponent
  ],
  exports: [
    MPaisaComponent
  ],
  providers: [
    MPaisaService
  ]
})
export class MPaisaModule {
}
