import { MessageType } from './../../../../constants/constant';
/**
 * Created by cl-macmini-51 on 17/07/18.
 */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { OnRatingChangeEven } from 'angular-star-rating/star-rating-struct';
import { MessageService } from '../../../../services/message.service';
import { SessionService } from '../../../../services/session.service';
import { PopUpService } from '../../../../modules/popup/services/popup.service';
import { LoaderService } from '../../../../services/loader.service';
import { OrdersService } from '../../orders.service';
import { AppService } from '../../../../app.service';

@Component({
  selector: 'app-order-rating',
  templateUrl: './order-rating.component.html',
  styleUrls: ['./order-rating.component.scss', '../../orders.component.scss']
})
export class OrderRatingComponent implements OnInit {

  public _orderForRating;
  languageStrings: any={};
  get orderForRating() { return this._orderForRating };
  @Input() set orderForRating(val: any) {
    this._orderForRating = val;
    this.ratingGiven = this._orderForRating.customer_rating || 0;
    this.review = this._orderForRating.customer_comment || '';
  };
  @Output() hideDialog: any = new EventEmitter();
  @Output() shiftAgentRating: any = new EventEmitter();
  public review: string;
  public ratingGiven: number;
  public error: boolean;
  onRatingChangeResult: OnRatingChangeEven;
  public config: any;
  public terminology: any;
  public langJson: any = {};
  public languageSelected: string;
  public direction: string;

  constructor(protected service: OrdersService,
              protected loader: LoaderService,
              protected popup: PopUpService,
              protected sessionService: SessionService,
              protected messageService: MessageService,
              public appService: AppService) { }

  ngOnInit() {
    this.languageStrings = this.sessionService.languageStrings;    this.setConfig();
    this.setLanguage();
  }


  /**
   * set config
   */
  setConfig() {
    this.config = this.sessionService.get('config');
    if (this.config) {
      this.terminology = this.config.terminology;
    }
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

    this.appService.langPromise.then(() => {
      this.langJson = this.appService.getLangJsonData();
    });
    this.sessionService.langStringsPromise.then(() =>
    {
     this.languageStrings = this.sessionService.languageStrings;
    });
  }


  /**
   * rating stars changed
   */
  onRatingChange = ($event: OnRatingChangeEven) => {
    this.onRatingChangeResult = $event;
  };


  /**
   * skip review
   */
  skipReview() {
    this.loader.show();
    const obj = {
      marketplace_reference_id: this.config.marketplace_reference_id,
      reference_id: this.sessionService.get("appData").vendor_details
        .reference_id,
      marketplace_user_id: this.config.marketplace_user_id,
      job_id: this.orderForRating.job_id
    };
    if (this.sessionService.get('appData')) {
      obj['vendor_id'] = this.sessionService.get('appData').vendor_details.vendor_id;
      obj['access_token'] = this.sessionService.get('appData').vendor_details.app_access_token;
    }
    this.service.skipReview(obj).subscribe(
      response => {
        this.loader.hide();
        try {
          if (response.status === 200) {
            //this.getOrders();
            if (this.config.is_tookan_active && this.orderForRating.tookan_job_hash) {
              this.makeAgentRatingEnable();
            } else {
              this.hideRatingDialog();
            }
          } else {
            this.popup.showPopup(MessageType.ERROR, 2000, response.message, false);
          }
        } catch (e) {
          console.error(e);
        }
        this.loader.hide();
      },
      error => {
        console.error(error);
      }
    );
  }

  /**
   * hide dialog
   */
  hideRatingDialog() {
    this.hideDialog.emit();
  }

  /**
   * make agent rating event
   */
  makeAgentRatingEnable() {
    this.shiftAgentRating.emit();
  }

  /**
   * save rating data
   */
  saveDialogData() {
    this.loader.show();
    const obj = {
      marketplace_reference_id: this.config.marketplace_reference_id,
      reference_id: this.sessionService.get("appData").vendor_details
        .reference_id,
      marketplace_user_id: this.config.marketplace_user_id,
      job_id: this.orderForRating.job_id,
      customer_comment: this.review
    };
    if (this.sessionService.get('appData')) {
      obj['vendor_id'] = this.sessionService.get('appData').vendor_details.vendor_id;
      obj['access_token'] = this.sessionService.get('appData').vendor_details.app_access_token;
    }
    if (this.onRatingChangeResult) {
      obj["customer_rating"] = this.onRatingChangeResult.rating;
    } else {
      obj["customer_rating"] = this.orderForRating.customer_rating;
    }
    if (obj["customer_rating"]) {
      this.service.submitReview(obj).subscribe(
        response => {
          this.loader.hide();
          try {
            if (response.status === 200) {
              // this.getOrders();
              // this.getOrdersAfterReview();
              if (this.config.is_tookan_active && this.orderForRating.tookan_job_hash) {
                this.makeAgentRatingEnable();
              } else {
                this.hideRatingDialog();
              }
            } else {
              this.popup.showPopup(MessageType.ERROR, 2000, response.message, false);
            }
          } catch (e) {
            console.error(e);
          }
          this.loader.hide();
        },
        error => {
          console.error(error);
        }
      );
    } else {
      this.loader.hide();
      this.popup.showPopup(
        MessageType.ERROR,
        2000,
        this.languageStrings.rating_is_required || "Rating is required!",
        false
      );
    }
  }

}
