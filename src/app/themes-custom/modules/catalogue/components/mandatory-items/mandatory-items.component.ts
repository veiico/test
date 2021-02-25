import { MandatoryItemsComponent } from '../../../../../components/catalogue/components/mandatory-items/mandatory-items.component';
import { OnInit, OnDestroy, ViewChild, ViewContainerRef, Component } from '@angular/core';
import { CheckOutService } from '../../../../../components/checkout/checkout.service';
import { PopUpService } from '../../../../../modules/popup/services/popup.service';
import { SessionService } from '../../../../../services/session.service';
import { AppCartService } from '../../../../../components/catalogue/components/app-cart/app-cart.service';
import { LoaderService } from '../../../../../services/loader.service';
import { CatalogueService } from '../../../../../components/catalogue/catalogue.service';
import { DynamicCompilerService } from '../../../../../services/dynamic-compiler.service';
import { IDynamicCompilerData } from '../../../../../interfaces/interfaces';
import { templates } from '../../../../../themes-custom/constants/template.constant';
import { CommonModule } from '@angular/common';
import { AppService } from '../../../../../app.service';

enum TabState {
    COLLAPSED = 'collapsed',
    EXPANDED = 'expanded'
}

@Component({
    selector: 'app-mandatory-items-dynamic',
    template: '<ng-container #mandatoryItemsTemplateRef></ng-container>',
})

export class DynamicMandatoryItemsComponent extends MandatoryItemsComponent implements OnInit, OnDestroy {

    @ViewChild('mandatoryItemsTemplateRef', { read: ViewContainerRef }) mandatoryItemsTemplateRef: ViewContainerRef;

    constructor(protected checkoutService: CheckOutService, protected popUpService: PopUpService, protected loader: LoaderService, protected sessionService: SessionService, protected cartService: AppCartService, protected catalogueService: CatalogueService, protected popup: PopUpService, protected appService: AppService, protected dynamicCompilerService: DynamicCompilerService) {
        super(checkoutService, popUpService, loader, sessionService, cartService, catalogueService,popup,appService)
    }

    ngOnInit() {
        setTimeout(() => {
            this.createDynamicTemplate();
        }, 100);
    }
    parentInit() {
        super.ngOnInit();
    }
    ngOnDestroy() {
        super.ngOnDestroy();
    }

    createDynamicTemplate() {

        /**
         * reference services in const variable to access 
         * without passing in constructor of child component
         */

        const checkoutService = this.checkoutService;
        const popUpService = this.popUpService;
        const loader = this.loader;
        const sessionService = this.sessionService;
        const cartService = this.cartService;
        const catalogueService = this.catalogueService;
        const popup = this.popup;
        const appService = this.appService;
        const dynamicCompilerService = this.dynamicCompilerService




        /**
         * create child class for new component
         */
        class DynamicMandatoryItemsComponentTemp extends DynamicMandatoryItemsComponent {
            constructor() {
                super(checkoutService, popUpService, loader, sessionService, cartService, catalogueService,popup,appService, dynamicCompilerService)
            }

            ngOnInit() {
                super.parentInit()
            }

            ngOnDestroy() {
                super.ngOnDestroy();
            }

        }


        /**
         * start creating dynamic component
         */


        const template = (this.sessionService.get('templates').components && this.sessionService.get('templates').components.mandatoryItems) ? this.sessionService.get('templates').components.mandatoryItems.html : templates.mandatoryItems.html;
        const tmpCss = (this.sessionService.get('templates').components && this.sessionService.get('templates').components.mandatoryItems) ? this.sessionService.get('templates').components.mandatoryItems.css : templates.mandatoryItems.css;

        const importsArray = [
            CommonModule
        ]

        const componentConfig: IDynamicCompilerData = {
            templateRef: this.mandatoryItemsTemplateRef,
            template: template,
            css: tmpCss,
            rootClass: DynamicMandatoryItemsComponentTemp,
            imports:importsArray
        };

        dynamicCompilerService.createComponentFactory(componentConfig);
    }

}
