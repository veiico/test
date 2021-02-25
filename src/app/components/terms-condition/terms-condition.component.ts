/**
 * Created by cl-macmini-51 on 01/05/18.
 */
import { Component, OnInit } from '@angular/core';
import { SessionService } from '../../services/session.service';
import { LoaderService } from '../../services/loader.service';
import { TermsConditionService } from './terms-condition.service';
declare var $: any;

@Component({
  selector: 'app-terms-condition',
  templateUrl: './terms-condition.html',
  styleUrls: ['./terms-condition.scss']
})
export class TermsConditionComponent implements OnInit {

  public appConfig: any;
  public languageSelected: any;
  public direction = 'ltr';
  public t_n_c_text = '';
  public t_n_c_text_flag = false;
  languageStrings: any={};
  constructor(private sessionService: SessionService, private loader: LoaderService,
              public termsService: TermsConditionService) {
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

  ngOnInit() {
    this.appConfig = this.sessionService.get('config');
    this.loader.hide();
    if(!this.sessionService.isPlatformServer()){
      this.getPoliciesData();
    }
    this.sessionService.langStringsPromise.then(() =>
    {
     this.languageStrings = this.sessionService.languageStrings;
    });
  }

  /**
   * get policies data
   */
  getPoliciesData() {
    const payload = {};
    payload['marketplace_reference_id'] = this.appConfig.marketplace_reference_id;
    this.termsService.getPoliciesData(payload).subscribe(response => {
      if (response.status === 200) {
        if (response.data.tnc_type === 0) {
          this.t_n_c_text = response.data.template_data;
          this.t_n_c_text_flag = false;
        }
      } else {
        this.t_n_c_text_flag = true;
        //this.popup.showPopup('error', 3000, response.message, false);
      }
    });
  }
}
