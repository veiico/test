/**
 * Created by socomo on 3/15/18.
 */
import { Component, OnInit, NgZone, AfterViewInit, Renderer2, OnDestroy, EventEmitter } from '@angular/core';
import { OnRatingChangeEven } from 'angular-star-rating/star-rating-struct';
import * as $ from 'jquery';

import { LoaderService } from '../../services/loader.service';
import { PopUpService } from '../../modules/popup/services/popup.service';
import { RestaurantReviewService } from './restaurant-review.service';
import { SessionService } from '../../services/session.service';
import { AppService } from '../../app.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MessageType } from '../../../app/constants/constant';

@Component({
  selector: 'app-restaurant-reviews',
  templateUrl: './restaurant-review.component.html',
  styleUrls: ['./restaurant-review.scss']
})
export class RestaurantReviewComponent implements OnInit, OnDestroy, AfterViewInit {
  public config: any;
  appConfig;
  pageoffset;
  pagelimit;
  dialog: any = {};
  private dialogStatus: boolean;
  stopScrollHit = false;
  showPaginating = false;
  subtotal = 0;
  ordersCount;
  currency;
  details;
  hitC = false;
  totalRatings;
  limit;
  reviewInfo = [];
  cardInfo;
  data;
  bg_color;
  profile_color;
  isPlatformServer: boolean;
  onRatingChangeResult: OnRatingChangeEven;
  public tookanStatusColor;
  public langJson: any;
  public languageSelected: any;
  public direction = 'ltr';
  public scrollSubscription;
  scrollEvent = new EventEmitter<number>();

  headerData;
  languageStrings: any={};
  constructor(protected service: RestaurantReviewService, protected loader: LoaderService, protected popup: PopUpService,
              protected sessionService: SessionService, protected ngZone: NgZone,
              public appService: AppService, protected renderer: Renderer2) {
    this.tookanStatusColor = {
       9:  '#166bd3',
      10:  '#166bd3',
      11:  '#ba68c8',
      12:  '#166bd3',
      13:  '#66d02a',
      14:  '#cb3529',
      15:  '#cb3529',
      16:  '#166bd3',
      17:  '#166bd3',
    };
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

  ngAfterViewInit() {
    this.pageoffset = this.pagelimit;
    this.pagelimit = this.pageoffset + 50;
  }

  ngOnDestroy() {
    if(this.scrollSubscription){
      this.scrollSubscription();
    }
  }

  ngOnInit() {
    this.sessionService.langStringsPromise.then(() =>
    {
     this.languageStrings = this.sessionService.languageStrings;
    });
    this.isPlatformServer = this.sessionService.isPlatformServer();
    this.headerData = this.sessionService.get('config');
    this.pageoffset = 0;
    this.pagelimit = this.pageoffset + 50;
    this.dialogStatus = false;
    if (!this.sessionService.isPlatformServer()) {
    this.getReviewList();
    }
    this.cardInfo = this.sessionService.get('info');
    this.appConfig = this.sessionService.get('config');
    this.data = this.sessionService.get('appData') ? this.sessionService.get('appData').vendor_details : '';
    this.bg_color = this.sessionService.get('config') ? this.sessionService.get('config').header_color : '';
    this.profile_color = this.sessionService.get('config') ? this.sessionService.get('config').color : '';
    this.loader.hide();
    this.scrollHandler();

    // $('body').on('scroll', () => {
    //   const getOffset = $(document).height() - $(window).height();
    //   if ($('body').scrollTop() === getOffset && getOffset !== 0) {
    //     this.ngZone.run(() => {
    //       this.onScroll('');
    //     });
    //   }
    // });

    this.initEvents();

  }



  initEvents() {

    this.scrollSubscription = this.renderer.listen('body', 'scroll', e => {
      this.scrollInit(e);
    });
  }

  private scrollHandler() {
    this.scrollEvent
      .pipe(
        debounceTime(100),
        distinctUntilChanged()
      )
      .subscribe(height => {
        this.onScroll(''); 
      });
  }
  

  scrollInit(event) {
    const offset = event.target.scrollHeight;
    const height = event.target.scrollTop;

    if (!this.showPaginating && ((event.target.scrollTop + event.target.clientHeight) / event.target.scrollHeight >= 0.75)) {
      
      this.scrollEvent.emit(event.target.scrollHeight);
    }
  }

  showRatingDialog() {
    if (this.cardInfo.my_review) {
      this.dialog.value = this.cardInfo.my_review;
    }
    this.dialog.title = this.languageStrings.rate_and_review || 'Rate & Review';
    this.dialog.show = true;
  }
  hideDialog() {
    this.dialog = {};

  }

  saveDialogData() {
    const obj = {
      'marketplace_reference_id': this.headerData.marketplace_reference_id,
      'reference_id': this.sessionService.get('appData').vendor_details.reference_id,
      'marketplace_user_id': this.headerData.marketplace_user_id,
      'user_id': this.sessionService.getString('user_id'),
      'review': this.dialog.value
    };
    if (this.sessionService.get('appData')) {
      obj['vendor_id'] = this.sessionService.get('appData').vendor_details.vendor_id;
      obj['access_token'] = this.sessionService.get('appData').vendor_details.app_access_token;
    }
    if (this.onRatingChangeResult) {
      obj['rating'] =  this.onRatingChangeResult.rating;
    } else {
      obj['rating'] =  this.cardInfo.my_rating;
    }
    if (obj['rating']) {
      this.service.submitReview(obj)
        .subscribe(
          response => {
            this.loader.hide();
            try {
              if (response.status === 200) {
                this.sessionService.setByKey('info', 'my_review', this.dialog.value);
                this.sessionService.setByKey('info', 'my_rating', this.onRatingChangeResult.rating);
                this.sessionService.setByKey('info', 'store_rating', response.data.store_rating);
                this.sessionService.setByKey('info', 'total_ratings_count', response.data.total_ratings_count);
                this.sessionService.setByKey('info', 'total_review_count', response.data.total_review_count);
                this.cardInfo = this.sessionService.get('info');
                if (!this.sessionService.isPlatformServer()) {
                this.getReviewList();
                }
                this.hideDialog();
              } else {
                this.popup.showPopup(MessageType.ERROR, 2000, response.message, false);
              }
            } catch (e) {
              console.error(e);
            }
            this.loader.hide();
            this.showPaginating = false;
          },
          error => {
            console.error(error);
          }
        );
    } else {
      this.popup.showPopup(MessageType.ERROR, 2000, this.languageStrings.rating_is_required || 'Rating is required!', false);
    }
  }
  onRatingChange = ($event: OnRatingChangeEven) => {
    this.onRatingChangeResult = $event;
  }

  getColourRed(rating) {
    if (rating === 1) {
      return true;
    } else {
      return false;
    }
  }

  getColourGreen(rating) {
    if (rating >= 4) {
      return true;
    } else {
      return false;
    }
  }

  getColourYellow(rating) {
    if (rating > 1 && rating < 4) {
      return true;
    } else {
      return false;
    }
  }

  getReviewList() {
    const obj = {
      'page_no': Math.floor(this.pageoffset / 50) + 1,
      'limit': this.pageoffset,
      'marketplace_reference_id': this.headerData.marketplace_reference_id,
      // 'reference_id': this.sessionService.get('appData').vendor_details.reference_id,
      // 'marketplace_user_id': this.sessionService.get('appData').vendor_details.marketplace_user_id,
      'user_id': this.sessionService.getString('user_id')
    };
    if (this.sessionService.get('appData')) {
      obj['vendor_id'] = this.sessionService.get('appData').vendor_details.vendor_id;
      obj['access_token'] = this.sessionService.get('appData').vendor_details.app_access_token;
    }
    this.limit = 5;
    this.service.getAllReviews(obj)
      .subscribe(
        result =>  {
      if (result.status === 200) {
        this.loader.hide();
        if (result.data && result.data.length === 0) {
          this.stopScrollHit = false;
        }
        this.reviewInfo = result.data;
        // this.ratingMap = result.data.rating_map;
        // var ratingCount = {1:0, 2:0, 3:0, 4:0, 5:0};
        // for(var i = 0; i < this.ratingMap.length; i++)
        // {
        //   ratingCount[i] = this.ratingMap[i].count;
        // }
        // this.totalRatings = ratingCount[1] + ratingCount[2] + ratingCount[3] + ratingCount[4] + ratingCount[5];
        // this.onewidth = (ratingCount[1]/this.totalRatings)*100;
        // this.twowidth = (ratingCount[2]/this.totalRatings)*100;
        // this.threewidth = (ratingCount[3]/this.totalRatings)*100;
        // this.fourwidth= (ratingCount[4]/this.totalRatings)*100;
        // this.fivewidth = (ratingCount[5]/this.totalRatings)*100;

      } else {
        this.loader.hide();
        this.stopScrollHit = true;
      }
          this.showPaginating = false;
    });

}

  onScroll(event) {
    this.pageoffset = this.pagelimit;
    this.pagelimit = this.pageoffset + 50;
    if (!this.stopScrollHit) {
      this.showPaginating = true;
      if (!this.sessionService.isPlatformServer()) {
      this.getReviewList();
      }
    }
  }
}
