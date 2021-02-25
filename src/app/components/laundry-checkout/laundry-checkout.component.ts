/**
 * Created by mba-214 on 23/10/18.
 */
import {
  Component,
  Input,
  ViewChild,
  OnInit,
  OnDestroy,
  AfterViewInit
} from "@angular/core";
import {
  FormGroup,
  AbstractControl,
  FormBuilder,
  FormControl
} from "@angular/forms";
import { Router } from "@angular/router";
import { BsDatepickerConfig, BsLocaleService } from "ngx-bootstrap/datepicker";
import { DateTimeAdapter } from "ng-pick-datetime";
import * as moment from "moment";
import { Subject ,  Observable } from "rxjs";

import { AppCartService } from "../catalogue/components/app-cart/app-cart.service";
import { SessionService } from "../../services/session.service";
import { appString } from "../../services/appstring";
import { PopUpService } from "../../modules/popup/services/popup.service";
import { LoaderService } from "../../services/loader.service";
import { GoogleAnalyticsEventsService } from "../../services/google-analytics-events.service";
import { AppService } from "../../app.service";
import { PaymentService } from "../payment/payment.service";
import { MessageService } from "../../services/message.service";
import { ProductDescriptionService } from "../../services/product-description.service";
import { trigger, transition, style, animate } from "@angular/animations";
import { CheckOutService } from "../checkout/checkout.service";
import { DropDownListService } from "../dropdownlist/dropdownlist.service";
import { CheckOutComponent } from "../checkout/checkout.component";
import { FavLocationService } from "../fav-location/fav-location.service";
import { FBPixelService } from '../../services/fb-pixel.service';
import { CheckoutTemplateService } from '../../modules/checkout-template/services/checkout-template.service';
import { CatalogueService } from '../catalogue/catalogue.service'
declare var $: any;

@Component({
  selector: "app-laundry-checkout",
  templateUrl: "./laundry-checkout.component.html",
  styleUrls: ["./laundry-checkout.component.scss", "../checkout/checkout.scss"],
  animations: [
    trigger("slideInOut", [
      transition(":enter", [
        style({ transform: "translateX(100%)", opacity: 0 }),
        animate(
          ".3s ease-out",
          style({ transform: "translateX(0)", opacity: 1 })
        )
      ]),
      transition(":leave", [
        style({ transform: "translateX(0)", opacity: 1 }),
        animate(
          ".3s ease-out",
          style({ transform: "translateX(100%)", opacity: 0 })
        )
      ])
    ])
  ]
})
export class CheckOutLaundryComponent extends CheckOutComponent
  implements OnInit, OnDestroy, AfterViewInit {
  public stepsArray: any = [
    {
      step: 1,
      name: "Pickup Details",
      showName: "Pickup Details",
      active: 1,
      complete: 0,
      data: []
    },
    {
      step: 2,
      name: "Delivery Details",
      showName: "Delivery Details",
      active: 0,
      complete: 0,
      data: []
    },
    {
      step: 3,
      name: "Schedule",
      showName: "Schedule",
      active: 0,
      complete: 0,
      data: []
    },
    {
      step: 4,
      name: "Review",
      showName: "Review",
      active: 0,
      complete: 0,
      data: []
    },
    {
      step: 5,
      name: "Payment",
      showName: "Payment",
      active: 0,
      complete: 0,
      data: []
    }
  ];

  public activeStep: {
    step: number;
    name: string;
    showName: string;
    active: number;
    complete: number;
    data: Array<any>;
  } = {
    step: 1,
    name: "Pickup Details",
    showName: "Pickup Details",
    active: 1,
    complete: 0,
    data: []
  };

  constructor(
    fb: FormBuilder,
    protected dropDownService: DropDownListService,
    protected popup: PopUpService,
    protected router: Router,
    protected sessionService: SessionService,
    protected cartService: AppCartService,
    protected checkOutService: CheckOutService,
    protected loader: LoaderService,
    protected favLocationService: FavLocationService,
    public googleAnalyticsEventsService: GoogleAnalyticsEventsService,
    public appService: AppService,
    protected localeService: BsLocaleService,
    protected dateTimeAdapter: DateTimeAdapter<any>,
    protected paymentService: PaymentService,
    protected messageService: MessageService,
    protected fbPixelService: FBPixelService,
    protected checkoutTemplateService: CheckoutTemplateService,
    protected productDescService: ProductDescriptionService,
    public catalogueService: CatalogueService
  ) {
    super(
      fb,
      dropDownService,
      popup,
      router,
      sessionService,
      cartService,
      checkOutService,
      loader,
      googleAnalyticsEventsService,
      appService,
      localeService,
      dateTimeAdapter,
      paymentService,
      messageService,
      favLocationService,
      fbPixelService,
      productDescService,
      checkoutTemplateService,
      catalogueService
    );
  }

  ngOnInit() {
    this.sessionService.setString("laundryFlow", true);
    let laundryCheckoutSteps = this.sessionService.get('laundryCheckoutSteps');
    if(laundryCheckoutSteps){
      this.stepsArray = laundryCheckoutSteps.stepsArray;
      this.activeStep = laundryCheckoutSteps.activeStep;
    }
    super.ngOnInit();
    this.arrangeStepsTerminology();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  ngAfterViewInit() {
    super.ngAfterViewInit();
  }

  /**
   * arrange steps terminology
   */
  arrangeStepsTerminology() {
    this.stepsArray.map((o) => {
      if (o.name === 'Pickup Details') {
        o.showName = o.showName.replace('Pickup', this.config.terminology.PICKUP);
      }

      if (o.name === 'Delivery Details') {
        o.showName = o.showName.replace(o.showName, this.config.terminology.DELIVERY) + ' Details';
      }
    })
  }

  /**
   * go to particular step
   */
  goToParticularStep(event) {
    this.activeStep = event;
    this.activeStep.active = 1;
  }

  /**
   * steps complete
   */
  stepComplete(data) {
    this.stepsArray = data;

    let activeIndex = this.stepsArray.findIndex(o => {
      return o.active === 1;
    });

    let dataIndex = this.stepsArray.findIndex(o => {
      return o.complete === 0;
    });

    if (activeIndex > -1) {
      this.activeStep = this.stepsArray[activeIndex];
      if(activeIndex == 4){
        this.stepsArray[activeIndex].active = 0;
        activeIndex--;
        this.stepsArray[activeIndex].active = 1;
        this.stepsArray[activeIndex].complete = 0;
        this.activeStep = this.stepsArray[activeIndex];
      }
    } else {
      if (dataIndex > -1) {
        this.stepsArray[dataIndex].active = 1;
        this.activeStep = this.stepsArray[dataIndex];
      }
    }

    let obj = {
      activeStep: this.activeStep,
      stepsArray: this.stepsArray
    };
    this.sessionService.set('laundryCheckoutSteps',obj);
  }
}
