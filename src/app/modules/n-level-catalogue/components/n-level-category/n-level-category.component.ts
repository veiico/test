import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { SessionService } from '../../../../services/session.service';
import { NLevelCategoryData } from '../../interface/n-level-category.interface';

@Component({
    selector: 'app-n-level-category',
    templateUrl: './n-level-category.component.html',
    styleUrls: ['./n-level-category.component.scss']
})
export class NLevelCategoryComponent implements OnInit {
    @Input() categoryData: any
    @Output() categorySelected: EventEmitter<any> = new EventEmitter<any>();
    @Input() categoryDepthLimit: number;
    constructor(public sessionService: SessionService) { }

    ngOnInit() {
    }
    /**
     * seclect category event
     */
    selectCategory(data) {
        const obj: NLevelCategoryData = {
            catalogue_id: data.catalogue_id,
            has_products: data.has_products,
            has_children: data.has_children,
            name: data.name,
            parent_category_id: data.parent_category_id,
            depth: data.depth
        }
        this.categorySelected.emit(obj);
    }
}

