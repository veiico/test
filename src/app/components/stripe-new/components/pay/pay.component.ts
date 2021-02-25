import { Component, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StripeService } from '../../services/stripe.service';
import { ITokenIntent } from '../interfaces/token-intent.interface';
import { BehaviorSubject } from 'rxjs';
import { trigger, transition, style, animate } from '@angular/animations';
import { environment } from '../../../../pipes/environment';

@Component({
  selector: 'app-pay',
  templateUrl: './pay.component.html',
  styleUrls: ['./pay.component.scss'],
  animations: [
    trigger(
      'enterAnimation', [
      transition(':enter', [
        style({ transform: 'translateY(100%)', opacity: 0 }),
        animate('.5s .32s cubic-bezier(0.23, 1, 0.32, 1)', style({ transform: 'translateY(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        style({ transform: 'translateY(0)', opacity: 1 }),
        animate('.32s .16s ease-out', style({ transform: 'translateY(100%)', opacity: 0 }))
      ])
    ]
    )
  ]
})
export class PayComponent implements OnInit {
  stripe: any;
  // clientSecret: string = "pi_1FFJioImv7zCMHnfc2BSB7i8_secret_O26I6ytKPZlKUYNBO6Il9HJnY";
  intent: ITokenIntent = <ITokenIntent>{};
  showLoader: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  token: string;
  showError: string = '';
  showIntentDialog = false;
  showPaymentSuccess = false;
  constructor(private activatedRoute: ActivatedRoute, private stripeService: StripeService) { }

  ngOnInit() {
    this.subscribetoQueryParams();
    this.loadStripe();

  }

  private loadStripe() {
    return new Promise((resolve, reject) => {
      if (document.getElementById('stripeScript')) {
        let stripeKey = environment.stripe_key;
        this.stripe = (<any>window).Stripe(stripeKey);
        resolve();
      }
      else {
        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://js.stripe.com/v3/';
        script.id = "stripeScript";
        script.onload = () => {
          let stripeKey = environment.stripe_key;
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

  private subscribetoQueryParams() {
    this.activatedRoute.queryParams.subscribe(res => {
      this.token = res.token;
      if (this.token) {
        this.getTokenDetails(this.token);
      }
    });
  }

  /**
   * validate user via email token and get info
   * @param token string email token to authenticate user and get details
   */
  private getTokenDetails(token: string) {
    this.showLoader.next(true);

    this.stripeService.getToken(token).subscribe((res: any) => {
      this.intent = res.data;
      this.showIntentDialog = true;
      this.showLoader.next(false);
    }, error => {
      //TODO
      this.logError(error);
      this.showError = "Invalid Token";
      setTimeout(() => this.showError = '', 5000);
      this.showLoader.next(false);
      // this.commonService.handleError(error);
    })
  }

  makePayment() {

    this.showLoader.next(true);

    this.stripe.handleCardPayment(
      this.intent.client_secret,
      {
        payment_method: this.intent.payment_method || this.intent.card_token,
      }
    ).then((result) => {
      if (result.error) {
        // this.stripePaymentAuthorize = "initial";
        this.showLoader.next(false);
        this.showError = result.error.message;
        setTimeout(() => this.showError = '', 5000);
        this.logError(result);
      } else {
        this.showIntentDialog = false;
        this.showPaymentSuccess = true;
        this.showLoader.next(false);
        setInterval(() => {
          <any>window.close();
        }, 4000)
        // The payment has succeeded. Display a success message.
      }
    });
  }

  private logError(response) {
    this.stripeService.saveLog(this.token, response)
      .subscribe(res => {

      }, error => {
      })
  }

}

