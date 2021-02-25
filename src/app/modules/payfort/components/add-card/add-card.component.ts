/**
 * Created by mba-214 on 17/11/18.
 */
import { Component, OnInit, Input, EventEmitter, Output, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { DomSanitizer } from "@angular/platform-browser";
import { AppService } from '../../../../app.service';
import { SessionService } from '../../../../services/session.service';
import { PopUpService } from '../../../popup/services/popup.service';
import { ValidationService } from '../../../../services/validation.service';
import { LoaderService } from '../../../../services/loader.service';
import { PayfortService } from '../../payfort.service';
import { MessageType } from '../../../../constants/constant';

declare var Stripe: any;

@Component({
  selector: 'app-payfort-add-card',
  templateUrl: './add-card.component.html',
  styleUrls: ['./add-card.component.scss']
})
export class PayfortAddCardComponent implements OnInit, AfterViewInit, OnDestroy {

  languageStrings: any={};
  public config: any;
  public terminology: any;
  public payfortLink: any;
  public langJson: any;
  public languageSelected: string;
  public direction: string;
  public card: any;
  public showPayfortCard: boolean;
  public cardWindowRef: any;
  public paymentWindowRef: any;

  @Input() addCardLink: string;
  @Output() cardWindowRefOut: any = new EventEmitter();

  private _hideIframe;
  get hideIframe() { return this._hideIframe };
  @Input() set hideIframe(val: any) {
    if (val) {
      this._hideIframe = val;
      this.showPayfortCard = false;
    }
  };

  private _secureUrlFrame;
  get secureUrlFrame() { return this._secureUrlFrame };
  @Input() set secureUrlFrame(val: any) {
    if (val) {
      this._secureUrlFrame = val;
      this.paymentWindowRef = window.open('','',"width=500,height=600,top=100,left=400");
      this.paymentWindowRef.document.title = 'Payment Process';
      this.paymentWindowRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      this.payfortLink = this.addCardLink + '&customer_ip=' + this.sessionService.getString("ip_address");
      this.paymentWindowRef.location.href = this.payfortLink;
      this.cardWindowRefOut.emit({data: this.paymentWindowRef});

      //this.payfortLink = this.domSanitizer.bypassSecurityTrustResourceUrl(this.addCardLink);
      //this.showPayfortCard = true;
    }
  };

  constructor(private sessionService: SessionService,
              protected popup: PopUpService,
              protected loader: LoaderService,
              protected payfortService: PayfortService,
              public domSanitizer: DomSanitizer,
              private appService: AppService) {
               
               }

  ngOnInit() {
    this.setConfig();
    this.setLanguage();
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
  addCard() {
    if (this.addCardLink == '') {
      this.popup.showPopup(MessageType.ERROR, 2000, this.langJson['Unable to add card'], false);
      return false;
    }
    //this.payfortLink = this.domSanitizer.bypassSecurityTrustResourceUrl(
    //  this.addCardLink + "&domain_name=" + window.location.origin
    //);
    this.cardWindowRef = window.open('','',"width=500,height=600,top=100,left=400");
    this.cardWindowRef.document.title = 'Add Card';
    this.cardWindowRef.location.href = this.addCardLink + "&domain_name=" + window.location.origin + '&customer_ip=' + this.sessionService.getString("ip_address");
    this.cardWindowRefOut.emit({data: this.cardWindowRef});
    //this.showPayfortCard = true;
  }

  getContentPayfort(event) {
    let frame = window.frames;
  }
}
