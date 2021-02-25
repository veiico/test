import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreorderTimeComponent } from './components/preorder-time/preorder-time.component';
import { ModalModule } from '../../components/modal/modal.module';
import { CalendarModule } from '../../../../node_modules/primeng/calendar';
import { FormsModule, ReactiveFormsModule } from '../../../../node_modules/@angular/forms';
import { JwCommonModule } from '../jw-common/jw-common.module';

@NgModule({
  imports: [
    CommonModule,
    ModalModule,
    CalendarModule,
    FormsModule,
    ReactiveFormsModule,
    JwCommonModule
  ],
  declarations: [PreorderTimeComponent],
  exports: [PreorderTimeComponent]
})
export class PreorderTimeModule { }
