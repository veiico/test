import { NgModule } from '@angular/core';

import { minutesDaysPipe } from '../pipes/minutesDays.pipe';

@NgModule({
  declarations: [
    minutesDaysPipe
  ],
  exports: [
    minutesDaysPipe
  ]
})
export class MinutesPipeModule { }
