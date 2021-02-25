import { Component, OnInit } from '@angular/core';
import { SessionService } from '../../../services/session.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-freelancer-homepage',
  templateUrl: './freelancer-homepage.component.html',
  styleUrls: ['./freelancer-homepage.component.scss']
})
export class FreelancerHomepageComponent implements OnInit {


  freelancerLandingPageConfig: any;
  terminology: any;
  selectedLanguage: string='en';
  config: any;

  public domainName = window.location.hostname;
  constructor(private sessionService: SessionService, public router: Router) {
    
 }
 ngOnInit() {
  this.setConfig();
}
     // ======================set config====================
   setConfig() {
    this.config = this.sessionService.get('config');
    this.freelancerLandingPageConfig=this.config?this.config.freelancer_landing_page_json:"";
    this.terminology = this.config.terminology;
    if (this.sessionService.getString('language')) {
      this.selectedLanguage = this.sessionService.getString('language');
    }
   }
  moveToMerchant()
  {
    let merchant_url ='https://' + this.config.ds_domain_name +
    '/onboard/merchant-signup?marketplace_reference_id=' + this.config.marketplace_reference_id + '&user=' + this.terminology.MERCHANT;
    window.open(merchant_url, "_blank");
  }
  moveToHomepage()
  {
    window.location.href='https://' + this.config.domain_name + '/' + this.selectedLanguage +'/home';
    
}
   }
