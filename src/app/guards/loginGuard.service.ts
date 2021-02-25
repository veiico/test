import { Injectable } from "@angular/core";
import { Router, CanActivate } from "@angular/router";
import { SessionService } from "./../services/session.service";
import { AppService } from "../app.service";

@Injectable()
export class LoginGuardService implements CanActivate {
  config;
  constructor(private sessionService: SessionService, private router: Router) {
    this.config = this.sessionService.get("config");
  }

  canActivate() {
    if (this.sessionService.isPlatformServer()) return true;

    if (this.sessionService.get("appData")) { 
      return true;
    } else if (
      this.config.business_model_type === "ECOM" &&
      this.config.nlevel_enabled === 2
    ) {
      return true;
    } else {
      this.router.navigate(["list"]);
      return false;
    }
  }
}

@Injectable()
export class VerificationGuardService implements CanActivate {
  config;
  constructor(private sessionService: SessionService, private router: Router) {
   
  }

  canActivate() {

    if (this.sessionService.isPlatformServer()) return true;
     
    if ((this.sessionService.get('config').is_customer_verification_required === 1) && (this.sessionService.get('appData').vendor_details.is_vendor_verified !== 1)) {
      this.router.navigate(['profile']);
      return false;
    } else {
      return true;
    }
    

  }
}

@Injectable()
export class CheckCartGuard implements CanActivate {
  constructor(
    private sessionService: SessionService,
    private router: Router,
    public appService: AppService
  ) { }

  canActivate() {
    if (this.sessionService.isPlatformServer()) return true;
    
    if (
      this.sessionService.get("app") &&
      this.sessionService.getByKey("app", "cart") &&
      this.sessionService.getByKey("app", "cart").length > 0
    ) {
      this.sessionService.remove("customOrderFlow");
      this.sessionService.remove('noProductStoreData');
      this.sessionService.remove("editedOrderPayment");
      return true;
    } else if (this.sessionService.getString("customOrderFlow") || this.sessionService.getString("editedOrderPayment") || this.sessionService.getString("userDebtData") || this.sessionService.getString("customerPlanData")) {
      return true;
    } else {
      if (this.sessionService.get('config').is_landing_page_enabled) {
        this.router.navigate([""]);
      } else {
        this.router.navigate(["list"]);
      }
      return false;
    }
  }
}
