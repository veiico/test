/**
 * Created by cl-macmini-51 on 19/07/18.
 */
import { Component, OnDestroy, OnInit, AfterViewInit, Input } from '@angular/core';

import { AppService } from '../../../../app.service';
import { SessionService } from '../../../../services/session.service';

@Component({
  selector: 'app-last-level-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})

export class LastLevelCategoriesComponent implements OnInit, OnDestroy, AfterViewInit {

  public config: any;
  public langJson: any;
  public terminology: any;
  public currency: string;
  public languageSelected: string;
  public direction: string;
  public result: boolean;

  @Input() categoryData: any;


  constructor(protected appService: AppService, protected sessionService: SessionService) {
    this.setConfig();
    this.setLanguage();
  }

  // ===================life cycles=====================
  ngOnInit() {

  }

  ngOnDestroy() {

  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.makeScrollOfCat();
    }, 3000);
  }

  // ===============set config for all====================
  setConfig() {
    this.config = this.sessionService.get('config');
    if (this.config) {
      this.config.borderColor = this.config['color'] || '#e13d36';
      this.terminology = this.config.terminology;
      this.currency = this.config['payment_settings'][0].symbol;
    }
  }

  // ===============set language and direction====================
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

  // ====================arrow function=====================
  makeScrollOfCat() {
    const view = document.getElementById('tslshow');
    const $item = document.querySelectorAll('div.spanImg'); // Cache your DOM selector
    let visible = 7; // Set the number of items that will be visible
    let index = 0; // Starting index
    let endIndex = ( $item.length / visible ) - 1; // End index
    let skipValue = 900;
    let clientWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    let rightArrow = document.getElementById('rightArrow');
    let leftArrow = document.getElementById('leftArrow');
    view.style.left = '0px';

    if (clientWidth > 800 && clientWidth < 950) {
      visible = 6;
      endIndex = ( $item.length / visible ) - 1;
      skipValue = 775;
    } else if (clientWidth > 700 && clientWidth < 799) {
      visible = 5;
      endIndex = ( $item.length / visible ) - 1;
      skipValue = 650;
    } else if (clientWidth > 600 && clientWidth < 699) {
      visible = 4;
      endIndex = ( $item.length / visible ) - 1;
      skipValue = 515;
    } else if (clientWidth > 400 && clientWidth < 599) {
      visible = 3;
      endIndex = ( $item.length / visible ) - 1;
      skipValue = 335;
    } else if (clientWidth > 300 && clientWidth < 399) {
      visible = 2;
      endIndex = ( $item.length / visible ) - 1;
      skipValue = 225;
    }


    if (endIndex < 0) {
      rightArrow.classList.add('inactive');
    }

    rightArrow.onclick = function(){
      if (index < endIndex ) {
        index++;
        // view.stop(false, true).animate({left: '-=' + skipValue}, { duration: 400});
        view.style.left = parseInt(view.style.left) - skipValue + 'px';
        // $item.animate({'left':'-=300px'});
      }

      if (index < endIndex) {
        rightArrow.classList.remove('inactive');
        leftArrow.classList.remove('inactive');
      } else {
        rightArrow.classList.add('inactive');
        leftArrow.classList.remove('inactive');
      }
    };

    leftArrow.onclick = function(){
      if (index > 0) {
        index--;
        // view.stop(false, true).animate({left: '+=' + skipValue}, { duration: 400});
        view.style.left = parseInt(view.style.left) + skipValue + 'px';
        // $item.animate({'left':'+=300px'});
      }
      if (index > 0) {
        leftArrow.classList.remove('inactive');
        rightArrow.classList.remove('inactive');
      } else {
        leftArrow.classList.add('inactive');
        rightArrow.classList.remove('inactive');
      }
    };
  }

  // ========================merahcant according to category==========================
  getMerchantProductAcc(cat, index) {
    const selectedArray = [];

    if (this.categoryData[index].selected) {
      this.categoryData[index].selected = false;
    } else {
      this.categoryData[index].selected = true;
    }

    for (let i = 0; i < this.categoryData.length; i++) {
      if (this.categoryData[i].selected) {
        selectedArray.push(this.categoryData[i].catalogue_id);
      }
    }
    if (selectedArray && selectedArray.length === 0) {
      selectedArray.push(this.sessionService.getString('catId'));
    }

    this.sessionService.setString('catIdChild', selectedArray);

    // send event to restaurant component

  }
}
