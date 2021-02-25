import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from '../../components/modal/modal.module';
import { VivaComponent } from './viva.component';
import { VivaService } from './viva.service';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    ReactiveFormsModule,
    FormsModule,
    ModalModule

  ],
  declarations: [
    VivaComponent
  ],
  exports: [
    VivaComponent
  ],
  providers: [
    VivaService 
  ]
})
export class VivaModule { }
