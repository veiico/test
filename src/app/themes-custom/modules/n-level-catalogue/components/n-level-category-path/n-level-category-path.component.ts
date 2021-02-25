import { Component, OnInit, Input } from '@angular/core';

import { NLevelCategoryPathComponent } from '../../../../../modules/n-level-catalogue/components/n-level-category-path/n-level-category-path.component';
import { SessionService } from '../../../../../services/session.service';
import { CatalogueService } from '../../../../../components/catalogue/catalogue.service';
import { takeWhile } from 'rxjs/operators';


@Component({
    selector: 'app-n-level-category-path-dynamic',
    templateUrl: '../../../../../modules/n-level-catalogue/components/n-level-category-path/n-level-category-path.component.html',
    styleUrls: ['../../../../../modules/n-level-catalogue/components/n-level-category-path/n-level-category-path.component.scss']
})
export class DynamicNLevelCategoryPathComponent extends NLevelCategoryPathComponent implements OnInit {

    alive = true;
    constructor(public sessionService: SessionService, protected catalogueService: CatalogueService) {
        super(sessionService, catalogueService)
    }

    ngOnInit() {
        this.catalogueService.categoryData.pipe(takeWhile(_ => this.alive)).subscribe(response => {
            this.makeCategoryArray(response);
            this._categoryData = response;
        })
        super.ngOnInit();
    }
    ngOnDestroy() {
        this.alive = false;
    }
}

