import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { SessionService } from '../../services/session.service';
import { AppService } from '../../app.service';
import { LoaderService } from '../../services/loader.service';
import { PaymentFor, PaymentMode } from '../../enums/enum';
// import { ThetellerService } from './theteller.service';
import { PopUpService } from "../../modules/popup/services/popup.service";
import { MessageType } from './../../constants/constant';
import { Router } from '@angular/router';
import { PaymentService } from '../../components/payment/payment.service';

@Component({
  selector: 'app-theteller',
  templateUrl: './theteller.component.html',
  styleUrls: ['./theteller.component.scss']
})
export class ThetellerComponent implements OnInit {
  languageStrings: any={};
  public config: any;
  public terminology: any;
  public langJson: any;
  public languageSelected: string;
  public direction: string;
  protected _triggerPayment;
  sessionVar: any;
  showBackground: boolean;
  url: any;
  allowPopUp: boolean = true;
  public post_enabled: boolean = false;
  paymentObj;

  @Input() loginResponse: any;
  @Input() NET_PAYABLE_AMOUNT: number;
  @Output() paymentMadeResponse: any = new EventEmitter();
  @Input() paymentFor: any;

  get triggerPayment() { return this._triggerPayment };
  @Input() set triggerPayment(val: any) {
    if (val) {
      this._triggerPayment = val;
      this.getPaymentObject();
    }
  };

  constructor(protected sessionService: SessionService, protected appService: AppService, public loader: LoaderService, protected cd: ChangeDetectorRef, protected popup: PopUpService, protected router: Router, protected paymentService: PaymentService) {
    this.setConfig();
    this.setLanguage();
  }

  ngOnInit() {

    window.onmessage = this.onWindowMessage.bind(this);
  }

  private onWindowMessage(event: any) {
    if (typeof event.data == 'object') {
      if (event.data.payment_method == PaymentMode.THETELLER) {
        if (event.data.status == 'error' && !this.post_enabled) {
          setTimeout(() => {
            this.showBackground = false;
          }, 900);
        }
        this.allowPopUp = false;
        this.paymentMadeResponse.emit(event.data);
        this.cd.detectChanges();
      }
    }
  }

  openUrl() {
    this.sessionVar = window.open(this.url)
    this.cd.detectChanges();
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

  setOnCloseWinListener(message) {
    this.showBackground = false;
    this.sessionVar.close();
    setTimeout(() => {
      this.popup.showPopup(MessageType.ERROR, 3000, message, false);
    }, 1000);
    if (message.length > 0) {
      if (this.post_enabled) {
        setTimeout(() => {
          this.router.navigate(['list']);
        }, 1500);
      }
    }
    else {
      this.paymentMadeResponse.emit({
        'payment_method': PaymentMode.THETELLER,
        'status': 'error'
      });
    }

    this.cd.detectChanges();
  };

  focusOnWindow() {
    this.sessionVar.focus();
    this.cd.detectChanges();
  }

  getPaymentObject() {
    this.paymentService.getActivePaymentOption().subscribe(response => {

      this.paymentObj = response.data.filter(
        ele => ele.value == PaymentMode.THETELLER
      );

      this.post_enabled = this.paymentObj[0].payment_process_type == 1 ? true : false;

      this.initTheteller();
    });
  }

  /**
     * init theteller
     */
  initTheteller() {
    // this.loader.show();
    this.sessionVar = this.sessionService.paymentWinRef;
    this.showBackground = true;

    const appData = this.sessionService.get('appData');
    ;
    const data = {
      'vendor_id': appData.vendor_details.vendor_id,
      'marketplace_user_id': this.config.marketplace_user_id,
      'user_id': this.sessionService.getString('user_id') || undefined,
      'access_token': appData.vendor_details.app_access_token,
      'app_type': 'WEB',
      'currency': this.config.payment_settings[0].code,
      'payment_method': PaymentMode.THETELLER,
      'name': appData.vendor_details.first_name,
      'email': appData.vendor_details.email,
      'domain_name': window.location.origin,
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

    this.paymentService.getPaymentUrl(data).subscribe(response => {
      this.loader.hide();
      if (response.status === 200) {
        this.url = response.data.url;
        this.sessionVar.location.href = this.url;
      } else {
        this.loader.hide();
        this.setOnCloseWinListener(response.message);
      }
    }, error => {
      this.loader.hide();
      this.setOnCloseWinListener('');
    });
  }

}
