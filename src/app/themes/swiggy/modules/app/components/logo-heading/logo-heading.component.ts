import { Component, OnInit, Input, OnDestroy, ElementRef } from '@angular/core';
import { ThemeService } from '../../../../../../services/theme.service';
import { Preview } from '../../classes/preview.class';
import { SessionService } from '../../../../../../services/session.service';
import { Router } from '@angular/router';
import { GoogleAnalyticsEvent } from '../../../../../../enums/enum';
import { GoogleAnalyticsEventsService } from '../../../../../../services/google-analytics-events.service';
import { slideInOutState } from '../../../../../../animations/slideInOut.animation';
import { LoaderService } from '../../../../../../services/loader.service';
declare var $: any;

@Component({
  selector: 'app-logo-heading',
  templateUrl: './logo-heading.component.html',
  styleUrls: ['./logo-heading.component.scss'],
  animations:[slideInOutState]
})
export class LogoHeadingComponent extends Preview implements OnInit, OnDestroy {
  languageStrings: any;
  @Input('styles') styles;
  @Input('data') data;
  @Input('fullHeight') fullHeight: boolean;
  public showFindBusiness = true;
  public showDefaultCustom = false;
  public terminology;
  isPlatformServer;

  //rentals
  showDateRange: boolean;
  constructor(private themeService: ThemeService, private sessionService: SessionService,
    private router:Router,private googleAnalyticsEventsService:GoogleAnalyticsEventsService,
    public loaderService :LoaderService,private el: ElementRef) {
    super(themeService);
  }

  ngOnInit() {
    this.isPlatformServer = this.sessionService.isPlatformServer();
    if (!this.isPlatformServer && this.styles.logoHeader && this.styles.logoHeader.styles) {
      this.themeService.setNativeStyles(this.styles.logoHeader.styles, this.el);
    }
    if (!this.isPlatformServer && this.styles.autoComplete && this.styles.autoComplete.styles) {
      this.themeService.setStyles(this.styles.autoComplete.styles);
    }
    const config = this.sessionService.get('config');
    this.terminology = config.terminology;
    if (config.business_model_type && config.business_model_type === "RENTAL") {
      this.showDateRange = true;
    }
    if(config.is_landing_page_enabled){
      this.showFindBusiness = false;
      this.showDefaultCustom = true;
    }
    this.sessionService.langStringsPromise.then(() =>
    {
     this.languageStrings = this.sessionService.languageStrings;
    });
  }

  ngOnDestroy() {
    this.alive = false;
  }

  /**
   * go to custom checkout
   */
  goToCustomCheckout() {
    this.loaderService.show();
    if (this.sessionService.get('appData') && parseInt(this.sessionService.getString('reg_status')) === 1) {
      this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.go_to_checkout, 'Custom order checkout', '', '');
      this.router.navigate(['customCheckout']);
    } else if (this.sessionService.get('appData') && parseInt(this.sessionService.getString('reg_status')) !== 1 &&
      !this.sessionService.get('appData').signup_template_data.length) {
      this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.go_to_checkout, 'Custom order checkout', '', '');
      this.router.navigate(['customCheckout']);
    } else {
      this.router.navigate(['custom-login'],{skipLocationChange:true});
      try{
        $('#loginDialog').modal('show');
        this.loaderService.hide();
      }catch(error){
        console.error(error);
      }
    }
  }
}
