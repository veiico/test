import { Component, OnInit } from '@angular/core';
import { SessionService } from '../../services/session.service';
import { ActivatedRoute } from '@angular/router';
import { ModalType } from '../../constants/constant';


import { MerchantProfileService } from './merchantProfile.service'
import { FreelancerService } from '../freelancer/services/freelancer.service';

@Component({
  selector: 'app-merchant-profile',
  templateUrl: './merchantProfile.component.html',
  styleUrls: ['./merchantProfile.component.scss']
})
export class MerchantProfileComponent implements OnInit {
  data;
  profileData;
  customFields1=[];
  customFields2=[];
  companyName:string;
  isPlatformServer:boolean;
  openImagePopup:boolean = false;
  imageData:any;
  rating = 0;
  notShow = true;
  modalType:ModalType;
  isMobileAppView:any;
  terminology;
  languageStrings: any={};
 
  constructor(private sessionService: SessionService, private merchantProfileService: MerchantProfileService, private route: ActivatedRoute,private freelancerService:FreelancerService) {
    this.data = {};
    this.data.user_id = parseInt(this.route.snapshot.params['userId']);
    this.data.marketplace_user_id = this.sessionService.get('config').marketplace_user_id;
    this.data.marketplace_reference_id = this.sessionService.get('config').marketplace_reference_id;
    if (this.sessionService.get('appData')) {
      this.data['vendor_id'] = this.sessionService.get('appData').vendor_details.vendor_id;
      this.data['access_token'] = this.sessionService.get('appData').vendor_details.app_access_token;
    }
  }

  ngOnInit() {
    this.sessionService.langStringsPromise.then(() =>
      {
       this.languageStrings = this.sessionService.languageStrings;
      });
    this.isPlatformServer = this.sessionService.isPlatformServer();
    if(this.sessionService.get('config')){
      this.terminology = this.sessionService.get('config').terminology;
    }
    this.isMobileAppView =parseInt(this.route.snapshot.params['isMobileAppView'])

    this.freelancerService.setView(this.isMobileAppView);
    
    this.companyName = this.sessionService.get('config').company_name;
    if(!this.isPlatformServer){
      this.merchantProfileService.fetchMerchantData(this.data).subscribe(
        response => {
          try {
            if (response.status === 200) {
              this.profileData = response.data;
              this.profileData['nameFull'] = this.profileData.last_name ? this.profileData.first_name + ' ' + this.profileData.last_name : this.profileData.first_name;
              this.morphData(response.data)
            }
          } catch (e) {
            console.error(e);
          }
          // this.loader.hide();
        },
        error => {
          console.error(error);
        }
      );
    }

  }
  private morphData(data: any) {
    data.custom_fields.forEach(item => {
      if (this.getWordsLength(item.display_name) > 3)
        this.customFields2.push(item);
      else
        this.customFields1.push(item);
    })


  }

  private getWordsLength(str: string): number {
    return str.split(' ').length || 0;
  }

  imagePopup(value){
    this.imageData = value;
    this.openImagePopup = true;
  }
  hideimagePopup(){
    this.imageData = undefined;
    this.openImagePopup = false;
  }
}
