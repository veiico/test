import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material';
import { StarRatingModule } from 'angular-star-rating';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { CalendarModule } from 'primeng/calendar';
import { ProfileComponent } from '../../../components/profile/profile.component';
import { IDynamicCompilerData } from '../../../interfaces/interfaces';
import { DynamicCompilerService } from '../../../services/dynamic-compiler.service';

import { AppService } from '../../../app.service';
import { ProfileService } from '../../../components/profile/profile.service';
import { PopUpService } from '../../../modules/popup/services/popup.service';
import { DateTimeFormatPipe } from '../../../pipes/date-format.pipe';
import { GoogleAnalyticsEventsService } from '../../../services/google-analytics-events.service';
import { LoaderService } from '../../../services/loader.service';
import { MessageService } from '../../../services/message.service';
import { SessionService } from '../../../services/session.service';
import { templates } from '../../constants/template.constant';

declare var $: any;


@Component({
  selector: 'app-profile-dynamic',
  template: '<ng-container #profileTemplateRef></ng-container>',
})
export class DynamicProfileComponent extends ProfileComponent implements OnInit {
  @ViewChild('profileTemplateRef', { read: ViewContainerRef }) profileTemplateRef: ViewContainerRef;

  dateTimeFormat = new DateTimeFormatPipe(this.sessionService)

  constructor(protected sessionService: SessionService, protected loader: LoaderService, protected popup: PopUpService,
    protected service: ProfileService, protected message: MessageService, protected formBuilder: FormBuilder, public messageService: MessageService,
    public appService: AppService, public googleAnalyticsEventsService: GoogleAnalyticsEventsService, protected dynamicCompilerService: DynamicCompilerService) {
    super(sessionService, loader, popup, service, message, formBuilder, messageService, appService, googleAnalyticsEventsService)
  }

  ngOnInit() {
    this.createDynamicTemplate();
  }

  parentInit(){
    super.ngOnInit();
  }

  dateTimePipe(value, args?: any, timezone?: any) {
    return this.dateTimeFormat.transform(value, args, timezone)
  }



  createDynamicTemplate() {

    /**
     * reference services in const variable to access
     * without passing in constructor of child component
     */

    const appService = this.appService;
    const sessionService = this.sessionService;
    const messageService = this.messageService;
    const formBuilder = this.formBuilder;
    const dynamicCompilerService = this.dynamicCompilerService;
    const popup = this.popup;
    const message = this.message;
    const googleAnalyticsEventsService = this.googleAnalyticsEventsService;
    const service = this.service;
    const loader = this.loader;
    /**
     * create child class for new component
     */
    class DynamicProfileComponentTemp extends DynamicProfileComponent {
      constructor() {
        super(sessionService, loader, popup, service, message, formBuilder, messageService, appService, googleAnalyticsEventsService, dynamicCompilerService)
      }

      ngOnInit() {
        super.parentInit();
      }
    }


    /**
     * start creating dynamic component
     */

    const template = (this.sessionService.get('templates').pages['profile'] && this.sessionService.get('templates').pages['profile'].html) ? this.sessionService.get('templates').pages['profile'].html : templates.profile.html;
    const tmpCss = (this.sessionService.get('templates').pages['profile'] && this.sessionService.get('templates').pages['profile'].css) ? this.sessionService.get('templates').pages['profile'].css : templates.profile.css;
    const importsArray = [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      OwlDateTimeModule,
      OwlNativeDateTimeModule,
      MatCheckboxModule,
      CalendarModule,
      StarRatingModule
    ];


    const componentConfig: IDynamicCompilerData = {
      templateRef: this.profileTemplateRef,
      template: template,
      css: tmpCss,
      imports: importsArray,
      rootClass: DynamicProfileComponentTemp,
    };

    dynamicCompilerService.createComponentFactory(componentConfig);
  }

  phoneChange(event, fc: FormControl, force: boolean) {
    const data = event.detail;
    this.country_code = data.dialCode;
    if (fc) {
        fc.setValue(data.value);
    }
  }


}
