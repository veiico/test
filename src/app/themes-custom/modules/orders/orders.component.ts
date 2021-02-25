import { AgmCoreModule, MapsAPILoader } from '@agm/core';
import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, NgZone, OnInit, Renderer2, ViewChild, ViewContainerRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { StarRatingModule } from 'angular-star-rating';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { takeWhile } from 'rxjs/operators';

import { AppService } from '../../../app.service';
import { FetchLocationService } from '../../../components/fetch-location/fetch-location.service';
import { OrdersComponent } from '../../../components/orders/orders.component';
import { OrdersService } from '../../../components/orders/orders.service';
import { IDynamicCompilerData } from '../../../interfaces/interfaces';
import { PopUpService } from '../../../modules/popup/services/popup.service';
import { DateTimeFormatPipe } from '../../../pipes/date-format.pipe';
import { DecimalConfigPipe } from '../../../pipes/decimalConfig.pipe';
import { TookanStatus } from '../../../pipes/tookanstatus.pipe';
import { DynamicCompilerService } from '../../../services/dynamic-compiler.service';
import { LoaderService } from '../../../services/loader.service';
import { MessageService } from '../../../services/message.service';
import { SessionService } from '../../../services/session.service';
import { ExternalLibService } from '../../../services/set-external-lib.service';
import { templates } from '../../constants/template.constant';
import { ConfirmationService } from '../../../modules/jw-notifications/services/confirmation.service';

declare var $: any;

@Component({
  selector: "app-orders-dynamic",
  template: '<ng-container #orderTemplateRef></ng-container>',
})
export class DynamicOrdersComponent extends OrdersComponent implements OnInit, AfterViewInit {
  @ViewChild('orderTemplateRef', { read: ViewContainerRef }) orderTemplateRef: ViewContainerRef;

  alive = true;
  dateTimeFormat = new DateTimeFormatPipe(this.sessionService)
  tookanStatus = new TookanStatus(this.sessionService);
  decimalPipe = new DecimalConfigPipe(this.sessionService);
  constructor(
    protected service: OrdersService,
    protected loader: LoaderService,
    protected popup: PopUpService,
    protected sessionService: SessionService,
    protected messageService: MessageService,
    protected elementRef: ElementRef,
    protected ngZone: NgZone,
    public appService: AppService,
    protected extService: ExternalLibService,
    protected renderer: Renderer2,
    protected router: Router,
    protected mapsAPILoader: MapsAPILoader,
    protected fetchLocationService: FetchLocationService,
    protected dynamicCompilerService: DynamicCompilerService,
    protected confirmationService : ConfirmationService
  ) {
    super(service, loader, popup, sessionService, messageService, elementRef, ngZone, appService, extService, renderer, router, mapsAPILoader, fetchLocationService,confirmationService)
  }
  ngAfterViewInit() {
    super.ngAfterViewInit()
  }

  ngOnInit() {
    this.createDynamicTemplate()
  }

  parentInit() {
    super.ngOnInit();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }


  dateTimeFormatData(value, args?: any, timezone?: any) {
    return this.dateTimeFormat.transform(value, args, timezone);
  }


  showTookanStatus(value: number) {
    return this.tookanStatus.transform(value).toUpperCase();
  }

  decimalConfigPipe(data) {
    return this.decimalPipe.transform(data);
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
    const dynamicCompilerService = this.dynamicCompilerService;
    const popup = this.popup;
    const elementRef = this.elementRef;
    const ngZone = this.ngZone;
    const extService = this.extService;
    const service = this.service;
    const loader = this.loader;
    const mapsAPILoader = this.mapsAPILoader;
    const fetchLocationService = this.fetchLocationService;
    const renderer = this.renderer;
    const confirmationService =this.confirmationService
    /**
     * create child class for new component
     */
    class DynamicOrdersComponentTemp extends DynamicOrdersComponent {
      constructor() {
        super(service, loader, popup, sessionService, messageService, elementRef, ngZone, appService, extService, renderer, router, mapsAPILoader, fetchLocationService, dynamicCompilerService,confirmationService)
      }

      ngOnInit() {
        this.service.orderList.pipe(takeWhile(_ => this.alive)).subscribe((response) => {
          this.ordersData = response.map(item => {
            item.creation_datetime = this.dateTimeFormatData(item.creation_datetime, 'MMM d, y, h:mm a');
            item.job_delivery_datetime = this.dateTimeFormatData(item.job_delivery_datetime, 'MMM d, y, h:mm a', '+0000');
            item.job_pickup_datetime = this.dateTimeFormatData(item.job_pickup_datetime, 'MMM d, y, h:mm a', '+0000');
            item.created_at = this.dateTimeFormatData(item.created_at, 'MMM d, y, h:mm a');
            return item;
          });
        });


        this.service.orderDetails.pipe(takeWhile(_ => this.alive)).subscribe((response: any) => {
          response.creation_datetime = this.dateTimeFormatData(response.creation_datetime, 'MMM d, y, h:mm a');
          response.job_delivery_datetime = this.dateTimeFormatData(response.job_delivery_datetime, 'MMM d, y, h:mm a');
          response.job_pickup_datetime = this.dateTimeFormatData(response.job_pickup_datetime, 'MMM d, y, h:mm a');
          response.created_at = this.dateTimeFormatData(response.created_at, 'MMM d, y, h:mm a');
          if (response.loyalty_points && response.loyalty_points.expiry_date) {
            response.loyalty_points.expiry_date = this.dateTimeFormatData(response.loyalty_points.expiry_date);
          }

          if (response.orderDetails) {
            response.orderDetails.forEach(item => {
              if (item.product) {
                item.product.task_start_time = this.dateTimeFormatData(item.product.task_start_time, 'MMM d, y, h:mm a');
                item.product.task_end_time = this.dateTimeFormatData(item.product.task_end_time, 'MMM d, y, h:mm a');
              }

            });
          }
          this.details = response;
        });

        super.parentInit();
      }



      ngAfterViewInit() {
        super.ngAfterViewInit();
      }


      ngOnDestroy() {
        this.alive = false;
        super.ngOnDestroy();
      }

    }


    /**
     * start creating dynamic component
     */

    const template = (this.sessionService.get('templates').pages['orders'] && this.sessionService.get('templates').pages['orders'].html) ? this.sessionService.get('templates').pages['orders'].html : templates.orders.html;
    const tmpCss = (this.sessionService.get('templates').pages['orders'] && this.sessionService.get('templates').pages['orders'].css) ? this.sessionService.get('templates').pages['orders'].css : templates.orders.css;
    const importsArray = [
      CommonModule,
      OverlayPanelModule,
      BreadcrumbModule,
      StarRatingModule.forRoot(),
      AgmCoreModule,
      FormsModule
    ];


    const componentConfig: IDynamicCompilerData = {
      templateRef: this.orderTemplateRef,
      template: template,
      css: tmpCss,
      imports: importsArray,
      rootClass: DynamicOrdersComponentTemp,
    };

    dynamicCompilerService.createComponentFactory(componentConfig);
  }
}
