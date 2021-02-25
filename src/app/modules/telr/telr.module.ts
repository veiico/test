import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TelrService } from './telr.service';
import { TelrComponent } from './telr.component';
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
    TelrComponent
  ],
  exports: [
    TelrComponent
  ],
  providers: [
    TelrService
  ]
})
export class TelrModule {
}
