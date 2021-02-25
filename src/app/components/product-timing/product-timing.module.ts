/**
 * Created by cl-macmini-51 on 20/04/18.
 */
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material';
import { CalendarModule } from 'primeng/calendar';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';

import { AppProductTimingComponent } from './product-timing.component';
import { ProductTimingService } from './product-timing.service';
import { DateTimeFormatPipeModule } from '../../modules/pipe.module';
import { PrivacyPolicyModule } from '../privacy-policy/privacy-policy.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CalendarModule,
    BsDatepickerModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    MatButtonModule,
    DateTimeFormatPipeModule,
    PrivacyPolicyModule
    // StarRatingsModule
  ],
  declarations: [
    AppProductTimingComponent,
    // StarRatingComponent
  ],
  exports: [
    AppProductTimingComponent
  ],
  providers: [
    ProductTimingService
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class ProductTimingModule {
}
