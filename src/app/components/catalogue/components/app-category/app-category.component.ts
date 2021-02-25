import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { SessionService } from '../../../../services/session.service';
import { AppCategoryService } from './app-category.service';
import { AppService } from '../../../../app.service';
import { GoogleAnalyticsEventsService } from '../../../../services/google-analytics-events.service';
import { GoogleAnalyticsEvent } from '../../../../enums/enum';

// import 'rxjs/Rx';
declare const $: any;

@Component({
  selector: 'app-category',
  templateUrl: './app-category.html',
  styleUrls: ['./app-category.scss']
})
export class AppCategoryComponent implements OnInit, OnDestroy {
  productData: any;
  isPlatformServer: boolean;
  @Input('categoryData') categoryData;
  @Input ('catBgColor') catBgColor;
  @Output() updateProduct: EventEmitter<any> = new EventEmitter<any>();
  @Output() showSearchProducts: EventEmitter<any> = new EventEmitter<any>();

  formSettings: any;
  private imgArray: Array<string>;

  private dataBool: boolean;
  private categoryForm: FormGroup;
  private currentCategory: string;
  public appConfig: any = {
    color: ''
  };
  private noOffering: boolean;
  private categoryList: any;
  private storeUnsubscribe: any;
  private allCategoryData: any;
  private loopData: {};
  private categoryId: string;
  private routeSubsriber: any;
  public terminology: any;
  public langJson: any;
  private selectedItem: any = {};
  public hideCategory = false;
  public languageSelected: any;
  public direction = 'ltr';
  constructor(protected route: ActivatedRoute, protected router: Router, protected sessionService: SessionService,
    public appCategoryService: AppCategoryService, public googleAnalyticsEventsService: GoogleAnalyticsEventsService,
    public appService: AppService) {
    this.currentCategory = '';

    this.formSettings = this.sessionService.get('config');
    if (this.formSettings.terminology) {
      this.terminology = this.formSettings.terminology;
    }
    this.currentCategory = this.formSettings.form_name;
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
  ngOnInit() {
    this.isPlatformServer = this.sessionService.isPlatformServer();
    if(this.categoryData[0].has_products || !this.categoryData[0].has_children){
      this.selectedItem = this.categoryData[0];
    }
    else{
      this.selectedItem = this.categoryData[0].sub_categories[0];
    }
    if(this.route.snapshot.queryParams['pordCat']){
      let deliveryIndex = this.categoryData.findIndex((o) => {
        return o.catalogue_id === Number(this.route.snapshot.queryParams['pordCat']);
      });
      if(deliveryIndex != -1)
       this.selectedItem = this.categoryData[deliveryIndex];
    }
    this.getOffering();
    this.appConfig = this.sessionService.get('config');

    this.imgArray = ['assets/img/thai.jpg', 'assets/img/indian.jpg', 'assets/img/chinese.jpg',
      'assets/img/italian.jpg', 'assets/img/mexican.jpg', 'assets/img/chinese.jpg', 'assets/img/italian.jpg',
      'assets/img/mexican.jpg', 'assets/img/italian.jpg', 'assets/img/mexican.jpg'];
    // ================language json manupilation======================
    this.appService.langPromise.then(()=>{
    this.langJson = this.appService.getLangJsonData();
    this.langJson['Search Product'] = this.langJson['Search Product'].replace('----', this.terminology.PRODUCT);
    });
  }
  selectedCategory(data,parentData) {
    // if(!this.isPlatformServer){
      // try {
        //const el = document.querySelector('.product-app');
        //el.scrollIntoView({ behavior: "smooth", block: "nearest"});
        // (document.getElementsByTagName('body')[0]).scrollTo({ top: 0, behavior: 'smooth' });
      // } catch (error) {
      //   (document.getElementsByTagName('body')[0]).scrollTop = 0;
      // }
    // }
    this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.category_click, data.name, '', '');
    if (this.selectedItem.catalogue_id !== data.catalogue_id) {
      this.selectedItem = data;
      this.showProduct(data,parentData);
    }

  }
  getParamsByRoute(data) {
    this.routeSubsriber = this.route.params.subscribe(params => {
      this.categoryId = params['id'];
      if (this.categoryId) {
        this.goToCategory();
      }
    });
  }
  getOffering() {
    let offering = this.sessionService.get('config');
    if (offering) {
      offering = offering['is_nlevel'];
    }
    this.noOffering = parseInt(offering) === 1 ? true : false;
  }
  getSubChildData(value) {
    const copyData = value.slice();
    const categoryObj: any = {};
    let finalArray = [];


    copyData.forEach((val, parentIndex) => {
      const catArray = [];
      val = val.slice(0);
      val.forEach(function (element, index) {
        if (element.parent_category_id) {
          const obj = {};
          obj[element.catalogue_id] = element;
          if (categoryObj[element.parent_category_id]) {
            element['layout_type'] = copyData[parentIndex][0].layout_type;
            if (element.has_children) {
              categoryObj[element.catalogue_id] = element;
            }
            if (categoryObj[element.parent_category_id].child) {
              if (!element.is_dummy) {
                categoryObj[element.parent_category_id].child.push(element);
              }
            } else {
              if (!element.is_dummy) {
                const localArray = [];
                localArray.push(element);
                categoryObj[element.parent_category_id].child = localArray;
              }
            }
          }
        } else {
          if (!element.is_dummy) {
            categoryObj[element.catalogue_id] = element;
            catArray.push(element);
          }
        }

      });
      if (catArray.length) {
        finalArray = catArray;
      }
    });

    this.categoryList = finalArray;
    this.loopData = finalArray;
    this.allCategoryData = JSON.parse(JSON.stringify(categoryObj));
    this.goToCategory();
  }

  selectCategory(id, parentId, index) {

    const categoryChildData = JSON.parse(JSON.stringify(this.allCategoryData[id]));
    const currentCatgoryData: any = {
      name: this.currentCategory,
      id: id,
      index: index,
      parentId: parentId,
      parent: false
    };
    if (!parentId) {
      currentCatgoryData.parent = true;
      delete currentCatgoryData.parentId;
    }

    if (categoryChildData && !categoryChildData.has_products && categoryChildData.has_children) {
      this.currentCategory = categoryChildData.layout_data.lines[0].data;

      if (categoryChildData.child[0].layout_type === 4) {
        currentCatgoryData.layout = true;
        this.goToProduct(currentCatgoryData, true, categoryChildData.child[0].catalogue_id);
      } else {
        this.loopData = categoryChildData.child;
        this.router.navigateByUrl('restaurants/' + id);

        // this.router.navigateByUrl('/pages/category/'+id);
      }
      this.sessionService.set('category', currentCatgoryData);
      // this.router.navigate(['/pages/category', id]);
      // this.router.navigateByUrl('/pages/category/' + id);

    } else {
      this.goToProduct(currentCatgoryData, parentId, id);
      // this.router.navigate(['/pages/products', id]);
    }

  }
  goToProduct(currentCatgoryData, bool, id) {
    if (!bool) {
      this.sessionService.set('category', currentCatgoryData);
    }
    // this.router.navigate(['/pages/products', id]);
    // this.router.navigate(['products', id]);

  }
  goToCategory() {
    const previousCategory: any = this.sessionService.get('category');
    /*if (previousCategory && previousCategory.parent) {
      this.selectParentData(previousCategory.index);
    } else if (previousCategory && !previousCategory.parent) {
      this.backToParent(previousCategory.parentId, previousCategory.id);
    }*/
    if (this.categoryId) {
      this.backToParent(this.categoryId);
    } else {
      this.selectParentData(0);
    }
  }

  selectParentData(index) {
    this.loopData = this.categoryList;
    this.currentCategory = this.formSettings.form_name;
  }
  backToParent(id) {
    const categoryChildData = JSON.parse(JSON.stringify(this.allCategoryData[id]));
    this.currentCategory = categoryChildData.layout_data.lines[0].data;

    if (!categoryChildData.parent_category_id) {
      const parentIndex = this.allCategoryData[id].parent_index;
      const currentCatgoryData: any = {
        name: this.currentCategory,
        id: id,
        index: parentIndex,
        parent: true
      };
      this.sessionService.set('category', currentCatgoryData);
    }
    this.loopData = categoryChildData.child;

  }
  showProduct(id, parentData) {
    this.updateProduct.emit({ data: id, parent_data: parentData });
  }

  closeOpenDivs() {
    $('.collapse.in').collapse('hide');
  }

  ngOnDestroy() {
  }
}
