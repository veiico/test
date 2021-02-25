/**
 * Created by cl-macmini-51 on 16/10/18.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { JwCommonModule } from '../../../../modules/jw-common/jw-common.module';
import { PopupModule } from '../../../../modules/popup/popup.module';
import { ModalModule } from '../../../modal/modal.module';
import { ChangeApiUrlComponent } from './change-api-url.component';
import { HeaderService } from '../../header.service';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    JwCommonModule,
    PopupModule,
    ModalModule
  ],
  declarations: [
    ChangeApiUrlComponent
  ],
  exports: [
    JwCommonModule,
    PopupModule,
    ChangeApiUrlComponent
  ],
  providers: [HeaderService]
})
export class ChangeUrlModule { }
