
import { Pipe } from '@angular/core';
import { AppService } from '../app.service';

@Pipe({
    name: 'minutesDaysPipe'
})
export class minutesDaysPipe {
    public langJson:any ={};
    constructor(public appService: AppService) {
        this.appService.langPromise.then(()=>{
            this.langJson = this.appService.getLangJsonData();
        })
    }
    transform(minutes: number): string {
        let serviceTime = "";
        let days: number, hours: number, min: number;
        days = parseInt((minutes / (24 * 60)).toString());
        hours = parseInt(((minutes % (24 * 60)) / 60).toString());
        min = parseInt(((minutes % (24 * 60)) % 60).toString());

        if (days != 0) {
            serviceTime += days + ' ' + (this.langJson["day" + ((days > 1) ? "s": "")] || 'day' + ((days > 1) ? "s" : ""));
        }
        if (hours != 0) {
            serviceTime += (days != 0 ? ", " : "") + hours + ' ' + (this.langJson["hr"+ ((hours > 1) ? "s": "")] || 'hr' + ((hours > 1) ? "s" : ""));
        }
        if (min != 0) {
            serviceTime += ((days != 0 || hours != 0) ? ", " : "") + min + ' ' + (this.langJson["min"+ ((min > 1) ? "s": "")] || 'min' + ((hours > 1) ? "s" : ""));
        }
        return serviceTime;
    }
}

