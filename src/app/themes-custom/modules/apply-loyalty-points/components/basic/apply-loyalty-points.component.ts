import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { ApplyLoyatyPointsComponent } from '../../../../../modules/apply-loyalty-points/components/basic/apply-loyalty-points.component';
import { SessionService } from '../../../../../services/session.service';
import { ValidationService } from '../../../../../services/validation.service';


@Component({
    templateUrl: '../../../../../modules/apply-loyalty-points/components/basic/apply-loyalty-points.component.html',
    styleUrls: ['../../../../../components/payment/payment.scss']
})
export class DynamicApplyLoyatyPointsComponent extends ApplyLoyatyPointsComponent implements OnInit {
    @Input() maxRedemptionPoints: number;
    @Input() originalPoints: number;
    constructor(public sessionService: SessionService,
        protected formBuilder: FormBuilder,
        protected validationService: ValidationService) {
        super(sessionService, formBuilder, validationService)
    }

    ngOnInit() {
        super.ngOnInit()
    }


}

