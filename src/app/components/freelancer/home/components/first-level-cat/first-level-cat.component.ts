/**
 * Created by cl-macmini-51 on 24/07/18.
 */
import { Component, OnDestroy, OnInit, AfterViewInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { SessionService } from '../../../../../services/session.service';
import { AppService } from '../../../../../app.service';
import { CategoryService } from '../../../services/category.service';

@Component({
  selector: 'app-first-level-cat',
  templateUrl: './first-level-cat.component.html',
  styleUrls: ['./first-level-cat.component.scss'],

})
export class FirstLevelCatComponent implements OnInit, OnDestroy, AfterViewInit {
  public config: any;
  public langJson: any;
  public languageSelected: any;
  public direction = 'ltr';
  public terminology: any;

  @Input() categoryList: any;

  constructor(private sessionService: SessionService, private router: Router,
    private appService: AppService, private categoryService: CategoryService) {
    this.setConfig();
    this.setLanguage();
  }

  // ======================life cycle====================
  ngOnInit() {

  }
  ngAfterViewInit() {

  }
  ngOnDestroy() {

  }

  // ======================set config====================
  setConfig() {
    this.config = this.sessionService.get('config');
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

  // ==================goto second level=====================

  goToSecondLevel(cat, index) {
    if (cat.has_children && cat.has_active_children) {
      this.categoryService.lastActiveBreadcumb = undefined;
      this.router.navigate(['categories', cat.catalogue_id], {queryParams: {name: cat.name}}); //freelancer
    } else {
      this.sessionService.set('categoryPath', [{
        name:  cat.name,
        id: cat.catalogue_id,
      }]);
      this.router.navigate(['create-project', cat.catalogue_id]); // create-project //freelancer
    }
  }

}
