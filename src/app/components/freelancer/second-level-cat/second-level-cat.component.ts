/**
 * Created by cl-macmini-51 on 24/07/18.
 */
import { Component, OnDestroy, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

import { SessionService } from '../../../services/session.service';
import { AppService } from '../../../app.service';
import { LoaderService } from '../../../services/loader.service';
import { CategoryService } from '../services/category.service';

@Component({
  selector: 'app-second-level-cat-home',
  templateUrl: './second-level-cat.component.html',
  styleUrls: ['./second-level-cat.component.scss'],

})
export class FreelancerSecondLevelCatComponent implements OnInit, OnDestroy, AfterViewInit {
  public config: any;
  public langJson: any;
  public languageSelected: any;
  public direction = 'ltr';
  public terminology: any;
  public catId: any;
  public categories: any;
  // public categoriesFull: any;
  public breadCrumb = [];
  catName: string;
  languageStrings: any={};

  constructor(private sessionService: SessionService, private router: Router, private appService: AppService,
    public loader: LoaderService, private route: ActivatedRoute,
    private categoryService: CategoryService) {
    this.setConfig();
    this.setLanguage();

    this.catId = parseInt(this.route.snapshot.params['id']);
    this.catName = this.route.snapshot.queryParams['name'];
  }

  // ======================life cycle====================
  ngOnInit() {
    this.sessionService.langStringsPromise.then(() =>
    {
     this.languageStrings = this.sessionService.languageStrings;
    });
  }
  ngAfterViewInit() {
    this.getCategoriesAll();
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
    this.langJson = this.appService.getLangJsonData();
  }


  // ====================get catalogue for all merchants========================
  async getCategoriesAll() {

    try {
      if (this.categoryService.lastActiveBreadcumb && this.categoryService.lastActiveBreadcumb.length) {
        this.breadCrumb = this.categoryService.lastActiveBreadcumb;
        this.categories = await this.categoryService.fetchCategorybyParentId(this.breadCrumb[this.breadCrumb.length - 1].id);
      } else {
        this.categories = await this.categoryService.fetchCategorybyParentId(this.catId);
        this.breadCrumb.push({
          name: this.catName || '..',
          id: this.catId,
        });
      }
    } catch (e) {
      console.error(e);
    }





  }

  // ==================get category list=====================
  async getSubCat(cat, index) {
    if (cat.has_children && cat.has_active_children) {
      try {
        this.categories = await this.categoryService.fetchCategorybyParentId(cat.catalogue_id);
        this.breadCrumb.push({
          name: cat.name,
          id: cat.catalogue_id,
        });
      } catch (e) {
        console.error(e);
      }
    } else {
      this.categoryService.lastActiveBreadcumb = this.breadCrumb;
      this.sessionService.set('categoryPath', [...this.breadCrumb, {
        name: cat.name, id: cat.catalogue_id
      }]);
      this.router.navigate(['create-project', cat.catalogue_id]);
    }
  }

  // ===================get bread crumbs====================
  async getBreadCrumb(data, index) {
    if (index === 0) {
      this.breadCrumb = [];
      this.router.navigate(['/']);//freelancer
    } else {
      this.breadCrumb.splice(index);
      // let stringOfChildren = [];
      // for (let i = 0; i < index; i++) {
      //   if (i === 0) {
      //     // stringOfChildren = this.categoriesFull[this.breadCrumb[i].indexG];
      //     stringOfChildren = this.categoriesFull;
      //   } else {
      //     stringOfChildren = stringOfChildren['sub_categories'][this.breadCrumb[i].indexG];
      //   }
      // }
      // this.categories = stringOfChildren['sub_categories'];

      try {
        this.categories = await this.categoryService.fetchCategorybyParentId(this.breadCrumb[this.breadCrumb.length - 1].id);
      } catch (e) {
        console.error(e);
      }
    }
  }

}
