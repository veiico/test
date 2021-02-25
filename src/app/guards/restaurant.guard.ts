import { Injectable } from '@angular/core';
import { Router, Route, NavigationStart, CanActivate, CanLoad, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { SessionService } from './../services/session.service';
import { Observable } from 'rxjs';
import { Routes } from '../constants/constant';

@Injectable()
export class RestaurantGuard implements CanActivate, CanLoad {
  config: any;

  constructor(private sessionService: SessionService, private router: Router) {

    this.config = this.sessionService.get('config');
  }


  canLoad(route: Route): boolean | Promise<boolean> {

    let config: any = this.sessionService.get('config');
    const dynRoutes = config.routes;
    if (dynRoutes && dynRoutes.fetchlocation == Routes.catalogRoute) {
      let id = config.marketplace_user_id;
      let storepage_slug = config.storepage_slug;
      let enabledStores = config.enabled_store_slugs;
      if (enabledStores && enabledStores.length > 1) {
        let index = -1;
        index = enabledStores.findIndex(value => value.user_id == config.marketplace_user_id);
        if (index != -1) {
          id = enabledStores[index].user_id;
          storepage_slug = enabledStores[index].storepage_slug;
        }
        else {
          id = enabledStores[0].user_id;
          storepage_slug = enabledStores[0].storepage_slug;
        }
      }
      else if(enabledStores && enabledStores.length==1){
        const storeData = enabledStores[0];
        id = storeData.user_id;
        storepage_slug = storeData.storepage_slug;
      }
      route.loadChildren = dynRoutes.fetchlocation;
      this.navigate(id, storepage_slug);
      return false;
    }
    else if (config.enabled_store_slugs && config.enabled_store_slugs.length == 1) {
      let storeData = config.enabled_store_slugs[0];
      const id = storeData.user_id;
      const storepage_slug = storeData.storepage_slug;
      this.navigate(id, storepage_slug);
      return false;
    }
    return true;
  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | import("@angular/router").UrlTree | Observable<boolean | import("@angular/router").UrlTree> | Promise<boolean | import("@angular/router").UrlTree> {

    let config: any = this.sessionService.get('config');
    const dynRoutes = config.routes;

    if (dynRoutes && dynRoutes.fetchlocation == Routes.catalogRoute) {
      let id = config.marketplace_user_id;
      let storepage_slug = config.storepage_slug;
      let enabledStores = config.enabled_store_slugs;
      if(enabledStores && enabledStores.length>1){
        let index = -1;
        index = enabledStores.findIndex(value => value.user_id == config.marketplace_user_id);
        if(index != -1){
          id = enabledStores[index].user_id;
          storepage_slug = enabledStores[index].storepage_slug;
        }
        else if(enabledStores && enabledStores.length==1){
          id = enabledStores[0].user_id;
          storepage_slug = enabledStores[0].storepage_slug;
        }
      }
      else{
        const storeData = enabledStores[0];
        id = storeData.user_id;
        storepage_slug = storeData.storepage_slug;
      }
      this.navigate(id, storepage_slug);
      return false;
    }
    else if (config.enabled_store_slugs && config.enabled_store_slugs.length == 1) {
      let storeData = config.enabled_store_slugs[0];
      const id = storeData.user_id;
      const storepage_slug = storeData.storepage_slug;
      this.navigate(id, storepage_slug);
      return false;
    }
    return true;
  }



  private navigate(id, storeName) {
    this.router.navigate([`/store/${storeName || '-'}/${id}`]);
  }
}
