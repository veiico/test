import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SessionService } from '../services/session.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerSubscriptionPlanGuard implements CanActivate {

  appData;
  appConfig;

  constructor(private router: Router, private sessionService: SessionService) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    let isPlatformServer = this.sessionService.isPlatformServer();
    if (isPlatformServer) {
        return true
    }
    this.appData = this.sessionService.get('appData');
    this.appConfig = this.sessionService.get('config');
    let isPayment = location.pathname.indexOf('/payment');
    if(this.appConfig.is_customer_subscription_enabled && this.appConfig.is_customer_subscription_mandatory && this.appData && this.appData.vendor_details && parseInt(this.appData.vendor_details.is_customer_subscription_plan_expired) && (isPayment == -1) && !(this.appConfig.is_guest_checkout_enabled &&  (this.appData &&  parseInt(this.appData.vendor_details.is_guest_account)))){
        this.router.navigate(['/customerSubscription/subscriptionPlan']);
        return false;
    }else {
         return true;
    }
  }
}
