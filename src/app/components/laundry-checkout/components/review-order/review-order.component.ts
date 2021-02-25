/**
 * Created by mba-214 on 24/10/18.
 */
import { Component, Input, ViewChild, OnInit, OnDestroy, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AppCartService } from '../../../catalogue/components/app-cart/app-cart.service';
import { SessionService } from '../../../../services/session.service';
import { CheckOutService } from '../../../checkout/checkout.service';
import { GoogleAnalyticsEventsService } from '../../../../services/google-analytics-events.service';
import { AppService } from '../../../../app.service';
import { MessageService } from '../../../../services/message.service';
import { PopUpService } from '../../../../modules/popup/services/popup.service';
import { LoaderService } from '../../../../services/loader.service';
import { priceType } from '../../../../constants/constant';
import { takeWhile, distinctUntilChanged } from '../../../../../../node_modules/rxjs/operators';
import { CheckoutTemplateService } from '../../../../modules/checkout-template/services/checkout-template.service';
import { CheckoutTemplateComponent } from '../../../../modules/checkout-template/checkout-template.component';
import { CheckoutTemplateType } from '../../../../enums/enum';

@Component({
  selector: 'app-review-order',
  templateUrl: './review-order.component.html',
  styleUrls: ['./review-order.component.scss']
})

export class ReviewOrderComponent implements OnInit, OnDestroy, AfterViewInit {

  @Input() stepsArray: any;
  @Output() stepComplete: any = new EventEmitter();
  public pickSlots: any;
  public deliverySlots: any;
  public products: any;
  public formSettings: any;
  protected cartSubscriber: any;
  public terminology: any = {};
  public langJson: any = {};
  public languageSelected: string;
  public direction: string;
  public description: string;
  public currency: string;
  public cartValue: number;
  public priceType = priceType;
  showCheckoutTemplate: boolean;
  templateData: Array<any> = [];
  templateCost = 0;
  alive = true;
  checkoutTemplateType = CheckoutTemplateType;
  @ViewChild('checkoutTemplate') checkoutTemplate: CheckoutTemplateComponent;
  languageStrings: any={};


  constructor(public cartService: AppCartService,
    public sessionService: SessionService,
    public appService: AppService,
    public messageService: MessageService,
    protected router: Router,
    protected popup: PopUpService,
    protected loader: LoaderService,
    public googleAnalyticsEventsService: GoogleAnalyticsEventsService,
    public checkoutService: CheckOutService,
    public checkoutTemplateService: CheckoutTemplateService) {
    this.cartSubscriber = this.cartService.currentStatus.subscribe(() => {
      this.getProduct();
    });
  }


  ngOnInit() {
    this.sessionService.langStringsPromise.then(() =>
    {
     this.languageStrings = this.sessionService.languageStrings;
     this.languageStrings.delivery_details = (this.languageStrings.delivery_details || 'Delivery Details')
     .replace('DELIVERY_DELIVERY', this.terminology.DELIVERY);
     this.languageStrings.pickup_details = (this.languageStrings.pickup_details || 'Pickup Details')
     .replace('PICKUP_PICKUP', this.terminology.PICKUP);
    });
    this.sessionService.removeByChildKey("app", "checkout_template");
    this.setConfig();
    this.setLang();
    this.setPickupDeliverySlot();
    this.setDescription();
    this.getProduct();
    this.isCheckoutEnabled();
    this.subscribeToCheckoutTemplate();
  }

  ngOnDestroy() {
    this.alive = false;
  }

  ngAfterViewInit() {

  }

  /**
   * set description
   */
  setDescription() {
    if (this.stepsArray[3].data.length) {
      this.description = this.stepsArray[3].data[0].description;
    } else {
      this.description = '';
    }
  }

  /**
   * set pickup delivery slots
   */
  setPickupDeliverySlot() {
    const pickIndex = this.stepsArray[2].data[0].findIndex((o) => {
      return o.type === 'pickup';
    });
    const deliveryIndex = this.stepsArray[2].data[0].findIndex((o) => {
      return o.type === 'delivery';
    });
    this.pickSlots = this.stepsArray[2].data[0][pickIndex];
    this.deliverySlots = this.stepsArray[2].data[0][deliveryIndex];
  }

  /**
   * setConfig
   */
  setConfig() {
    this.formSettings = this.sessionService.get('config');
    this.terminology = this.formSettings.terminology;
    this.currency = this.formSettings.payment_settings[0].symbol;
    this.priceType[1].name = this.terminology.UNIT || 'Unit';
  }

  /**
   * set lang
   */
  setLang() {
    // checks for ar translations
    if (this.sessionService.getString('language')) {
      this.languageSelected = this.sessionService.getString('language');
      if (this.languageSelected === 'ar') {
        this.direction = 'rtl';
      } else {
        this.direction = 'ltr';
      }
    } else {
      this.languageSelected = 'en';
      if (this.languageSelected === 'ar') {
        this.direction = 'rtl';
      } else {
        this.direction = 'ltr';
      }
    }
    this.appService.langPromise.then(() => {
      this.langJson = this.appService.getLangJsonData();
    });
  }

  /**
   * get all products
   */
  getProduct() {
    this.products = this.cartService.getCartData();
    this.calculateCartValue();
  }

  /**
   * enter description
   */
  enterDescription() {
    if (this.description) {
      this.stepsArray[3].data = [];
      this.stepsArray[3].data.push({
        description: this.description
      });
    } else {
      this.stepsArray[3].data = [];
    }
  }

  /**
   * delete product
   */
  decreaseQuantity(product, index) {
    this.cartService.decreamentQuantity(product.id, index);
  }


  increaseQuantity(product, index) {
    this.cartService.increaseQuantity(product.id, index);
  }

  /**
   * get product string
   */
  getProductString() {
    const productData = [];
    this.products.forEach((val, index) => {
      const productObj = {};
      productObj['product_id'] = val.id;
      productObj['unit_price'] = val.price;
      productObj['quantity'] = val.quantity;
      productObj['unit_type'] = val.unit_type;
      productObj['total_price'] = val.price;
      productObj['customizations'] = val.customizations;
      productObj['return_enabled'] = 0;
      productData.push(productObj);
    });
    return JSON.stringify(productData);
  }

  /**
   * confirm order
   */
  confirmOrder() {

    // this.loader.show();
    const obj = {
      // promo_code : Joi.string().optional(),
      job_pickup_email: this.stepsArray[0].data[0].email,
      job_pickup_phone: '+' + this.stepsArray[0].data[0].country_code + ' ' + this.stepsArray[0].data[0].phone,
      job_pickup_name: this.stepsArray[0].data[0].name +' '+ this.stepsArray[0].data[0].lastName,
      job_description: this.description,
      job_pickup_latitude: this.stepsArray[0].data[0].latitude,
      job_pickup_longitude: this.stepsArray[0].data[0].longitude,
      job_pickup_datetime: this.pickSlots.start_time,
      job_pickup_address: this.makeAddressString(this.stepsArray[0].data[0].flat, this.stepsArray[0].data[0].landmark,
        this.stepsArray[0].data[0].address),
      job_delivery_latitude: this.stepsArray[1].data[0].latitude,
      job_delivery_longitude: this.stepsArray[1].data[0].longitude,
      job_delivery_address: this.makeAddressString(this.stepsArray[1].data[0].flat, this.stepsArray[1].data[0].landmark,
        this.stepsArray[1].data[0].address),
      job_delivery_email: this.stepsArray[1].data[0].email,
      job_delivery_name: this.stepsArray[1].data[0].name +' '+ this.stepsArray[1].data[0].lastName,
      job_delivery_phone: '+' + this.stepsArray[1].data[0].country_code + ' ' + this.stepsArray[1].data[0].phone,
      job_delivery_datetime: this.deliverySlots.start_time,
      is_scheduled: 1,
      // card_id : Joi.number().optional(),
      // vertical : Joi.string().optional(),
      // promo_id : Joi.number().optional(),
      // referral_code : Joi.string().optional(),
      // yelo_app_type : Joi.number().optional(),
      has_pickup: 1,
      // tax : Joi.number().optional(),
      // delivery_charge : Joi.number().optional(),
      // tip_type : Joi.number().optional(),
      // tip : Joi.number().optional(),
      // AppIP : Joi.string().optional(),
      // payment_method : Joi.number().optional(),
      // transaction_id : Joi.string().optional().allow(""),
      // amount : this.cartValue,
      timezone: new Date().getTimezoneOffset(),
      currency_id: this.formSettings.payment_settings[0].currency_id,
      has_delivery: 1,
      products: this.getProductString(),
    };

    const obj2 = JSON.parse(JSON.stringify(obj));
    // obj2.vendor_id = this.sessionService.get('appData').vendor_details.vendor_id;
    // obj2.access_token = this.sessionService.get('appData').vendor_details.app_access_token;
    obj2.reference_id = this.sessionService.get('appData').vendor_details.reference_id;
    obj2.user_id = this.sessionService.get('user_id');
    obj2.marketplace_user_id = this.formSettings.marketplace_user_id;
    obj2.marketplace_reference_id = this.formSettings.marketplace_reference_id;
    if (this.sessionService.get('appData')) {
      obj2['vendor_id'] = this.sessionService.get('appData').vendor_details.vendor_id;
      obj2['access_token'] = this.sessionService.get('appData').vendor_details.app_access_token;
    }
    // this.sessionService.set('laundryCheckoutData',obj2);
    this.sessionService.setByKey("app", "checkout", { cart: obj });
    this.sessionService.setByKey("app", "checkout", { cart: obj });
    this.sessionService.setByKey("app", "checkout_template", this.templateData);
    return obj2;
    // this.router.navigate(["payment"]);
    // this.checkoutService.laundryOrder(obj).subscribe(response => {
    //   if (response.status === 200) {
    //     this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.order_created_success, 'Order Created Success');
    //     this.langJson['Your order has been placed.'] = this.langJson['Your order has been placed.'].
    //     replace('----', this.terminology.ORDER);
    //     const msg = this.langJson['Your order has been placed.'];
    //     this.popup.showPopup('success', 3000, msg, false);

    //     this.messageService.clearCartOnly();
    //     this.sessionService.removeByChildKey('app', 'cart');
    //     this.sessionService.removeByChildKey('app', 'category');
    //     this.sessionService.removeByChildKey('app', 'checkout');
    //     this.sessionService.removeByChildKey('app', 'payment');
    //     this.sessionService.removeByChildKey('app', 'customize');
    //     this.sessionService.removeByChildKey('app', 'cartProduct');
    //     this.sessionService.remove('sellerArray');
    //     this.sessionService.remove('tip');
    //     this.cartService.cartClearCall();
    //     setTimeout(() => {
    //       this.loader.hide();
    //       this.router.navigate(['list']);
    //     }, 200);
    //   } else {
    //     this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.order_created_failure, 'Order Created Failure');
    //     this.loader.hide();
    //     this.popup.showPopup('error', 3000, response.message, false);
    //   }
    // });
  }
  /**
   * calculate cart value
   */
  calculateCartValue() {
    const cart = this.cartService.getCartData();
    this.cartValue = 0;
    if (cart && cart.length > 0) {
      cart.forEach((val) => {
        this.cartValue += val.quantity * val.showPrice;
      });
    }
    this.cartValue += this.templateCost;
  }

  /**
   * continue to next step
   */
  continueOption() {

    if (this.checkoutTemplate) {
      if (!this.checkoutTemplate.validateFields()) { return; }
    }

    this.stepsArray.forEach((o) => {
      if (o.data.length) {
        o.active = 0;
      }
    });

    const obj = this.confirmOrder();

    this.stepsArray[3].complete = 1;
    this.stepsArray[3].active = 0;
    this.stepsArray[3].data = [];
    this.stepsArray[3].data.push(obj);

    this.stepComplete.emit(this.stepsArray);
  }

  // checkout template
  protected isCheckoutEnabled() {
    this.checkoutService.isCheckoutTemplateEnabled(CheckoutTemplateType.NORMAL_ORDER)
      .subscribe(response => {
        if (response.status === 200) {
          this.showCheckoutTemplate = !!response.data.is_checkout_template_enabled;
        } else {
          this.showCheckoutTemplate = false;
        }
      }, error => {
        this.showCheckoutTemplate = false;
      });
  }


  private subscribeToCheckoutTemplate() {
    this.checkoutTemplateService.priceTemplateChange
      .pipe(
        takeWhile(_ => this.alive),
        distinctUntilChanged()
      )
      .subscribe(data => this.onCheckoutTemplateEvent(data));
  }

  private onCheckoutTemplateEvent(items: any[]) {
    this.templateData = this.checkoutTemplateService.createCheckoutTemplateJson(
      items
    );
    this.calculateAdditionalCharge();

    // this.getBillBreakdown();
  }

  /**
   * Calculate additional charge using checkout template
   */
  calculateAdditionalCharge() {
    try {
      const templatItemWithCost = this.templateData.filter(_ => ['Single-Select', 'Multi-Select'].includes(_.data_type)
      && Boolean(_.value) && _.value.length);
      const templateCost = templatItemWithCost.reduce((cost , el) => {
        switch (el.data_type) {
          case 'Single-Select':
            const selectedOption = el.option.find(_ => _.text === el.value);
            return cost + selectedOption ? selectedOption.cost : 0;
          case 'Multi-Select':
            const selectedOptions = el.option.filter(_ => el.value.includes(_.text)) || [];
            return cost + selectedOptions.reduce((acc, curEl) => acc + curEl.cost, 0);
        }
      }, 0);
      this.templateCost = templateCost || 0;
    } catch (err) {
      this.templateCost = 0;
    }
    this.calculateCartValue();
  }

  /**
   * make address string
   * @param flat
   * @param landmark
   * @param address
   */
  makeAddressString(flat: string, landmark: string, address: string): string {
    let result_address = '';
    if (flat) {
      result_address += `${flat}, `;
    }
    result_address += address;
    if (landmark) {
      result_address += `, ${landmark}`;
    }
    return result_address;
  }

}
