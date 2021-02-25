
/**
 * Created by mba-214 on 02/11/18.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PayfastService } from './payfast.service';
import { PayfastComponent } from './payfast.component';
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
    PayfastComponent
  ],
  exports: [
    PayfastComponent
  ],
  providers: [
    PayfastService
  ]
})
export class PayfastModule {
}
