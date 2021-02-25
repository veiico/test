import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewContainerRef } from '@angular/core';

import { IDynamicCompilerData } from '../../../interfaces/interfaces';
import {
    ShowOrderAdditionalInfoComponent,
} from '../../../modules/show-order-additional-info/show-order-additional-info.component';
import { DateTimeFormatPipe } from '../../../pipes/date-format.pipe';
import { DecimalConfigPipe } from '../../../pipes/decimalConfig.pipe';
import { DynamicCompilerService } from '../../../services/dynamic-compiler.service';
import { SessionService } from '../../../services/session.service';
import { templates } from '../../constants/template.constant';

@Component({
    template: '<ng-container #orderAdditionalInfoTemplateRef></ng-container>'
})
export class DynamicShowOrderAdditionalInfoComponent extends ShowOrderAdditionalInfoComponent implements OnInit {
    _additionalInformation: any;
    get additionalInformation() {
        return this._additionalInformation;
    }
    @Input() set additionalInformation(val: any) {
        this._additionalInformation = val;
    };
    @Output() closeComponent: EventEmitter<boolean> = new EventEmitter<boolean>();
    dateTimeFormat = new DateTimeFormatPipe(this.sessionService)
    decimalPipe = new DecimalConfigPipe(this.sessionService);

    @ViewChild('orderAdditionalInfoTemplateRef', { read: ViewContainerRef }) orderAdditionalInfoTemplateRef: ViewContainerRef;
    constructor(public sessionService: SessionService, protected dynamicCompilerService: DynamicCompilerService) {
        super(sessionService)
    }

    ngOnInit() {
        setTimeout(() => {
            this.createDynamicTemplate();
        }, 100);
    }

    parentInit() {
        super.ngOnInit();
    }

    /**
     * date time format data
     */
    dateTimeFormatData(value, args?: any, timezone?: any) {
        return this.dateTimeFormat.transform(value, args, timezone);
    }

    /**
     * decimal config pipe
     */

    decimalConfigPipe(data) {
        return this.decimalPipe.transform(data);
    }


    createDynamicTemplate() {

        /**
         * reference services in const variable to access 
         * without passing in constructor of child component
         */

        const sessionService = this.sessionService;
        const dynamicCompilerService = this.dynamicCompilerService;

        /**
         * create child class for new component
         */
        class DynamicShowOrderAdditionalInfoComponentTemp extends DynamicShowOrderAdditionalInfoComponent {
            constructor() {
                super(sessionService, dynamicCompilerService)
            }

            ngOnInit() {
                super.parentInit();
            }
        }


        /**
         * start creating dynamic component
         */

        const template = (this.sessionService.get('templates').components && this.sessionService.get('templates').components.orderAdditionalInfo) ? this.sessionService.get('templates').components.orderAdditionalInfo.html : templates.orderAdditionalInfo.html;
        const tmpCss = (this.sessionService.get('templates').components && this.sessionService.get('templates').components.orderAdditionalInfo) ? this.sessionService.get('templates').components.orderAdditionalInfo.css : templates.orderAdditionalInfo.css;

        const importsArray = [
            CommonModule,
        ];

        const inputDataObject = {
            'additionalInformation': this._additionalInformation,
            'closeComponent': this.closeComponent
        }

        const componentConfig: IDynamicCompilerData = {
            templateRef: this.orderAdditionalInfoTemplateRef,
            template: template,
            css: tmpCss,
            imports: importsArray,
            rootClass: DynamicShowOrderAdditionalInfoComponentTemp,
            inputData: inputDataObject
        };

        dynamicCompilerService.createComponentFactory(componentConfig);
    }

}

