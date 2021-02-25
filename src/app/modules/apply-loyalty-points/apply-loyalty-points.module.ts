import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { ValidationService } from '../../services/validation.service';
import { JwCommonModule } from '../jw-common/jw-common.module';
import { ApplyLoyatyPointsComponent } from './components/basic/apply-loyalty-points.component';
import { LaundryLoyaltyComponent } from './components/laundry-loyalty/laundry-loyalty.component';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        JwCommonModule
    ],
    providers: [ValidationService],
    declarations: [
      ApplyLoyatyPointsComponent,
      LaundryLoyaltyComponent
    ],
    exports: [
      ApplyLoyatyPointsComponent,
      LaundryLoyaltyComponent
    ]
})
export class ApplyLoyatyPointsModule { }
