import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';

import { NLevelCategoryComponent } from '../../../../../modules/n-level-catalogue/components/n-level-category/n-level-category.component';
import { SessionService } from '../../../../../services/session.service';
import { CatalogueService } from '../../../../../components/catalogue/catalogue.service';
import { DynamicCompilerService } from '../../../../../services/dynamic-compiler.service';
import { takeWhile } from 'rxjs/operators';
import { templates } from '../../../../../themes-custom/constants/template.constant';
import { CommonModule } from '@angular/common';
import { IDynamicCompilerData } from '../../../../../interfaces/interfaces';


@Component({
    template: '<ng-container #nLevelCategoryTemplateRef></ng-container>'
})
export class DynamicNLevelCategoryComponent extends NLevelCategoryComponent implements OnInit {
    @ViewChild('nLevelCategoryTemplateRef', { read: ViewContainerRef }) nLevelCategoryTemplateRef: ViewContainerRef;
    alive = true;
    constructor(public sessionService: SessionService, public catalogueService: CatalogueService, protected dynamicCompilerService: DynamicCompilerService) {
        super(sessionService)
    }
    ngOnInit() {
        setTimeout(() => {
            this.createDynamicTemplate();
        }, 100);

    }

    createDynamicTemplate() {

        /**
         * reference services in const variable to access 
         * without passing in constructor of child component
         */

        const catalogueService = this.catalogueService;
        const sessionService = this.sessionService;
        const dynamicCompilerService = this.dynamicCompilerService;


        /**
         * create child class for new component
         */
        class DynamicNLevelCategoryComponentTemp extends DynamicNLevelCategoryComponent {
            constructor() {
                super(sessionService, catalogueService, dynamicCompilerService)
            }

            ngOnInit() {
                this.catalogueService.categoryList.pipe(takeWhile(_ => this.alive)).subscribe((response) => {
                    if(response.length){
                        this.categoryData = response;
                    }
                })
            }

            ngOnDestroy() {
                this.alive = false;
            }

        }


        /**
         * start creating dynamic component
         */


        const template = (this.sessionService.get('templates').components && this.sessionService.get('templates').components.nlevelCategoryList) ? this.sessionService.get('templates').components.nlevelCategoryList.html : templates.nlevelCategoryList.html;
        const tmpCss = (this.sessionService.get('templates').components && this.sessionService.get('templates').components.nlevelCategoryList) ? this.sessionService.get('templates').components.nlevelCategoryList.css : templates.nlevelCategoryList.css;

        const importsArray = [
            CommonModule,
        ];

        const inputDataObject = {
            categoryData: this.categoryData,
            categorySelected: this.categorySelected,
            categoryDepthLimit: this.categoryDepthLimit
        };

        const componentConfig: IDynamicCompilerData = {
            templateRef: this.nLevelCategoryTemplateRef,
            template: template,
            css: tmpCss,
            imports: importsArray,
            rootClass: DynamicNLevelCategoryComponentTemp,
            inputData: inputDataObject
        };

        dynamicCompilerService.createComponentFactory(componentConfig);
    }

}

