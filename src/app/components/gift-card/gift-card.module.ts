import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DecimalConfigPipeModule } from '../../modules/decimal-config-pipe.module';

import { FooterModule } from '../../modules/footer/footer.module';
import { HeaderModule } from '../header/header.module';
import { ModalModule } from '../modal/modal.module';
import { StripeModule } from '../../modules/stripe/stripe.module';
import { JwCommonModule } from '../../modules/jw-common/jw-common.module';
import { BillPlzModule } from '../../modules/billplz/billplz.module';
import { RazorpayModule } from '../../modules/razorpay/razorpay.module';
import { PayfortModule } from '../../modules/payfort/payfort.module';
import { PaypalModule } from '../../modules/paypal/paypal.module';
import { TelrModule } from '../../modules/telr/telr.module';
import { GiftCardService } from './gift-card.service';
import { GiftCardComponent } from './gift-card.component';
import { GiftButtonComponent } from './components/gift-button/gift-button.component';
import { GiftBuyComponent } from './components/buy/buy.component';
import { GiftCardReedemComponent } from './components/reedem/reedem.component';
import { PaymentMethodsModule } from '../payment-methods/payment-methods.module';
import { GiftCardHistoryComponent } from './components/history/history.component';
import { DateTimeFormatPipeModule } from '../../modules/pipe.module';

export const routes: Routes = [
  {
    path: '',
    component: GiftCardComponent,
  }
];

@NgModule({
  imports: [
    CommonModule,
    DecimalConfigPipeModule,
    FormsModule,
    ReactiveFormsModule,
    FooterModule,
    HeaderModule,
    RouterModule.forChild(routes),
    ModalModule,
    JwCommonModule,
    PaymentMethodsModule,
    DateTimeFormatPipeModule
  ],
  declarations: [
    GiftCardComponent,
    GiftButtonComponent,
    GiftBuyComponent,
    GiftCardReedemComponent,
    GiftCardHistoryComponent
  ],
  providers: [
    GiftCardService
  ]
})
export class GiftCardModule {

}
