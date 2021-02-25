import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { SessionService } from '../services/session.service';
import { PopUpService } from '../modules/popup/services/popup.service';
import { MessageType } from '../constants/constant';

@Injectable({
  providedIn: 'root'
})
export class ListGuard implements CanActivate {
  previousUrl: string;
  config: any;
  flag: boolean = false;

  ngOnIt() {

  }


  constructor(private router: Router, private sessionService: SessionService,private popup: PopUpService) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    this.config = this.sessionService.get('config');
    let isPlatformServer = this.sessionService.isPlatformServer();
    if (isPlatformServer) {
      return true
    }
 
 

    if (!this.config.is_customer_login_required) {
      return true;
    }
    else {
      if (!this.sessionService.get('appData')) {
        if (!isPlatformServer) {
          this.previousUrl=window.location.pathname;
          if((this.previousUrl && this.previousUrl.includes("/store")))
          {
          this.sessionService.set('previousUrl',this.previousUrl.slice(3))
          }
          this.router.navigate(['']);
          this.popup.showPopup(MessageType.INFO, 2500, 'Login Required', false);
        }
        return false;
      } else {
        return true;
      }
    }
  }


}
