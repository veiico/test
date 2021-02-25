/**
 * Created by cl-macmini-51 on 20/04/18.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../modules/shared.module';
import { StarRatingModule } from 'angular-star-rating';

import { OrdersRoutingModule } from './orders.routing';

import { OrdersComponent } from './orders.component';

import { OrdersService } from './orders.service';
import { FooterModule } from '../../modules/footer/footer.module';
import { ShowOrderAdditonalInfoModule } from '../../modules/show-order-additional-info/show-order-additional-info.module';
import { BreadcrumbModule } from '../../../../node_modules/primeng/breadcrumb';
import { OverlayPanelModule } from '../../../../node_modules/primeng/overlaypanel';
import { ModalModule } from '../modal/modal.module';
import { OrderRatingComponent } from './components/order-rating/order-rating.component';
import { AgentRatingComponent } from './components/agent-rating/agent-rating.component';
import { DateTimeFormatPipeModule } from '../../modules/pipe.module';
import { AgmCoreModule } from '@agm/core';


@NgModule({
  imports: [
    CommonModule,
    OrdersRoutingModule,
    SharedModule,
    StarRatingModule.forRoot(),
    FooterModule,
    ShowOrderAdditonalInfoModule,
    OverlayPanelModule,
    BreadcrumbModule,
    ModalModule,
    DateTimeFormatPipeModule,
    AgmCoreModule
  ],
  declarations: [
    OrdersComponent,
    OrderRatingComponent,
    AgentRatingComponent
  ],
  providers: [
    OrdersService
  ]
})
export class OrdersModule {
}
