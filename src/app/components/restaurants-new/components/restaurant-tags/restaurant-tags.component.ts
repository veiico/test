import { Component, OnInit, Input, OnDestroy, ElementRef } from '@angular/core';
import { ThemeService } from '../../../../services/theme.service';
import { SessionService } from '../../../../services/session.service';

@Component({
    selector: 'restaurant-tags',
    templateUrl: './restaurant-tags.component.html',
    styleUrls: ['./restaurant-tags.component.scss']
})
export class RestaurantTagsComponent implements OnInit, OnDestroy {

    formSettings: any;
    @Input('previewOn') previewOn;
    @Input('item') item;
    public _data: any;
    showClosedTag: any;
    showPreOrderTag: any;
    showSponsoredTag: any;
    get data() {
        return this._data;
    }
    @Input() set data(val: any) {
        if (val) {
            this._data = val;
            this.onPreview();
        }
    }
    tagsData;

    constructor(protected themeService: ThemeService, protected el: ElementRef,protected sessionService:SessionService) {

    }

    ngOnInit() {
        this.formSettings = this.sessionService.get('config');
    }

    onPreview() {
        this.tagsData = this._data;
        this.showPreOrderTag = (this.tagsData.preorder_tag && this.tagsData.preorder_tag.is_enabled);
        this.showClosedTag = (this.tagsData.closed_tag && this.tagsData.closed_tag.is_enabled);
        this.showSponsoredTag = (this.tagsData.sponsored_tag && this.tagsData.sponsored_tag.is_enabled);
        this.themeService.setNativeStyles(this.tagsData.closed_tag.styles, this.el);
        this.themeService.setNativeStyles(this.tagsData.preorder_tag.styles, this.el);
        this.themeService.setNativeStyles(this.tagsData.sponsored_tag.styles, this.el);
    }

    ngOnDestroy() {
        // this.alive = false;
    }
}
