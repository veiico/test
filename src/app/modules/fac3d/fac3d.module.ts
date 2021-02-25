import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Fac3dComponent } from '../fac3d/fac3d.component';
import { MatButtonModule } from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ModalModule } from '../../components/modal/modal.module';
import { Fac3dService } from '../fac3d/fac3d.service';

@NgModule({
  declarations: [Fac3dComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    ReactiveFormsModule,
    FormsModule,
    ModalModule
  ],
  exports: [
    Fac3dComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    Fac3dService
  ]
})
export class Fac3dModule { }
