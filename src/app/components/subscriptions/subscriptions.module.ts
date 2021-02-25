
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { StarRatingModule } from 'angular-star-rating';
import { CalendarModule } from 'primeng/calendar';

import { FooterModule } from '../../modules/footer/footer.module';
import { SharedModule } from '../../modules/shared.module';
import { SubscriptionCalendarComponent } from './components/subscription-calendar/subscription-calendar.component';
import { SubscriptionOrdersComponent } from './components/subscription-orders/subscription-orders.component';
import { SubscriptionsRoutingModule } from './subscriptions.routing';
import { SubscriptionsService } from './subscriptions.service';
import { ShowOrderAdditonalInfoModule } from '../../modules/show-order-additional-info/show-order-additional-info.module';
import { DateTimeFormatPipeModule } from '../../modules/pipe.module';

@NgModule({
  imports: [
    CommonModule,
    SubscriptionsRoutingModule,
    SharedModule,
    StarRatingModule.forRoot(),
    FooterModule,
    CalendarModule,
    ShowOrderAdditonalInfoModule,
    DateTimeFormatPipeModule,

  ],
  declarations: [
    SubscriptionOrdersComponent,
    SubscriptionCalendarComponent
  ],
  providers: [
    SubscriptionsService
  ]
})
export class SubscriptionsModule {
}
