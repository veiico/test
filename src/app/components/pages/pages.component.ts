/**
 * Created by cl-macmini-51 on 01/05/18.
 */
import { Component, OnInit, Renderer2 } from '@angular/core';
import { SessionService } from '../../services/session.service';
import { LoaderService } from '../../services/loader.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { PagesService } from './pages.service';
import { OnboardingBusinessType } from '../../enums/enum';
declare var $: any;

@Component({
    selector: 'app-pages',
    templateUrl: './pages.component.html',
    styleUrls: ['./pages.component.scss']
})
export class PagesComponent implements OnInit {

    public appConfig: any;
    public direction = 'ltr';
    public routerSubscription: Subscription;
    public showPageData = 'noPage';
    public pageName: string;
    public pageType: string;
    public pageData: string = '';

    protected messageListener: Function;
    languageStrings: any={};
    constructor(private sessionService: SessionService, private loader: LoaderService, private pagesService: PagesService,
        private router: ActivatedRoute, private renderer: Renderer2,
        private route: Router) {
        // checks for ar translations

    }

    ngOnInit() {
        this.sessionService.langStringsPromise.then(() =>
      {
       this.languageStrings = this.sessionService.languageStrings;
      });
        this.appConfig = this.sessionService.get('config');
        this.navigationInterceptor();
        this.setListener()
    }

    navigationInterceptor() {
        this.routerSubscription = this.router.params.subscribe((data) => {
            this.pageName = data.pageName;
            this.pageType = data.type;
            if(this.pageType =='admin')
            {
                this.pageType = 'content';
            }
            else
            {
                if(window.location.pathname.includes("content")){
                    this.pageType = 'content';
                }
                else{
                    this.pageType = 'store';
                }
            }
            if (this.pageName != 'preview')
                this.getPagesData();
        })
    }

    protected setListener() {
        this.messageListener = this.renderer.listen('window', 'message', this.onMessage.bind(this))
    }

    onMessage(event: Event) {
        const message = event as MessageEvent;

        const dashboard_url = "https://"+this.sessionService.get('config').ds_domain_name;
        const domains = ['https://admin.yelo.red',
                         'https://admin2.yelo.red',
                         'https://dev1.yelo.red',
                         'https://dev2.yelo.red',
                         'https://dev3.yelo.red',
                         'https://dev4.yelo.red',
                         'https://dev5.yelo.red',
                         'https://dev6.yelo.red',
                         'https://dev7.yelo.red',
                         'https://dev8.yelo.red',
                         'https://dev9.yelo.red',
                         'https://dev10.yelo.red',
                         'https://dev11.yelo.red',
                         'https://dev12.yelo.red'
                        ];
        if (domains.includes(message.origin) || message.origin==dashboard_url) {
            this.pageData = message.data;
            this.showPageData = 'success';
        }
    }

    /**
     * get pages data
     */
    getPagesData() {
        const payload = {};
        payload['marketplace_reference_id'] = this.appConfig.marketplace_reference_id;
        payload['marketplace_user_id'] = this.appConfig.marketplace_user_id;
        payload['route'] = this.pageName;
        payload['is_active'] = 1;
        payload['start'] = 0;
        payload['length'] = 10;
        if (this.sessionService.get('appData')) {
            payload['vendor_id'] = this.sessionService.get('appData').vendor_details.vendor_id;
            payload['access_token'] = this.sessionService.get('appData').vendor_details.app_access_token;
          }

        //payload['is_admin_page'] = this.sessionService.getString('user_id') ? 0 : 1;
        if(this.pageType && this.pageType != 'content'){
            payload['user_id'] = this.sessionService.getString('user_id') ? this.sessionService.getString('user_id') : this.appConfig.marketplace_user_id;
        }
        else{
            payload['user_id'] = this.appConfig.marketplace_user_id;
        }
        payload['source'] = "0";
        this.loader.show();
        this.pagesService.getPageData(payload).subscribe(response => {
            this.loader.hide();
            if (response.status === 200) {

                this.pageData = response.data.template_data[0].template_data;
                this.showPageData = 'success';

            } else {
                this.route.navigate(['/']);
                // this.showPageData = 'error';
                //this.popup.showPopup(MessageType.ERROR, 3000, response.message, false);
            }
        },
            (error) => {
                console.error(error);
                this.route.navigate(['/list']);
                this.showPageData = 'error';
                this.loader.hide();
            });
    }

    ngOnDestroy() {
        this.routerSubscription.unsubscribe();
        this.messageListener();
    }
}
