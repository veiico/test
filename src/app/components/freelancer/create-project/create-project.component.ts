import { MessageType } from './../../../constants/constant';
/**
 * Created by cl-macmini-51 on 20/07/18.
 */
import { Component, OnDestroy, OnInit, AfterViewInit } from '@angular/core';

import { SessionService } from '../../../services/session.service';
import { AppService } from '../../../app.service';
import { CreateProjectService } from './create-project.service';
import { LoaderService } from '../../../services/loader.service';
import { PopupModalService } from '../../../modules/popup/services/popup-modal.service';
import { ProjectTypeEnum } from '../../../enums/enum';
import { Router, ActivatedRoute } from '../../../../../node_modules/@angular/router';

@Component({
  selector: 'app-free-lancer-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.scss'],

})
export class FreelancerProjectComponent implements OnInit, OnDestroy, AfterViewInit {

  public config: any;
  public langJson: any;
  public languageSelected: any;
  public direction = 'ltr';
  public terminology: any;
  public noData: boolean;
  public catId: number;
  public path: Array<number>;

  public formTemplatePages = [];
  public images = {};
  languageStrings: any={};

  constructor(private sessionService: SessionService, private appService: AppService,
    private createProjectService: CreateProjectService, private loader: LoaderService,
    private popup: PopupModalService, private activatedRoute: ActivatedRoute, private router: Router) {
    this.setConfig();
    this.setLanguage();

    this.catId = parseInt(this.activatedRoute.snapshot.params['id']);
    if (!this.catId) {
      this.router.navigate(['/freelancer']);
    }
  }

  // ======================life cycle====================
  ngOnInit() {
    this.sessionService.remove('fLData');
    this.getPath();
    this.getDynamicTemplates();
    this.createProjectService.projectAddressObj = {};
    this.createProjectService.project_type = undefined;
  }
  ngAfterViewInit() {

  }
  ngOnDestroy() {

  }


  getPath() {
    const categoryPath: Array<any> =  this.sessionService.get('categoryPath');
    if (categoryPath && categoryPath.length && categoryPath[categoryPath.length - 1].id === this.catId ) {
      this.path = categoryPath.map(el => el.id);
    } else if (this.catId) {
      this.path = [this.catId];
    } else {
      this.router.navigate(['/freelancer']);
    }
  }



  // ======================set config====================
  setConfig() {
    this.config = this.sessionService.get('config');
    this.terminology = this.config.terminology;
    this.sessionService.langStringsPromise.then(() =>
    {
     this.languageStrings = this.sessionService.languageStrings;
     this.languageStrings.post_your_project=(this.languageStrings.post_your_project || 'Please Select a Project').replace('PROJECT_PROJECT',this.terminology.PROJECT)
    });
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
  }

  // ====================get templates=======================
  getDynamicTemplates() {
    this.loader.show();
    // let project_type;
    // if (this.config.project_type && this.config.project_type === ProjectTypeEnum.FREELANCER_WITHOUT_BIDDING) {
    //   project_type = ProjectTypeEnum.FREELANCER_WITHOUT_BIDDING;
    // } else {
    //   if (this.config.business_model_type === 'FREELANCER') {
    //     project_type = ProjectTypeEnum.FREELANCER;
    //   } else {
    //     project_type = ProjectTypeEnum.LOGISTICS;
    //   }
    // }
    const obj = {
      'marketplace_reference_id': this.config.marketplace_reference_id,
      'marketplace_user_id': this.config.marketplace_user_id,
      'user_id': this.config.marketplace_user_id,
      'category_id': this.catId
    };
    this.createProjectService.getTemplates(obj)
      .subscribe(
        response => {
          try {
            if (response.status === 200) {
              if (response.data && response.data.length && response.data[0].template && response.data[0].template.length) {
                this.noData = false;
                this.createProjectService.project_type = response.data[0].project_type;
                this.manuplateData(response.data);
              } else {
                this.noData = true;
              }
            } else {
              this.popup.showPopup(MessageType.ERROR, 2000, response.message, false);
            }
          } catch (e) {
            console.error(e);
          }
          this.loader.hide();
        },
        error => {
          console.error(error);
        }
      );
  }

  // =====================manuplation data=========================
  manuplateData(data) {

    this.formTemplatePages = [];
    const sortedData = data[0].template.concat().sort(this.sessionService.sortBy('group'));
    const lastGroupIndex = sortedData[sortedData.length - 1].group;

    for (let i = 0; i < lastGroupIndex; i++) {
      const templateGrouped = data[0].template.filter(function (o: any) { return o.group == i + 1; });
      this.formTemplatePages.push({
        show: false,
        template: templateGrouped
      });
    }
    this.formTemplatePages[0].show = true;
  }

  // =================get next status of any data =======================
  nextStatus(data) {
    if (data.index !== data.total) {
      this.formTemplatePages[data.index].show = true;

      for (let i = 0; i < this.formTemplatePages.length; i++) {
        if (i !== data.index) {
          this.formTemplatePages[i].show = false;
        }
      }
    }
    const jsonData = this.sessionService.get('fLData');
    if (jsonData && jsonData.length > data.index) {
      for (let j = 0; j < this.formTemplatePages[data.index].template.length; j++) {
        for (let k = 0; k < jsonData[data.index].fields.length; k++) {
          if (jsonData[data.index].fields[k].label === this.formTemplatePages[data.index].template[j].label) {
            if (this.formTemplatePages[data.index].template[j].data_type === 'Date' ||
            this.formTemplatePages[data.index].template[j].data_type === 'Date-Future' ||
              this.formTemplatePages[data.index].template[j].data_type === 'Date-Past' ||
              this.formTemplatePages[data.index].template[j].data_type === 'Date-Time' ||
              this.formTemplatePages[data.index].template[j].data_type === 'Time' ||
              this.formTemplatePages[data.index].template[j].data_type === 'Datetime-Future' ||
              this.formTemplatePages[data.index].template[j].data_type === 'Datetime-Past') {
              this.formTemplatePages[data.index].template[j].value = new Date(jsonData[data.index].fields[k].data);
            } else {
              this.formTemplatePages[data.index].template[j].value = jsonData[data.index].fields[k].data;
            }
          }
        }
      }
    }
  }
  // =================get next status of any data =======================
  backStatus(data) {

    let jsonData;
    let jsonDataFull;
    if (this.sessionService.get('fLData')) {
      jsonDataFull = this.sessionService.get('fLData');
      jsonData = this.sessionService.get('fLData')[data.index - 1];
      jsonDataFull.splice(data.index - 1, 1);
      this.sessionService.setString('fLData', jsonDataFull);
    }

    if (data.index !== data.total) {
      this.formTemplatePages[data.index - 1].show = true;

      for (let i = 0; i < this.formTemplatePages.length; i++) {
        if (i !== data.index - 1) {
          this.formTemplatePages[i].show = false;
        }
      }
      for (let j = 0; j < this.formTemplatePages[data.index - 1].template.length; j++) {
        for (let k = 0; k < jsonData.fields.length; k++) {
          if (jsonData.fields[k].label === this.formTemplatePages[data.index - 1].template[j].label) {
            if (this.formTemplatePages[data.index - 1].template[j].data_type === 'Date' ||
            this.formTemplatePages[data.index - 1].template[j].data_type === 'Date-Future' ||
              this.formTemplatePages[data.index - 1].template[j].data_type === 'Date-Past' ||
              this.formTemplatePages[data.index - 1].template[j].data_type === 'Date-Time' ||
              this.formTemplatePages[data.index - 1].template[j].data_type === 'Time' ||
              this.formTemplatePages[data.index - 1].template[j].data_type === 'Datetime-Future' ||
              this.formTemplatePages[data.index - 1].template[j].data_type === 'Datetime-Past') {
              this.formTemplatePages[data.index - 1].template[j].value = new Date(jsonData.fields[k].value);
            } else {
              this.formTemplatePages[data.index - 1].template[j].value = jsonData.fields[k].value;
            }
          }
        }
      }
    }
  }
}
