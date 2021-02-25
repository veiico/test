import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AppService } from '../../../../app.service';
import { SessionService } from '../../../../services/session.service';
import { OnboardingBusinessType } from '../../../../enums/enum';
import { MessageService } from '../../../../../app/services/message.service';

// import { AppService } from '../../../checkout/';
@Component({
  selector: 'app-pickup-option',
  templateUrl: './pickup-option.component.html',
  styleUrls: ['./pickup-option.component.scss', '../../../checkout/checkout.scss']
})
export class PickupOptionComponent implements OnInit {
  languageStrings: any;
  langJson: any;
  formSettings: any;
  terminology: any;
  pickupOption = 1;
  @Output() pickupOptionChange = new EventEmitter<number>();
  isLaundryFlow:boolean;
  is_anywhere_required: number;
  is_custom_required: number;
  config: any;

  constructor(public appService: AppService,public sessionService: SessionService , private messageService: MessageService) { }

  ngOnInit() {
    this.config = this.sessionService.get('config');
    this.isLaundryFlow = this.config.onboarding_business_type === OnboardingBusinessType.LAUNDRY;
    this.terminology = this.config.terminology;
    this.is_anywhere_required = this.config.is_anywhere_required;
    this.is_custom_required = this.config.is_custom_required;

    if((this.is_custom_required && !this.is_anywhere_required) || this.sessionService.get('noProductStoreData')){
      this.pickupOption = 2;
      this.pickupOptionChange.emit(2);
    }

    this.initEvents();
    this.sessionService.langStringsPromise.then(() =>
    {
     this.languageStrings = this.sessionService.languageStrings;
     this.languageStrings.store_options=(this.languageStrings.store_options || 'Store Options').replace('STORE_STORE',this.terminology.STORE)
    });
  }

  initEvents() {
    this.messageService.noProductCustomOrder.subscribe(
      (res) => {
        if(res == 'no-product') {
          this.pickupOption = 2;
          this.pickupOptionChange.emit(2);
        }
      });
  }

  onChange() {
    this.pickupOptionChange.emit(this.pickupOption);
  }

}
