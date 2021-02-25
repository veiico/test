import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { TimeFormat } from '../enums/enum';
import { SessionService } from '../services/session.service';

@Pipe({
  name: 'dateTimeFormat'
})
export class DateTimeFormatPipe extends DatePipe implements PipeTransform {

  public timeFormat = TimeFormat;
  public config: any;

  constructor(public sessionService: SessionService) {
    super(sessionService.getString('language'));
    this.config = this.sessionService.get('config')
  }

  transform(value: any, args?: any, timeZone?: any): any {
    if(!args || args == 'mediumDate' || args == 'MMM d, y'){
      args = this.config.date_format ? (this.config.date_format.replace(/D/g,'d').replace(/Y/g,'y')) : 'dd-MM-yyyy';
    } else if (args == 'MMM d, y, h:mm a'){
      args = this.config.date_format ? (this.config.date_format.replace(/D/g,'d').replace(/Y/g,'y') + (this.config.time_format === this.timeFormat.TWENTY_FOUR_HOURS ? ', HH:mm' : ', h:mm a')) : 'MMM d, y, HH:mm';
    } else if (args == 'MMM d, y, h:mm'){
      args = this.config.date_format ? (this.config.date_format.replace(/D/g,'d').replace(/Y/g,'y') + (this.config.time_format === this.timeFormat.TWENTY_FOUR_HOURS ? ', HH:mm' : ', h:mm')) : 'MMM d, y, HH:mm';
    }else if (args == "MMM dd, yyyy 'at' h:mm a"){
      args = this.config.date_format ? (this.config.date_format.replace(/D/g,'d').replace(/Y/g,'y') + "' at' h:mm a") : "MMM dd, yyyy ' at' h:mm a";
    } else if(args == "dd MMM, yyyy 'at' h:mm a"){
      args = this.config.date_format ? (this.config.date_format.replace(/D/g,'d').replace(/Y/g,'y') + "' at' h:mm a") : "dd MMM, yyyy 'at' h:mm a";
    } else if(args == "MMM d, y, h:mm':'+0000'"){
      args = this.config.date_format ? (this.config.date_format.replace(/D/g,'d').replace(/Y/g,'y')) : "MMM d, y";
      this.config.time_format === this.timeFormat.TWENTY_FOUR_HOURS ? (args = args + ", h:mm a':'+0000'" ) : args = args + ", h:mm ':'+0000'"
    }
    // if(args &&  !['mediumDate','EEE','dd LLL','shortTime','MMM d, y, h:mm a'].includes(args) && this.config.time_format != this.timeFormat.TWENTY_FOUR_HOURS && !args.includes('a')){
    //   args = args;
    // }
    if(this.config.time_format == this.timeFormat.TWENTY_FOUR_HOURS && args.includes('a')){
      args = args ;
    }
    const dateGot = super.transform(value, args);
    if (dateGot && (dateGot.indexOf('AM') > -1 || dateGot.indexOf('am') > -1 || dateGot.indexOf('PM') > -1 || dateGot.indexOf('pm') > -1) && this.config.time_format === this.timeFormat.TWENTY_FOUR_HOURS) {
      return super.transform(value,args, timeZone);
    } else if (dateGot) {
      return super.transform(value, args, timeZone);
    }
  }
}
