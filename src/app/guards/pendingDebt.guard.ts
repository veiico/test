import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanDeactivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SessionService } from '../services/session.service';

@Injectable()
export class PendingDebtAmountGuard implements CanActivate {

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
        if (this.appConfig.is_debt_enabled && this.appData && this.appData.vendor_details && this.appData.vendor_details.debt_amount > 0 && this.appConfig.is_debt_payment_compulsory && (isPayment == -1)) {
            this.router.navigate(['/debtAmount']);
            return false;
        } else {
            
               return true;
            
        }

    }
}
