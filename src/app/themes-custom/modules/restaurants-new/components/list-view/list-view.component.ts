import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewContainerRef,
  ChangeDetectorRef
} from '@angular/core';
import { Router } from '@angular/router';
import { slideInOutState } from '../../../../../animations/slideInOut.animation';
import { AppService } from '../../../../../app.service';
import { ListViewComponent } from '../../../../../components/restaurants-new/components/list-view/list-view.component';
import { PopUpService } from '../../../../../modules/popup/services/popup.service';
import { GoogleAnalyticsEventsService } from '../../../../../services/google-analytics-events.service';
import { LoaderService } from '../../../../../services/loader.service';
import { MessageService } from '../../../../../services/message.service';
import { SessionService } from '../../../../../services/session.service';
import { ThemeService } from '../../../../../services/theme.service';
import { DynamicCompilerService } from '../../../../../services/dynamic-compiler.service';
import { CommonModule } from '@angular/common';
import { templates } from '../../../../../themes-custom/constants/template.constant';
import { IDynamicCompilerData } from '../../../../../interfaces/interfaces';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { DecimalConfigPipeModule } from '../../../../../modules/decimal-config-pipe.module';
import { minutesDaysPipe } from '../../../../../pipes/minutesDays.pipe';
import { StarRatingModule } from 'angular-star-rating';
import { RestaurantsService } from '../../../../../components/restaurants-new/restaurants-new.service';
// import { DecimalConfigPipe } from '../../../../../pipes/decimalConfig.pipe';

@Component({
  selector: 'app-list-view-dynamic',
  template: '<ng-container #listContainer></ng-container>',
  animations: [slideInOutState]
})
export class DynamicListViewComponent extends ListViewComponent
  implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('listContainer', { read: ViewContainerRef })
  listContainer: ViewContainerRef;
 
  // get businessData() {
  //   return this._businessData;
  // }
  // @Input() set businessData(val: any) {
  //   if (val) {
  //     this._businessData = val;
  //     this._businessData.data = this._businessData.data.map(item => {
  //       item.merchantMinimumOrder = this.decimalPipe.transform(
  //         item.merchantMinimumOrder
  //       );
  //       return item;
  //     });
  //   }
  // }

  _paginatingList: any
  get paginatingList() {
    return this._paginatingList
  }
  @Input() set paginatingList(val: any) {
    this._paginatingList = val;
  };

  @Input() categoryDataChild: any;
  minutesPipe = new minutesDaysPipe(this.appService);

  constructor(
    protected themeService: ThemeService,
    protected appService: AppService,
    public loader: LoaderService,
    protected sessionService: SessionService,
    protected popupService: PopUpService,
    protected googleAnalyticsEventsService: GoogleAnalyticsEventsService,
    protected messageService: MessageService,
    protected router: Router,
    protected el: ElementRef,
    protected cd: ChangeDetectorRef,
    protected dynamicCompilerService: DynamicCompilerService
  ) {
    super(
      themeService,
      appService,
      loader,
      sessionService,
      popupService,
      googleAnalyticsEventsService,
      messageService,
      router,
      el,
      cd
    );
  }

  ngOnInit() {
    setTimeout(() => {
      this.createDynamicTemplate();
    }, 100);
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  ngAfterViewInit() {
    super.ngAfterViewInit();
  }

  createDynamicTemplate() {
    /**
     * reference services in const variable to access
     * without passing in constructor of child component
     */

    const sessionService = this.sessionService;
    const messageService = this.messageService;
    const dynamicCompilerService = this.dynamicCompilerService;
    const themeService = this.themeService;
    const appService = this.appService;
    const loader = this.loader;
    const popupService = this.popupService;
    const googleAnalyticsEventsService = this.googleAnalyticsEventsService;
    const router = this.router;
    const el = this.el;
    const cd = this.cd;
    /**
     * create child class for new component
     */
    class DynamicListViewComponentTemp extends DynamicListViewComponent {
      constructor() {
        super(
          themeService,
          appService,
          loader,
          sessionService,
          popupService,
          googleAnalyticsEventsService,
          messageService,
          router,
          el,
          cd,
          dynamicCompilerService
        );
        this.initConstructorEvents();
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

    const template =
      this.sessionService.get('templates').components &&
      this.sessionService.get('templates').components.merchantListing
        ? this.sessionService.get('templates').components.merchantListing.html
        : templates.merchantListing.html;
    const tmpCss =
      this.sessionService.get('templates').components &&
      this.sessionService.get('templates').components.merchantListing
        ? this.sessionService.get('templates').components.merchantListing.css
        : templates.merchantListing.css;
    const importsArray = [
      CommonModule,
      TooltipModule,
      // DecimalConfigPipeModule,
      StarRatingModule
    ];

    const inputDataObject = {
      businessData: this.businessData,
      categoryDataChild: this.categoryDataChild,
      paginatingList:this._paginatingList
    };
    const componentConfig: IDynamicCompilerData = {
      templateRef: this.listContainer,
      template: template,
      css: tmpCss,
      imports: importsArray,
      rootClass: DynamicListViewComponentTemp,
      inputData: inputDataObject,
      animations: [slideInOutState]
    };

    dynamicCompilerService.createComponentFactory(componentConfig);
  }
  minutesDaytransform(minutes) {
    return this.minutesPipe.transform(minutes);

  }
}
