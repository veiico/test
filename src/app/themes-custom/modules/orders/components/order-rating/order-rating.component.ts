import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StarRatingModule } from 'angular-star-rating';

import { AppService } from '../../../../../app.service';
import { OrderRatingComponent } from '../../../../../components/orders/components/order-rating/order-rating.component';
import { OrdersService } from '../../../../../components/orders/orders.service';
import { IDynamicCompilerData } from '../../../../../interfaces/interfaces';
import { PopUpService } from '../../../../../modules/popup/services/popup.service';
import { DynamicCompilerService } from '../../../../../services/dynamic-compiler.service';
import { LoaderService } from '../../../../../services/loader.service';
import { MessageService } from '../../../../../services/message.service';
import { SessionService } from '../../../../../services/session.service';
import { templates } from '../../../../../themes-custom/constants/template.constant';

@Component({
  template: '<ng-container #orderRatingTemplateRef></ng-container>',
})
export class DynamicOrderRatingComponent extends OrderRatingComponent implements OnInit {

  public _orderForRating;
  get orderForRating() { return this._orderForRating };
  @Input() set orderForRating(val: any) {
    this._orderForRating = val;
    this.ratingGiven = this._orderForRating.customer_rating || 0;
    this.review = this._orderForRating.customer_comment || '';
  };
  @Output() hideDialog: any = new EventEmitter();
  @Output() shiftAgentRating: any = new EventEmitter();


  @ViewChild('orderRatingTemplateRef', { read: ViewContainerRef }) orderRatingTemplateRef: ViewContainerRef;

  constructor(protected service: OrdersService,
    protected loader: LoaderService,
    protected popup: PopUpService,
    protected sessionService: SessionService,
    protected messageService: MessageService,
    public appService: AppService,
    protected dynamicCompilerService: DynamicCompilerService) {
    super(service, loader, popup, sessionService, messageService, appService)
  }

  ngOnInit() {
    setTimeout(() => {
      this.createDynamicTemplate();
    }, 100);

  }
  parentInit() {
    super.ngOnInit();
  }

  createDynamicTemplate() {

    /**
     * reference services in const variable to access 
     * without passing in constructor of child component
     */

    const sessionService = this.sessionService;
    const dynamicCompilerService = this.dynamicCompilerService;
    const service = this.service;
    const loader = this.loader;
    const popup = this.popup;
    const messageService = this.messageService;
    const appService = this.appService;


    /**
     * create child class for new component
     */
    class DynamicOrderRatingComponentTemp extends DynamicOrderRatingComponent {
      constructor() {
        super(service, loader, popup, sessionService, messageService, appService, dynamicCompilerService)
      }

      ngOnInit() {
        super.parentInit();
      }
    }


    /**
     * start creating dynamic component
     */

    const template = (this.sessionService.get('templates').components && this.sessionService.get('templates').components.orderRating) ? this.sessionService.get('templates').components.orderRating.html : templates.orderRating.html;
    const tmpCss = (this.sessionService.get('templates').components && this.sessionService.get('templates').components.orderRating) ? this.sessionService.get('templates').components.orderRating.css : templates.orderRating.css;

    const importsArray = [
      CommonModule,
      StarRatingModule.forRoot(),
      FormsModule
    ];

    const inputDataObject = {
      'orderForRating': this._orderForRating,
      'hideDialog': this.hideDialog,
      'shiftAgentRating': this.shiftAgentRating
    }

    const componentConfig: IDynamicCompilerData = {
      templateRef: this.orderRatingTemplateRef,
      template: template,
      css: tmpCss,
      imports: importsArray,
      rootClass: DynamicOrderRatingComponentTemp,
      inputData: inputDataObject
    };

    dynamicCompilerService.createComponentFactory(componentConfig);
  }

}
