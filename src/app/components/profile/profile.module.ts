/**
 * Created by cl-macmini-51 on 02/05/18.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../modules/shared.module';

import { ProfileRoutingModule } from './profile.routing';
import { StarRatingModule } from 'angular-star-rating';

import { ProfileComponent } from './profile.component';
import {MultiSelectModule} from 'primeng/multiselect';
import {DropdownModule} from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { ProfileService } from './profile.service';
import { FuguTelInputModule } from '../fugu-tel-input/fugu-tel-input.module';
//import { SwiggyHeaderModule } from '../../themes/swiggy/modules/header/header.module';
//import { FooterNewModule } from '../../themes/swiggy/modules/footer-new/footer-new.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderModule } from '../header/header.module';
import { FooterModule } from '../../modules/footer/footer.module';
import { ChangePasswordModule } from './components/change-password/change-password.module';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from '../../../../node_modules/ng-pick-datetime';
import { MatCheckboxModule } from '../../../../node_modules/@angular/material';
import { SubscriptionModule } from './components/subscription/subscription.module';
import { DateTimeFormatPipeModule } from '../../modules/pipe.module';



@NgModule({
  imports: [
    CommonModule,
    ProfileRoutingModule,
    HeaderModule,
    FuguTelInputModule,
    MultiSelectModule,
    DropdownModule,
    //SwiggyHeaderModule,
    //FooterNewModule,
    FormsModule,
    ReactiveFormsModule,
    FooterModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    MatCheckboxModule,
    ChangePasswordModule,
    SubscriptionModule,
    DateTimeFormatPipeModule,
    CalendarModule,
    StarRatingModule
  ],
  declarations: [
    ProfileComponent
  ],
  providers: [
    ProfileService
  ]
})
export class ProfileModule {
}
