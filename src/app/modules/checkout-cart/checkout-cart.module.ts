import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckoutCartComponent } from './checkout-cart.component';
import { JoinPipe } from './pipes/join.pipe';
import { ItemButtonModule } from '../item-button/item-button.module';
import { SharedModule } from '../shared.module';
import { OverlayPanelModule } from '../../../../node_modules/primeng/overlaypanel';
import { SideOrdersComponent } from './components/side-orders/side-orders.component';
import { DateTimeFormatPipeModule } from '../pipe.module';
import { CatalogueModule } from '../../components/catalogue/catalogue.module';


@NgModule({
  imports: [
    CommonModule,
    ItemButtonModule,
    SharedModule,
    OverlayPanelModule,
    DateTimeFormatPipeModule,
    CatalogueModule
  ],
  providers: [],
  declarations: [
    CheckoutCartComponent,
    JoinPipe,
    SideOrdersComponent
  ],
  exports: [
    CheckoutCartComponent,
    JoinPipe
  ]
})
export class CheckoutCartModule { }
