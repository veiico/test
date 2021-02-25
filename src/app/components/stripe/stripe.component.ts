import { Component, ViewChild, ElementRef, ChangeDetectorRef, OnDestroy, OnInit, Inject, Renderer2 } from '@angular/core';
import { NG_VALUE_ACCESSOR, NgForm } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';

import { LoaderService } from '../../services/loader.service';
import { PopUpService } from '../../modules/popup/services/popup.service';
import { CartModel } from '../catalogue/components/app-cart/app-cart.model';
import { StripeApiService } from './stripe.service';
import { SessionService } from "../../services/session.service";
import { LoadScriptsPostAppComponentLoad } from '../../classes/load-scripts.class';
import { MessageType } from '../../constants/constant';
import { DOCUMENT } from '@angular/common';

declare var Stripe: any;

// import { ValidationService } from './../../components/validation/validation.service';
// import { Store } from '@ngrx/store';
// import * as cart from './state/cart.actions';

@Component({
    selector: 'app-stripe',
    templateUrl: './stripe.html',
    styleUrls: ['./stripe.scss']
})
export class StripeComponent implements OnInit, OnDestroy {

    secret;
    @ViewChild('cardInfo') cardInfo: ElementRef;
    card: any;
    cardHandler = this.onChange.bind(this);
    error: string;
    stripe;
    elements;
    public appConfig: any = {
        color: ''
    };
    public languageSelected: any;
    public direction = 'ltr';
    access_token_for_add_card: any;
    vendorId_for_add_card: any;
    cardHolderName: string
    city: string
    // country: string
    line1: string
    line2: string
    state: string
    showerror: boolean;
    hideStripePostalCodeForArr = [239393,239482,424539,278329,283939];
    user_Id_for_add_card: any;
    customerEmail: string;
    languageStrings: any={};

    constructor(
        private el: ElementRef,private renderer: Renderer2,@Inject(DOCUMENT) private _document: HTMLDocument,private loader: LoaderService, private popup: PopUpService, private service: StripeApiService,
        private activatedRoute: ActivatedRoute, private cd: ChangeDetectorRef, public sessionService: SessionService) {
        this.loader.show();

        // if (data.config) {
        //     this.appConfig = data.config;
        // }
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
    }

    ngOnInit() {
        // this.loader.hide();
        this.sessionService.langStringsPromise.then(() =>
        {
         this.languageStrings = this.sessionService.languageStrings;
        });
        this.loader.show();
        this.appConfig = this.sessionService.get('config') ? this.sessionService.get('config') : {};
        if (this.sessionService.get('appData')) {
            this.access_token_for_add_card = this.getParameterByName("access_token", this.sessionService.get("appData").add_card_link);
            this.vendorId_for_add_card = this.getParameterByName("vendor_id", this.sessionService.get("appData").add_card_link);
        }
        this.activatedRoute.queryParams.subscribe(async (params: Params) => {
            this.user_Id_for_add_card = params['user_id'];
            if (params['access_token'] && params['vendor_id']) {
                this.access_token_for_add_card = params['access_token'];
                this.vendorId_for_add_card = params['vendor_id'];               
                if (this.access_token_for_add_card && this.vendorId_for_add_card ) {
                    const data = {
                        'access_token': this.access_token_for_add_card,
                        'vendor_id': this.vendorId_for_add_card,
                    };
                    this.service.getStripeKey(data)
                        .subscribe(async res => {
                            this.loader.hide();
                            if (res.status === 200) {
                                await LoadScriptsPostAppComponentLoad.stripePromise;
                                if(!LoadScriptsPostAppComponentLoad.stripePromise){
                                    await  LoadScriptsPostAppComponentLoad.stripe(this._document, this.renderer, this.el);
                                }
                                this.loader.hide();
                                this.stripe = Stripe(res.data.public_key,{locale: this.sessionService.getString('language')});                                
                                this.elements = this.stripe.elements();
                                // this.card = this.elements.create('card'); // , {hidePostalCode: true}
                                if (this.hideStripePostalCodeForArr.includes(+this.user_Id_for_add_card)) {
                                    this.card = this.elements.create("card", { hidePostalCode: true });
                                  }
                                  else {
                                    this.card = this.elements.create("card");
                                  }
                                this.card.mount(this.cardInfo.nativeElement);
                                this.card.addEventListener('change', this.cardHandler);
                            }
                        });
                }
            } else {
                await LoadScriptsPostAppComponentLoad.stripePromise;
                if(!LoadScriptsPostAppComponentLoad.stripePromise){
                    await  LoadScriptsPostAppComponentLoad.stripe(this._document, this.renderer, this.el);
                }
                this.loader.hide();
                this.stripe = Stripe(this.appConfig.stripe_public_key);
                this.elements = this.stripe.elements();
                // this.card = this.elements.create('card');
                if (this.hideStripePostalCodeForArr.includes(+this.user_Id_for_add_card)) {
                    this.card = this.elements.create("card", { hidePostalCode: true });
                  }
                  else {
                    this.card = this.elements.create("card");
                  }
                this.card.mount(this.cardInfo.nativeElement);

                this.card.addEventListener('change', this.cardHandler);
            }
        });
    }

    getParameterByName(name, url) {
        if (!url) { url = window.location.href; }
        name = name.replace(/[\[\]]/g, '\\$&');
        const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
        const results = regex.exec(url);
        if (!results) { return null; }
        if (!results[2]) { return ''; }
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }

    ngOnDestroy() {
        if (this.card) {
            this.card.removeEventListener('change', this.cardHandler);
            this.card.destroy();
        }
    }

    onChange({ error }) {
        if (error) {
            this.error = error.message;
        } else {
            this.error = null;
        }
        this.cd.detectChanges();
    }
    buy() {
        if (this.user_Id_for_add_card == 198298 || this.user_Id_for_add_card == 283747) {
            if (!this.cardHolderName || !this.customerEmail || !this.city || !this.state || !this.line1) {
                this.showerror = true;
                return;
            }
        }
        this.loader.show();
        let data = {}
        data = {
            name: this.cardHolderName || undefined,
            email: this.customerEmail || undefined,
            address_city: this.city || undefined,
            // address_country: this.country || undefined,
            address_line1: this.line1 || undefined,
            address_line2: this.line2 || undefined,
            address_state: this.state || undefined,
        }

        this.stripe
            .createToken(this.card, data)
            .then(result => {
                if (result.token) {
                    // Use the token to create a charge or a customer
                    // https://stripe.com/docs/charges
                    if (this.access_token_for_add_card && this.vendorId_for_add_card) {
                        const data = {
                            'access_token': this.access_token_for_add_card,
                            'stripe_token': result.token.id,
                            'vendor_id': this.vendorId_for_add_card
                        };
                        this.service.submitDetails(data)
                            .subscribe(res => {
                                this.loader.hide();
                                if (res.status === 200) {
                                    window.location.href = window.location.href + '&success';
                                    this.popup.showPopup(MessageType.SUCCESS, 2500, res.message, false);
                                } else {
                                    this.popup.showPopup(MessageType.ERROR, 2500, res.message, false);
                                }
                            });
                    } else {

                    }
                } else if (result.error) {
                    this.loader.hide();
                    // Error creating the token
                    // this.popup.showPopup(MessageType.ERROR, 2500, result.error.message, false);
                }
            });
    }
}
