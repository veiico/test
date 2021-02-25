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
import { AuthorizeNetService } from '../../authorize-net.service';
import { MessageType } from '../../../../constants/constant';

declare var Stripe: any;

@Component({
  selector: 'app-authorize-net-add-card',
  templateUrl: './add-card.component.html',
  styleUrls: ['./add-card.component.scss']
})
export class AuthorizeNetAddCardComponent implements OnInit, AfterViewInit, OnDestroy {

  languageStrings: any={};
  public config: any;
  public terminology: any;
  public authorizeNetLink: any;
  public langJson: any;
  public languageSelected: string;
  public direction: string;
  public card: any;
  public showAuthorizeNetAddCard: boolean;
  public cardWindowRef: any;
  public paymentWindowRef: any;

  @Input() addCardLink: string;
  @Output() cardWindowRefOut: any = new EventEmitter();

  private _hideIframe;
  get hideIframe() { return this._hideIframe };
  @Input() set hideIframe(val: any) {
    if (val) {
      this._hideIframe = val;
      this.showAuthorizeNetAddCard = false;
    }
  };

  private _secureUrlFrame;
  get secureUrlFrame() { return this._secureUrlFrame };
  @Input() set secureUrlFrame(val: any) {
    if (val) {}
  };

  constructor(private sessionService: SessionService,
              protected popup: PopUpService,
              protected loader: LoaderService,
              protected authorizeNetService: AuthorizeNetService,
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

 addCard(){
  if (this.addCardLink == '') {
    this.popup.showPopup(MessageType.ERROR, 2000, this.languageStrings.unable_to_add_card || 'Unable to add card', false);
    return false;
  }
  this.authorizeNetLink = this.domSanitizer.bypassSecurityTrustResourceUrl(this.addCardLink+= "&domain_name=" + encodeURIComponent(window.location.origin));
  this.showAuthorizeNetAddCard = true;
 }

  getContentPayfort(event) {
    let frame = window.frames;
  }
}
