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
  selector: 'app-agent-rating',
  templateUrl: './agent-rating.component.html',
  styleUrls: ['./agent-rating.component.scss', '../../orders.component.scss']
})
export class AgentRatingComponent implements OnInit {

  @Input() orderForRating: any;
  @Output() hideDialog: any = new EventEmitter();
  public review: string;
  public error: boolean;
  onRatingChangeResult: OnRatingChangeEven;
  public config: any;
  public terminology: any;
  public langJson: any = {};
  public languageSelected: string;
  public direction: string;
  languageStrings: any={};

  constructor(protected service: OrdersService,
              protected loader: LoaderService,
              protected popup: PopUpService,
              protected sessionService: SessionService,
              protected messageService: MessageService,
              public appService: AppService) { }

  ngOnInit() {
    this.sessionService.langStringsPromise.then(() =>
    {
     this.languageStrings = this.sessionService.languageStrings;
    });
    this.setConfig();
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
            this.hideRatingDialog();
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
   * save rating data and
   * it will not be done in case of services flow
   */
  saveDialogData() {
    this.loader.show();
    const obj = {
      marketplace_reference_id: this.config.marketplace_reference_id,
      marketplace_user_id: this.config.marketplace_user_id,
      vendor_id: this.sessionService.get("appData").vendor_details.vendor_id,
      job_id: this.orderForRating.job_id,
      job_hash: this.orderForRating.tookan_job_hash ? this.orderForRating.tookan_job_hash : '',
      customer_comment: this.review
    };
    if (this.sessionService.get('appData')) {
      obj['vendor_id'] = this.sessionService.get('appData').vendor_details.vendor_id;
      obj['access_token'] = this.sessionService.get('appData').vendor_details.app_access_token;
    }
    if (this.onRatingChangeResult) {
      obj["rating"] = this.onRatingChangeResult.rating;
    }
    if (obj["rating"]) {
      this.service.submitAgentReview(obj).subscribe(
        response => {
          this.loader.hide();
          try {
            if (response.status === 200) {
              // this.getOrders();
              // this.getOrdersAfterReview();
              this.hideRatingDialog();
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
        this.languageStrings.rating_required || "Rating is required!",
        false
      );
    }
  }

}
