/**
 * Created by mba-214 on 02/11/18.
 */
import { Component, OnInit, Input, EventEmitter, Output, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { SessionService } from '../../services/session.service';
import { AppService } from '../../app.service';
import { LoaderService } from '../../services/loader.service';
import { PopUpService } from '../popup/services/popup.service';

@Component({
  selector: 'app-quick-look',
  templateUrl: './quickLook.component.html',
  styleUrls: ['./quickLook.component.scss']
})
export class QuickLookComponent implements OnInit, AfterViewInit, OnDestroy {

  languageStrings: any={};
  public config: any;
  public terminology: any;
  public langJson: any;
  public languageSelected: string;
  public direction: string;

  protected _productData;
  get productData() { return this._productData };
  @Input() set productData(val: any) {

    this._productData = val;
  };

  @Output() showMultiImages: any = new EventEmitter();

  constructor(protected sessionService: SessionService,
              public loader: LoaderService,
              protected popup: PopUpService,
              protected appService: AppService) {
            
    this.setConfig();
    this.setLanguage();
  }

  ngOnInit() {
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
   * get quick look
   */
  getQuickLook() {
   
    this.showMultiImages.emit({data: this.productData});
  }

}
