import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ShowOrderAdditionalInfoComponent } from './show-order-additional-info.component';
import { DecimalConfigPipeModule } from '../decimal-config-pipe.module';
import { DateTimeFormatPipeModule } from '../pipe.module';

@NgModule({
    imports: [
        CommonModule,
        DecimalConfigPipeModule,
      DateTimeFormatPipeModule
    ],
    providers: [],
    declarations: [ShowOrderAdditionalInfoComponent],
    exports: [ShowOrderAdditionalInfoComponent]
})
export class ShowOrderAdditonalInfoModule { }
