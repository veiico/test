/**
 * Created by mba-214 on 23/10/18.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { JwCommonModule } from '../../modules/jw-common/jw-common.module';
import { PaymentMethodsComponent } from './components/payment-methods/payment-methods.component';
import { StripeModule } from '../../modules/stripe/stripe.module';
import { PayfortModule } from '../../modules/payfort/payfort.module';
import { RazorpayModule } from '../../modules/razorpay/razorpay.module';
import { FacModule } from '../../modules/fac/fac.module';
import { InnstapayModule } from '../../modules/innstapay/innstapay.module';
import { PaypalModule } from '../../modules/paypal/paypal.module';
import { TelrModule } from '../../modules/telr/telr.module';
import { PayfastModule } from '../../modules/payfast/payfast.module';
import { BillPlzModule } from '../../modules/billplz/billplz.module';
import { PayuModule } from '../../modules/payu/payu.module';
import { DecimalConfigPipeModule } from '../../modules/decimal-config-pipe.module';
import { PaymentService } from '../payment/payment.service';
import { AuthorizeNetModule } from '../../modules/authorize-net/authorize-net.module';
import { VistaModule } from '../../modules/vista/vista.module';
import { PaymentHoldModule } from '../payment-hold/payment-hold.module';
import { PayMobModule } from '../../modules/paymob/paymob.module';
import { LimeLightModule } from '../../modules/limelight/limelight.module';
import { TwoCheckoutModule } from '../../modules/two-checkout/two-checkout.module';
import { CheckoutComModule } from '../../modules/checkout-com/checkout-com.module';
import { PaystackModule } from '../../../app/modules/paystack/paystack.module';
import { VivaModule } from '../../modules/viva/viva.module';
import { MPaisaModule } from '../../modules/mpaisa/mpaisa.module';
import { WirecardModule } from '../../modules/wirecard/wirecard.module';
import { SslCommerzModule } from '../../modules/sslCommerz/sslCommerz.module';
import { Fac3dModule } from '../../modules/fac3d/fac3d.module';
import { AzulModule } from '../../modules/azul/azul.module';
import { CredimaxModule } from '../../modules/credimax/credimax.module';
import { MyFatooraModule } from '../../modules/my-fatoora/my-fatoora.module';
import { TapModule } from '../../modules/tap/tap.module';
import { PaynowModule } from '../../modules/paynow/paynow.module';
import { StripeidealModule } from '../../modules/stripeideal/stripeideal.module';
import { FuguTelInputModule } from '../fugu-tel-input/fugu-tel-input.module';
import { ModalModule } from '../modal/modal.module';
import { PayhereModule } from '../../modules/payhere/payhere.module';
import { HyperpayModule } from '../../modules/hyperpay/hyperpay.module';
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


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    JwCommonModule,
    StripeModule,
    PayfortModule,
    RazorpayModule,
    FacModule,
    InnstapayModule,
    PaypalModule,
    TelrModule,
    VivaModule,
    PayfastModule,
    BillPlzModule,
    PayuModule,
    DecimalConfigPipeModule,
    AuthorizeNetModule,
    VistaModule,
    PaymentHoldModule,
    PayMobModule,
    PaystackModule,
    StripeidealModule,
    MPaisaModule,
    WirecardModule,
    SslCommerzModule,
    AzulModule,
    CredimaxModule,
    MyFatooraModule,
    TapModule,
    ThetellerModule,
    PaynowModule,
    LimeLightModule,
    TwoCheckoutModule,
    CheckoutComModule,
    PayhereModule,
    HyperpayModule,
    FuguTelInputModule,
    ModalModule,
    Fac3dModule,
    PaynetModule,
    CurlecModule,
    WipayModule,
    PagarModule,
    WhooshModule,
    MtnModule,
    WechatModule,
    OnepayModule,
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
    PaymentMethodsComponent
  ],
  exports: [
    PaymentMethodsComponent
  ],
  providers: [
    PaymentService
  ]
})
export class PaymentMethodsModule {
}
