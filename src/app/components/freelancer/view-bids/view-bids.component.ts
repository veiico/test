/**
 * Created by cl-macmini-51 on 26/07/18.
 */
import { Component, OnDestroy, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { SessionService } from '../../../services/session.service';
import { AppService } from '../../../app.service';
import { LoaderService } from '../../../services/loader.service';
import { PostedProjectService } from '../posted-projects/posted-projects.service';
import { ExternalLibService } from '../../../services/set-external-lib.service';

@Component({
  selector: 'app-view-bids',
  templateUrl: './view-bids.component.html',
  styleUrls: ['./view-bids.component.scss'],
})
// tslint:disable-next-line:component-class-suffix
export class ViewBidsComponents implements OnInit, OnDestroy, AfterViewInit {

  public config: any;
  public langJson: any;
  public languageSelected: any;
  public direction = 'ltr';
  public terminology: any;
  public pageOffset: number;
  public pageLimit: number;
  public stopScrollHit: boolean;
  public showPaginating: boolean;
  public result: boolean;
  public bidsList: any;
  public jobId: number;
  public jobData: any;
  public currency: string;
  public showChatIcon = false;
  languageStrings: any={};


  constructor(private sessionService: SessionService, private router: Router, private appService: AppService,
    // tslint:disable-next-line:max-line-length
    private postedProjectService: PostedProjectService, public loader: LoaderService, private route: ActivatedRoute, private extService: ExternalLibService) {
    this.setConfig();
    this.setLanguage();

    // tslint:disable-next-line:radix
    this.jobId = parseInt(this.route.snapshot.params['id']);
  }

  // ======================life cycle====================
  ngOnInit() {
  
 
    if (this.sessionService.get('config')) {
      if (this.sessionService.get('config').is_fugu_chat_enabled) {
        this.showChatIcon = true;
      } else {
        this.showChatIcon = false;
      }
    }
    if (this.sessionService.get("config")) {
      this.terminology = this.sessionService.get("config").terminology;
    }
    this.sessionService.langStringsPromise.then(() =>
    {
     this.languageStrings = this.sessionService.languageStrings;
    });

    // }
    this.extService.updateFuguWidget();
  }
  ngAfterViewInit() {
    this.pageOffset = 0;
    this.pageLimit = 10;
    this.getBidsAll('old');
    this.getDetails();
    // this.extService.initFuguWidget();
  }
  ngOnDestroy() {

  }

  // ======================set config====================
  setConfig() {
    this.config = this.sessionService.get('config');
    this.currency = this.config.payment_settings[0].symbol;
  }

  // ======================set language====================
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
  startChat(tags, transactionId, userId, projectId, storeName) {
    this.extService.chatWithMerchant(tags, transactionId, userId, projectId, storeName);
  }
  // ====================get catalogue for all merchants========================
  getBidsAll(type) {
    if (type !== 'scroll') {
      this.loader.show();
    }
    const obj = {
      // 'skip': this.pageOffset,
      // 'limit': this.pageLimit,
      // 'marketplace_reference_id': this.sessionService.getString('marketplace_reference_id'),
      // 'reference_id': this.sessionService.get('appData').vendor_details.reference_id,
      'marketplace_user_id': this.config.marketplace_user_id,
      'project_id': this.jobId
    };
    if (this.sessionService.get('appData')) {
      obj['vendor_id'] = this.sessionService.get('appData').vendor_details.vendor_id;
      obj['access_token'] = this.sessionService.get('appData').vendor_details.app_access_token;
    }
    this.postedProjectService.getBids(obj)
      .subscribe(
        response => {
          try {
            if (response.status === 200) {
              if (response.data.result && response.data.result.length > 0) {
                this.bidsList = response.data.result;
                // if (response.data.result.length === 0) {
                //   this.stopScrollHit = true;
                // }

                // if (type === 'scroll') {
                //   response.data.result.forEach((data) => {
                //     this.bidsList.push(data);
                //   })
                // } else {
                //   this.bidsList = response.data.result;
                // }
                this.result = false;
              } else {
                this.bidsList = [];
                this.result = true;
                // this.stopScrollHit = true;
                // if (type !== 'scroll') {
                //   this.bidsList = [];
                //   this.result = true;
                // }
              }
              this.loader.hide();

            } else if (response.status === 400) {
            }
          } catch (e) {
            console.error(e);
          }
          this.loader.hide();
          this.showPaginating = false;
        },
        error => {
          console.error(error);
          this.loader.hide();
        }
      );
  }
  // ================get project details====================
  getDetails() {
    const obj = {
      'marketplace_user_id': this.config.marketplace_user_id,
      'project_id': this.jobId
    };
    if (this.sessionService.get('appData')) {
      obj['vendor_id'] = this.sessionService.get('appData').vendor_details.vendor_id;
      obj['access_token'] = this.sessionService.get('appData').vendor_details.app_access_token;
    }

    this.postedProjectService.getProjects(obj)
      .subscribe(
        response => {
          try {
            if (response.status === 200) {
              this.jobData = response.data.result && response.data.result.length ? response.data.result[0] : [];
              // tslint:disable-next-line:arrow-return-shorthand
              const headLineIndex = this.jobData.template.findIndex((o: any) => { return o.label === 'headline'; });
              // tslint:disable-next-line:arrow-return-shorthand
              const budgetIndex = this.jobData.template.findIndex((o: any) => { return o.label === 'budget'; });
              if (headLineIndex > -1) {
                this.jobData['headline'] = this.jobData.template[headLineIndex].value;
              }
              if (budgetIndex > -1) {
                this.jobData['budget'] = this.jobData.template[budgetIndex].value;
              }

            } else if (response.status === 400) {

            }
          } catch (e) {
            console.error(e);
          }
          this.loader.hide();
        },
        error => {
          console.error(error);
          this.loader.hide();
        }
      );
  }


  // ====================on scroll========================
  // onScroll(event) {
  //   this.pageOffset = this.pageOffset + this.pageLimit;
  //   this.pageLimit = 10;
  //   if (!this.stopScrollHit) {
  //     this.showPaginating = true;
  //     // this.getBidsAll('scroll');
  //   }
  // }


  proceedToCheckout(bid: any) {
    this.sessionService.set('freelancerCheckout', {
      project_id: bid.project_id,
      bid_id: bid.bid_id
    });
    this.sessionService.setString('user_id',bid.user_id);
    this.router.navigate(['/payment']);
  }
}
