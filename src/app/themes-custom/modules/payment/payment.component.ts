import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewContainerRef, ElementRef, AfterViewInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from '../../../app.service';
import { AppCartService } from '../../../components/catalogue/components/app-cart/app-cart.service';
import { PaymentComponent } from '../../../components/payment/payment.component';
import { PaymentService } from '../../../components/payment/payment.service';
import { PopUpService } from '../../../modules/popup/services/popup.service';
import { DecimalConfigPipe } from '../../../pipes/decimalConfig.pipe';
import { FBPixelService } from '../../../services/fb-pixel.service';
import { GoogleAdWordsService } from '../../../services/google-adwords.service';
import { GoogleAnalyticsEventsService } from '../../../services/google-analytics-events.service';
import { LoaderService } from '../../../services/loader.service';
import { MessageService } from '../../../services/message.service';
import { SessionService } from '../../../services/session.service';
import { RouteHistoryService } from '../../../services/setGetRouteHistory.service';
import { ValidationService } from '../../../services/validation.service';
import { DynamicCompilerService } from '../../../services/dynamic-compiler.service';
import { IDynamicCompilerData } from '../../../interfaces/interfaces';
import { CommonModule } from '@angular/common';
import { templates } from '../../constants/template.constant';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

declare var Stripe: any;

@Component({
  selector: "app-payment-dynamic",
  template: '<ng-container #paymentTemplateRef></ng-container>'
})
export class DynamicPaymentComponent extends PaymentComponent implements OnInit, OnDestroy {
  @ViewChild('paymentTemplateRef', { read: ViewContainerRef }) paymentTemplateRef: ViewContainerRef;
  decimalPipe = new DecimalConfigPipe(this.sessionService);
  constructor(
    protected fb: FormBuilder,
    protected paymentService: PaymentService,
    protected cartService: AppCartService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected sessionService: SessionService,
    protected popup: PopUpService,
    protected ref: ChangeDetectorRef,
    protected loader: LoaderService,
    public googleAnalyticsEventsService: GoogleAnalyticsEventsService,
    public messageService: MessageService,
    public appService: AppService,
    public domSanitizer: DomSanitizer,
    public validationService: ValidationService,
    public fbPixelService: FBPixelService,
    public googleAdWordsService: GoogleAdWordsService,
    public routeHistoryService: RouteHistoryService,
    protected dynamicCompilerService: DynamicCompilerService) {
    super(fb, paymentService, cartService, activatedRoute, router, sessionService, popup, ref, loader, googleAnalyticsEventsService, messageService, appService, domSanitizer, validationService, fbPixelService, googleAdWordsService, routeHistoryService)
  }


  ngOnInit() {
    this.createDynamicTemplate();
  }

  parentInit() {
    super.ngOnInit();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  decimalConfigPipe(value) {
    return this.decimalPipe.transform(value)
  }
  
  phoneChange(event, fc: FormControl, force: boolean) {
    const data = event.detail;
    this.country_code = data.dialCode || 91;
    if (fc) {
        fc.setValue(data.value);
    }
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
    const fb = this.fb;
    const paymentService = this.paymentService;
    const cartService = this.cartService;
    const activatedRoute = this.activatedRoute;
    const popup = this.popup;
    const ref = this.ref;
    const loader = this.loader;
    const googleAnalyticsEventsService = this.googleAnalyticsEventsService;
    const domSanitizer = this.domSanitizer;
    const validationService = this.validationService;
    const fbPixelService = this.fbPixelService;
    const googleAdWordsService = this.googleAdWordsService;
    const routeHistoryService = this.routeHistoryService;
    const dynamicCompilerService = this.dynamicCompilerService;



    /**
     * create child class for new component
     */
    class DynamicPaymentComponentTemp extends DynamicPaymentComponent {
      @ViewChild("cardInfo") cardInfo: ElementRef;
      constructor() {
        super(fb, paymentService, cartService, activatedRoute, router, sessionService, popup, ref,
          loader, googleAnalyticsEventsService, messageService, appService, domSanitizer,
          validationService, fbPixelService, googleAdWordsService, routeHistoryService, dynamicCompilerService)
      }

      async ngOnInit() {
        super.parentInit();
      }
  
    async initStripe() {
        await super.loadStripe();
        if (!this.isPlatformServer) {
          this.post_payment_enable = Boolean(this.appConfig.post_payment_enable);
          try {
            this.stripe = Stripe(this.appConfig.stripe_public_key);
            this.elements = this.stripe.elements();
            this.card = this.elements.create("card"); // , {hidePostalCode: true}
            this.card.mount(document.getElementById('card-info'));
            this.card.addEventListener("change", this.cardHandler);
          }
          catch (e) { }
        }
      
      }

      ngOnDestroy() {
        super.ngOnDestroy();
      }

    }


    /**
     * start creating dynamic component
     */

    const template = (this.sessionService.get('templates').pages['payment'] && this.sessionService.get('templates').pages['payment'].html) ? this.sessionService.get('templates').pages['payment'].html : templates.payment.html;
    const tmpCss = (this.sessionService.get('templates').pages['payment'] && this.sessionService.get('templates').pages['payment'].css) ? this.sessionService.get('templates').pages['payment'].css : templates.payment.css;

    const importsArray = [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      TooltipModule
    ];


    const componentConfig: IDynamicCompilerData = {
      templateRef: this.paymentTemplateRef,
      template: template,
      css: tmpCss,
      imports: importsArray,
      rootClass: DynamicPaymentComponentTemp
    };

    dynamicCompilerService.createComponentFactory(componentConfig);
  }

}
