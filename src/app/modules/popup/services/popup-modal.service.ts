import { ApiService } from './../../../services/api.service';
import { MessageType } from './../../../constants/constant';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from '../../../services/session.service';


@Injectable()
export class PopupModalService {

    constructor(private router: Router, private sessionService: SessionService,private api: ApiService) { }

    showPopup(type, timeout, message, bool) {
        const ele = document.getElementById('popup-m-cnt');
        const icon = document.getElementById('pop-m-icon');

        if (type === MessageType.ERROR) {
            try {
                this.backendErrorLogging(message).subscribe((res) => { console.log(res) });
            } catch (error) {
                console.error(error);
            }
        }

        switch (type) {
            case 'success':
                // ele.classList.add('success');
                // icon.classList.add('ion-android-done');
                break;
            case 'info':
                // ele.classList.add('info');
                // icon.classList.add('ion-information-circled');
                break;
            default:
                // icon.classList.add('ion-alert-circled');
        }
        document.getElementById('popup-modal').style.display = 'flex';
        document.getElementById('popup-m-message').innerText = message;
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
        const ele = document.getElementById('popup-m-cnt');
        const icon = document.getElementById('pop-m-icon');
        icon.classList.remove('ion-alert-circled', 'ion-android-done', 'ion-information-circled');
        ele.classList.toggle('active');
        ele.classList.remove('success');
        ele.classList.remove('info');
        ele.classList.remove('ion-alert-circled');
        document.getElementById('popup-m-message').innerText = '';
        document.getElementById('popup-modal').style.display = 'none';
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
