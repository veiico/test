import { Component, OnDestroy, OnInit, ViewChild, ViewContainerRef, Output, EventEmitter, Input } from '@angular/core';
import { Router } from '@angular/router';

import { AppService } from '../../../../../app.service';
import { AppCartComponent } from '../../../../../components/catalogue/components/app-cart/app-cart.component';
import { AppCartService } from '../../../../../components/catalogue/components/app-cart/app-cart.service';
import { PopUpService } from '../../../../../modules/popup/services/popup.service';
import { FBPixelService } from '../../../../../services/fb-pixel.service';
import { GoogleAnalyticsEventsService } from '../../../../../services/google-analytics-events.service';
import { MessageService } from '../../../../../services/message.service';
import { SessionService } from '../../../../../services/session.service';
import { DynamicCompilerService } from '../../../../../services/dynamic-compiler.service';
import { templates } from '../../../../../themes-custom/constants/template.constant';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { IDynamicCompilerData } from '../../../../../interfaces/interfaces';
import { DecimalConfigPipe } from '../../../../../pipes/decimalConfig.pipe';
import { takeWhile } from 'rxjs/operators';


declare var $: any;

@Component({
  selector: 'app-cart-dynamic',
  template: '<ng-container #cartTemplateRef></ng-container>'
})
export class DynamicAppCartComponent extends AppCartComponent implements OnInit, OnDestroy {
  @ViewChild('cartTemplateRef', { read: ViewContainerRef }) cartTemplateRef: ViewContainerRef;
  @Output() toggle: EventEmitter<string> = new EventEmitter<string>();
  @Output() askLocation: EventEmitter<null> = new EventEmitter<null>();
  @Input() notDeliverable:any;
  alive = true;
  decimalPipe = new DecimalConfigPipe(this.sessionService);
  constructor(protected router: Router, protected sessionService: SessionService, protected cartService: AppCartService,
    protected popup: PopUpService, public googleAnalyticsEventsService: GoogleAnalyticsEventsService, public appService: AppService,
    public fbPixelService: FBPixelService, public messageService: MessageService, public dynamicCompilerService: DynamicCompilerService) {
    super(router, sessionService, cartService, popup, googleAnalyticsEventsService, appService, fbPixelService, messageService);
  }

  ngOnInit() {
    setTimeout(() => {
      this.createDynamicTemplate();
    }, 100)
  }
  parentInit() {
    super.ngOnInit();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    this.alive = false;
  }


  createDynamicTemplate() {

    /**
     * reference services in const variable to access 
     * without passing in constructor of child component
     */

    const appService = this.appService;
    const sessionService = this.sessionService;
    const messageService = this.messageService;
    const router = this.router;
    const cartService = this.cartService;
    const popup = this.popup;
    const googleAnalyticsEventsService = this.googleAnalyticsEventsService;
    const fbPixelService = this.fbPixelService;
    const dynamicCompilerService = this.dynamicCompilerService;




    /**
     * create child class for new component
     */
    class DynamicAppCartComponentTemp extends DynamicAppCartComponent {
      constructor() {
        super(router, sessionService, cartService, popup, googleAnalyticsEventsService, appService, fbPixelService, messageService, dynamicCompilerService);
      }

      ngOnInit() {
        super.parentInit();
        this.appService.notDelivered(this.notDeliverable);
        this.appService.notDeliverable.pipe(takeWhile(_ => this.alive)).subscribe((resp)=>{
          this.notDeliverable=resp;
        });
      }

      ngOnDestroy() {
        super.ngOnDestroy();
      }

    }


    /**
     * start creating dynamic component
     */


    const template = (this.sessionService.get('templates').components && this.sessionService.get('templates').components.cart) ? this.sessionService.get('templates').components.cart.html : templates.cart.html;
    const tmpCss = (this.sessionService.get('templates').components && this.sessionService.get('templates').components.cart) ? this.sessionService.get('templates').components.cart.css : templates.cart.css;

    const importsArray = [
      CommonModule,
      ReactiveFormsModule,
      FormsModule,
    ];

    const inputDataObject = {
      toggle: this.toggle,
      askLocation: this.askLocation,
      notDeliverable: this.notDeliverable
    };

    const componentConfig: IDynamicCompilerData = {
      templateRef: this.cartTemplateRef,
      template: template,
      css: tmpCss,
      imports: importsArray,
      rootClass: DynamicAppCartComponentTemp,
      inputData: inputDataObject
    };

    dynamicCompilerService.createComponentFactory(componentConfig);
  }

  decimalConfigPipe(data) {
    return this.decimalPipe.transform(data);
  }
  

}
