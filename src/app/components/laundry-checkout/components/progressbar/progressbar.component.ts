/**
 * Created by mba-214 on 23/10/18.
 */
import { Component, Input, ViewChild, OnInit, OnDestroy, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { SessionService } from '../../../../services/session.service';
import { AppService } from '../../../../app.service';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progressbar.component.html',
  styleUrls: ['./progressbar.component.scss']
})

export class ProgressBarComponent implements OnInit, OnDestroy, AfterViewInit {

  @Input() stepsArray: any;
  @Output() goToParticularStep: any =  new EventEmitter();
  public width: string;
  public languageSelected: string;
  public direction: string;
  public langJson: any;
  public formSettings: any;
  public terminology: any;
  @Input() activeStep:number;
  languageStrings: any = {};

  constructor(public sessionService: SessionService,
              public appService: AppService) {
  }


  ngOnInit() {
    this.sessionService.langStringsPromise.then(() =>
    {
     this.languageStrings = this.sessionService.languageStrings;
    });
    this.width = (100 / this.stepsArray.length).toFixed(2) + '%';
    this.setLang();
    this.setConfig();

  }

  ngOnDestroy() {

  }

  ngAfterViewInit() {

  }

  /**
   * set config
   */
  setConfig() {
    this.formSettings = this.sessionService.get('config');
    this.terminology = this.formSettings.terminology;
  }

  /**
   * set lang
   */
  setLang() {
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

  /**
   * got to step
   */
  goToStep(data, index) {
    if (data.complete ===  1 || data.active === 1) {
      this.goToParticularStep.emit(data);
    }
  }

  /**
   * go to prvious step
   * @param activeStep
   */
  goToPreviousStep(activeStep: number) {
    activeStep--;
    this.goToStep(this.stepsArray[activeStep -1], activeStep-1)
  }

}
