/**
 * Created by cl-macmini-51 on 03/09/18.
 */

export enum GoogleAnalyticsEvent {
  'sign_in_success' = 1,
  'sign_in_failure' = 2,
  'signup_success' = 3,
  'signup_failure' = 4,
  'add_quantity' = 5,
  'remove_quantity' = 6,
  'go_to_checkout' = 7,
  'go_to_payment' = 8,
  'category_click' = 9,
  'add_address' = 10,
  'order_created_success' = 11,
  'order_created_failure' = 12,
  'restaurant_detail_order_online' = 13,
  'restaurant_click' = 14,
  'find_business' = 15,
  'choose_time_slots' = 16,
  'add_to_cart' = 17,
  'search_text' = 18,
  'business_category' = 19,
  'choose_date_slots' = 20

}

export enum ProjectTypeEnum {
  'LOGISTICS' = 1,
  'FREELANCER',
  'FREELANCER_WITHOUT_BIDDING'
}

export enum PaymentMode {
  STRIPE = 2,
  PAYPAL = 4,
  TELR = 287, 
  CASH = 8,
  PAYFORT = 32,
  PAYTM = 64,
  RAZORPAY = 128,
  PAYSTACK = 256,
  BILLPLZ = 512,
  FAC = 2048,
  INNSTAPAY = 4096,
  VIVA=2097152,
  PAYFAST = 1024,
  PAYU = 8192,
  WALLET = 16384,
  AUTHORIZE_NET = 32768,
  PAY_LATER = 65536,
  PAY_MOB = 131072,
  VISTA = 262144,
  PAYNOW = 1048576,
  STRIPE_IDEAL=524288,
  MPAISA = 8388608,
  PAYTM_LINK = 16777216,
  // WIRE_CARD = 33554432,
  SSL_COMMERZ = 67108864,
  LIME_LIGHT = 134217728,
  TWO_CHECKOUT = 268435456,
  FAC_3D = 1073741824,
  CHECKOUT_COM = 536870912,
  PAYHERE = 4194304,
  AZUL = 2147483648  ,
  HYPERPAY=4294967296,
  CREDIMAX = 33554432,
  MY_FATOORAH = 8589934592,
  THETELLER = 17179869184,
  PAYNET = 34359738368,
  TAP = 68719476736,
  CURLEC = 137438953472,
  WIPAY = 274877906944,
  PAGAR = 549755813888,
  WHOOSH = 1099511627776,
  MTN = 2199023255552,
  WECHAT = 4398046511104,
  ONEPAY = 8796093022208,
  PAGOPLUX = 17592186044416,
  MYBILLPAYMENT = 35184372088832,
  VALITOR =140737488355328,
  TRUEVO = 562949953421312,
  BHARATPE = 281474976710656,
  PAYZEN = 1125899906842624,
  FIRSTDATA = 2251799813685248,
  BANKOPEN = 70368744177664,
  SQUARE = 4503599627370496,
  ETISALAT = 257,
  SUNCASH = 258,
  GOCARDLESS = 259,
  ATH = 260,
  IPAY88 = 261,
  PROXYPAY = 262,
  CYBERSOURCE = 263,
  ALFALAH = 264,
  CULQI = 265,
  NMI = 266,
  FLUTTERWAVE = 267,
  MPESA = 268,
  ADYEN = 269,
  PAYMARK = 271,
  HYPUR = 270,
  PAYTMV3 = 272,
  PIXELPAY = 273,
  DOKU = 274,
  PEACH = 275,
  PAGUELOFACIL = 276,
  NOQOODY = 277,
  GTBANK = 279,
  URWAY = 278,
  VUKA = 282,
  VPOS = 281,
  CXPAY = 280,
  PAYKU = 283,
  BAMBORA = 285,
  PAYWAYONE = 286,
  PLACETOPAY = 297
}
export enum CREATE_TASK_TYPE {
  FOOD = 1,
  CUSTOM_ORDER = 2,
  LAUNDARY = 3,
  FREELANCER = 4,
  CREATE_CHARGE=7,
  QUOTATION =9,
  LAUNDARY_CUSTOM_ORDER= 9,
  REWARD=10
  };

export enum PaymentFor {
  REWARDS = 5,
  REPAYMENT = 4,
  GIFT_CARD = 3,
  WALLET = 2,
  VENDOR_SUBSCRIPTION = 1,
  CREATE_TASK = 0,
  DEBT_AMOUNT = 6,
  CUSTOMER_SUBSCRIPTION_AMOUNT = 11
}
export enum PaymentByUsing {
 USING_FAC=2
}

export enum OnboardingBusinessType {
  LAUNDRY = 805,
  CAR_RENTAL = 902,
  RENTALS = 9,
  FOOD = 8,
  GROCERIES = 802,
  CANNABIS = 801,
  FOOD_CATERING = 804,
  PHARMACY = 803,
  BEAUTY = 7,
  HOME_SERVICES = 701,
  FREELANCER = 12
}

export enum WalletStatus {
  ADD = 1,
  DEDUCTION = 2,
  REFUND = 3,
  CREDIT = 4,
  FAIL = 5,
  GIFT_CARD_PURCHASE = 6,
  GIFT_CARD_REDEEM = 7,
  ADMIN_DEDUCTION = 8,
  REWARD_CASHBACK = 9,
  REWARD_BUY = 10
}


export enum PromotionOn {
  SUBTOTAL = 0,
  DELIVERY_CHARGE,
}


export enum PromoMode {
  PUBLIC = 0,
  HIDDEN,
  AUTO_APPLY,
}

export enum GiftCardType {
  SELF_REEDEM = 1,
  RECEIVED = 2,
  SENT = 3,
  OTHER_REEDEM = 4,
}

export enum CheckoutTemplateType {
  NORMAL_ORDER = 0,
  CUSTOM_ORDER = 1,
}

export enum TransactionStatusEnum {
  ORDER_COMPLETE = 1,
  TRANSACTION_COMPLETE,
  INIT,
  PAYMENT_FAILED_REFUNDED,
  TRANSACTION_INCOMPLETE,
  REFUNDED,
  TRANSACTION_FAILED,
  PARTIAL_PAYMENT,
  PARTIALLY_REFUNDED,
  PAYMENT_HOLD,
  PAYMENT_RELEASED
}

export enum BusinessType {
  PRODUCT_MARKETPLACE = 1,
  SERVICE_MARKETPLACE = 2
}

export enum TaskType {
  PICKUP_AND_DELIVERY = 1,
  APPOINTMENT = 2,
  SERVICE_AS_PRODUCT = 3
}

export enum TimeFormat {
  TWELVE_HOURS = 1,
  TWENTY_FOUR_HOURS = 2
}
export enum DeliveryMethod {
  SELF_PICKUP = 4,
  HOME_DELIVERY = 2
}
export enum AmountService {
  Price = 1,
  ConvertToSec=0
}
export enum PageType {
  THANKYOU = 1,
  ERROR = 2
}
export enum AddonType {
  NETCORE = 109
}
export enum DAY {
  SUNDAY = 0,
  MONDAY,
  TUESDAY,
  WEDNESDAY,
  THURSDAY,
  FRIDAY,
  SATURDAY
}

export enum RecurringOrderStatus {
  PENDING = 0,
  ACCEPTED = 1,
  REJECTED = 2
};

export enum LoginBy {
  LOCAL_STORAGE = 1,
  QUERY_PARAMS = 2
}
export enum LocationType {
  HOME = 0,
  WORK = 1,
  OTHERS=2
}


export enum FreelancerAddress {
  PROJECT_ADDRESS = 1,
  PICKUP_ADDRESS
}

export enum Inspectlet {
  JINI = 865942142,
  DIETBUDDY = 1287903440
}

export enum MarketplaceUserId {
  JINI = 166876,
  DIETBUDDY = 175522
}

export enum MapType {
  FLIGHTMAP = 0,
  GOOGLEMAP = 2
}