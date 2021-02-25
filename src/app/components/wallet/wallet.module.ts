import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataScrollerModule } from 'primeng/datascroller';
import { DecimalConfigPipeModule } from '../../modules/decimal-config-pipe.module';
import { FooterModule } from '../../modules/footer/footer.module';
import { HeaderModule } from '../header/header.module';
import { WalletService } from './wallet.service';
import { WalletComponent } from './wallet.component';
import { ModalModule } from '../modal/modal.module';
import { JwCommonModule } from '../../modules/jw-common/jw-common.module';
import { BillPlzModule } from '../../modules/billplz/billplz.module';
import { RazorpayModule } from '../../modules/razorpay/razorpay.module';
import { PayfortModule } from '../../modules/payfort/payfort.module';
import { PaypalModule } from '../../modules/paypal/paypal.module';
import { TelrModule } from '../../modules/telr/telr.module';
import { DateTimeFormatPipeModule } from '../../modules/pipe.module';
import { PayMobModule } from '../../modules/paymob/paymob.module';
import { PaystackModule } from '../../../app/modules/paystack/paystack.module';
import { VistaModule } from './../../modules/vista/vista.module';
import { VivaModule } from './../../modules/viva/viva.module';
import { PaynowModule } from '../../modules/paynow/paynow.module';
import { LimeLightModule } from '../../modules/limelight/limelight.module';
import { TwoCheckoutModule } from '../../modules/two-checkout/two-checkout.module';
import { CheckoutComModule } from '../../modules/checkout-com/checkout-com.module';
import { StripeidealModule } from './../../modules/stripeideal/stripeideal.module';
import { StripeModule } from './../../modules/stripe/stripe.module';
import { MPaisaModule } from '../../modules/mpaisa/mpaisa.module';
// import { WirecardModule } from '../../modules/wirecard/wirecard.module';
import { SslCommerzModule } from '../../modules/sslCommerz/sslCommerz.module';
import { Fac3dModule } from '../../modules/fac3d/fac3d.module';
import { PayhereModule } from '../../modules/payhere/payhere.module';
import { AzulModule } from '../../modules/azul/azul.module';
import { HyperpayModule } from '../../modules/hyperpay/hyperpay.module';
import { CredimaxModule } from '../../modules/credimax/credimax.module';
import { MyFatooraModule } from '../../modules/my-fatoora/my-fatoora.module';
import { TapModule } from '../../modules/tap/tap.module';
import { ThetellerModule } from '../../modules/theteller/theteller.module';
import { PaynetModule } from '../../modules/paynet/paynet.module';
import { CurlecModule } from '../../modules/curlec/curlec.module';
import { WipayModule } from '../../modules/wipay/wipay.module';
import { PagarModule } from '../../modules/pagar/pagar.module';
import { WhooshModule } from '../../modules/whoosh/whoosh.module';
import { MtnModule } from '../../modules/mtn/mtn.module';
import { WechatModule } from '../../modules/wechat/wechat.module';
import { OnepayModule } from '../../modules/onepay/onepay.module';
import { PagopluxModule } from '../../modules/pagoplux/pagoplux.module';
import { MybillpaymentModule } from '../../modules/mybillpayment/mybillpayment.module';
import { ValitorModule } from '../../modules/valitor/valitor.module';
import { TruevoModule } from '../../modules/truevo/truevo.module';
import { PayzenModule } from '../../modules/payzen/payzen.module';
import { FirstdataModule } from '../../modules/firstdata/firstdata.module';
// import { BankopenModule } from '../../modules/bankopen/bankopen.module';
import { SquareModule } from '../../modules/square/square.module';
import { EtisalatModule } from '../../modules/etisalat/etisalat.module';
import { SuncashModule } from '../../modules/suncash/suncash.module';
import { GocardlessModule } from '../../modules/gocardless/gocardless.module';
// import { AthModule } from '../../modules/ath/ath.module';
import { Ipay88Module } from '../../modules/ipay88/ipay88.module';
import { ProxypayModule } from '../../modules/proxypay/proxypay.module';
// import { CybersourceModule } from '../../modules/cybersource/cybersource.module';
// import { AlfalahModule } from '../../modules/alfalah/alfalah.module';
// import { CulqiModule } from '../../modules/culqi/culqi.module';
import { NmiModule } from '../../modules/nmi/nmi.module';
import { FlutterwaveModule } from '../../modules/flutterwave/flutterwave.module';
import { MpesaModule } from '../../modules/mpesa/mpesa.module';
// import { AdyenModule } from '../../modules/adyen/adyen.module';
import { PaymarkModule } from '../../modules/paymark/paymark.module';
import { HypurModule } from '../../modules/hypur/hypur.module';
import { PaytmModule } from '../../modules/paytm/paytm.module';
import { PixelpayModule } from '../../modules/pixelpay/pixelpay.module';
import { DokuModule } from '../../modules/doku/doku.module';
import { PeachModule } from '../../modules/peach/peach.module';
import { PaymentGatewaysModule } from '../../modules/payment-gateways/payment-gateways.module';

export const routes: Routes = [
  {
    path: '',
    component: WalletComponent,
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
    StripeidealModule,
    VivaModule,
    JwCommonModule,
    BillPlzModule,
    RazorpayModule,
    PayfortModule,
    PaypalModule,
    TelrModule,
    DataScrollerModule,
    DateTimeFormatPipeModule,
    PayMobModule,
    PaystackModule,
    VistaModule,
    PaynowModule,
    LimeLightModule,
    TwoCheckoutModule,
    CheckoutComModule,
    PayhereModule,
    StripeModule,
    MPaisaModule,
    // WirecardModule,
    SslCommerzModule,
    Fac3dModule,
    AzulModule,
    HyperpayModule,
    CredimaxModule,
    MyFatooraModule,
    ThetellerModule,
    PaynetModule,
    TapModule,
    CurlecModule,
    WipayModule,
    PagarModule,
    WhooshModule,
    MtnModule,
    WechatModule,
    OnepayModule,
    WechatModule,
    PagopluxModule,
    MybillpaymentModule,
    ValitorModule,
    TruevoModule,
    PayzenModule,
    FirstdataModule,
    // BankopenModule,
    SquareModule,
    EtisalatModule,
    SuncashModule,
    GocardlessModule,
    // AthModule,
    Ipay88Module,
    ProxypayModule,
    // CybersourceModule,
    // AlfalahModule,
    // CulqiModule,
    NmiModule,
    FlutterwaveModule,
    MpesaModule,
    // AdyenModule,
    PaymarkModule,
    HypurModule,
    PaytmModule,
    PixelpayModule,
    DokuModule,
    PeachModule,
    PaymentGatewaysModule
  ],
  declarations: [
    WalletComponent
  ],
  providers: [
    WalletService
  ]
})
export class WalletModule {
}
