/**
 * Created by mba-214 on 23/11/18.
 */
import { Injectable } from '@angular/core';
import { SessionService } from './session.service';

declare var fbq: Function;

@Injectable()
export class FBPixelService {

  public config: any;
  constructor(public sessionService: SessionService) {
    this.config = this.sessionService.get('config');
  }

  public emitEvent(event, data) {
    if (this.sessionService.isPlatformServer()) return;
    
    try {
      if (this.config.fb_pixel_id && !data) {
        fbq("track", event);
      } else if (this.config.fb_pixel_id && data) {
        fbq("track", event, data)
      }
    } catch (error) {
      console.error(error);
    }

  }
}
