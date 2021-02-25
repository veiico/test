import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from '../../../app.service';
import { CustomerSubscriptionService } from '../../../components/customer-subscription/customer-subscription.service';
import { PopUpService } from '../../../modules/popup/services/popup.service';
import { LoaderService } from '../../../services/loader.service';
import { SessionService } from '../../../services/session.service';
import { CustomerSubscriptionComponent } from '../../../components/customer-subscription/customer-subscription.component';



@Component({
  selector: 'app-customer-subscription',
  templateUrl: '../../../components/customer-subscription/customer-subscription.component.html',
  styleUrls: ['../../../components/customer-subscription/customer-subscription.component.scss']
})

export class DynamicCustomerSubscriptionComponent extends CustomerSubscriptionComponent implements OnInit, OnDestroy, AfterViewInit {

  _loginResponse:any;

  get loginResponse(){return this._loginResponse}
  @Input() set loginResponse(val:any){
    this._loginResponse = val;
    this.filterOutSubscriptionFromResponse();
    this.paymentMethodEnable();
  }
  @Output() successfullLogin: any = new EventEmitter();

  constructor(protected loader: LoaderService,
    protected sessionService: SessionService,
    public router: Router,
    protected popup: PopUpService,
    public customerSubscriptionService: CustomerSubscriptionService,
    protected appService: AppService) {
    super(loader, sessionService, router, popup, customerSubscriptionService, appService)
  }

  ngOnInit() {
    this.setConfig();
    this.setLanguage();
    this.initializeVariables();
  }

  ngAfterViewInit() {
    super.ngAfterViewInit();

  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }



}
