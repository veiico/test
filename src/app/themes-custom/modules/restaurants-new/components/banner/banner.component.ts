import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';

import { AppService } from '../../../../../app.service';
import { BannerComponent } from '../../../../../components/restaurants-new/components/banner/banner.component';
import { BannerService } from '../../../../../components/restaurants-new/components/banner/banner.service';
import { IDynamicCompilerData } from '../../../../../interfaces/interfaces';
import { DynamicCompilerService } from '../../../../../services/dynamic-compiler.service';
import { GoogleAnalyticsEventsService } from '../../../../../services/google-analytics-events.service';
import { MessageService } from '../../../../../services/message.service';
import { SessionService } from '../../../../../services/session.service';
import { templates } from '../../../../../themes-custom/constants/template.constant';


@Component({
  template: '<ng-container #bannerContainer></ng-container>'
})

export class DynamicBannerComponent extends BannerComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('bannerContainer', { read: ViewContainerRef }) bannerContainer: ViewContainerRef;

  constructor(protected appService: AppService, public sessionService: SessionService,
    public bannerService: BannerService, public googleAnalyticsEventsService: GoogleAnalyticsEventsService,
    public messageService: MessageService, public router: Router, protected dynamicCompilerService: DynamicCompilerService) {
    super(appService, sessionService, bannerService, googleAnalyticsEventsService, messageService, router)
  }

  ngOnInit() {
    setTimeout(() => {
      this.createDynamicTemplate(); 
    }, 100);

  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  createDynamicTemplate() {

    /**
     * reference services in const variable to access 
     * without passing in constructor of child component
     */

    const appService = this.appService;
    const sessionService = this.sessionService;
    const bannerService = this.bannerService;
    const googleAnalyticsEventsService = this.googleAnalyticsEventsService;
    const messageService = this.messageService;
    const router = this.router;
    const dynamicCompilerService = this.dynamicCompilerService;

    /**
     * create child class for new component
     */
    class DynamicBannerComponentTemp extends DynamicBannerComponent {
      constructor() {
        super(appService, sessionService, bannerService, googleAnalyticsEventsService, messageService, router, dynamicCompilerService)
      }
      ngOnInit() {
        this.subscriptionForListeningMessage();
        this.getBanner();
      }
      ngOnDestroy() {
        super.ngOnDestroy();
      }

    }


    /**
     * start creating dynamic component
     */

    const template = (this.sessionService.get('templates').components && this.sessionService.get('templates').components.banner) ? this.sessionService.get('templates').components.banner.html : templates.banner.html;
    const tmpCss = (this.sessionService.get('templates').components && this.sessionService.get('templates').components.banner) ? this.sessionService.get('templates').components.banner.css : templates.banner.css;
    const importsArray = [
      CommonModule
    ];


    const componentConfig: IDynamicCompilerData = {
      templateRef: this.bannerContainer,
      template: template,
      css: tmpCss,
      imports: importsArray,
      rootClass: DynamicBannerComponentTemp
    };


    dynamicCompilerService.createComponentFactory(componentConfig);
  }
}
