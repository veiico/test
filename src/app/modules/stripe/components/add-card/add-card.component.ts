/**
 * Created by mba-214 on 02/11/18.
 */
import { Component, OnInit, Input, EventEmitter, Output, ViewChild, OnDestroy, AfterViewInit, ElementRef, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AppService } from '../../../../app.service';
import { SessionService } from '../../../../services/session.service';
import { PopUpService } from '../../../popup/services/popup.service';
import { ValidationService } from '../../../../services/validation.service';
import { StripeService } from '../../stripe.service';
import { LoaderService } from '../../../../services/loader.service';
import { MessageType } from '../../../../constants/constant';

declare var Stripe: any;

@Component({
  selector: 'app-stripe-add-card',
  templateUrl: './add-card.component.html',
  styleUrls: ['./add-card.component.scss']
})
export class StripeAddCardComponent implements OnInit, AfterViewInit, OnDestroy {

  languageStrings: any={};
  public config: any;
  public terminology: any;
  public langJson: any;
  public languageSelected: string;
  public direction: string;
  public cardForm: FormGroup;
  private stripe;
  private elements;
  public card: any;
  public showStripeCard: boolean;
  public error: boolean;
  public stripe_token: string;
  public secret: string;
  public access_token_for_add_card: string;
  public vendorId_for_add_card: string;
  cardHolderName: string;
  city: string;
  country: string;
  line1: string;
  line2: string;
  state: string;
  hideStripePostalCodeForArr = [239393,239482,424539,278329,283939];

  @Input() addCardLink: string;
  @Output() cardAdded: any = new EventEmitter();
  @ViewChild('cardInfo') cardInfo: ElementRef;
  public cardHandler = this.onChange.bind(this);
  showerror: boolean = false;
  userId: any;
  customerEmail: any;

  constructor(private sessionService: SessionService,
              protected popup: PopUpService,
              protected fb: FormBuilder,
              protected ref: ChangeDetectorRef,
              protected loader: LoaderService,
              protected stripeService: StripeService,
              private appService: AppService) { }

  ngOnInit() {
    this.setConfig();
    this.setLanguage();
    this.userId = this.sessionService.get("appData").vendor_details.marketplace_user_id;
  }

  public loadStripe() {
    return new Promise((resolve, reject) => {
      if (document.getElementById('stripeScript')) {
        let stripeKey = this.sessionService.get("config").stripe_public_key;
        // console.log(this.sessionService.getString('language'))
        // console.log(this.languageSelected)
        // debugger
        this.stripe = (<any>window).Stripe(stripeKey,{locale: this.sessionService.getString('language')});
        resolve();
      }
      else {
        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://js.stripe.com/v3/';
        script.id = "stripeScript";
        script.onload = () => {
          let stripeKey = this.sessionService.get("config").stripe_public_key;
          // if (this.commonService.loginData.reseller && this.commonService.loginData.reseller.stripe_publishable_key) {
          //   stripeKey = this.commonService.loginData.reseller.stripe_publishable_key;
          // }
          this.stripe = (<any>window).Stripe(stripeKey);
          resolve();
        };
        document.head.appendChild(script);
      }
    });
  }

  ngAfterViewInit() {

  }

  ngOnDestroy() {

  }

  /**
   * set config
   */
  setConfig() {
    this.config = this.sessionService.get('config');
    this.terminology = this.config.terminology;
  }

  /**
   * set language
   */
  setLanguage() {
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
    this.sessionService.langStringsPromise.then(() =>
    {
     this.languageStrings = this.sessionService.languageStrings;
    });
  }

  /**
   * add card
   */
  async addCard() {
    if (this.addCardLink == '') {
      this.popup.showPopup(MessageType.ERROR, 2000, this.languageStrings.unable_to_add_card || 'Unable to add card', false);
      return false;
    }
    if (!this.config.stripe_public_key || this.config.stripe_public_key === null) {
      this.popup.showPopup(MessageType.ERROR, 2000, 'Stripe not enabled for this user.', false);
      return false;
    }
    await this.loadStripe();
    this.initAddCardForm();
    let user_id = this.sessionService.get("appData").vendor_details.marketplace_user_id;
    this.showStripeCard = true;
    this.stripe = Stripe(this.config.stripe_public_key);
    this.elements = this.stripe.elements();
    // this.card = this.elements.create('card');
    if (this.hideStripePostalCodeForArr.includes(user_id)) {
      this.card = this.elements.create("card", { hidePostalCode: true });
    }
    else {
      this.card = this.elements.create("card");
    }
    this.card.mount(this.cardInfo.nativeElement);
    this.card.addEventListener('change', this.cardHandler);
  }
  private setupIntentToken() {
    return new Promise((resolve, reject) => {
      const data=
      {
     marketplace_user_id:this.sessionService.get(
      "appData"
    ).vendor_details.marketplace_user_id,
    vendor_id :this.sessionService.get(
      "appData"
    ).vendor_details.vendor_id,
    access_token:this.sessionService.get(
      "appData"
    ).vendor_details.app_access_token
      }
      this.stripeService.getSetupIntent(data).subscribe((res) => {
        if (res.status == 200) {
          resolve(res.data||{});
        }
        else{
          this.loader.hide();
          this.popup.showPopup(MessageType.ERROR, 2500, res.message, false);          
        }
      })
    })
  }

  /**
   * init add card for
   */
  initAddCardForm() {
    this.cardForm = this.fb.group({
      'cardNumber': ['', Validators.compose([Validators.required, ValidationService.NumberValidator, Validators.minLength(14)])],
      'validity': ['', Validators.compose([Validators.required])],
      'name': [''],
      'cvc': ['', Validators.compose([Validators.required, ValidationService.NumberValidator, Validators.minLength(3)])],
    });
  }

  /**
   * on change bind
   */
  onChange({ error }) {
    if (error) {
      this.error = error.message;
    } else {
      this.error = null;
    }
    this.ref.detectChanges();
  }

  /**
   * reset card
   */
  resetCard() {
    this.showStripeCard = false;
    this.error = false;
  }

  /**
   * get card token
   */
  async getCardToken(value, event) {
    if (this.userId == 198298 || this.userId == 283747) {
      if (!this.cardHolderName || !this.customerEmail || !this.city || !this.state || !this.line1) {
        this.showerror = true;
        return;
      }
    }
    
    this.access_token_for_add_card = this.getParameterByName('access_token', this.addCardLink);
    this.vendorId_for_add_card = this.getParameterByName('vendor_id', this.addCardLink);

    this.loader.show();
    const intentData: any = await this.setupIntentToken();
    if (!intentData) {
      return;
    }
    this.stripe.handleCardSetup(intentData, this.card, {
      payment_method_data: {
        // billing_details: { name: this.cardHolderName || this.sessionService.get('appData').vendor_details.first_name, email: this.customerEmail || this.sessionService.get('appData').vendor_details.email  }
        billing_details: {
          name: this.cardHolderName || this.sessionService.get('appData').vendor_details.first_name,
          email: this.customerEmail || undefined,
          address: {
            city: this.city || undefined,
            country: this.country || undefined,
            line1: this.line1 || undefined,
            line2: this.line2 || undefined,
            state: this.state || undefined
          }
        }
      }
    }
    ).then(result => {
        if (result.setupIntent) {
          const data=
          {
         marketplace_user_id:this.sessionService.get(
          "appData"
        ).vendor_details.marketplace_user_id,
        vendor_id :this.sessionService.get(
          "appData"
        ).vendor_details.vendor_id,
        access_token:this.sessionService.get(
          "appData"
        ).vendor_details.app_access_token,
        payment_method:result.setupIntent.payment_method
          }
          this.stripeService.addCustomerCard(data)
            .subscribe(res => {
              this.loader.hide();
              this.card.clear();
              this.showStripeCard = false;
              this.cardAdded.emit();
              if (res.status === 200) {
                this.popup.showPopup(MessageType.SUCCESS, 2500, res.message, false);
              } else {
                this.popup.showPopup(MessageType.ERROR, 2500, res.message, false);
              }
            });
        } else if (result.error) {
          // Error creating the token
          this.loader.hide();
          this.card.clear();
          this.showStripeCard = false;
          this.popup.showPopup(MessageType.ERROR, 2500, result.error.message, false);
        } else {
          this.card.clear();
          this.showStripeCard = false;
          this.loader.hide();
        }
      });
  }

  /**
   * get params from url
   */
  getParameterByName(name, url) {
    if (!url) { url = window.location.href; }
    name = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
    if (!results) { return null; }
    if (!results[2]) { return ''; }
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }
}
