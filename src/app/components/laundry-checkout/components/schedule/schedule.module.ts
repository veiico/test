
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ScheduleLaundryComponent } from './schedule.component';
import { CalendarLaundryComponent } from '../calendar/calendar.component';
import { DateTimeFormatPipeModule } from '../../../../modules/pipe.module';




@NgModule({
  imports: [
    CommonModule,
    DateTimeFormatPipeModule
  ],
  declarations: [
    ScheduleLaundryComponent,
    CalendarLaundryComponent
  ],
  exports: [
    ScheduleLaundryComponent,
    CalendarLaundryComponent
  ],
  providers: [
  ]
})
export class ScheduleLaundryModule {
}
