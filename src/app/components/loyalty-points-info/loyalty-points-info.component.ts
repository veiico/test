import { Component, OnInit } from '@angular/core';

import { AppService } from '../../app.service';
import { LoaderService } from '../../services/loader.service';
import { SessionService } from '../../services/session.service';
import { LoyaltyPointsInfoService } from './loyalty-points-info.service';

@Component({
    selector: 'app-loyalty-points-info',
    templateUrl: './loyalty-points-info.component.html',
    styleUrls: ['./loyalty-points-info.component.scss']
})
export class LoyaltyPointsInfoComponent implements OnInit {
    appConfig;
    public langJson: any;
    public appData: any;
    public languageSelected: any;
    public currency;
    public direction = 'ltr';
    public loyaltyCriteria: any;
    public minimum_criteria: number;
    public loyaltyPointsHistory: any;
    public terminology: any;
    public isPlatformServer:boolean;
    public Loyality_Points:any;
    public loyalityText:any;
    public useLoyalityPoints:any;
    loyalitySmallText:any;
    public loyalityPointExpireOn:any;
    public OrderText:any;
    minimumOrderAmount: any;
    minimumOrderEarning: any;
    loyalityPointOffer: any;
    loyalityPointExpire: any;
    loyalityPointsText: any;
    languageStrings: any={};
    constructor(protected sessionService: SessionService,
        protected loader: LoaderService,
        public appService: AppService,
        protected loyaltyPointsInfoService: LoyaltyPointsInfoService) {

        if (this.sessionService.getString('language')) {
            this.languageSelected = this.sessionService.getString('language');
            if (this.languageSelected === 'ar') {
                this.direction = 'rtl';
            } else {
                this.direction = 'ltr';
            }
        }
    }

    ngOnInit() {
        this.isPlatformServer = this.sessionService.isPlatformServer();
        
        this.appConfig = this.sessionService.get('config');
        this.appData = this.sessionService.get('appData');
        this.currency = this.appConfig.payment_settings[0].symbol;
        this.terminology = this.appConfig.terminology;
        this.loyalityText=  this.terminology.LOYALTY_POINTS || 'Loyality Points';
        this.OrderText=this.terminology.ORDER || 'orderText';
        this.loyalitySmallText= this.terminology.LOYALTY_POINTS || 'The Loyality Points';
        this.loyalityPointsText=this.terminology.LOYALTY_POINTS || 'Loyality_Point';
    


        if (!this.isPlatformServer) {
            this.getLoyaltyData();
        }
        this.sessionService.langStringsPromise.then(() =>
        {
         this.languageStrings = this.sessionService.languageStrings;
         this.setLangKeys();
        });
    }
    setLangKeys() {
        this.languageStrings.use_these_loyality_points_msg = (this.languageStrings.use_these_loyality_points_msg || "Use these  Loyalty Point on your next ORDER")
        .replace('LOYALTY_POINTS' ,this.terminology.LOYALTY_POINTS);
        this.languageStrings.use_these_loyality_points_msg = this.languageStrings.use_these_loyality_points_msg.replace('ORDER_ORDER' ,this.terminology.ORDER);
        this.useLoyalityPoints = this.languageStrings.use_these_loyality_points_msg;
        this.languageStrings.min_order_amount_required_msg = (this.languageStrings.min_order_amount_required_msg || "Minimum ORDER_ORDER amount required for using Loyalty Point is")
        .replace('ORDER_ORDER' ,this.terminology.ORDER);
        this.languageStrings.min_order_amount_required_msg = this.languageStrings.min_order_amount_required_msg.replace('LOYALTY_POINTS' ,this.terminology.LOYALTY_POINTS);
        this.minimumOrderAmount = this.languageStrings.min_order_amount_required_msg;
        this.languageStrings.min_order_amount_for_earn = (this.languageStrings.min_order_amount_for_earn || "Minimum ORDER_ORDER amount for Earning Loyalty  is")
        .replace('ORDER_ORDER' ,this.terminology.ORDER);
        this.languageStrings.min_order_amount_for_earn = this.languageStrings.min_order_amount_for_earn.replace('LOYALTY_POINTS' ,this.terminology.LOYALTY_POINTS);
        this.minimumOrderEarning = this.languageStrings.min_order_amount_for_earn;
        this.loyalityPointOffer= this.languageStrings.layality_usage_applicable || "Loyality usage will be applicable with other offers.";
        this.loyalityPointExpire = (this.languageStrings.loyality_points_expire_after || "Loyalty will expire after")
        .replace('LOYALTY_POINTS' ,this.terminology.LOYALTY_POINTS);
        this.loyalityPointExpireOn = (this.languageStrings.loyality_point_expire_on || 'Loyalty Point expiring on').replace('LOYALTY_POINTS' ,this.terminology.LOYALTY_POINTS);
    }

    getLoyaltyData() {
        const data = {
            marketplace_user_id: this.appData.vendor_details.marketplace_user_id,
            vendor_id: this.sessionService.get('appData').vendor_details.vendor_id,
            access_token: this.sessionService.get('appData').vendor_details.app_access_token,
        };
        this.loader.show();
        this.loyaltyPointsInfoService.fetchLoyaltyConfig(data).subscribe((response) => {
            this.loyaltyCriteria = response.data[0];
            this.minimum_criteria = (this.loyaltyCriteria.rate_criteria * 10) / this.loyaltyCriteria.rate_point;
            if(this.loyaltyCriteria.loyalty_point_history){
                this.loyaltyPointsHistory = this.loyaltyCriteria.loyalty_point_history[0];
            }
            this.loader.hide();
        });
    }
}
