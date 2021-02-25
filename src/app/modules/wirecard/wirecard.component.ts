import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { AppService } from '../../app.service';
import { PaymentFor, PaymentMode } from '../../enums/enum';
import { LoaderService } from '../../services/loader.service';
import { SessionService } from '../../services/session.service';
import { WirecardService } from './wirecard.service';

@Component({
  selector: 'app-wirecard',
  templateUrl: './wirecard.component.html',
  styleUrls: ['./wirecard.component.scss']
})
export class WirecardComponent implements OnInit, AfterViewInit, OnDestroy {
  languageStrings: any={};
  transactionData: any;

  public config: any;
  public terminology: any;
  public langJson: any;
  public languageSelected: string;
  public direction: string;
  public wirecardPaymentUrl: any;
  public checkScriptLoad: boolean = false;   
  public showBackground: boolean;
  @Input() loginResponse: any;
  @Input() NET_PAYABLE_AMOUNT: number;
  @Output() paymentMadeResponse: any = new EventEmitter();
  @Input() paymentFor: any;
  protected _triggerPayment;
  protected wirecardWinRef;
  protected closeWindowListener;

  get triggerPayment() { return this._triggerPayment };
  @Input() set triggerPayment(val: any) {
    if (val) {
      this._triggerPayment = val;
      this.initWirecard();
    }
  };

  ref: Window;

  constructor(protected sessionService: SessionService,
    public wirecardService: WirecardService,
    public domSanitizer: DomSanitizer,
    public loader: LoaderService,
    public router: Router,
    protected appService: AppService) {
    this.setConfig();
    this.setLanguage();
  }

  ngOnInit() {
    this.sessionService.langStringsPromise.then(() =>
    {
     this.languageStrings = this.sessionService.languageStrings;
    });
    // this.loadWiredPayment();

    /**
     * iframe events for success and failure payment
     */
    window.onmessage = this.onWindowMessage.bind(this);
  }

  private onWindowMessage(event: any) {
    if (typeof event.data == 'object') {
      if (event.data.payment_method == 33554432) {
        if (event.data.status == 'success') {
          this.wirecardResponse(event.data);
        } else {
          this.wirecardResponse(event.data);
        }
      }
    }
  }

    ngAfterViewInit() {

    }

    ngOnDestroy() {
      // if (this.sessionService.wirecardWinRef)
      // this.sessionService.wirecardWinRef.close();
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
    }


    /**
     * init wirecard
     */
    initWirecard() {
      // this.loader.show();
      this.showBackground = true;

      const appData = this.sessionService.get('appData');
      ;
      const data = {
        'vendor_id': appData.vendor_details.vendor_id,
        'marketplace_user_id': this.config.marketplace_user_id,
        'user_id': this.sessionService.getString('user_id') || undefined,
        // 'user_id': ((this._triggerPayment.payment_for  == PaymentFor.REPAYMENT || this._triggerPayment.isEditedTask) ? this.sessionService.get('repay_merchant') : this.sessionService.getString("user_id")) || undefined,      
        'access_token': appData.vendor_details.app_access_token,
        'app_type': 'WEB',
        'currency': this.config.payment_settings[0].code,
        // 'payment_method': PaymentMode.WIRE_CARD,
        'name': appData.vendor_details.first_name,
        'email': appData.vendor_details.first_name,
        'frame_ancestor_url': `https://test-public-3036.yelo.red`,
        'origin_url':`${window.location.origin}`,
        // 'frame_ancestor_url': `${window.location.origin} https://test-public-3036.yelo.red`,
        //   'domain_name': window.location.origin,
        'amount': this.NET_PAYABLE_AMOUNT,
      };

      if (typeof this._triggerPayment == 'object' && this._triggerPayment.job_id) {
        data['job_id'] = this._triggerPayment.job_id.toString();
      }

      if (typeof this._triggerPayment == 'object') {
        data['isEditedTask'] = this._triggerPayment.isEditedTask ? 1 : undefined;
        data['payment_for'] = this._triggerPayment.payment_for !== undefined ? this._triggerPayment.payment_for : undefined;
      }

      if (this.paymentFor) {
        data['payment_for'] = this.paymentFor;
      }
      this.wirecardService.getPaymentLink(data).subscribe(response => {
        this.loader.hide();
        if (response.status === 200) {
          // this.sessionService.wirecardWinRef.location.href = response.data.url;
        } else {
          this.loader.hide();
          this.setOnCloseWinListener();

        }
      }, error => {
        this.loader.hide();
      });
    }

    focusOnWindow() {
      // this.sessionService.wirecardWinRef.focus();
  }

  setOnCloseWinListener() {
              this.paymentMadeResponse.emit({
                  // 'payment_method': PaymentMode.WIRE_CARD,
                  'status': 'error'
              });
              this.showBackground = false;
          
  };



  openWindowInCenter(url, title, w, h, t) {
      // Fixes dual-screen position                         Most browsers      Firefox
      let dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : window.screenX;
      let dualScreenTop = window.screenTop != undefined ? window.screenTop : window.screenY;

      let width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
      let height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

      let systemZoom = width / window.screen.availWidth;
      let left = (width - w) / 2 / systemZoom + dualScreenLeft
      let top = (height - h) / 2 / systemZoom + dualScreenTop + t;
      // this.sessionService.wirecardWinRef = window.open(url, '', 'scrollbars=yes, width=' + w / systemZoom + ', height=' + h / systemZoom + ', top=' + top + ', left=' + left);

      // Puts focus on the newWindow
      // if (window.focus) this.sessionService.wirecardWinRef.focus();
  }

    /**
     * payment made event
     */
    paymentMade(data) {
      this.paymentMadeResponse.emit(data);
    }
    /**
     * close iframe
     */
    close3dver() {
      this.wirecardPaymentUrl = '';
    }


    wirecardResponse(data) {
      setTimeout(() => {
        this.paymentMade(data);
      }, 3000);
    }

    /**
     * change route when payment not done with payment status
     */
    changeRouteWithParams() {
      setTimeout(() => {
        this.loader.hide();
        //this.orderPlacedCartClear();
        const payment_params = {
          payment_status: 0
        };
        if (this._triggerPayment.payment_for == PaymentFor.REPAYMENT) {
          payment_params['repayment'] = 1
        }
        if ((this.sessionService.get('config').business_model_type === 'ECOM') &&
          (this.sessionService.get('config').nlevel_enabled === 2)) {
          this.router.navigate(['ecom/categories'], { queryParams: payment_params });
        }
        else {
          this.router.navigate(['list'], { queryParams: payment_params });
        }
      }, 200);
    }

    /**
     * manupulate bowser history for failed payment
     */
    manupulateBrowserHistory() {
      let domain = window.location.hostname;
      let url = ''
      if ((this.sessionService.get('config').business_model_type === 'ECOM') &&
        (this.sessionService.get('config').nlevel_enabled === 2)) {
        url = 'ecom/categories';
      }
      else {
        url = 'list';
      }

      if (
        domain === "localhost" ||
        domain === "dev-webapp.yelo.red" ||
        domain === "beta-webapp.yelo.red" ||
        domain === "127.0.0.1" ||
        domain === "dev.yelo.red"
      ) {
        history.replaceState('', '', location.origin + '/' + url + '?payment_status=0' + (this._triggerPayment.payment_for == PaymentFor.REPAYMENT ? '&repayment=1' : ''));
      } else {
        history.replaceState('', '', location.origin + '/' + this.languageSelected + '/' + url + '?payment_status=0' + (this._triggerPayment.payment_for == PaymentFor.REPAYMENT ? '&repayment=1' : ''));
      }
    }
  }
