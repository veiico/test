import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaguelofacilComponent } from './paguelofacil/paguelofacil.component';
import { AdyenComponent } from '../adyen/adyen.component';
import { AlfalahComponent } from '../alfalah/alfalah.component';
import { AthComponent } from '../ath/ath.component';
import { NoqoodyComponent } from './noqoody/noqoody.component';
import { BankopenComponent } from '../bankopen/bankopen.component';
import { CulqiComponent } from '../culqi/culqi.component';
import { CybersourceComponent } from '../cybersource/cybersource.component';
import { GtbankComponent } from './gtbank/gtbank.component';
import { UrwayComponent } from './urway/urway.component';
import { VukaComponent } from './vuka/vuka.component';
import { VposComponent } from './vpos/vpos.component';
import { CxpayComponent } from './cxpay/cxpay.component';
import { PaykuComponent } from './payku/payku.component';
import { BamboraComponent } from './bambora/bambora.component';
import { PaywayoneComponent } from './paywayone/paywayone.component';
import { PlacetopayComponent } from './placetopay/placetopay.component';

@NgModule({
  declarations: [
    PaguelofacilComponent,
    AdyenComponent,
    AlfalahComponent,
    AthComponent,
    NoqoodyComponent,
    BankopenComponent,
    CulqiComponent,
    CybersourceComponent,
    GtbankComponent,
    UrwayComponent,
    VukaComponent,
    VposComponent,
    CxpayComponent,
    PaykuComponent,
    BamboraComponent,
    PaywayoneComponent,
    PlacetopayComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    PaguelofacilComponent,
    AdyenComponent,
    AlfalahComponent,
    AthComponent,
    NoqoodyComponent,
    BankopenComponent,
    CulqiComponent,
    CybersourceComponent,
    GtbankComponent,
    UrwayComponent,
    VukaComponent,
    VposComponent,
    CxpayComponent,
    PaykuComponent,
    BamboraComponent,
    PaywayoneComponent,
    PlacetopayComponent
  ]
})
export class PaymentGatewaysModule { }
