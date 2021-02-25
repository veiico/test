import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanLoad,
  Route,
  Router
} from '@angular/router';
import { Observable } from 'rxjs';
import { SessionService } from '../services/session.service';
import { AppStartService } from '../services/app-start.service';
import { Routes } from '../constants/constant';
import { AppService } from '../app.service';
import { LoginBy } from '../enums/enum';
import { ExternalLibService } from '../services/set-external-lib.service';
import { MessageService } from '../services/message.service';
import { ProfileService } from '../components/profile/profile.service';

@Injectable()
export class LoadGuard implements CanLoad, CanActivate {
  private once: boolean;
  constructor(
    private router: Router,
    private sessionService: SessionService,
    private appStartService: AppStartService,
    private appService: AppService,
    private extService: ExternalLibService,
    private messageService: MessageService,
    private profileService: ProfileService
  ) {}

  private pages = ['home', 'list', 'store', 'orders', 'settings', 'loyalty', 'profile', 'payment','debtAmount'];

  // fetchTemplates(config, pageName) {
  //   return new Promise((resolve, reject) => {

  //       .subscribe(resp => {
  //         console.log();
  //         resolve(resp);
  //       });
  //   });
  // }

 async canLoad(route: Route): Promise<boolean> {
    let config: any = this.sessionService.get('config');
    const dynRoutes = config.routes;
      let pageName = route.data.type === 'fetchlocation' ? 'home' : route.data.type ;
      if (this.pages.find(val => val === pageName)) {
        if (
          config.theme_enabled &&
          !this.sessionService.get('templates').pages[pageName]
        ) {
          let templates = await this.appService.fetchTemplates(config.marketplace_user_id, null, pageName).toPromise();
          this.sessionService.addToTemplates(templates.data);
        }
      }

    if (dynRoutes && route.data) {
      const key = route.data.type ;


      if (key == 'layout' && config.business_model_type === 'FREELANCER') {
        route.loadChildren =
          'app/components/freelancer/freelancer.module#FreeLancerModule';
      } else if (
        config.business_model_type === 'RENTAL' ||
        config.onboarding_business_type === 902
      ) {
        route.loadChildren = Object.keys(dynRoutes).includes(key)
          ? 'app/components/fetch-location/home/home-new.module#HomeNewModule'
          : route.loadChildren;
      } else {
        route.loadChildren = Object.keys(dynRoutes).includes(key)
          ? dynRoutes[key]
          : route.loadChildren;
      }
    } else if (
      (config.business_model_type === 'RENTAL' ||
        config.onboarding_business_type === 902) &&
      route.data
    ) {
      const key = route.data.type;
      route.loadChildren =
        key === 'fetchlocation'
          ? 'app/components/fetch-location/home/home-new.module#HomeNewModule'
          : route.loadChildren;
    }

    //check for merchant domain
    if (this.sessionService.isMerchantDomain()) {
      if (route.data && ['fetchlocation', 'list'].includes(route.data.type)) {
        const id = config.merchant_domain_obj.merchant_id;
        const storepage_slug = config.merchant_domain_obj.storepage_slug;
        route.loadChildren =
          'app/components/catalogue/catalogue.module#CatalogueModule';
        if (!this.once) {
          this.once = true;
          this.navigate(id, storepage_slug);
        }
        return true;
      }
    }
    return true;
  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | boolean
    | import('@angular/router').UrlTree
    | Observable<boolean | import('@angular/router').UrlTree>
    | Promise<boolean | import('@angular/router').UrlTree> {
    let config: any = this.sessionService.get('config');
    //check for merchant domain

   // vendor login
   if(state.root.queryParams["access_token_web"] && state.root.queryParams["vendor_id_web"]) {
    const obj = {
      access_token: state.root.queryParams["access_token_web"],
      vendor_id: state.root.queryParams["vendor_id_web"]
    }
    if (!this.sessionService.isPlatformServer()) {
      if (!this.sessionService.get('appData')) {
        this.initLoginViaAccessToken(LoginBy.QUERY_PARAMS, obj);
        this.extService.socketRegister(obj.vendor_id);
      } else {
        if (this.sessionService.get('appData')) {
          this.initLoginViaAccessToken(LoginBy.LOCAL_STORAGE);
          this.extService.socketRegister(
            this.sessionService.get('appData').vendor_details.vendor_id
          );
        }
      }
    }
  }

    if (this.sessionService.isMerchantDomain()) {
      if (route.data && ['fetchlocation', 'list'].includes(route.data.type)) {
        const id = config.merchant_domain_obj.merchant_id;
        const storepage_slug = config.merchant_domain_obj.storepage_slug;
        this.navigate(id, storepage_slug);
        return false;
      }
    } else if (
      config.routes &&
      [Routes.catalogRoute, Routes.dyCatalogRoute].includes(config.routes.fetchlocation)
    ) {
      if (route.data && ['fetchlocation'].includes(route.data.type)) {
        let id = config.marketplace_user_id;
        let storepage_slug = config.storepage_slug;
        let enabledStores = config.enabled_store_slugs;
        if (enabledStores && enabledStores.length > 1) {
          let index = -1;
          index = enabledStores.findIndex(
            value => value.user_id == config.marketplace_user_id
          );
          if (index != -1) {
            id = enabledStores[index].user_id;
            storepage_slug = enabledStores[index].storepage_slug;
          } else {
            id = enabledStores[0].user_id;
            storepage_slug = enabledStores[0].storepage_slug;
          }
        } else if (enabledStores && enabledStores.length == 1) {
          const storeData = enabledStores[0];
          id = storeData.user_id;
          storepage_slug = storeData.storepage_slug;
        }
        if (route.data.type == 'fetchlocation') {
          this.sessionService.set(
            'user_id',
            parseInt(id)
          );
          this.navigate(id, storepage_slug);
          return true;
        } else {
          this.navigate(id, storepage_slug);
          return false;
        }
      }
    } else if (
      config.routes &&
      [Routes.restaurantRoute, Routes.dyRestaurantRoute].includes(config.routes.fetchlocation)
    ) {
      if (
        route.data &&
        ['fetchlocation'].includes(route.data.type) &&
        config.enabled_store_slugs &&
        config.enabled_store_slugs.length == 1
      ) {
        let storeData = config.enabled_store_slugs[0];
        const id = storeData.user_id;
        const storepage_slug = storeData.storepage_slug;
        this.navigate(id, storepage_slug);
        return false;
      } else {
        if (route.data.type != 'list') {
          if(route.data.type =='fetchlocation') {
            return true;
          } else {
            this.navigateToList();
            return false;
          } 
        }
      }
    }
  }

  private navigate(id, storeName) {
    this.router.navigate([`/store/${storeName || '-'}/${id}`]);
  }
  private navigateToList() {
    this.router.navigate([`/list`]);
  }
  private getConfig() {
    // return new Promise((resolve, reject) => {
    //   let config = this.sessionService.get('config');
    //   if (config) {
    //     resolve(config);
    //   }
    //   this.appStartService.initialLoad().then(() => {
    //     config = this.sessionService.get('config');
    //     console.log('resolved');
    //     resolve(config);
    //   });
    // })
  }

  initLoginViaAccessToken(type:number,data?:any) {
    let config: any = this.sessionService.get('config');
    const obj = {
      marketplace_reference_id: config.marketplace_reference_id,
      marketplace_user_id:  config.marketplace_reference_id,
    };

    if (type === LoginBy.LOCAL_STORAGE) {
      if (this.sessionService.get('appData')) {
        obj['vendor_id'] = this.sessionService.get('appData').vendor_details.vendor_id;
        obj['access_token'] = this.sessionService.get('appData').vendor_details.app_access_token;
      }
    } else {
      obj['vendor_id'] = data.vendor_id;
      obj['access_token'] = data.access_token;
    }
    obj['device_token']=this.sessionService.get("device_token") || this.sessionService.get("device_token_app") 
    this.profileService.accessTokenLogin(obj).subscribe(
      response => {
        try {
          if (response.status === 200) {
            this.sessionService.set('appData', response.data);
            if (type === LoginBy.QUERY_PARAMS) {
              this.messageService.sendLoggedIn(true);
            }
            this.extService.updateFuguWidget();
          } else {
            console.error(response.message);
          }
        } catch (e) {
          console.error(e);
        }
      },
      error => {
        console.error(error);
      }
    );
  }
}
