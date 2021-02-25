import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as moment from 'moment';

import { LoaderService } from '../../../../services/loader.service';
import { SessionService } from '../../../../services/session.service';
import { SubscriptionsService } from '../../subscriptions.service';

declare var $: any;
@Component({
    selector: 'app-subscription-calendar',
    templateUrl: './subscription-calendar.component.html',
    styleUrls: ['./subscription-calendar.component.scss']
})
export class SubscriptionCalendarComponent implements OnInit {


    @Input() public subscriptionDetail;
    public disabledDates = null;
    public enabledDatesObject = {};
    public skippedDates = []
    public enableDates = [];
    public calendarMonth = new Date().getMonth();
    public selectedDates = null;
    public currDate = new Date();
    public maxDate = new Date(this.currDate.getFullYear(), this.currDate.getMonth() + 3, 0);
    public minDateCalendar: any;
    public maxDateCalendar: any;
    public calendarYear;
    @Output() public closeCalendar = new EventEmitter<any>();
    languageStrings: any={};

    constructor(private orderService: SubscriptionsService, private loader: LoaderService,
        private sessionService: SessionService) { }

    ngOnInit() {
        this.getSelectedDates();
        this.sessionService.langStringsPromise.then(() =>
        {
         this.languageStrings = this.sessionService.languageStrings;
        });
    }

    getSelectedDates() {
        const payload = {
            rule_id: this.subscriptionDetail.rule_id,
            marketplace_user_id: this.sessionService.get("appData").vendor_details.marketplace_user_id.toString(),
            user_id: this.subscriptionDetail.user_id,
            vendor_id: this.sessionService.get("appData").vendor_details.vendor_id.toString(),
            access_token: this.sessionService.get("appData").vendor_details.app_access_token,
            app_type: "WEB"

        }
        this.loader.show();
        this.orderService.getRecurringDates(payload).subscribe((res) => {
            this.loader.hide();
            if (res.status == 200) {
                this.enableDates = res.data.result;
                this.enableDates.forEach((dates, index) => {
                    dates.vaction = dates.is_skipped;
                    let enabledDateStr = dates.date.split('T')[0];
                    this.enabledDatesObject[enabledDateStr] = JSON.parse(JSON.stringify(dates));
                })
                this.makeDisableDates();
                setTimeout(() => {
                    let orderScroll = document.getElementById('orderScroll')
                    if (orderScroll) {
                        orderScroll.scroll({
                            top: orderScroll.scrollHeight,
                            behavior: 'smooth'
                        });
                    }
                }, 500);
               
            }
        }, error => {
            this.loader.hide();
        })
    }

    makeDisableDates() {
        this.minDateCalendar = new Date(this.enableDates[0].date.split('T')[0])
        this.maxDateCalendar = new Date(this.enableDates[this.enableDates.length - 1].date.split('T')[0])
        this.calendarYear = this.minDateCalendar.getFullYear();
        this.calendarMonth = this.minDateCalendar.getMonth();
        this.disabledDates = [];
        const selectedDates = [];
        const skippedDates = [];
        let nextDate = moment().year(this.calendarYear).month(this.calendarMonth).date(1);
        while ((skippedDates.length + selectedDates.length) < this.enableDates.length) {

            let dateStr = this.formatDate(nextDate);
            if (!this.enabledDatesObject[dateStr]) {
                this.disabledDates.push(new Date(dateStr));
            }
            else if (!this.enabledDatesObject[dateStr].is_skipped) {
                selectedDates.push(new Date(dateStr));
            } else {
                skippedDates.push(new Date(dateStr))
            }
            nextDate.add(1, 'day');

        }
        this.selectedDates = selectedDates.length == 0 ? null : selectedDates;
        this.skippedDates = skippedDates;
    }

    daysInThisMonth() {
        return new Date(this.calendarYear, (this.calendarMonth + 1), 0).getDate();
    }


    formatDate(date) {
        return moment(date).format().split('T')[0];
    }

    onSubmit() {
        const selectDatesHash = {};
        this.selectedDates.forEach((date) => {
            selectDatesHash[this.formatDate(date)] = true;
        })

        const skippedDates = [];

        this.enableDates.forEach((dateObj) => {
            let dateStr = dateObj.date.split('T')[0];
       
            if (selectDatesHash[dateStr]) {
                dateObj.is_skipped = false;
            }
            else {
                skippedDates.push(dateObj.date);
                dateObj.is_skipped = true;
            }
        })


        const payload = {
            rule_id: this.subscriptionDetail.rule_id,
            marketplace_user_id: this.sessionService.get("appData").vendor_details.marketplace_user_id.toString(),
            user_id: this.subscriptionDetail.user_id,
            vacation_dates: skippedDates,
            app_type: 'WEB'
        }

        if (this.sessionService.get('appData')) {
            payload['vendor_id'] = this.sessionService.get('appData').vendor_details.vendor_id;
            payload['access_token'] = this.sessionService.get('appData').vendor_details.app_access_token;
        }

        this.loader.show();
        this.orderService.addSkippedDates(payload).subscribe((res) => {
            this.loader.hide();
            if (res.status == 200) {
                this.closeCalendar.emit();

            }
        }, (err) => {
            this.loader.hide();
        })
    }

    close() {
        this.closeCalendar.emit();
    }

    ngOnDestroy() {

    }
}
