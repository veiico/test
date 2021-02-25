import { NgModule } from '@angular/core';

import { DateTimeFormatPipe } from '../pipes/date-format.pipe';

@NgModule({
  declarations: [
    DateTimeFormatPipe
  ],
  exports: [
    DateTimeFormatPipe
  ]
})
export class DateTimeFormatPipeModule { }
