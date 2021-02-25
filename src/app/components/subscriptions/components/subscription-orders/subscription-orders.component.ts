import { Component, OnInit, Renderer2 } from '@angular/core';

import { AppService } from '../../../../app.service';
import { MessageType, priceType, WeekDays } from '../../../../constants/constant';
import { OnboardingBusinessType, RecurringOrderStatus } from '../../../../enums/enum';
import { PopUpService } from '../../../../modules/popup/services/popup.service';
import { LoaderService } from '../../../../services/loader.service';
import { SessionService } from '../../../../services/session.service';
import { SubscriptionsService } from '../../subscriptions.service';

declare var $: any;
@Component({
    selector: 'app-subscription-orders',
    templateUrl: './subscription-orders.component.html',
    styleUrls: ['./subscription-orders.component.scss', '../../../orders/orders.component.scss']
})
export class SubscriptionOrdersComponent implements OnInit {

    public isPlatformServer;
    public pageoffset;
    public showPaginating = false
    public stopScrollHit = false;
    public subscriptionTasks = [];
    public appConfig;
    public langJson;
    public terminology;
    public orderDetails;
    public weekDays = WeekDays;
    public daysString: string;
    public calendarPopup: boolean = false;
    public ordersLoading: boolean = false;
    public confirmationModal: boolean = false;
    public selectedOrderIndex;
    public currency;
    public showAdditonalInfo = false;
    public additionalPrice: number;
    public isLaundryFlow: boolean;
    public priceTypeConst = priceType;
    public subtotal: number;
    public scrollSubscription
    public pagelimit;
    public loginData: any;
    public recurringOrderStatus = RecurringOrderStatus
    public deliveryChargeDetails: any = [];
    languageStrings: any={};
    orderConfirmString: any;

    constructor(protected sessionService: SessionService, protected service: SubscriptionsService,
        protected loader: LoaderService, protected popup: PopUpService,
        protected appService: AppService, protected renderer: Renderer2) { }

    ngOnInit() {
        this.isPlatformServer = this.sessionService.isPlatformServer();
        this.loader.show();
        this.appConfig = this.sessionService.get("config");
        if (!this.isPlatformServer) {
            this.loginData = this.sessionService.get('appData');
            this.getOrders();
        }

        this.isLaundryFlow = this.appConfig.onboarding_business_type === OnboardingBusinessType.LAUNDRY;
        const currency = this.appConfig["payment_settings"];
        if (currency) {
            this.currency = currency[0].symbol;
        }

        if (this.appConfig.terminology) {
            this.terminology = this.appConfig.terminology;
        }


        if (!this.isPlatformServer) {
            this.scrollSubscription = this.renderer.listen('body', 'scroll', (event) => {
                const newOffset = event.target.scrollHeight - event.target.offsetHeight;
                const newScollTop = event.target.scrollTop
                if (newScollTop === newOffset && newOffset !== 0) {
                    this.onScroll();
                }
            });
        }
        this.sessionService.langStringsPromise.then(() =>
        {
         this.languageStrings = this.sessionService.languageStrings;
         this.setLangKey();
        });
    }
    setLangKey()
    {
        this.languageStrings.are_you_sure_you_want_to_pause_order = (this.languageStrings.are_you_sure_you_want_to_pause_order || "Are you sure you want to ---- the ORDER_ORDER ?")
        .replace("ORDER_ORDER",this.terminology.ORDER);
        this.languageStrings.side_order =  (this.languageStrings.side_order || "side Order")
        .replace(
            "ORDER_ORDER",
            this.terminology.ORDER
        );
        this.languageStrings.order_id =  (this.languageStrings.order_id || "Order Id")
        .replace(
            "ORDER_ORDER",
            this.terminology.ORDER
        );
        this.languageStrings.order_amount =  (this.languageStrings.order_amount || "Order amount")
        .replace(
            "ORDER_ORDER",
            this.terminology.ORDER
        );
        this.languageStrings.order_time =   (this.languageStrings.order_time || "Order time")
        .replace(
            "ORDER_ORDER",
            this.terminology.ORDER
        );
        this.languageStrings.cancel_order= (this.languageStrings.cancel_order || "cancel Order")
        .replace(
            "ORDER_ORDER",
            this.terminology.ORDER
        );
        this.languageStrings.pause_order= (this.languageStrings.pause_order || "Pause Order")
        .replace(
            "ORDER_ORDER",
            this.terminology.ORDER
        );
        this.languageStrings.resume_order= (this.languageStrings.resume_order || "Resume Order")
        .replace(
            "ORDER_ORDER",
            this.terminology.ORDER
        );
        this.languageStrings.will_deducted_creation_of_each_order= (this.languageStrings.will_deducted_creation_of_each_order || "will be deducted on the creation of each order")
        .replace(
            "ORDER_ORDER",
            this.terminology.ORDER
        );
        

        this.languageStrings.no_subscription_to_display  = (this.languageStrings.no_subscription_to_display || "No SUBSCRIPTIONS_SUBSCRIPTIONS to display")
        .replace("SUBSCRIPTIONS_SUBSCRIPTIONS", (this.terminology.SUBSCRIPTIONS || 'Subscriptions'));
    }
    /**
     * ngAfterViewInit
     */
    ngAfterViewInit() {
        this.pageoffset = 0;
        this.pagelimit = this.pageoffset + 10;
    }


  
    /**
     * onScroll
     */

    onScroll() {
        this.pageoffset = this.pagelimit;
        this.pagelimit = this.pageoffset + 10;
        if (!this.stopScrollHit) {
            this.showPaginating = true;
            this.getOrders();
        }
    }


    /**
     * get order listing
     */
    getOrders() {

        const obj = {
            start: this.pageoffset || 0,
            marketplace_reference_id: this.appConfig.marketplace_reference_id,
            reference_id: this.loginData.vendor_details.reference_id,
            marketplace_user_id: this.loginData.vendor_details.marketplace_user_id,
            user_id: this.loginData.vendor_details.marketplace_user_id,
            vendor_id: this.loginData.vendor_details.vendor_id,
            access_token: this.loginData.vendor_details.app_access_token
        };
        this.service.getSubscriptions(obj).subscribe(response => {
            this.ordersLoading = true;
            this.loader.hide();
            if (response.status === 200) {
                this.showAdditonalInfo = false;
                this.subscriptionTasks = this.subscriptionTasks.concat(response.data.result);
                if (response.data.result.length === 0 || this.subscriptionTasks.length >= response.data.count) {
                    this.stopScrollHit = true;
                }

            } else {
                this.popup.showPopup(MessageType.ERROR, 2000, response.message, false);
            }

            this.loader.hide();
            this.showPaginating = false;
        }, error => {
            this.loader.hide();
            this.popup.showPopup(MessageType.ERROR, 2000, error.message, false);

        });
    }

    /**
     * open order details
     */

    openDetails(order) {
        this.loader.show();
        const obj = {
            marketplace_reference_id: this.appConfig.marketplace_reference_id,
            marketplace_user_id: this.appConfig.marketplace_user_id,
            user_id: order.user_id,
            vendor_id: this.loginData.vendor_details.vendor_id,
            access_token: this.loginData.vendor_details.app_access_token,
            rule_id: order.rule_id
        };
        this.service.getSubscriptionDetails(obj).subscribe(response => {
            this.loader.hide();
            if (response.status == 200) {
                this.orderDetails = response.data.result[0];
                this.loader.hide();
                this.calendarPopup = false;
                let selectedDays = [];
                this.deliveryChargeDetails = [];
                if (this.orderDetails.recurring_surge_detail && this.orderDetails.recurring_surge_detail.length) {
                    this.orderDetails.recurring_surge_detail.forEach(element => {
                        this.deliveryChargeDetails.push({
                            day_id: element.day_id,
                            day: this.weekDays[element.day_id].day_name,
                            charge: element.delivery_charges,
                            amount: element.amount,
                            occurances: element.occurances,
                            total_amount: element.total_amount
                        })
                    });
                }
                this.orderDetails.day_array.forEach((day) => {
                    selectedDays.push(this.weekDays[day].day_name.substring(0, 2));
                })
                if (
                    this.orderDetails.checkout_template &&
                    this.orderDetails.checkout_template.length > 0
                ) {
                    const checkoutTemplate = this.orderDetails.checkout_template.map(
                        elem => elem.cost || 0
                    );
                    this.additionalPrice = checkoutTemplate.reduce((a, c) => a + c);
                }

                if (this.orderDetails.products) {

                    this.calculatePriceOfOrder();

                    this.subtotal = this.orderDetails.order_amount;
                    this.daysString = selectedDays.join(" | ");
                    $("#orderDetails").modal("show");
                }

            }
        },
            error => {
                console.error(error);
            }
        );
    }

    /**
     * calculatePriceOfOrder
     */

    calculatePriceOfOrder() {
        for (let i = 0; i < this.orderDetails.products.length; i++) {
            if (this.orderDetails.products[i].product.multiPrice &&
                this.orderDetails.products[i].product.multiPrice.length) {
                this.orderDetails.products[i].product.multiPrice = this.orderDetails.products[i].
                    product.multiPrice.filter(el => el.price_type > 1);
            }
            let productTotal = 0;
            if (this.orderDetails.products[i].product.unit_type !== 1) {
                if (this.orderDetails.products[i].product.multiPrice && this.orderDetails.products[i].product.multiPrice.length &&
                    this.appConfig.business_model_type === 'RENTAL') {
                    productTotal = this.orderDetails.products[i].product.multiPrice.reduce((accumulator, currentValue) => accumulator + currentValue.price * currentValue.unit, 0);
                }
                else {
                    productTotal = productTotal + this.orderDetails.products[i].product.unit_price * this.orderDetails.products[i].product.unit_count * this.orderDetails.products[i].product.quantity;
                }
            }
            else {
                productTotal = productTotal + this.orderDetails.products[i].product.unit_price * this.orderDetails.products[i].product.quantity;
            }
            if (this.orderDetails.products[i].customizations &&
                this.orderDetails.products[i].customizations.length) {
                for (let j = 0; j < this.orderDetails.products[i].customizations.length; j++) {
                    if (this.orderDetails.products[i].product.unit_type !== 1) {
                        productTotal = productTotal + this.orderDetails.products[i].customizations[j].unit_price * this.orderDetails.products[i].customizations[j].quantity;
                    }
                    else {
                        productTotal = productTotal + this.orderDetails.products[i].customizations[j].unit_price * this.orderDetails.products[i].customizations[j].quantity;
                    }
                }
            }
            this.orderDetails.products[i].product.productWiseTotal = productTotal.toFixed(2);
            if (this.orderDetails.products[i].product.total_tax_on_product) {
                this.orderDetails.products[i].product.productWiseTotalWithTax = +(productTotal) + this.orderDetails.products[i].product.total_tax_on_product;
            }
        }
    }

    toggleCalendar() {
        this.calendarPopup = !this.calendarPopup;
    }

    showConfirmDialog(orderDetail, index) {
        let status = this.subscriptionTasks[index].is_paused ? ( this.languageStrings.resume || 'resume') : (this.languageStrings.pause || 'pause'); 
        this.orderConfirmString = this.languageStrings.are_you_sure_you_want_to_pause_order.replace("----",status);
        this.confirmationModal = true;
        this.orderDetails = orderDetail;
        this.selectedOrderIndex = index;
    }


    /**
     * pause or Resume Order
     */

    pauseResumeOrder() {
        const payload = {
            rule_id: this.orderDetails.rule_id,
            is_paused: +(!this.orderDetails.is_paused),
            marketplace_user_id: this.loginData.vendor_details.marketplace_user_id.toString(),
            user_id: this.orderDetails.user_id,
            vendor_id: this.loginData.vendor_details.vendor_id.toString(),
            access_token: this.loginData.vendor_details.app_access_token,
            app_type: 'WEB'
        };
        this.loader.show();
        this.service.pauseResumeTask(payload).subscribe((res) => {
            this.confirmationModal = false;
            this.loader.hide();
            if (res.status == 200) {
                this.subscriptionTasks[this.selectedOrderIndex].is_paused = payload.is_paused;
                this.popup.showPopup(MessageType.SUCCESS, 2000, res.message, false);
            } else {
                this.popup.showPopup(MessageType.ERROR, 2000, res.message, false);
            }
        }, error => {
            this.loader.hide();
            this.popup.showPopup(MessageType.ERROR, 2000, error.message, false);
        })
    }

    hideDialog() {
        this.confirmationModal = false;
    }


    ngOnDestroy() {
        if (this.scrollSubscription) {
            this.scrollSubscription();
        }
    }
}
