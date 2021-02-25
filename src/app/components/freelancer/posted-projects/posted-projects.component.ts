/**
 * Created by cl-macmini-51 on 25/07/18.
 */
import { Component, OnDestroy, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';

import { SessionService } from '../../../services/session.service';
import { AppService } from '../../../app.service';
import { LoaderService } from '../../../services/loader.service';
import { PostedProjectService } from './posted-projects.service';
import { ModalType, DynamicTemplateDataType } from '../../../constants/constant';
import { ExternalLibService } from '../../../services/set-external-lib.service';
import { ProjectTypeEnum } from '../../../enums/enum';

@Component({
  selector: 'app-posted-projects',
  templateUrl: './posted-projects.component.html',
  styleUrls: ['./posted-projects.component.scss'],

})
// tslint:disable-next-line:component-class-suffix
export class PostedProjectComponents implements OnInit, OnDestroy, AfterViewInit {

  public config: any;
  public langJson: any;
  public languageSelected: any;
  public direction = 'ltr';
  public terminology: any;
  public pageOffset: number;
  public pageLimit: number;
  public stopScrollHit: boolean;
  public showPaginating: boolean;
  public result: boolean;
  public projectList: any;
  public categories: any;
  public details: any;
  public categorySelected = 'opened';
  public projectDetails = false;
  public modalType: ModalType = ModalType;
  public typesWithoutDate: any;
  public typesDate: any;
  public typesCheckbox: any;
  public typesImages: any;
  public typesMultiSelect: any;
  public typesTextArea: any;
  public typesDescription: any;
  public currency: string;
  public projectTypeEnum = ProjectTypeEnum;
  public dynamicTemplateDataType = DynamicTemplateDataType;
  public cancelPopup:boolean = false;
  public selectedProject:any;
  languageStrings: any={};

  constructor(private sessionService: SessionService, private router: Router, private appService: AppService,
    private postedProjectService: PostedProjectService, public loader: LoaderService, private extService: ExternalLibService) {
    this.setConfig();
    this.setLanguage();
  }

  // ======================life cycle====================
  ngOnInit() {
    this.sessionService.langStringsPromise.then(() =>
    {
     this.languageStrings = this.sessionService.languageStrings;
    });
    this.categories = [
      // {
      //   label: 'All',
      //   value: 'all'
      // },
      {
        label: this.terminology.OPENED || 'Opened',
        value: 'opened'
      },
      {
        label: this.terminology.CLOSED || 'Closed',
        value: 'closed'
      },
      {
        label: this.terminology.EXPIRED || 'Expired',
        value: 'expired'
      }
    ];
    window['x']=this;
  }
  ngAfterViewInit() {
    this.pageOffset = 0;
    this.pageLimit = 10;
    if (!this.sessionService.isPlatformServer())
      this.getProjectsAll('new');
    this.extService.updateFuguWidget();
  }
  ngOnDestroy() {

  }

  // ======================set config====================
  setConfig() {
    this.config = this.sessionService.get('config');
    this.terminology = this.config.terminology;
    this.currency = this.config.payment_settings[0].symbol;
  }

  // ======================set language====================
  setLanguage() {
    // checks for ar translations
    if (this.sessionService.getString('language')) {
      this.languageSelected = this.sessionService.getString('language');
      if (this.languageSelected === 'ar') {
        this.direction = 'rtl';
      } else {
        this.direction = 'ltr';
      }
    } else {
      this.languageSelected = 'en';
      if (this.languageSelected === 'ar') {
        this.direction = 'rtl';
      } else {
        this.direction = 'ltr';
      }
    }
    this.langJson = this.appService.getLangJsonData();
  }


  // ====================get catalogue for all merchants========================
  getProjectsAll(type) {
    const obj = {
      // 'skip': this.pageOffset,
      // 'limit': this.pageLimit,
      // 'marketplace_reference_id': this.sessionService.getString('marketplace_reference_id'),
      // 'reference_id': this.sessionService.get('appData').vendor_details.reference_id,
      'marketplace_user_id': this.config.marketplace_user_id,
    };
    if (this.sessionService.get('appData')) {
      obj['vendor_id'] = this.sessionService.get('appData').vendor_details.vendor_id;
      obj['access_token'] = this.sessionService.get('appData').vendor_details.app_access_token;
    }

    // if (this.categorySelected === 'all') {
    //   obj['filter'] = 4;
    // } else
    if (this.categorySelected === 'opened') {
      obj['filter'] = 1;
    } else if (this.categorySelected === 'closed') {
      obj['filter'] = 2;
    } else if (this.categorySelected === 'expired') {
      obj['filter'] = 3;
    }
    if (type !== 'scroll') {
      this.loader.show();
    }

    this.postedProjectService.getProjects(obj)
      .subscribe(
        response => {
          try {
            if (response.status === 200) {
              if (response.data.result && response.data.result.length > 0) {
                if (response.data.result.length === 0) {
                  this.stopScrollHit = true;
                }

                this.projectList = response.data.result;

                this.result = false;
              } else {
                this.stopScrollHit = true;
                if (type === 'new') {
                  this.projectList = [];
                  this.result = true;
                }
              }
            }
          } catch (e) {
            console.error(e);
          }
          this.loader.hide();
          this.showPaginating = false;
        },
        error => {
          console.error(error);
          this.loader.hide();
        }
      );
  }


  private oldResponseMapping(response:any){
    response.data.result.forEach((data) => {
      // tslint:disable-next-line:arrow-return-shorthand
      const headLineIndex = data.template.findIndex((o: any) => { return o.label === 'headline'; });
      // tslint:disable-next-line:arrow-return-shorthand
      const descriptionIndex = data.template.findIndex((o: any) => { return o.label === 'description'; });
      if (headLineIndex > -1) {
        data['headline'] = data.template[headLineIndex].value;
      }
      if (descriptionIndex > -1) {
        data['description'] = data.template[descriptionIndex].value;
      }

      if (data.path && data.path.length) {
        data.formattedPath = data.path.map(el => ({ label: el.name }));
      }
    });
  }

  // ====================on scroll========================
  // onScroll(event) {
  //   console.log('order scroll');
  //   this.pageOffset = this.pageOffset + this.pageLimit;
  //   this.pageLimit = 10;
  //   if (!this.stopScrollHit) {
  //     this.showPaginating = true;
  //     this.getProjectsAll('scroll');
  //   }
  // }
  // ==================== cancelling Job ====================
  cancelJob(event) {
    let data = this.selectedProject;
    event.stopPropagation();
    const obj = {
      'marketplace_user_id': data.marketplace_user_id,
      'project_id': data.project_id,
    };
    if (this.sessionService.get('appData')) {
      obj['vendor_id'] = this.sessionService.get('appData').vendor_details.vendor_id;
      obj['access_token'] = this.sessionService.get('appData').vendor_details.app_access_token;
    }
    this.loader.show();
    this.postedProjectService.cancelJob(obj)
      .subscribe(
        response => {
          try {
            if (response.status === 200) {
              this.getProjectsAll('new');
              this.closeCancelPopup();
            } else if (response.status === 400) {

            }
          } catch (e) {
            console.error(e);
          }
          this.loader.hide();
          this.closeCancelPopup();
        },
        error => {
          console.error(error);
          this.loader.hide();
          this.closeCancelPopup();
        }
      );
  }

  openCancelPopup(cancelProject){
    this.selectedProject = cancelProject;
    this.cancelPopup = true;
  }

  closeCancelPopup(){
    this.selectedProject = undefined;
    this.cancelPopup = false;
  }

  // ====================job button clicked==================
  jobClick(type, project, event) {
    event.stopPropagation();
    switch (type) {
      case 'View Bids':
        this.router.navigate(['bids', project.project_id]);
        break;
    }
  }

  /**
   * get project details
   * @param data
   */
  getProjectDetails(data) {
    const obj = {
      'marketplace_user_id': data.marketplace_user_id,
      'project_id': data.project_id,
    };
    if (this.sessionService.get('appData')) {
      obj['vendor_id'] = this.sessionService.get('appData').vendor_details.vendor_id;
      obj['access_token'] = this.sessionService.get('appData').vendor_details.app_access_token;
    }
    this.loader.show();
    this.postedProjectService.getProjectDetails(obj)
      .subscribe(
        response => {
          try {
            if (response.status === 200) {
              this.showProjectDetails(response.data);
            } else if (response.status === 400) {

            }
          } catch (e) {
            console.error(e);
          }
          this.loader.hide();
        },
        error => {
          console.error(error);
          this.loader.hide();
        }
      );
  }

  // ====================show project details====================

  showProjectDetails(data) {
    this.details = data;
    this.projectDetails = true;

    // without Date Image Checkbox TexatArea
    this.typesWithoutDate = this.details.template.filter(text => {
      // tslint:disable-next-line:max-line-length
      if ((text.data_type === 'Text' || text.data_type === 'Email' || text.data_type === 'Telephone' || text.data_type === 'Number' || text.data_type === 'Single-Select')
        && (text.display_name.indexOf('description') === -1 && text.display_name.indexOf('Description') === -1)) {
        return true;
      }
    });

    // description only
    this.typesDescription = this.details.template.filter(text => {
      if (text.display_name.indexOf('description') > -1 || text.display_name.indexOf('Description') > -1) {
        return true;
      }
    });
    // multi select only
    this.typesMultiSelect = this.details.template.filter(text => {
      if (text.data_type === 'Multi-Select') {
        return true;
      }
    });
    // Date only
    this.typesDate = this.details.template.filter(text => {
      // tslint:disable-next-line:max-line-length
      if (text.data_type === 'Date' || text.data_type === 'Date-Future' || text.data_type === 'Date-Past' || text.data_type === 'Date-Time' || text.data_type === 'Time' || text.data_type === 'Datetime-Future' || text.data_type === 'Datetime-Past') {
        return true;
      }
    });
    // checkbox only
    this.typesCheckbox = this.details.template.filter(text => {
      if (text.data_type === 'Checkbox') {
        return true;
      }
    });
    // images only
    this.typesImages = this.details.template.filter(text => {
      if (text.data_type === 'Image') {
        return true;
      }
    });
    // textarea only
    this.typesTextArea = this.details.template.filter(text => {
      if (text.data_type === 'TextArea') {
        return true;
      }
    });

  }



  /**
   * hide tmplate view modal
   */
  hideTempltePopup() {
    this.projectDetails = false;
  }

}
