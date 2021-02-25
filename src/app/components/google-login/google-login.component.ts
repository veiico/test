import { MessageType } from './../../constants/constant';
import { Component, Output, EventEmitter } from '@angular/core';
import { SessionService } from '../../services/session.service';
import { LoaderService } from '../../services/loader.service';
import { GoogleAnalyticsEvent } from '../../enums/enum';
import { PopupModalService } from '../../modules/popup/services/popup-modal.service';
import { GoogleAnalyticsEventsService } from '../../services/google-analytics-events.service';
import { GoogleLoginService } from './google-login.service';
import { MessageService } from '../../services/message.service';
import { AppService } from '../../app.service';

declare const gapi: any;
declare var $: any;
@Component({
    selector: 'app-google-login',
    templateUrl: './google-login.component.html',
    styleUrls: ['./google-login.component.scss']
})


export class GoogleLoginComponent {
    public auth2: any;
    public client_id: string
    public config
    @Output() googleInfoEvent: EventEmitter<any> = new EventEmitter<any>();
    apiList = ['loginUsingGoogle', 'loginUsingGoogleDual'];
    langJson;
    languageStrings: any={};

    constructor(protected sessionService: SessionService,
        protected loader: LoaderService,
        protected popup: PopupModalService,
        public googleAnalyticsEventsService: GoogleAnalyticsEventsService,
        public googleLoginService: GoogleLoginService, protected messageService: MessageService, protected appService: AppService) {
            this.sessionService.langStringsPromise.then(() =>
            {
             this.languageStrings = this.sessionService.languageStrings;
            });
        this.config = this.sessionService.get('config');
        this.client_id = this.config.google_client_app_id;
        this.langJson = this.appService.getLangJsonData();
    }


    ngAfterViewInit() {
        if (!this.sessionService.isPlatformServer())
            this.googleInit();
    }

    /**
     * function init google auth via client id
     */
    public googleInit() {
        try {
            gapi.load('auth2', () => {
                try {
                    this.auth2 = gapi.auth2.init({
                        client_id: this.client_id,
                        scope: 'profile email'
                    });
                    this.attachSignin(document.getElementById('googleBtn'));
                }
                catch (e) {
                    console.error(e)
                    this.loader.hide();
                }
            });
        }
        catch (e) {
            console.error(e)
            this.loader.hide();
        }
    }


    /**
     * assign clickhandler to id btn
     */
    public attachSignin(element) {
        this.auth2.attachClickHandler(element, {},
            (googleUser) => {
                let profile = googleUser.getBasicProfile();
                let obj = {
                    google_token: profile.getId(),
                    email: profile.getEmail(),
                }
                let vendor_image = profile.getImageUrl();

                if (this.config && this.config.is_dual_user_enable === 1) {
                    this.googleLoginApi(obj, profile.getName(), 1, vendor_image);
                } else {
                    this.googleLoginApi(obj, profile.getName(), 0, vendor_image);
                }

            }, (error) => {
                this.loader.hide();
                this.popup.showPopup(MessageType.ERROR, 2000, this.languageStrings.some_error_occured_please__try_again || 'some_error_occured_please__try_again', false);
            });
    }

    /**
     * function to hit after successful fetch info
     */

    googleLoginApi(googleData, name, dual, vendor_image) {
        this.loader.show();
        let obj = {
            marketplace_reference_id: this.config.marketplace_reference_id,
            device_token:this.sessionService.get("device_token") || this.sessionService.get("device_token_app"),
            ...googleData
        };

        let apiName = this.apiList[dual];
        this.googleLoginService[apiName](obj)
            .subscribe(
                response => {
                    try {
                        if (response.status === 200) {
                            this.googleInfoEvent.emit({
                                event: 'afterSuccess',
                                response: response
                            });

                        } else if (response.status == 405) {
                            googleData['vendor_image'] = vendor_image;
                            this.openSignupDialog(response, googleData, name);
                        } else {
                            this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.sign_in_failure, '', '', '');
                            this.popup.showPopup(MessageType.ERROR, 2000, response.message, false);
                        }
                    } catch (e) {
                        console.error(e);
                        this.loader.hide();
                        this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.sign_in_failure, '', '', '');
                    }
                    this.loader.hide();
                },
                error => {
                    console.error(error);
                    this.loader.hide();
                    this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.sign_in_failure, '', '', '');
                }
            );
    }

    /**
     * open signup dialog on user not found
     */

    openSignupDialog(response, googleData, name) {
        const signup_field = this.sessionService.get('config').signup_field;
        const obj = {
            'first_name': name,
            'google_token': googleData.google_token,
            'email': googleData.email,
            'domain_name': this.sessionService.getString('domain'),
            'marketplace_reference_id': this.config.marketplace_reference_id,
            'vendor_image': googleData.vendor_image,
            'device_token':this.sessionService.get("device_token") || this.sessionService.get("device_token_app") 
        };
        // when phone number is not mandatory make a direct hit of the register google
        if(signup_field ==0)
        {
            this.registerWithGoogle(obj);
        }
        else  
        {  
        this.messageService.getLoginSignupLocation('From Login Button');
         $('#loginDialog').modal('hide');
        $('#signupDialog').modal('show');
        this.messageService.openSignUpPage({
        'showTrue': 0,
        'showOTP': 0,
        'signup_template_data': [],
        'googleData': obj
    })
    this.popup.showPopup(MessageType.ERROR, 2000, response.message, false);
   
    } 
    }

    registerWithGoogle(signupDirectObj?:any) {
        this.loader.show();
        let obj={};
        obj=Object.assign({}, signupDirectObj);
         this.googleLoginService.registerUsingGoogle(obj)
          .subscribe(
            response => {
              try {
                if (response.status === 200) {
                    this.googleInfoEvent.emit({
                        event: 'afterSuccess',
                        response: response,
                        from:'register'
                    });
                } 
              } catch (e) {
                console.error(e);

              }
              this.loader.hide();
            },
            error => {
              console.error(error);
              this.loader.show();
            }
          );
      }

}
