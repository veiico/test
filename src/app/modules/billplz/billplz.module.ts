/**
 * Created by mba-214 on 02/11/18.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from '../../components/modal/modal.module';
import { BillPlzService } from './billplz.service';
import { BillPlzComponent } from './billplz.component';


@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    ReactiveFormsModule,
    FormsModule,
    ModalModule
  ],
  declarations: [
    BillPlzComponent
  ],
  exports: [
    BillPlzComponent
  ],
  providers: [
    BillPlzService
  ]
})
export class BillPlzModule {
}
