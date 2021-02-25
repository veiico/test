import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopupModalComponent } from './components/popup-modal/popup-modal.component';
import { PopUpComponent } from './components/popup/popup.component';
import { PopupModalService } from './services/popup-modal.service';
import { PopUpService } from './services/popup.service';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    PopupModalComponent,
    PopUpComponent
  ],
  exports: [
    PopupModalComponent,
    PopUpComponent
  ],
  providers: [
    PopupModalService,
    PopUpService
  ]
})
export class PopupModule { }
