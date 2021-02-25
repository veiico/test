import { MessageType } from './../../../constants/constant';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from '../../../services/session.service';
import { ApiService } from '../../../services/api.service';


@Injectable()
export class PopUpService {
    config:any ={}
    constructor(private router: Router, private sessionService: SessionService,private api: ApiService) {
        this.config = this.sessionService.get('config')
     }
    showPopup(type, timeout, message, bool) {
        if (this.sessionService.isPlatformServer()) return;
        
        if (type === MessageType.ERROR) {
            try {
                this.backendErrorLogging(message).subscribe((res) => { console.log(res) });
            } catch (error) {
                console.error(error);
            }
        }
        
        const ele = document.getElementById('popup-cnt');
        const icon = document.getElementById('pop-icon');
        document.getElementById('popup-comp').style.display = 'flex';
        document.getElementById('popup-message').innerText = message;
        ele.classList.toggle('active');

        setTimeout(() => {
            this.hidePopup();
            if (bool) {
                this.sessionService.removeAll();
                this.router.navigate(['/welcome']);
            }
        }, timeout);

    }
    hidePopup() {
        if (this.sessionService.isPlatformServer()) return;

        const ele = document.getElementById('popup-cnt');
        const icon = document.getElementById('pop-icon');
        icon.classList.remove('ion-alert-circled', 'ion-android-done', 'ion-information-circled');
        ele.classList.toggle('active');
        ele.classList.remove('success');
        ele.classList.remove('info');
        ele.classList.remove('ion-alert-circled');
        document.getElementById('popup-message').innerText = '';
        document.getElementById('popup-comp').style.display = 'none';
    }


    backendErrorLogging(msg) {
        const body = {
            marketplace_user_id: this.sessionService.get('config').marketplace_user_id,
            vendor_id: this.sessionService.get('appData') ? this.sessionService.get('appData').vendor_details.vendor_id : undefined,
            error_message: msg,
            app_type: 4,
            customer_side_error: 1,
            screen:window.location.href,
            metadata: JSON.stringify({
                origin_url: window.location.href,
                app_type:'WebApp'
            })
        };
        const obj = {
            'url': 'error/log',
            'body': body,
        };

        return this.api.post(obj);
    }
}
