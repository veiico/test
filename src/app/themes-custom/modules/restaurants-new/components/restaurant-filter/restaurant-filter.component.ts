import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { IDynamicCompilerData } from '../../../../../interfaces/interfaces';
import { DynamicCompilerService } from '../../../../../services/dynamic-compiler.service';
import { templates } from '../../../../../themes-custom/constants/template.constant';

import { RestaurantFilterComponent } from '../../../../../components/restaurants-new/components/restaurant-filter/restaurant-filter.component';
import { RestaurantFilterService } from '../../../../../components/restaurants-new/components/restaurant-filter/restaurant-filter.service';
import { MessageService } from '../../../../../services/message.service';
import { SessionService } from '../../../../../services/session.service';
import { CheckboxModule } from 'primeng/checkbox';
import { RadioButtonModule } from 'primeng/radiobutton';
import { AppService } from '../../../../../app.service';

@Component({
    template: '<ng-container #filterContainer></ng-container>',
})
export class DynamicRestaurantFilterComponent extends RestaurantFilterComponent implements OnInit {

    @ViewChild('filterContainer', { read: ViewContainerRef }) filterContainer: ViewContainerRef;

    constructor(protected sessionService: SessionService,
        protected messageService: MessageService, protected restaurantFilterService: RestaurantFilterService,public appService: AppService,
        protected formBuilder: FormBuilder, protected dynamicCompilerService: DynamicCompilerService) {
        super(sessionService, messageService, restaurantFilterService,appService, formBuilder)
    }

    ngOnInit() {
        setTimeout(() => {
            this.createDynamicTemplate();
        }, 100);
    }

    ngOnDestroy() {
        super.ngOnDestroy();
    }

    createDynamicTemplate() {

        /**
         * reference services in const variable to access
         * without passing in constructor of child component
         */


        const sessionService = this.sessionService;
        const messageService = this.messageService;
        const dynamicCompilerService = this.dynamicCompilerService;
        const restaurantFilterService = this.restaurantFilterService;
        const formBuilder = this.formBuilder;
        const appService=this.appService

        /**
         * create child class for new component
         */
        class DynamicRestaurantFilterComponentTemp extends DynamicRestaurantFilterComponent {
            constructor() {
                super(sessionService, messageService, restaurantFilterService, appService,formBuilder, dynamicCompilerService)
            }
            ngOnInit() {
                this.initEvents();
            }

            ngOnDestroy() {
                super.ngOnDestroy();
            }

        }


        /**
         * start creating dynamic component
         */

        const template = (this.sessionService.get('templates').components && this.sessionService.get('templates').components.merchantFilter) ? this.sessionService.get('templates').components.merchantFilter.html : templates.merchantFilter.html;
        const tmpCss = (this.sessionService.get('templates').components && this.sessionService.get('templates').components.merchantFilter) ? this.sessionService.get('templates').components.merchantFilter.css : templates.merchantFilter.css;
        const importsArray = [
            CommonModule,
            CheckboxModule,
            ReactiveFormsModule,
            RadioButtonModule
        ];


        const componentConfig: IDynamicCompilerData = {
            templateRef: this.filterContainer,
            template: template,
            css: tmpCss,
            imports: importsArray,
            rootClass: DynamicRestaurantFilterComponentTemp
        };


        dynamicCompilerService.createComponentFactory(componentConfig);
    }
}




