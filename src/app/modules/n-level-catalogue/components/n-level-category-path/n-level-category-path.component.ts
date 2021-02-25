import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SessionService } from '../../../../services/session.service';
import { NLevelCategoryData } from '../../interface/n-level-category.interface';
import { CatalogueService } from '../../../../components/catalogue/catalogue.service';

@Component({
    selector: 'app-n-level-category-path',
    templateUrl: './n-level-category-path.component.html',
    styleUrls: ['./n-level-category-path.component.scss']
})
export class NLevelCategoryPathComponent implements OnInit {
    categoryPathArray: any[] = [];
    @Input() depthLimit: number;
    @Input() depthAllCategory: number;
    @Input() allCategoryName: string;
    public _categoryData;
    get categoryData() { return this._categoryData };
    @Input() set categoryData(val: any) {
        this.makeCategoryArray(val);
        this._categoryData = val;
    };
    @Output() categorySelected: EventEmitter<NLevelCategoryData> = new EventEmitter<NLevelCategoryData>();
    constructor(public sessionService: SessionService,protected catalogueService:CatalogueService) { }

    ngOnInit() {

    }

    /**
     * make category array
     */
    makeCategoryArray(data) {
      let prodParmUrl = new URLSearchParams(window.location.search);
      let prodCat = prodParmUrl.get('prodname');

        if(prodCat && this.sessionService.get('config') && this.sessionService.get('config').is_product_share_enabled){
          this.categoryPathArray = data
        }
        else{
            if (!data.parent_category_id) {
              this.makeDefaultArray();
              this.categoryPathArray.push(data);
          } else {
              let ind = this.categoryPathArray.findIndex((res) => res.catalogue_id === data.parent_category_id);
              if (ind !== -1) {
                  if (this.categoryPathArray.length > ind + 1) {
                      this.categoryPathArray.splice(ind + 1, (this.categoryPathArray.length - 1) - ind);
                  }
              }
              this.categoryPathArray.push(data);
          }
        }
    }

    /**
     * select category from breadcrumb
     */
    selectCategory(data: any, index: number) {
        if (data.depth <= this.depthLimit) {
            return;
        }
        if (!index) {
            this.categoryPathArray = [];
        } else {
            this.categoryPathArray.splice(index, (this.categoryPathArray.length - 1) - index);
        }
        console.log('data-data-data',data);

        const obj: NLevelCategoryData = {
            catalogue_id: data.catalogue_id,
            has_products: data.has_products || 0,
            has_children: data.has_children || 0,
            name: data.name,
            parent_category_id: data.parent_category_id ? Number(data.parent_category_id) : undefined,
            depth: data.depth || 1
        }
        this.categorySelected.emit(obj);
    }

    /**
     * make default array
     */
    makeDefaultArray() {
        this.categoryPathArray = [];
        this.categoryPathArray.push(
            { name: (this.allCategoryName || 'All'), catalogue_id: null, parent_category_id: null, depth: this.depthAllCategory + 1 }
        )
    }


}

