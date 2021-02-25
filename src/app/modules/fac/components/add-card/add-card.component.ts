import { Component, OnInit, Input, EventEmitter, Output, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { DomSanitizer } from "@angular/platform-browser";
import { AppService } from '../../../../app.service';
import { SessionService } from '../../../../services/session.service';
import { PopUpService } from '../../../popup/services/popup.service';
import { ValidationService } from '../../../../services/validation.service';
import { LoaderService } from '../../../../services/loader.service';
import { FacService } from '../../fac.service';

declare var Stripe: any;

@Component({
  selector: 'app-fac-add-card',
  templateUrl: './add-card.component.html',
  styleUrls: ['./add-card.component.scss']
})
export class FacAddCardComponent implements OnInit, AfterViewInit, OnDestroy {

  languageStrings: any={};
  public config: any;
  public terminology: any;
  public facLink: any;
  public langJson: any;
  public languageSelected: string;
  public direction: string;
  public card: any;
  public showFacAddCard: boolean;
  public cardWindowRef: any;
  public paymentWindowRef: any;

  @Input() addCardLink: string;
  @Output() cardWindowRefOut: any = new EventEmitter();

  protected _hideIframe;
  get hideIframe() { return this._hideIframe };
  @Input() set hideIframe(val: any) {
    if (val) {
      this._hideIframe = val;
      this.showFacAddCard = false;
    }
  };

  protected _secureUrlFrame;
  get secureUrlFrame() { return this._secureUrlFrame };
  @Input() set secureUrlFrame(val: any) {
    if (val) {}
  };

  constructor(protected sessionService: SessionService,
              protected popup: PopUpService,
              protected loader: LoaderService,
              protected facService: FacService,
              public domSanitizer: DomSanitizer,
              protected appService: AppService) {
               
               }

  ngOnInit() {
    this.setConfig();
    this.setLanguage();
  }

  ngAfterViewInit() {

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

 addCard() {
  
  if (this.addCardLink === '') {
    this.popup.showPopup('error', 2000,this.languageStrings.card_added_successfully || "Card successfully added", false);
    return false;
  }
  this.facLink = this.domSanitizer.bypassSecurityTrustResourceUrl(this.addCardLink += "&domain_name=" + encodeURIComponent(window.location.origin));
  this.showFacAddCard = true;
 }

  getContentPayfort(event) {
    let frame = window.frames;
  }
  ngOnDestroy() {

  }

}
