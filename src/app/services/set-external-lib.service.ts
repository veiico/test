/**
 * Created by cl-macmini-51 on 13/07/18.
 */
import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';
import { MessageService } from './message.service';
import { environment } from '../../environments/environment';
import { SessionService } from './session.service';
import { PushNotification } from '../interfaces/interfaces';
import { PopUpService } from '../modules/popup/services/popup.service';
import { LoadScriptsPostAppComponentLoad } from '../classes/load-scripts.class';
import { MessageType } from '../constants/constant';

@Injectable()

export class ExternalLibService {
  // socket = io(environment.API_ENDPOINT);
  socket;
  public permission: string;
  isPlatformServer: boolean;
  loadScripts = new LoadScriptsPostAppComponentLoad(this.sessionService);
  constructor(private popup: PopUpService, private messageService: MessageService,
     private sessionService: SessionService) {
    window['s'] = this;
    this.permission = this.isSupported() ? 'default' : 'denied';
    this.requestPermission();
    this.isPlatformServer = this.sessionService.isPlatformServer();
  }

  isSupported(): boolean {
    return 'Notification' in window;
  }

  requestPermission(): void {
    if ('Notification' in window) {
      Notification.requestPermission((status) => {
        return this.permission = status;
      });
    }
  }

  create(title: string, options?: PushNotification): any {
    return new Observable((obs) => {
      if (!('Notification' in window)) {
        console.log('Notifications are not available in this environment');
        obs.complete();
      }
      if (this.permission !== 'granted') {
        console.log('The user hasn\'t granted you permission to send push notifications');
        obs.complete();
      }
      const _notify = new Notification(title, options);
      _notify.onshow = function (e) {
        return obs.next({
          notification: _notify,
          event: e
        });
      };
      _notify.onclick = function (e) {
        window.focus();
        _notify.close();
        return obs.next({
          notification: _notify,
          event: e
        });
      };
      _notify.onerror = function (e) {
        return obs.error({
          notification: _notify,
          event: e
        });
      };
      _notify.onclose = function () {
        return obs.complete();
      };
    });
  }
  generateNotification(item): void {
    const options = {
      body: item.alertContent,
      icon: this.sessionService.get('config').fav_logo || '../../assets/img/favicon.png',
    };
    const notify = this.create(item.title, options).subscribe();
  }

  async initFuguWidget() {
    const config  = this.sessionService.get('config');
    const tag = this.sessionService.get('config') ? (this.sessionService.get('config').form_name + ' Webapp') : 'Yelo Webapp'
      if(config && config.is_fugu_chat_enabled){
      await this.loadScripts.hippo();
      try {
        (<any>window).fuguInit({
          'appSecretKey': this.sessionService.get('config').is_demo?'07de4b582efae50d964f4d8e6e548fed':this.sessionService.get('config').fugu_chat_token,
          "force_assign": this.sessionService.get('config').is_demo?1:0,
          "alwaysSkipBot": this.sessionService.get('config').is_demo?true:false,
          'tags': this.sessionService.get('config').is_demo?["Yelo-Sales-Chat", tag, "Yelo-Live-Demo"]:[tag],
          'customWhitelabelPointing': (environment.production || environment.beta) ? true : false,
          'color': this.sessionService.get('config').color,
          'language': this.sessionService.getString("language") || 'en',
          'device_token':this.sessionService.get('pwa_app') && this.sessionService.get("device_token_app")? this.sessionService.get("device_token_app"):undefined,
          'device_type':this.sessionService.get('pwa_app') && this.sessionService.get("device_type_app")? this.sessionService.get("device_type_app"):undefined,
          'app_version_code':this.sessionService.get('pwa_app')?400:undefined,
          'app_version':this.sessionService.get('pwa_app')?400:undefined,
          'app_type':this.sessionService.get('pwa_app') && this.sessionService.get('config').marketplace_user_id ? this.sessionService.get('config').marketplace_user_id+'0019':undefined,
          'deviceId':this.sessionService.get('pwa_app') && this.sessionService.get('deviceId') ? this.sessionService.get('deviceId'):undefined,
          'customAttributes': {
            'device_type':this.sessionService.get('pwa_app') && this.sessionService.get("device_type_app")? this.sessionService.get("device_type_app"):undefined,
            'app_type':this.sessionService.get('pwa_app') && this.sessionService.get('config').marketplace_user_id ? this.sessionService.get('config').marketplace_user_id+'0019':undefined,
            'app_name':this.sessionService.get('pwa_app')?'YeloCustomerPWA':undefined,
            'role':this.sessionService.get('pwa_app')?1:undefined,
            'source_type':this.sessionService.get('pwa_app')? 'YELO': undefined,
          },
        });
      } catch (e) {
        console.error(e);
      }
    }
  }
  async updateFuguWidget() {
    if (this.sessionService.get('config') && !this.isPlatformServer) {
      const tag = this.sessionService.get('config') ? (this.sessionService.get('config').form_name + ' Webapp') : 'Yelo Webapp'
      if (this.sessionService.get('config').is_fugu_chat_enabled) {
        await this.loadScripts.hippo();
        try {
          (<any>window).fuguUpdate({
            // 'appSecretKey': 'disugf74r982fh9IUUHU82E8HD98', //dev
            // 'appSecretKey': 'f4511ad1f914448e1afbcad303ef4813', //test
            // 'appSecretKey': 'vdfvvbdfgb786347823vhjdvwfjcvj',
            // 'uniqueId': this.sessionService.getString('f_uid'),
            'uniqueId': this.sessionService.get('appData').vendor_details.vendor_id,
            'email': this.sessionService.get('appData').vendor_details.email,
            'customWhitelabelPointing': (environment.production || environment.beta) ? true : false,
            // tslint:disable-next-line:max-line-length
            'name': this.sessionService.get('appData').vendor_details.first_name + ' ' + this.sessionService.get('appData').vendor_details.last_name,
            'phone': this.sessionService.get('appData').vendor_details.phone_number,
            "force_assign": this.sessionService.get('config').is_demo?1:0,
            "alwaysSkipBot": this.sessionService.get('config').is_demo?true:false,
            'tags': this.sessionService.get('config').is_demo?["Yelo-Sales-Chat", tag, "Yelo-Live-Demo"]:[tag],
            'color': this.sessionService.get('config').color,
            'language': this.sessionService.getString("language") || 'en',
            // 'appSecretKey': this.loginData.app_secret_key
            'device_token':this.sessionService.get('pwa_app') && this.sessionService.get("device_token_app")? this.sessionService.get("device_token_app"):undefined,
            'device_type':this.sessionService.get('pwa_app') && this.sessionService.get("device_type_app")? this.sessionService.get("device_type_app"):undefined,
            'deviceId':this.sessionService.get('pwa_app') && this.sessionService.get('deviceId') ? this.sessionService.get('deviceId'):undefined,
            'app_version_code':this.sessionService.get('pwa_app')?400:undefined,
            'app_version':this.sessionService.get('pwa_app')?400:undefined,
            'app_type':this.sessionService.get('pwa_app') && this.sessionService.get('config').marketplace_user_id ? this.sessionService.get('config').marketplace_user_id+'0019':undefined,
            'customAttributes': {
              'device_type':this.sessionService.get('pwa_app') && this.sessionService.get("device_type_app")? this.sessionService.get("device_type_app"):undefined,
              'app_type':this.sessionService.get('pwa_app') && this.sessionService.get('config').marketplace_user_id ? this.sessionService.get('config').marketplace_user_id+'0019':undefined,
              'app_name':this.sessionService.get('pwa_app')?'YeloCustomerPWA':undefined,
              'role':this.sessionService.get('pwa_app')?1:undefined,
              'source_type':this.sessionService.get('pwa_app')? 'YELO': undefined,
            },
            'appSecretKey': this.sessionService.get('config').is_demo?'07de4b582efae50d964f4d8e6e548fed':this.sessionService.get('config').fugu_chat_token,

          });
        } catch (e) {
          console.error(e);
        }
      }
    }
  }
  async chatWithMerchant(tags, tranId, userId, projectId, storeName) {
    try {
      const defaultMessage = 'hi';
      const hostname = window.location.host || 'app',
        hostContent = hostname.split('.') || [];
      const hippoKey = this.sessionService.get('config').fugu_chat_token;
      const obj = {
        transaction_id: tranId,
        custom_label: storeName + '(' + projectId + ')',
        grouping_tags: tags
      };
      await this.loadScripts.hippo();
      
      if(!this.sessionService.get('config').is_fugu_bot_enabled){
        obj['skipBot'] = 1;
        obj['skipBotReason'] = null;
      }

      (<any>window).startConversation(obj);
      // (window as any).startConversation({
      //   'tags': [tags],
      //   // tslint:disable-next-line:max-line-length
      //   'name': this.sessionService.get('appData').vendor_details.first_name + ' ' + this.sessionService.get('appData').vendor_details.last_name,
      //   'transaction_id': tranId,
      //   'user_id': userId,
      // });

    } catch (err) {
      console.error(err, 'yes error');
    }
  }
  shutdownFuguWidget() {
    try {
      (<any>window).shutDownFugu();
    } catch (e) {
      console.error(e);
    }
  }

  socketRegister(id) {
    let socket_endpoint;
    const config = this.sessionService.get('config');
    if (((environment.production || environment.beta))) {
      const protoCol: string = (location && location.protocol && ['http:', 'https:'].includes(location.protocol)) ? location.protocol : 'https:';
      if (this.sessionService.isMerchantDomain()) {
        socket_endpoint = `${protoCol}//${config.merchant_domain_obj.domain_name}`;
      } else {
        socket_endpoint = `${protoCol}//${config.domain_name}`;
      }
    } else {
      socket_endpoint = environment.SOCKET_ENDPOINT;
    }
    if (this.socket) {
      this.socket.disconnect();
    }
    this.socket = io(socket_endpoint, {path: '/socket.io'});
    const that = this;
    this.socket.emit('register_webapp_in_redis', { domain_name: this.sessionService.getString('domain'), vendor_id: id });
    this.socket.on('connect', function () {
      console.log('connected');
    });
    this.socket.on('disconnect', function () {
      that.socket.connect();
    });
    this.socket.on('error', function () {
      that.socket.connect();
    });
    this.socket.on('status_change_webapp', function (msg) {
      that.messageService.addNotification(msg);
      if (that.permission === 'granted') {
        that.generateNotification({
          'title': that.sessionService.get('config').form_name || 'Yelo',
          'alertContent': msg.body,
        });
      } else {
        that.popup.showPopup(MessageType.SUCCESS, 5000, msg.body, false);
      }
    });
  }

  // async initNetcore(){
  //     await LoadScriptsPostAppComponentLoad.netcore();
  //     // try {
  //       //ADGMOT35CHFLVDHBJNIG50K9690LIV5DBPC3FJRHIPB1PRRQE51G
  //       //f396415a168f4939667f84d053482a40
  //       // (<any>window).smartech('create', 'ADGMOT35CHFLVDHBJNIG50K9690LIV5DBPC3FJRHIPB1PRRQE51G');
  //       // (<any>window).smartech('register', 'f396415a168f4939667f84d053482a40');
  //       // (<any>window).smartech('dispatch',1,{});
  //     // } catch (e){
  //       // console.error(e);
  //     // }
  // }
}
