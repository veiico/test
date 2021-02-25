import { Pipe, PipeTransform } from '@angular/core';
import { SessionService } from '../services/session.service';
/*
 * Raise the value exponentially
 * Takes an exponent argument that defaults to 1.
 * Usage:
 *   value | exponentialStrength:exponent
 * Example:
 *   {{ 2 | exponentialStrength:10 }}
 *   formats to: 1024
*/
@Pipe({name: 'TookanStatus'})
export class TookanStatus implements PipeTransform {
  public terminology;
  public statusList;
  constructor(public sessionService: SessionService) {
    let config: any = this.sessionService.get('config');
    this.terminology = config.terminology;
    this.statusList = {
      9: this.terminology.PENDING || 'PENDING',
      10: this.terminology.ORDERED || 'ORDERED',
      11: this.terminology.ACCEPTED || 'ACCEPTED',
      12: this.terminology.DISPATCHED || 'DISPATCHED',
      13: this.terminology.COMPLETED || 'COMPLETED',
      14: this.terminology.REJECTED || 'REJECTED',
      15: this.terminology.CANCELLED || 'CANCELLED',
      16: this.terminology.DISPATCHED || 'DISPATCHED',
      17: this.terminology.DISPATCHED || 'DISPATCHED',
      44: this.terminology.JOB_ASSIGNED  || 'ORDER ASSIGNED',
      45: this.terminology.PROCESSED  || 'PROCESSED',
      46: this.terminology.PICKED_UP  || 'PICKED UP',
    };
  } 


  transform(value: number): string {
    return this.statusList[value];
  }
}
