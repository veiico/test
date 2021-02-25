/**
 * Created by cl-macmini-51 on 20/07/18.
 */
import { Component, OnDestroy, OnInit, AfterViewInit, Inject, HostListener, ElementRef, NgZone } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import { PageScrollService, PageScrollInstance } from 'ngx-page-scroll';
import { FormGroup, Validators, FormControl } from '@angular/forms';

import { SessionService } from '../../../services/session.service';
import { AppService } from '../../../app.service';
import { LoaderService } from '../../../services/loader.service';
import { ExternalLibService } from '../../../services/set-external-lib.service';
import { CategoryService } from '../services/category.service';
import { MessageService } from '../../../services/message.service';
declare var $: any;

@Component({
  selector: 'app-free-lancer-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss', '../../fetch-location/fetch-location.component.scss'],

})
export class FreelancerHomeComponent implements OnInit, OnDestroy, AfterViewInit {
  public config: any;
  public listForm: any;
  public langJson: any;
  public languageSelected: any;
  public direction = 'ltr';
  public terminology: any;
  public categories = [];
  public scrollTop = false;
  public domainName = window.location.hostname;
  public marketplace_reference_id;
  public selectedLanguage;
  merchant_url: string;
  merchant_signup_terminolgy: string;
  //server
  isPlatformServer: boolean;

  constructor(private sessionService: SessionService, private router: Router, private appService: AppService,
    public loader: LoaderService,
    private pageScrollService: PageScrollService, @Inject(DOCUMENT) private document: any,
    public el: ElementRef, private extService: ExternalLibService,
    private categoryService: CategoryService, public messageService: MessageService, protected ngZone: NgZone) {
    this.setConfig();
    this.setLanguage();
    if (this.sessionService.getString('language') !== undefined) {
      this.selectedLanguage = this.sessionService.getString('language');
    }

    if (this.config !== undefined) {
      this.marketplace_reference_id = this.config.reference_id;
      this.terminology = this.config.terminology;
      this.merchant_signup_terminolgy = this.terminology.MERCHANT;

    }
    this.merchant_url = 'https://' + this.domainName + '/' + this.selectedLanguage +
      '/onboard/merchant-signup?marketplace_reference_id=' + this.marketplace_reference_id + '&user=' + this.merchant_signup_terminolgy;
  }

  // ======================life cycle====================
  ngOnInit() {
    this.isPlatformServer = this.sessionService.isPlatformServer();
    if (!this.isPlatformServer) {
      if (this.config.show_serving_restriction) {
        this.messageService.getMessage().subscribe((res) => {
          if (res && res.lat && res.lng && res.city) {
            const location = {
              lat: res.lat,
              lng: res.lng
            };
            this.getCategoriesAll(location);
          }
        });
      }

      let locationObj = this.sessionService.get('location');
      if (this.config.show_serving_restriction && locationObj && locationObj.city) {
        const location = {
          lat: locationObj.lat,
          lng: locationObj.lng
        };
        this.getCategoriesAll(location);
      } else {
        this.getCategoriesAll();
      }
      if (this.config.is_customer_login_required && !this.sessionService.get('appData')) {
        $('#loginDialog').modal('show');
        return ;
    }
    }
    this.listForm = new FormGroup({
      searchControl: new FormControl('', [Validators.required])
    });
  }

  ngAfterViewInit() {
    const body = document.querySelector('body');
    body.onscroll = (e: any) => {

      if (e.target.scrollTop > 70 && e.target.scrollTop <= (e.target.scrollHeight - e.target.offsetHeight)) {
        this.scrollTop = true;
      } else {
        this.scrollTop = false;
      }
    };
  }
  ngOnDestroy() {
    this.sessionService.resetTitle();
  }

  // ======================set config====================
  setConfig() {
    this.config = this.sessionService.get('config');
    if (this.config && this.config.is_fugu_chat_enabled) {
      // this.extService.initFuguWidget();
    }
  }

  // ======================set language====================
  setLanguage() {
    if (this.sessionService.getString('language')) {
      this.languageSelected = this.sessionService.getString('language');
      this.direction = this.languageSelected === 'ar' ? 'rtl' : 'ltr';
    } else {
      this.languageSelected = 'en';
      this.direction = 'ltr';
    }
    this.langJson = this.appService.getLangJsonData();
  }

  // ======================submit go inside====================
  onSubmit(form) {
    if (!form.valid) {
      return;
    }
    this.router.navigate(['/create-project']);
  }

  // ====================get catalogue for all merchants========================
  async getCategoriesAll(locationObj?: any) {
    this.ngZone.run(async () => {
      try {
        if (locationObj && locationObj.lat && locationObj.lng) {
          this.categories = await this.categoryService.fetchCategory(locationObj);
          
        } else {
          this.categories = await this.categoryService.fetchCategory();
        
      if(this.categories.length==1 && this.config.business_model_type == 'FREELANCER')
      {
      if( this.categories[0].has_children && this.categories[0].has_active_children)
      {
        
     this.categoryService.lastActiveBreadcumb = undefined;
      this.router.navigate(['categories',  this.categories[0].catalogue_id], {queryParams: {name:  this.categories[0].name}});
    
  }
  else {
    this.sessionService.set('categoryPath', [{
      name:  this.categories[0].name,
      id: this.categories[0].catalogue_id,
    }]);
    this.router.navigate(['create-project', this.categories[0].catalogue_id]); // create-project //freelancer
  }
}

        }   
      } catch (e) {
      }
    })
  }
  

  // ====================trigger scroll========================
  public triggerScrollTo(flag): void {
    if (flag) {
      const pageScrollInstance: PageScrollInstance = PageScrollInstance.simpleInstance(this.document, '#fetchLocation');
      this.pageScrollService.start(pageScrollInstance);
    } else {
      const pageScrollInstance: PageScrollInstance = PageScrollInstance.simpleInstance(this.document, '#categories');
      this.pageScrollService.start(pageScrollInstance);
    }

  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.getBackgroundImage();
  }

  getBackgroundImage() {
    let clientWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    if (clientWidth <= 768 && this.config.mobile_background_image) {
      return 'url(' + this.config.mobile_background_image + ')';
    } else {
      return 'url(' + this.config.background_image + ')';
    }
  }
}
