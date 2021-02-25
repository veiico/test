/**
 * Created by mba-214 on 25/10/18.
 */
import { Component, Input, OnInit, OnDestroy, AfterViewInit, Output, HostListener } from '@angular/core';
import { SessionService } from '../../../../services/session.service';
import { PopUpService } from '../../../../modules/popup/services/popup.service';
import { AppService } from '../../../../app.service';
import { CatalogueService } from '../../catalogue.service';

@Component({
  selector: 'app-static-pages',
  templateUrl: './static-pages.component.html',
  styleUrls: ['./static-pages.component.scss']
})

export class StaticPagesComponent implements OnInit, OnDestroy, AfterViewInit {

  public formSettings: any;
  public terminology: any;
  public direction: string;
  public languageSelected: string;
  public showArrow: boolean;
  public sliceFrom: number = 0;
  public sliceTo: number = 6;
  public dropDownArray: any = [];
  public staticPages: any = [];

  constructor(public sessionService: SessionService,
              public appService: AppService,
              public catalogueService: CatalogueService) {

  }


  ngOnInit() {
    this.setConfig();
    this.setLang();
    this.getAllStaticPages();
    this.arrowToShow();
    this.checkWidthScreen();
  }

  ngOnDestroy() {

  }

  ngAfterViewInit() {

  }

  /**
   * set config
   */
  setConfig() {
    this.formSettings = this.sessionService.get('config');
    this.terminology = this.formSettings.terminology;
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
  }

  /**
   * arrow to show
   */
  arrowToShow() {
    if (this.staticPages.length > this.sliceTo) {
      this.showArrow = true;
      this.defineDropArray();
    } else if (this.staticPages.length <= this.sliceTo) {
      this.showArrow = false;
    }
  }

  /**
   * define drop array
   */
  defineDropArray() {
    let dropItems = [];
    for (let i = this.sliceTo; i < this.staticPages.length; i++) {
      dropItems.push(this.staticPages[i]);
    }

    this.dropDownArray = dropItems;
  }

  /**
   * window resize event
   * @param event
     */
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.checkWidthScreen();
  }

  /**
   * check width of screen and define list according
   */
  checkWidthScreen() {
    let width = window.innerWidth;
    if (width > 600 && width < 800) {
      if (this.staticPages.length > 4) {
        this.sliceTo = 4;
        this.defineDropArray();
      }
    } else if (width > 300 && width < 600) {
      if (this.staticPages.length > 2) {
        this.sliceTo = 2;
        this.defineDropArray();
      }
    } else {
      this.sliceTo = 6;
      this.defineDropArray();
    }
  }

  /**
   * get all static pages
   */
  getAllStaticPages() {
    if(!this.sessionService.getString('user_id') && !this.sessionService.get('info')['storefront_user_id']){
      return ;
    }
    const obj = {
      // 'marketplace_reference_id': this.sessionService.getString('marketplace_reference_id'),
      'marketplace_reference_id': this.formSettings.marketplace_reference_id,
      'marketplace_user_id': this.formSettings.marketplace_user_id,
      'user_id': this.sessionService.getString('user_id') ?  this.sessionService.getString('user_id'): (this.sessionService.get('info')['storefront_user_id'] ? this.sessionService.get('info')['storefront_user_id'] : undefined),
      'is_active': 1,
      'is_admin_page': 0,
      'source': 0
    };
    if (this.sessionService.get('appData')) {
      obj['vendor_id'] = this.sessionService.get('appData').vendor_details.vendor_id;
      obj['access_token'] = this.sessionService.get('appData').vendor_details.app_access_token;
    }

    this.catalogueService.getAllPages(obj)
      .subscribe(
        response => {
          try {
            if (response.status === 200) {
              response.data.template_data.forEach((o) => {
                if (location.hostname !== 'localhost') {
                  o.url = location.origin + '/' + this.sessionService.getString('language') + '/store/' + o.route;
                } else {
                  o.url = location.origin + '/store/' + o.route;
                }
              })

              this.staticPages = response.data.template_data;

            } else if (response.status === 400) {
              this.staticPages = [];
            }
          } catch (e) {
            console.error(e);
          }
        },
        error => {
          console.error(error);
        }
      );
  }
}
