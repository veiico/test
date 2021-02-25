import { CommonModule, isPlatformBrowser } from '@angular/common';
import { NgModule, Injector, Inject, PLATFORM_ID } from '@angular/core';

import { PaymentService } from '../../../components/payment/payment.service';
import { GoogleAnalyticsEventsService } from '../../../services/google-analytics-events.service';
import { ValidationService } from '../../../services/validation.service';
import { DynamicApplyLoyatyPointsModule } from '../apply-loyalty-points/apply-loyalty-points.module';
import { DynamicFooterModule } from '../footer/footer.module';
import { DynamicHeaderModule } from '../header/header.module';
import { DynamicInnstapayModule } from '../payment-gateways/innstapay/innstapay.module';
import { DynamicPayfastModule } from '../payment-gateways/payfast/payfast.module';
import { DynamicPaypalModule } from '../payment-gateways/paypal/paypal.module';
import { DynamicTelrModule } from '../payment-gateways/telr/telr.module';
import { DynamicPayuModule } from '../payment-gateways/payu/payu.module';
import { DynamicPaymentHoldModule } from '../payment-hold/payment-hold.module';
import { DynamicModalModule } from '../modal/modal.module';
import { DynamicPaymentComponent } from './payment.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../modules/shared.module';
import { DynamicPaymentRoutingModule } from './payment.routing';
import { DynamicPaystackModule } from '../payment-gateways/paystack/paystack.module';
import { DynamicPaynowModule } from '../payment-gateways/paynow/paynow.module';
import { DynamicVistaMoneyModule } from '../payment-gateways/vista-money/vista-money.module';
import { DynamicMPaisaModule } from '../payment-gateways/mpaisa/mpaisa.module';
import { DynamicStripeIdealModule } from '../payment-gateways/stripeideal/stripeideal.module';
import { DynamicPayMobModule } from '../payment-gateways/paymob/paymob.module';
import { TwoCheckoutModule } from '../../../modules/two-checkout/two-checkout.module';
import { TwoCheckoutComponent } from '../../../modules/two-checkout/two-checkout.component';
import { Fac3dModule } from '../../../modules/fac3d/fac3d.module';
import { Fac3dComponent } from '../../../modules/fac3d/fac3d.component';
import { CheckoutComModule } from '../../../modules/checkout-com/checkout-com.module';
import { CheckoutComComponent } from '../../../modules/checkout-com/checkout-com.component';
import { SslCommerzModule } from '../../../modules/sslCommerz/sslCommerz.module';
import { SslCommerzComponent } from '../../../modules/sslCommerz/sslCommerz.component';
import { VivaComponent } from '../../../modules/viva/viva.component';
import { VivaModule } from '../../../modules/viva/viva.module';
import { PayhereComponent } from '../../../modules/payhere/payhere.component';
import { PayhereModule } from '../../../modules/payhere/payhere.module';
import { AzulModule } from '../../../modules/azul/azul.module';
import { AzulComponent } from '../../../modules/azul/azul.component';
import { HyperpayComponent } from '../../../modules/hyperpay/hyperpay.component';
import { HyperpayModule } from '../../../modules/hyperpay/hyperpay.module';
import { CredimaxComponent } from '../../../modules/credimax/credimax.component';
import { CredimaxModule } from '../../../modules/credimax/credimax.module';
import { MyFatooraComponent } from '../../../modules/my-fatoora/my-fatoora.component';
import { MyFatooraModule } from '../../../modules/my-fatoora/my-fatoora.module';
import { TapModule } from '../../../modules/tap/tap.module';
import { ThetellerComponent } from '../../../modules/theteller/theteller.component';
import { ThetellerModule } from '../../../modules/theteller/theteller.module';
import { PaynetComponent } from '../../../modules/paynet/paynet.component';
import { PaynetModule } from '../../../modules/paynet/paynet.module';
import { TapComponent } from '../../../modules/tap/tap.component';
import { CurlecComponent } from '../../../modules/curlec/curlec.component';
import { CurlecModule } from '../../../modules/curlec/curlec.module';
import { WipayComponent } from '../../../modules/wipay/wipay.component';
import { WipayModule } from '../../../modules/wipay/wipay.module';
import { PagarComponent } from '../../../modules/pagar/pagar.component';
import { PagarModule } from '../../../modules/pagar/pagar.module';
import { WhooshComponent } from '../../../modules/whoosh/whoosh.component';
import { WhooshModule } from '../../../modules/whoosh/whoosh.module';
import { MtnComponent } from '../../../modules/mtn/mtn.component';
import { MtnModule } from '../../../modules/mtn/mtn.module';
import { WechatComponent } from '../../../modules/wechat/wechat.component';
import { WechatModule } from '../../../modules/wechat/wechat.module';
import { OnepayModule } from '../../../modules/onepay/onepay.module';
import { OnepayComponent } from '../../../modules/onepay/onepay.component';
import { PagopluxComponent } from '../../../modules/pagoplux/pagoplux.component';
import { PagopluxModule } from '../../../modules/pagoplux/pagoplux.module';
import { MybillpaymentComponent } from '../../../modules/mybillpayment/mybillpayment.component';
import { ValitorComponent } from '../../../modules/valitor/valitor.component';
import { ValitorModule } from '../../../modules/valitor/valitor.module';
import { MybillpaymentModule } from '../../../modules/mybillpayment/mybillpayment.module';
import { TruevoComponent } from '../../../modules/truevo/truevo.component';
import { TruevoModule } from '../../../modules/truevo/truevo.module';
import { PayzenComponent } from '../../../modules/payzen/payzen.component';
import { PayzenModule } from '../../../modules/payzen/payzen.module';
import { FirstdataComponent } from '../../../modules/firstdata/firstdata.component';
import { FirstdataModule } from '../../../modules/firstdata/firstdata.module';
import { BankopenComponent } from '../../../modules/bankopen/bankopen.component';
// import { BankopenModule } from '../../../modules/bankopen/bankopen.module';
import { SquareComponent } from '../../../modules/square/square.component';
import { SquareModule } from '../../../modules/square/square.module';
import { EtisalatComponent } from '../../../modules/etisalat/etisalat.component';
import { EtisalatModule } from '../../../modules/etisalat/etisalat.module';
import { SuncashComponent } from '../../../modules/suncash/suncash.component';
import { SuncashModule } from '../../../modules/suncash/suncash.module';
import { GocardlessComponent } from '../../../modules/gocardless/gocardless.component';
import { GocardlessModule } from '../../../modules/gocardless/gocardless.module';
import { AthComponent } from '../../../modules/ath/ath.component';
// import { AthModule } from '../../../modules/ath/ath.module';
import { Ipay88Component } from '../../../modules/ipay88/ipay88.component';
import { Ipay88Module } from '../../../modules/ipay88/ipay88.module';
import { ProxypayComponent } from '../../../modules/proxypay/proxypay.component';
import { ProxypayModule } from '../../../modules/proxypay/proxypay.module';
import { CybersourceComponent } from '../../../modules/cybersource/cybersource.component';
// import { CybersourceModule } from '../../../modules/cybersource/cybersource.module';
import { AlfalahComponent } from '../../../modules/alfalah/alfalah.component';
// import { AlfalahModule } from '../../../modules/alfalah/alfalah.module';
import { CulqiComponent } from '../../../modules/culqi/culqi.component';
// import { CulqiModule } from '../../../modules/culqi/culqi.module';
import { NmiComponent } from '../../../modules/nmi/nmi.component';
import { NmiModule } from '../../../modules/nmi/nmi.module';
import { FlutterwaveComponent } from '../../../modules/flutterwave/flutterwave.component';
import { FlutterwaveModule } from '../../../modules/flutterwave/flutterwave.module';
import { MpesaComponent } from '../../../modules/mpesa/mpesa.component';
import { MpesaModule } from '../../../modules/mpesa/mpesa.module';
import { AdyenComponent } from '../../../modules/adyen/adyen.component';
// import { AdyenModule } from '../../../modules/adyen/adyen.module';
import { PaymarkComponent } from '../../../modules/paymark/paymark.component';
import { PaymarkModule } from '../../../modules/paymark/paymark.module';
import { HypurComponent } from '../../../modules/hypur/hypur.component';
import { HypurModule } from '../../../modules/hypur/hypur.module';
import { PaytmComponent } from '../../../modules/paytm/paytm.component';
import { PaytmModule } from '../../../modules/paytm/paytm.module';
import { PixelpayComponent } from '../../../modules/pixelpay/pixelpay.component';
import { PixelpayModule } from '../../../modules/pixelpay/pixelpay.module';
import { DokuModule } from '../../../modules/doku/doku.module';
import { DokuComponent } from '../../../modules/doku/doku.component';
import { PeachComponent } from '../../../modules/peach/peach.component';
import { PeachModule } from '../../../modules/peach/peach.module';
import { PaguelofacilComponent } from '../../../modules/payment-gateways/paguelofacil/paguelofacil.component';
import { PaymentGatewaysModule } from '../../../../app/modules/payment-gateways/payment-gateways.module';
import { NoqoodyComponent } from '../../../../app/modules/payment-gateways/noqoody/noqoody.component';
import { GtbankComponent } from '../../../../app/modules/payment-gateways/gtbank/gtbank.component';
import { UrwayComponent } from '../../../../app/modules/payment-gateways/urway/urway.component';
import { VukaComponent } from '../../../../app/modules/payment-gateways/vuka/vuka.component';
import { VposComponent } from '../../../../app/modules/payment-gateways/vpos/vpos.component';
import { CxpayComponent } from '../../../../app/modules/payment-gateways/cxpay/cxpay.component';
import { PaykuComponent } from '../../../../app/modules/payment-gateways/payku/payku.component';
import { BamboraComponent } from '../../../../app/modules/payment-gateways/bambora/bambora.component';
import { PaywayoneComponent } from '../../../../app/modules/payment-gateways/paywayone/paywayone.component';
import { PlacetopayComponent } from '../../../../app/modules/payment-gateways/placetopay/placetopay.component';

const customElementTupleArray: [any, string][] = [
  [TwoCheckoutComponent, 'app-two-checkout'],
  [Fac3dComponent, 'app-fac3d'],
  [CheckoutComComponent, 'app-checkout-com'],
  [SslCommerzComponent, 'app-sslcommerz'],
  [VivaComponent, 'app-viva'],
  [PayhereComponent, 'app-payhere'],
  [AzulComponent, 'app-azul'],
  [HyperpayComponent, 'app-hyperpay'],
  [CredimaxComponent, 'app-credimax'],
  [MyFatooraComponent, 'app-my-fatoora'],
  [ThetellerComponent, 'app-theteller'],
  [PaynetComponent, 'app-paynet'],
  [TapComponent,'app-tap'],
  [CurlecComponent,'app-curlec'],
  [WipayComponent,'app-wipay'],
  [PagarComponent,'app-pagar'],
  [WhooshComponent,'app-whoosh'],
  [MtnComponent,'app-mtn'],
  [WechatComponent,'app-wechat'],
  [OnepayComponent, 'app-onepay'],
  [WechatComponent,'app-wechat'],
  [PagopluxComponent,'app-pagoplux'],
  [MybillpaymentComponent,'app-mybillpayment'],
  [ValitorComponent,'app-valitor'],
  [TruevoComponent,'app-truevo'],
  [PayzenComponent,'app-payzen'],
  [FirstdataComponent,'app-firstdata'],
  [BankopenComponent,'app-bankopen'],
  [SquareComponent,'app-square'],
  [EtisalatComponent,'app-etisalat'],
  [SuncashComponent,'app-suncash'],
  [GocardlessComponent,'app-gocardless'],
  [AthComponent,'app-ath'],
  [Ipay88Component,'app-ipay88'],
  [ProxypayComponent,'app-proxypay'],
  [CybersourceComponent,'app-cybersource'],
  [AlfalahComponent, 'app-alfalah'],
  [CulqiComponent,'app-culqi'],
  [NmiComponent,'app-nmi'],
  [FlutterwaveComponent, 'app-flutterwave'],
  [MpesaComponent,'app-mpesa'],
  [AdyenComponent, 'app-adyen'],
  [PaymarkComponent, 'app-paymark'],
  [HypurComponent, 'app-hypur'],
  [PaytmComponent, 'app-paytm'],
  [PixelpayComponent, 'app-pixelpay'],
  [DokuComponent,'app-doku'],
  [PeachComponent,'app-peach'],
  [PaguelofacilComponent,'app-paguelofacil'],
  [NoqoodyComponent,'app-noqoody'],
  [GtbankComponent,'app-gtbank'],
  [UrwayComponent,'app-urway'],
  [VukaComponent,'app-vuka'],
  [VposComponent,'app-vpos'],
  [CxpayComponent,'app-cxpay'],
  [PaykuComponent,'app-payku'],
  [BamboraComponent,'app-bambora'],
  [PaywayoneComponent,'app-paywayone'],
  [PlacetopayComponent, 'app-placetopay']
];

declare var require: any;


@NgModule({
  imports: [
    CommonModule,
    DynamicPaymentRoutingModule,
    SharedModule,
    DynamicHeaderModule,
    DynamicFooterModule,
    DynamicApplyLoyatyPointsModule,
    DynamicPaymentHoldModule,
    DynamicPayuModule,
    DynamicPaypalModule,
    DynamicTelrModule,
    DynamicPayfastModule,
    DynamicInnstapayModule,
    TwoCheckoutModule,
    CheckoutComModule,
    PayhereModule,
    Fac3dModule,
    DynamicModalModule,
    FormsModule,
    ReactiveFormsModule,
    DynamicPaystackModule,
    DynamicPaynowModule,
    DynamicVistaMoneyModule,
    DynamicMPaisaModule,
    DynamicStripeIdealModule,
    DynamicPayMobModule,
    SslCommerzModule,
    VivaModule,
    DynamicPayMobModule,
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
    DynamicPaymentComponent
  ],
  exports: [
    DynamicPaymentComponent
  ],
  entryComponents: [
    TwoCheckoutComponent,
    Fac3dComponent,
    CheckoutComComponent,
    SslCommerzComponent,
    VivaComponent,
    PayhereComponent,
    AzulComponent,
    HyperpayComponent,
    CredimaxComponent,
    MyFatooraComponent,
    ThetellerComponent,
    PaynetComponent,
    TapComponent,
    CurlecComponent,
    WipayComponent,
    PagarComponent,
    WhooshComponent,
    MtnComponent,
    WechatComponent,
    OnepayComponent,
    WechatComponent,
    PagopluxComponent,
    MybillpaymentComponent,
    ValitorComponent,
    TruevoComponent,
    PayzenComponent,
    FirstdataComponent,
    BankopenComponent,
    SquareComponent,
    EtisalatComponent,
    SuncashComponent,
    GocardlessComponent,
    AthComponent,
    Ipay88Component,
    ProxypayComponent,
    CybersourceComponent,
    AlfalahComponent,
    CulqiComponent,
    NmiComponent,
    FlutterwaveComponent,
    MpesaComponent,
    AdyenComponent,
    PaymarkComponent,
    HypurComponent,
    PaytmComponent,
    PixelpayComponent,
    DokuComponent,
    PeachComponent,
    PaguelofacilComponent,
    NoqoodyComponent,
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
  providers: [
    ValidationService,
    GoogleAnalyticsEventsService,
    PaymentService
  ]
})
export class DynamicPaymentModule {
  constructor(private injector: Injector, @Inject(PLATFORM_ID) platformId: Object) {
    if (isPlatformBrowser(platformId)) {
      const { createCustomElement } = require('@angular/elements');

      for (const [component, selector] of customElementTupleArray) {
        const elemExist = customElements.get(selector)
        if (!elemExist) {
          const el = createCustomElement(component, { injector: this.injector });
          customElements.define(selector, el);
        }
      }
    }
  }
}
