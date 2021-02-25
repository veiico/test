/**
 * Created by cl-macmini-51 on 11/09/18.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from "./modal.component";

import { KeyboardEvent } from '../../directives/keyboard-event.directive';


@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    ModalComponent,
    KeyboardEvent
  ],
  providers: [

  ],
  exports: [ModalComponent, KeyboardEvent]
})
export class ModalModule {
}
