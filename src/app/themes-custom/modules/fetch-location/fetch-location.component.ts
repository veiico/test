import {
  Component,
  OnInit,
  Inject,
  ViewChild,
  ViewContainerRef,
  NgZone,
  ElementRef
} from '@angular/core';
import { slideInOutState } from '../../../../app/animations/slideInOut.animation';
import { FetchLocationComponent } from '../../../../app/components/fetch-location/fetch-location.component';
import { LoaderService } from '../../../../app/services/loader.service';
import { SessionService } from '../../../../app/services/session.service';
import { MessageService } from '../../../../app/services/message.service';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { LoginService } from '../../../../app/components/login/login.service';
import { GoogleAnalyticsEventsService } from '../../../../app/services/google-analytics-events.service';
import { AppService } from '../../../../app/app.service';
import { PopupModalService } from '../../../../app/modules/popup/services/popup-modal.service';
import { RestaurantsService } from '../../../../app/components/restaurants-new/restaurants-new.service';
import { BsLocaleService, BsDatepickerModule } from 'ngx-bootstrap';
import { ExternalLibService } from '../../../../app/services/set-external-lib.service';
import { DynamicCompilerService } from '../../../../app/services/dynamic-compiler.service';
import { IDynamicCompilerData } from '../../../../app/interfaces/interfaces';
import { templates } from '../../constants/template.constant';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AgmCoreModule } from '@agm/core';
import { AdapterService } from '../../../../app/services/adapter.service';
import { IAppConfig } from '../../interfaces/interface';
import { ThemeService } from '../../../../app/services/theme.service';
import { DOCUMENT } from '@angular/common';
import { BusinessCategoriesService } from '../../../components/restaurants-new/components/business-categories/business-categories.service';
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: 'app-fetch-location',
  template: '<ng-container #fetchLocationContainer> </ng-container>',
  styleUrls: [],
  animations: [slideInOutState]
})
export class DynamicFetchLocationComponent extends FetchLocationComponent
  implements OnInit {
  @ViewChild('fetchLocationContainer', { read: ViewContainerRef })
  fetchLocationTemplateViewRef: ViewContainerRef;

  constructor(
    protected loader: LoaderService,
    protected sessionService: SessionService,
    protected ngZone: NgZone,
    protected messageService: MessageService,
    protected router: Router,
    protected themeService: ThemeService,
    protected loginService: LoginService,
    protected googleAnalyticsEventsService: GoogleAnalyticsEventsService,
    protected appService: AppService,
    protected popup: PopupModalService,
    protected restaurantService: RestaurantsService,
    protected localeService: BsLocaleService,
    protected extService: ExternalLibService,
    protected activatedRoute: ActivatedRoute,
    protected domSanitizer: DomSanitizer,
    protected dynamicCompilerService?: DynamicCompilerService,
    protected adapterService?: AdapterService,
    protected businessCategoriesService?: BusinessCategoriesService,
    @Inject(DOCUMENT) protected _document?
  ) {
    super(
      loader,
      sessionService,
      ngZone,
      messageService,
      router,
      themeService,
      loginService,
      googleAnalyticsEventsService,
      appService,
      popup,
      restaurantService,
      localeService,
      extService,
      activatedRoute,
      domSanitizer,
      businessCategoriesService
    );
  }

  ngOnInit() {
    this.createDynamicTemplate();
  }

  createDynamicTemplate() {
    const loader = this.loader;
    const sessionService = this.sessionService;
    const ngZone = this.ngZone;
    const messageService = this.messageService;
    const router = this.router;
    const themeService = this.themeService;
    const loginService = this.loginService;
    const googleAnalyticsEventsService = this.googleAnalyticsEventsService;
    const appService = this.appService;
    const popup = this.popup;
    const restaurantService = this.restaurantService;
    const localeService = this.localeService;
    const extService = this.extService;
    const dynamicCompilerService = this.dynamicCompilerService;
    const adapterService = this.adapterService;
    const activatedRoute = this.activatedRoute;
    const domSanitizer = this.domSanitizer;
    const _document = this._document;
    const businessCategoriesService = this.businessCategoriesService;

    class DynamicFetchLocationTemp extends DynamicFetchLocationComponent {
      @ViewChild('dynamicAutocompleteComponent')
      dynamicAutoCompleteComponentRef: ElementRef;

      public fetchLocationWrapper = {};

      constructor() {
        super(
          loader,
          sessionService,
          ngZone,
          messageService,
          router,
          themeService,
          loginService,
          googleAnalyticsEventsService,
          appService,
          popup,
          restaurantService,
          localeService,
          extService,
          activatedRoute,
          domSanitizer,
          dynamicCompilerService,
          adapterService,
          businessCategoriesService
        );
      }

      ngOnInit() {
        window['qq'] = this;
        this.initchecks();
        this.afterInitchecks();

        this.fetchLocationWrapper = {
          data: this.data,
          show_default_custom: this.showDefaultCustom,
          show_find_business: this.showFindBusiness,
          location_form: this.locationForm,
          is_platform_server: this.isPlatformServer,
          mobile_view: this.mobileView,
          terminology: this.terminology
        };
      }

      //TODO: formCheck not a right approach
      /**
       * Cannot access autocomplete component
       */
      onLocationSubmit(data, event, name) {
        var formCheck = false;

        if (
          _document.getElementById('jw-autocomplete') &&
          _document.getElementById('jw-autocomplete').value &&
          sessionService.get('location').lat &&
          sessionService.get('location').lng
        ) {
          formCheck = true;
        }
        console.log(this.dynamicAutoCompleteComponentRef, 'fetch comp ref');

        if (this.dynamicAutoCompleteComponentRef) {
          const compInstance = this.dynamicAutoCompleteComponentRef
            .nativeElement.ngElementStrategy.componentRef.instance;
          formCheck =
            compInstance.autoCompleteGoogleForm.controls.googleSearch.value &&
            compInstance.lat &&
            compInstance.lng;
          console.error(
            this.dynamicAutoCompleteComponentRef.nativeElement.ngElementStrategy
              .componentRef.instance,
            'fetch instance'
          );
          console.error(
            compInstance.autoCompleteGoogleForm.controls.googleSearch.value,
            compInstance.lat,
            compInstance.lng,
            'fetch cond instance'
          );
        }

        this.onSubmit(data, event, name, formCheck);
      }
    }

    const template = this.sessionService.get('templates').pages['home']
      ? this.sessionService.get('templates').pages['home'].html
      : templates.fetchLocation.html;
    const tmpCss = this.sessionService.get('templates').pages['home']
      ? this.sessionService.get('templates').pages['home'].css
      : templates.fetchLocation.css;
    const importsArray = [
      CommonModule,
      ReactiveFormsModule,
      AgmCoreModule,
      BsDatepickerModule,
      RouterModule
    ];
    const inputDataArray = {};
    const componentConfig: IDynamicCompilerData = {
      templateRef: this.fetchLocationTemplateViewRef,
      template: template,
      css: tmpCss,
      imports: importsArray,
      animations: [slideInOutState],
      rootClass: DynamicFetchLocationTemp,
      inputData: inputDataArray
    };

    dynamicCompilerService.createComponentFactory(componentConfig);
  }
}
