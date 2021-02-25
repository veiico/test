import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ValidationService } from '../../services/validation.service';
import { ControlMessagesComponent } from './components/control-messages';
import { Sanitize } from './pipes/sanitize.pipe';
import { AppColorDirective } from '../../directives/app-color.directive';
import { PopupModule } from '../popup/popup.module';

@NgModule({
  imports: [
    CommonModule,
    PopupModule
  ],
  declarations: [ControlMessagesComponent,Sanitize, AppColorDirective],
  exports: [ControlMessagesComponent,Sanitize, AppColorDirective,PopupModule],
  providers: [ValidationService]
})
export class JwCommonModule { }
