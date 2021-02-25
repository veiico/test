
import { Injectable } from "../../../../../node_modules/@angular/core";
import { SessionService } from "../../../services/session.service";
import { RestaurantsService } from "../../restaurants-new/restaurants-new.service";
import { LoaderService } from "../../../services/loader.service";
import { FreelancerService } from "./freelancer.service";
declare var $: any;

@Injectable()
export class CategoryService {

    config: any;
    firstLevelCategories: any;
    categoryByLevel: any = [];
    lastActiveBreadcumb: Array<any>;

    constructor(private sessionService: SessionService,
        private restaurantService: RestaurantsService,
        public loader: LoaderService, public freelancerService: FreelancerService) {

        this.config = this.sessionService.get('config');
    }

    // ====================get catalogue for all merchants========================

    async fetchCategory(locationObj?:any) {
        if (locationObj && locationObj.lat && locationObj.lng) {
            return await this.getlevelWiseCategories(null, locationObj);
        }
        return this.firstLevelCategories || await this.getlevelWiseCategories();
    }

    async fetchCategorybyParentId(parentId: number) {
        return this.categoryByLevel[parentId] || await this.getlevelWiseCategories(parentId);
    }

    getlevelWiseCategories(parent_category_id?: number, locationObj?: any): Promise<any> {
        this.loader.show();
        let obj = {
            'marketplace_reference_id': this.config.marketplace_reference_id,
            'marketplace_user_id': this.config.marketplace_user_id,
            'user_id': this.config.marketplace_user_id,
        };
        if (this.sessionService.get('appData')) {
            obj['vendor_id'] = this.sessionService.get('appData').vendor_details.vendor_id;
            obj['access_token'] = this.sessionService.get('appData').vendor_details.app_access_token;
          }

        if (locationObj) {
            obj['latitude'] = locationObj.lat;
            obj['longitude'] = locationObj.lng;
        }
        if (this.config.is_customer_login_required && !this.sessionService.get('appData')) {
            this.loader.hide();
            $('#loginDialog').modal('show');
            return ;
        }
        if (parent_category_id)
            obj['parent_category_id'] = parent_category_id;
        // if (this.sessionService.isPlatformServer())
            obj['source'] = '0';

        return new Promise((resolve, reject) => {
            this.freelancerService.getlevelWiseCategories(obj)
                .subscribe(
                    response => {
                        if (response.status === 200 && response.data && response.data.length > 0) {
                            if (parent_category_id) {
                                this.categoryByLevel[parent_category_id] = response.data;
                            } else {
                                this.firstLevelCategories = response.data;
                            }
                            this.loader.hide();
                            resolve(response.data);
                        } else {
                            this.loader.hide();
                            reject(false);
                        }
                    },
                    error => {
                        this.loader.hide();
                        reject(false);
                    });
        });
    }

}
