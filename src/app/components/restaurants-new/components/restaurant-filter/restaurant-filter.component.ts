import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { DynamicTemplateDataType } from '../../../../constants/constant';
import { MessageService } from '../../../../services/message.service';
import { SessionService } from '../../../../services/session.service';
import { RestaurantFilterService } from './restaurant-filter.service';
import { takeWhile } from 'rxjs/operators';
import { AppService } from '../../../../app.service';

@Component({
    selector: 'app-restaurant-filter',
    templateUrl: './restaurant-filter.component.html',
    styleUrls: ['./restaurant-filter.component.scss'],
})
export class RestaurantFilterComponent implements OnInit {

    public config: any;
    public SpecificCategoryfilterGroups = [];
    public defaultFilters = [];
    public specificFilters = [];
    public dynamicTemplateDataType = DynamicTemplateDataType;
    public filterForm: FormGroup;
    public enableClearFilter = false;
    public appliedFilters = [];
    public deselectRadio;
    public alive: boolean = true;
    public filterEnabled:boolean;
    langJson: any;
    languageStrings: any={};

    constructor(protected sessionService: SessionService,
        protected messageService: MessageService, protected restaurantFilterService: RestaurantFilterService, public appService: AppService,
        protected formBuilder: FormBuilder) {
        this.config = this.sessionService.get('config');
    }
    ngOnInit() {
        this.initEvents();
            this.sessionService.langStringsPromise.then(() =>
            {
             this.languageStrings = this.sessionService.languageStrings;
            });
    }

    /**init all events */
     initEvents() {
        this.initFilterForm();
        this.getDefaultFilters();
        const businessId = this.sessionService.get('bId');
        if (businessId) {
            this.getSpecificFilters(businessId);
        }
        this.messageService.sendBusinessCategoryId.pipe(takeWhile(_ => this.alive)).subscribe(response => {
            this.resetSpecificFilters();
            this.setFilters();
            if (response.id) {
                this.getSpecificFilters(response.id);
            }
        });
    }

    /**
     * function to get default filters
     */

    getDefaultFilters() {
        const obj = {
            'marketplace_user_id': this.config.marketplace_user_id,
        };
        this.restaurantFilterService.getFilters(obj).subscribe((response) => {
            if (response.status === 200) {
                this.defaultFilters = response.data.result;
                this.messageService.merchantFilterEnabled = Boolean(response.data.is_filters_enabled);
                this.filterEnabled = Boolean(response.data.is_filters_enabled);
                if (response.data.is_filters_enabled) {
                    this.messageService.showFilterIcon.next(true);
                } else {
                    this.messageService.showFilterIcon.next(false);
                }
                this.initDefaultFilter();
            }
        });
    }

    /**
     * function to get specific filters
     */

    getSpecificFilters(business_category_id) {
        const obj = {
            business_category_id,
            'marketplace_user_id': this.config.marketplace_user_id
        };
        this.restaurantFilterService.getFilters(obj).subscribe((response) => {
            this.specificFilters = response.data.result;
            this.initSpecificFilters();
        });
    }

    /**
     * function to init filter form;
     */
    initFilterForm() {
        this.filterForm = this.formBuilder.group({
            defaultFilters: this.formBuilder.array([]),
            specificFilters: this.formBuilder.array([]),
        });

    }

    /**
     * function to init default filter
     */
    initDefaultFilter() {
        this.defaultFilters.forEach((element) => {
            (this.filterForm.controls.defaultFilters as FormArray).push(this.createFilterField(element));
        });
    }

    /**
     * function to init specific filter;
     */
    initSpecificFilters() {
        this.resetSpecificFilters();
        this.specificFilters.forEach((element) => {
            (this.filterForm.controls.specificFilters as FormArray).push(this.createFilterField(element));
        });
    }

    /**
     * functo return created form froup of filter groups
     */
    createFilterField(data) {
        return this.formBuilder.group({
            label: [data.label],
            display_name: [data.display_name],
            allowed_values: [data.allowed_values],
            value: [data.value],
            data_type: [data.data_type],
            business_category_id: [data.business_category_id || null],
            selected_values: []
        });
    }

    /**
     * function to reset specific filters
     */
    resetSpecificFilters() {
        (this.filterForm.controls.specificFilters as FormArray).controls = [];
    }

    /**
     * function to reset specific filters
     */
    resetDeafultFilters() {
        (this.filterForm.controls.defaultFilters as FormArray).controls = [];
    }


    /**
     * function to create data map array
     * @param data form control name
     */
    createdMapArray(data): Array<any> {
        const mapData = (this.filterForm.controls[data] as FormArray).controls.map((element) => {
            if (element.value.data_type === this.dynamicTemplateDataType.MULTI_SELECT) {
                if (element.value.selected_values && element.value.selected_values.length > 0) {
                    const key = element.value.label;
                    const value = element.value.selected_values;
                    return { [key]: value };
                }

            }
            if (element.value.data_type === this.dynamicTemplateDataType.SINGLE_SELECT) {
                if (typeof element.value.selected_values === 'string') {
                    const key2 = element.value.label;
                    const value2 = element.value.selected_values;
                    return { [key2]: [value2] };
                }
            }
        });
        return mapData;
    }

    /**
     * function to filter array
     * @param data formcntrol name
     */
    filterArray(data) {
        const filerData = this.createdMapArray(data).filter(element => element !== undefined);
        return filerData;
    }

    /**
     * function to set filters
     */
    setFilters() {
        const appliedFilters = this.getApplidFilters();

        const obj = {
            event_type: (appliedFilters.length) ? 1 : 0,
            data: appliedFilters
        };
        if(this.filterEnabled){
            this.messageService.applyFilters(obj);
        }
    }

    private getApplidFilters() {
        let defaultFilters = [];
        let specificFilters = [];
        if (this.defaultFilters.length) {
            defaultFilters = this.filterArray('defaultFilters');
        }
        if (this.specificFilters.length) {
            specificFilters = this.filterArray('specificFilters');
        } 
        const appliedFilters = [...defaultFilters, ...specificFilters];
        this.appliedFilters = appliedFilters;
        return appliedFilters;
    }

    /**
     * function to clear all filters
     */

    clearFilters() {
        (this.filterForm.controls.defaultFilters as FormArray).controls.forEach((element: FormGroup) => {
            element.controls.selected_values.setValue([]);
        });
        (this.filterForm.controls.specificFilters as FormArray).controls.forEach((element: FormGroup) => {
            element.controls.selected_values.setValue([]);
        });
        this.appliedFilters = [];
        const obj = {
            event_type: 0,
            data: []
        };
        if(this.filterEnabled){
            this.messageService.applyFilters(obj);
        }
        this.checkForEnableClearFilter();
    }
    /**
     * function on closing the component
     */

    closeComponent() {
        const obj = {
            event_type: 2,
            data: []
        };

        if (this.appliedFilters && this.appliedFilters.length === 0) {
            (this.filterForm.controls.defaultFilters as FormArray).controls.forEach((element: FormGroup) => {
                element.controls.selected_values.setValue([]);
            });
            (this.filterForm.controls.specificFilters as FormArray).controls.forEach((element: FormGroup) => {
                element.controls.selected_values.setValue([]);
            });
        }
        if(this.filterEnabled){
            this.messageService.applyFilters(obj);
        }
        this.checkForEnableClearFilter();
    }
    /**
     * check for enable clear btn
     */

    checkForEnableClearFilter() {
        let defaultFilters = [];
        let specificFilters = [] ;
        if (this.defaultFilters.length) {
            defaultFilters = this.filterArray('defaultFilters');
        }
        if (this.specificFilters.length) {
            specificFilters = this.filterArray('specificFilters');
        }
        const appliedFilters = [...defaultFilters, ...specificFilters].filter((element) => element);

        if (appliedFilters.length > 0) {
            this.enableClearFilter = true;
        } else {
            this.enableClearFilter = false;
        }
    }

    /**
     * function to clear selected filter
     */
    clearSelectedFilter(formControl: FormControl) {
        formControl['controls'].selected_values.setValue([]);
        this.checkForEnableClearFilter();
    }

    ngOnDestroy() {
        this.alive = false;
      }
}




