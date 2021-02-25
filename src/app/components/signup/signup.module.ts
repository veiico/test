import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignupComponent } from './signup.component';
import { SignupService } from './signup.service';
import { JwCommonModule } from '../../modules/jw-common/jw-common.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FuguTelInputModule } from '../fugu-tel-input/fugu-tel-input.module';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { MatCheckboxModule } from '@angular/material';
import { MultiSelectModule } from 'primeng/multiselect';
import { RouterModule } from '@angular/router';
import { CustomerSubscriptionModule } from '../customer-subscription/customer-subscription.module';
import { DecimalConfigPipeModule } from '../../modules/decimal-config-pipe.module';
import { DateTimeFormatPipeModule } from "../../modules/pipe.module";
import { CalendarModule } from 'primeng/calendar';
import {DropdownModule} from 'primeng/dropdown';

@NgModule({
    imports: [
      CommonModule,
      JwCommonModule,
      RouterModule,
      FuguTelInputModule,
      FormsModule,
      MatCheckboxModule,
      OwlDateTimeModule,
      OwlNativeDateTimeModule,
      ReactiveFormsModule,
      CustomerSubscriptionModule,
      DateTimeFormatPipeModule,
      MultiSelectModule,
      DropdownModule,
      CalendarModule,
    ],
    declarations: [
        SignupComponent,
    ],
    exports: [
        SignupComponent
    ],
    providers: [
        SignupService
    ]
})
export class SignupModule {
}
