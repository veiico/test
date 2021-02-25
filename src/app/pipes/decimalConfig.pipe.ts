import { Pipe, PipeTransform } from '@angular/core';
import { isNumber } from 'util';
import { SessionService } from '../services/session.service';

@Pipe({
  name: 'decimalConfig'
})
export class DecimalConfigPipe implements PipeTransform {
  appConfig: any;
  constructor(public sessionService: SessionService) {
    this.appConfig = this.sessionService.get('config');
  }

    ////////  Currency Formatting functions  /////////

  /* CURRENCY FORMAT e.g. 10,345,456.76 */  
commaSeparated = function (amount) { 
  let amt = amount.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$&,') 
  return amt; 
  } 
  
  /* CURRENCY FORMAT e.g. 10.345.456,76 */ 
  dotSeparated = function(amount) { 
  let amt = amount.toString().replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$&.'); 
  return amt; 
  } 

  /* CURRENCY FORMAT e.g. 10'345'456.76 */ 
  quoteSeparated = function(amount) { 
  let amt = amount.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$&'"); 
  return amt; 
  }

  decimalPrecision(value : any): string{
    let decimalCheck;
    if (
      this.appConfig &&
      this.appConfig.decimal_display_precision_point !== undefined
    ) {
      decimalCheck = this.appConfig.decimal_display_precision_point;
    } else {
      decimalCheck = 2;
    }
    let convertedValue;
    let tempValue = parseFloat(value);
    if (!isNaN(tempValue)) {
      let tensValue = Math.pow(10, decimalCheck);
      tempValue = Math.round(tempValue * tensValue);
      tempValue = tempValue / tensValue;
      convertedValue = tempValue.toFixed(decimalCheck);
      return convertedValue;
    } else {
      return (0.0).toFixed(decimalCheck); //value.toString();
    }
  }
  transform(value: any): string {

    let decimalCorrectedValue = this.decimalPrecision(value);
    switch(this.appConfig.currency_format) {
      case 2:
          return this.commaSeparated(decimalCorrectedValue);
      case 3:
          return this.dotSeparated(decimalCorrectedValue);
        case 4:
          return this.quoteSeparated(decimalCorrectedValue);
      default:
          return decimalCorrectedValue;
    }

  }
}
