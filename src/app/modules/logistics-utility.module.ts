import { AgmCoreModule } from '@agm/core';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material';
import { MatCheckboxModule } from '@angular/material/checkbox';

//import { AutocompleteComponent } from '../components/autocomplete/autocomplete.component';
// import { FuguTelInputComponent } from '../components/fugu-tel-input/fugu-tel-input.component';
// import { FuguIntelInputService } from '../components/fugu-tel-input/fugu-tel-input.service';
//import { ModalComponent } from '../components/modal/modal.component';
//import { KeyboardEvent } from '../directives/keyboard-event.directive';
import { NumberOnlyDirective } from '../directives/number-only.directive';
import { ValidationService } from '../services/validation.service';
// import { AppColorDirective } from '../directives/app-color.directive';
import { BoxShadowDirective } from '../directives/box-shadow.directive';
import { BorderColorDirective } from '../directives/border-color.directive';
import { HeaderModule } from '../components/header/header.module';
import { JwCommonModule } from './jw-common/jw-common.module';
import { FuguTelInputModule } from '../components/fugu-tel-input/fugu-tel-input.module';
import { PopupModule } from './popup/popup.module';
import { PhoneEmailHybridModule } from '../components/phone-email-hybrid/phone-email-hybrid.module';
import { AutoCompleteModule } from "../components/autocomplete/autocomplete.module";
import { ModalModule } from "../components/modal/modal.module";


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatButtonModule,
    AgmCoreModule,
    HeaderModule,
    JwCommonModule,
    FuguTelInputModule,
    PopupModule,
    PhoneEmailHybridModule,
    AutoCompleteModule,
    ModalModule

  ],
  declarations: [

    // FuguTelInputComponent,
    //AutocompleteComponent,
    //ModalComponent,
    NumberOnlyDirective,
    //KeyboardEvent,
    // AppColorDirective,
    BoxShadowDirective,
    BorderColorDirective,
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    AgmCoreModule,
    // FuguTelInputComponent,
    //AutocompleteComponent,
    //ModalComponent,
    MatCheckboxModule,
    NumberOnlyDirective,
    //KeyboardEvent,
    // AppColorDirective,
    BoxShadowDirective,
    BorderColorDirective,
    PopupModule,
    FuguTelInputModule,
    JwCommonModule,
    PhoneEmailHybridModule,
    AutoCompleteModule,
    ModalModule
  ],
  providers: [
    // FuguIntelInputService,
    ValidationService,
    // PopupModalService
  ]
})
export class LogisticsUtilityModule { }
