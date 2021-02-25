import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { LoyaltyPointsInfoComponent } from '../../../components/loyalty-points-info/loyalty-points-info.component';
import { SessionService } from '../../../services/session.service';
import { LoaderService } from '../../../services/loader.service';
import { AppService } from '../../../app.service';
import { LoyaltyPointsInfoService } from '../../../components/loyalty-points-info/loyalty-points-info.service';
import { DynamicCompilerService } from '../../../services/dynamic-compiler.service';
import { templates } from '../../constants/template.constant';
import { CommonModule } from '@angular/common';
import { IDynamicCompilerData } from '../../../interfaces/interfaces';
import { DateTimeFormatPipe } from '../../../pipes/date-format.pipe';

@Component({
    selector: 'app-loyalty-points-info-dynamic',
    template: '<ng-container #loyaltyInfoTemplateRef></ng-container>'
})

export class DynamicLoyaltyPointsInfoComponent extends LoyaltyPointsInfoComponent implements OnInit {

    @ViewChild('loyaltyInfoTemplateRef', { read: ViewContainerRef }) loyaltyInfoTemplateRef: ViewContainerRef;
    dateTimeFormat = new DateTimeFormatPipe(this.sessionService)
    constructor(protected sessionService: SessionService,
        protected loader: LoaderService,
        public appService: AppService,
        protected loyaltyPointsInfoService: LoyaltyPointsInfoService,
        protected dynamicCompilerService: DynamicCompilerService) {
        super(sessionService, loader, appService, loyaltyPointsInfoService)
    }

    ngOnInit() {
        this.createDynamicTemplate();
    }

    parentInit() {
        super.ngOnInit();
    }


    createDynamicTemplate() {

        /**
         * reference services in const variable to access 
         * without passing in constructor of child component
         */

        const appService = this.appService;
        const sessionService = this.sessionService;
        const dynamicCompilerService = this.dynamicCompilerService;
        const loyaltyPointsInfoService = this.loyaltyPointsInfoService;
        const loader = this.loader;
        /**
         * create child class for new component
         */
        class DynamicLoyaltyPointsInfoComponentTemp extends DynamicLoyaltyPointsInfoComponent {
            constructor() {
                super(sessionService, loader, appService, loyaltyPointsInfoService, dynamicCompilerService)
            }

            ngOnInit() {
                super.parentInit();
            }
        }

        /**
         * start creating dynamic component
         */

        const template = (this.sessionService.get('templates').pages['loyalty'] && this.sessionService.get('templates').pages['loyalty'].html) ? this.sessionService.get('templates').pages['loyalty'].html : templates.loyalty.html;
        const tmpCss = (this.sessionService.get('templates').pages['loyalty'] && this.sessionService.get('templates').pages['loyalty'].css) ? this.sessionService.get('templates').pages['loyalty'].css : templates.loyalty.css;
        const importsArray = [
            CommonModule
        ];

        const componentConfig: IDynamicCompilerData = {
            templateRef: this.loyaltyInfoTemplateRef,
            template: template,
            css: tmpCss,
            imports: importsArray,
            rootClass: DynamicLoyaltyPointsInfoComponentTemp,
        };

        dynamicCompilerService.createComponentFactory(componentConfig);
    }


    /**
     * date time format pipe
     */
    dateTimePipe(value, args?: any, timezone?: any) {
        return this.dateTimeFormat.transform(value, args, timezone)
    }


}
