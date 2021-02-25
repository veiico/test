import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { validations } from '../../../../constants/constant';
import { SessionService } from '../../../../services/session.service';
import { ValidationService } from '../../../../services/validation.service';

@Component({
    selector: 'app-apply-loyalty-points',
    templateUrl: './apply-loyalty-points.component.html',
    styleUrls: ['../../../../components/payment/payment.scss'],
    // encapsulation: ViewEncapsulation.None
})
export class ApplyLoyatyPointsComponent implements OnInit {
    languageStrings: any={};
    direction: string;
    loyaltyForm: FormGroup;
    selectPoints: boolean;
    config: any
    languageSelected;
    terminology;
    @Input() maxRedemptionPoints: number;
    @Input() originalPoints: number;
    @Output() applyPointsEvent: EventEmitter<any> = new EventEmitter<any>();
    constructor(public sessionService: SessionService,
        protected formBuilder: FormBuilder,
        protected validationService: ValidationService
    ) {
        if (this.sessionService.getString('language')) {
            this.languageSelected = this.sessionService.getString('language');
            if (this.languageSelected === 'ar') {
                this.direction = 'rtl';
            } else {
                this.direction = 'ltr';
            }
        } else {
            this.languageSelected = 'en';
            if (this.languageSelected === 'ar') {
                this.direction = 'rtl';
            } else {
                this.direction = 'ltr';
            }
        }
    }

    ngOnInit() {
        this.config = this.sessionService.get('config');
        this.terminology = this.config.terminology;
        this.initLoyaltyForm();
        this.sessionService.langStringsPromise.then(() =>
        {
         this.languageStrings = this.sessionService.languageStrings;
         this.languageStrings.maximum_loyality_you_can_apply = (this.languageStrings.maximum_loyality_you_can_apply || "Maximum loyality point you can apply")
         .replace('LOYALTY_POINTS',this.terminology.LOYALTY_POINTS)
        });
    }

    /**
     * init loyalty form
     */

    initLoyaltyForm() {
        this.loyaltyForm = this.formBuilder.group({
            loyalty_point: ['', [Validators.required, Validators.pattern(validations.onlyNumbers)]],
            enable: [false]
        });
    }


    /**
     * submit loyalty points
     */

    submitLoyaltyPoints() {
        if (!this.loyaltyForm.valid) {
            return this.validationService.validateAllFormFields(this.loyaltyForm);
        }
        this.applyPointsEvent.emit({
            points: +this.loyaltyForm.controls.loyalty_point.value
        })
    }

}

