
import { Pipe } from '@angular/core';
import { AppService } from '../app.service';
import { priceType } from '../constants/constant';

@Pipe({
    name: 'serviceTimePipe'
})
export class serviceTimePipe {
    public langJson:any ={};
    constructor(public appService: AppService) {
        this.appService.langPromise.then(() => {
            this.langJson = this.appService.getLangJsonData();
        });
    }
    transform(minutes: number, unit_type: any): string {
        let serviceTime = "";
        let time: number;
        time = minutes / priceType[unit_type[0].toString()]['minutes'];
        switch (unit_type[0]) {
            case 2: {
                serviceTime = time + ' ' + (unit_type[1] ? unit_type[1] : this.langJson['minutes']);
                break;
            }
            case 3: {
                serviceTime = time + ' ' + (unit_type[1] ? unit_type[1] : this.langJson['hour' + ((time > 1) ? "s" : "")]);
                break;
            }
            case 4: {
                serviceTime = time + ' ' + (unit_type[1] ? unit_type[1] : this.langJson['day' + ((time > 1) ? "s" : "")]);
                break;
            }
            case 5: {
                serviceTime = time + ' ' + (unit_type[1] ? unit_type[1] : this.langJson['week' + ((time > 1) ? "s" : "")]);
                break;
            }
            case 6: {
                serviceTime = time + ' ' + (unit_type[1] ? unit_type[1] : this.langJson['month' + ((time > 1) ? "s" : "")]);
                break;
            }
            case 7: {
                serviceTime = time + ' ' + (unit_type[1] ? unit_type[1] : this.langJson['year' + ((time > 1) ? "s" : "")]);
                break;
            }
            default:
                {
                    serviceTime = minutes + ' ' + (unit_type[1] ? unit_type[1] : this.langJson['minutes']);
                    break;
                }
        }

        return serviceTime;
    }
}

