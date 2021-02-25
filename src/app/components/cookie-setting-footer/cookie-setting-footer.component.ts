import { MessageType } from './../../constants/constant';
/**
 * Created by cl-macmini-51 on 01/05/18.
 */
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { MessageService } from "../../services/message.service";
import { CookieSettingService } from "./cookie-setting-footer.service";
import { PopUpService } from "../../modules/popup/services/popup.service";
import { SessionService } from "../../services/session.service";

declare var $: any;

// import * as $ from 'jquery';

@Component({
  selector: "app-cookie-footer",
  templateUrl: "./cookie-setting-footer.html",
  styleUrls: ["./cookie-setting-footer.scss"]
})
export class CookieFooterComponent implements OnInit {
  public formSettings: any;
  showCookieBar = false;
  linkToShow = false;
  privacyLink = "";
  tnc_url = "";
  public languageSelected: any;
  public direction = "ltr";
  languageStrings: any={};
  constructor(
    private messageService: MessageService,
    private cookieService: CookieSettingService,
    private popup: PopUpService,
    private sessionService: SessionService,
    public router: Router
  ) {
    //if (this.sessionService.get('config') && this.sessionService.get('config').privacy_policy) {
    //  this.linkToShow = true;
    //  this.privacyLink = this.sessionService.get('config').privacy_policy;
    //} else {
    //  this.linkToShow = false;
    //}
    if (this.sessionService.getString("language")) {
      this.languageSelected = this.sessionService.getString("language");
      if (this.languageSelected === "ar") {
        this.direction = "rtl";
      } else {
        this.direction = "ltr";
      }
    } else {
      this.languageSelected = "en";
      if (this.languageSelected === "ar") {
        this.direction = "rtl";
      } else {
        this.direction = "ltr";
      }
    }
  }

  ngOnInit() {
    this.sessionService.langStringsPromise.then(() =>
      {
       this.languageStrings = this.sessionService.languageStrings;
      });
    this.setConfig();
    this.messageService.storageRemovedUpdate.subscribe(
      data => {
        if (data.data && this.showCookieBar) {
          this.showCookieBar = true;
        } else {
          this.showCookieBar = false;
        }
      },
      err => {}
    );
      if(!this.sessionService.isPlatformServer()){
        this.getPoliciesData();
      }
  }

  /** 
* set config 
*/ 
setConfig() { 
  this.formSettings = this.sessionService.get('config'); 
  }

  /**
   * get policies data
   */
  getPoliciesData() {
    const payload = {};
    payload["marketplace_reference_id"] = this.sessionService.get(
      "config"
    ).marketplace_reference_id;
    this.cookieService.getPoliciesData(payload).subscribe(response => {
      if (response.status === 200) {
        if (this.sessionService.get("cookieEnabled")) {
          this.showCookieBar = false;
        } else {
          this.showCookieBar = true;
        }
        if (response.data.tnc_type === 1) {
          this.tnc_url = response.data.tnc_user_link;
        } else {
          this.tnc_url = "";
        }
      } else {
        this.showCookieBar = false;
        //this.popup.showPopup(MessageType.ERROR, 3000, response.message, false);
      }
    });
  }

  /**
   * go to terms page
   */
  goToTerms() {
    this.router.navigate(["terms-condition"]);
  }

  storeCookie() {
    this.showCookieBar = false;
    const cookieEnabled = {
      cookieFlag: true
    };
    this.sessionService.set("cookieEnabled", cookieEnabled);
    if (this.sessionService.get("appData")) {
      this.hitCookieApi();
    }
  }

  hitCookieApi() {
    const payload = {};
    // payload["vendor_id"] = this.sessionService.get(
    //   "appData"
    // ).vendor_details.vendor_id;
    // payload["access_token"] = this.sessionService.get(
    //   "appData"
    // ).vendor_details.app_access_token;
    payload["marketplace_user_id"] = this.formSettings.marketplace_reference_id;
    payload["user_id"] = this.sessionService.getString("user_id");
    if (this.sessionService.get('appData')) {
      payload['vendor_id'] = this.sessionService.get('appData').vendor_details.vendor_id;
      payload['access_token'] = this.sessionService.get('appData').vendor_details.app_access_token;
    }
    this.cookieService.enableCookie(payload).subscribe(response => {
      if (response.status === 200) {
      } else {
        this.popup.showPopup(MessageType.ERROR, 3000, response.message, false);
      }
    });
  }
}
