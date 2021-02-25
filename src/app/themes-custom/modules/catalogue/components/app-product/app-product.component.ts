import {
  AfterViewInit,
  Component,
  OnChanges,
  OnDestroy,
  OnInit,
  Input,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from '../../../../../app.service';
import { AppCartService } from '../../../../../components/catalogue/components/app-cart/app-cart.service';
import { AppProductComponent } from '../../../../../components/catalogue/components/app-product/app-product.component';
import { RestaurantsService } from '../../../../../components/restaurants-new/restaurants-new.service';
import { PopUpService } from '../../../../../modules/popup/services/popup.service';
import { GoogleAnalyticsEventsService } from '../../../../../services/google-analytics-events.service';
import { MessageService } from '../../../../../services/message.service';
import { SessionService } from '../../../../../services/session.service';
import { CatalogueService } from '../../../../../components/catalogue/catalogue.service';
import { IProdultListPageData } from '../../../../../themes-custom/interfaces/interface';
import { takeWhile } from 'rxjs/operators';
import { DecimalConfigPipe } from '../../../../../pipes/decimalConfig.pipe';
import { serviceTimePipe } from '../../../../../pipes/serviceTime.pipe';
import { IDynamicCompilerData } from '../../../../../interfaces/interfaces';
import { DynamicCompilerService } from '../../../../../services/dynamic-compiler.service';
import { templates } from '../../../../../themes-custom/constants/template.constant';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { TruncatePipe } from '../../../../../pipes/truncate.pipe';
import { DynamicModalModule } from '../../../modal/modal.module';
import { ProductTimingService } from '../../../../../components/product-timing/product-timing.service';
import { CheckVideoPipe } from '../../../../../pipes/checkVideo.pipe';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { ProductTemplateService } from '../../../../../components/product-template/services/product-template.service';
import { ConfirmationService } from '../../../../../modules/jw-notifications/services/confirmation.service';

declare var $: any;

@Component({
  template: '<ng-container #productListTemplateRef></ng-container>'
})
export class DynamicAppProductComponent extends AppProductComponent
  implements OnInit, OnDestroy, OnChanges, AfterViewInit {
  alive = true;
  decimalPipe = new DecimalConfigPipe(this.sessionService);
  serviceTime = new serviceTimePipe(this.appService);
  truncatePipe = new TruncatePipe();
  checkVideoPipe = new CheckVideoPipe();
  @ViewChild('productListTemplateRef', { read: ViewContainerRef })
  productListTemplateRef: ViewContainerRef;

  constructor(
    public productTemplateService : ProductTemplateService,
    protected route: ActivatedRoute,
    protected router: Router,
    protected sessionService: SessionService,
    protected popup: PopUpService,
    protected cartService: AppCartService,
    public googleAnalyticsEventsService: GoogleAnalyticsEventsService,
    public messageService: MessageService,
    public appService: AppService,
    protected restaurantService: RestaurantsService,
    protected catalogueService: CatalogueService,
    protected productTimingService: ProductTimingService,
    protected dynamicCompilerService: DynamicCompilerService,
    public confirmationService : ConfirmationService) {
    super(productTemplateService, route, router, sessionService, popup, cartService, googleAnalyticsEventsService, messageService, appService, restaurantService, catalogueService, productTimingService, confirmationService)
  }

  ngAfterViewInit() {
    super.ngAfterViewInit();
  }

  ngOnChanges() {
    super.ngOnChanges();
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

    const appService = this.appService;
    const sessionService = this.sessionService;
    const messageService = this.messageService;
    const router = this.router;
    const cartService = this.cartService;
    const popup = this.popup;
    const googleAnalyticsEventsService = this.googleAnalyticsEventsService;
    const route = this.route;
    const restaurantService = this.restaurantService;
    const catalogueService = this.catalogueService;
    const productTimingService = this.productTimingService;
    const dynamicCompilerService = this.dynamicCompilerService;
    const productTemplateService = this.productTemplateService
    const confirmationService =this.confirmationService;




    /**
     * create child class for new component
     */
    class DynamicAppProductComponentTemp extends DynamicAppProductComponent {
      constructor() {
        super(productTemplateService,route, router, sessionService, popup, cartService, googleAnalyticsEventsService, messageService, appService, restaurantService, catalogueService,productTimingService, dynamicCompilerService,confirmationService)
      }
      ngOnInit() {
        this.catalogueService.productList
          .pipe(takeWhile(_ => this.alive))
          .subscribe((response: IProdultListPageData) => {
            this.currentCategoryName = response.currentCategoryName;
            this.searchProducts = response.searchProducts;
            this.cardInfo = response.cardInfo;
            this.paginating = response.paginating;
            this.hasImages = response.hasImages;
            this.layout_type = response.layout_type;
            this._p = response.productList;
            this.addTemplateData();
            this.productList = response.productList;
            this.isRestaurantActive = response.isRestaurantActive;
            if (this.searchProducts === 1) {
              this.activate(response.productList, 0);
            } else {
              this.activate(response.productList, 1);
            }
          });
        super.parentInit();
      }

      ngOnChanges() {
        this.addTemplateData();
        super.ngOnChanges();
      }

      ngOnDestroy() {
        super.ngOnDestroy();
      }
    }

    /**
     * start creating dynamic component
     */

    const template =
      this.sessionService.get('templates').components &&
      this.sessionService.get('templates').components.productList
        ? this.sessionService.get('templates').components.productList.html
        : templates.productList.html;
    const tmpCss =
      this.sessionService.get('templates').components &&
      this.sessionService.get('templates').components.productList
        ? this.sessionService.get('templates').components.productList.css
        : templates.productList.css;

    const importsArray = [
      CommonModule,
      ReactiveFormsModule,
      FormsModule,
      TooltipModule,
      DropdownModule,
      MultiSelectModule
    ];

    const inputDataObject = {
      toggle: this.toggle
    };

    const componentConfig: IDynamicCompilerData = {
      templateRef: this.productListTemplateRef,
      template: template,
      css: tmpCss,
      imports: importsArray,
      rootClass: DynamicAppProductComponentTemp,
      inputData: inputDataObject
    };

    dynamicCompilerService.createComponentFactory(componentConfig);
  }

  decimalConfigPipe(data) {
    return this.decimalPipe.transform(data);
  }

  serviceTimePipe(minutes: number, unit_type: any) {
    return this.serviceTime.transform(minutes, unit_type);
  }

  truncateString(value: string, length: number) {
    return this.truncatePipe.transform(value, length);
  }

  checkVideo(data) {
    return this.checkVideoPipe.transform(data);
  }
  addTemplateData() {
    if (this._p) {
      this._p = this._p.map(item => {
        if (item.service_time) {
          item.service_time_text = this.serviceTimePipe(item.service_time, [
            item.unit_type,
            item.unit_in_text
          ]);
        }

        // if (item.layout_data.lines[1].data) {
        //   item.layout_data.lines[1].data = this.truncateString(
        //     item.layout_data.lines[1].data,
        //     60
        //   );
        // }
        return item;
      });
    }
  }
}
