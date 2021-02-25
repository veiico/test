import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DynamicTemplateDataType } from '../../constants/constant';
import { SessionService } from '../../services/session.service';

@Component({
    selector: 'app-show-order-additonal-info',
    templateUrl: './show-order-additional-info.component.html',
    styleUrls: ['./show-order-additional-info.component.scss']
})
export class ShowOrderAdditionalInfoComponent implements OnInit {
    languageStrings: any={};
    direction: string;
    @Input() additionalInformation;
    @Input() currency;
    templateDataType = DynamicTemplateDataType;
    imageArray;
    otherArray;
    multipleArray;
    singleArray;
    optionsArray;
    @Output() closeComponent: EventEmitter<boolean> = new EventEmitter<boolean>();
    constructor(public sessionService: SessionService) {
     }

    ngOnInit() {
        const currency = this.sessionService.get('config')['payment_settings'];
        if (currency && !this.currency) {
            this.currency = currency[0].symbol;
        }
        if (!this.additionalInformation) {
            this.additionalInformation = [];
        }
        this.processmultipleArray();
        this.sessionService.langStringsPromise.then(() =>
        {
         this.languageStrings = this.sessionService.languageStrings;
        });
    }

    /**
     * function to make options array
     *
     */
    protected processmultipleArray() {
        this.imageArray = [], this.otherArray = [], this.optionsArray = [];
        const single = [], multiple = [], deliveryTemplate = [];
        this.additionalInformation.forEach(item => {
            switch (item.data_type) {
                case this.templateDataType.IMAGE:
                    this.imageArray.push(item);
                    break;
                case this.templateDataType.SINGLE_SELECT:
                    const _itemSingle = this.mapArrays(item);
                    single.push(_itemSingle);
                    break;
                case this.templateDataType.SINGLE_SELECT_DELIVERY_TEMPLATE:
                    const _itemSingleDeliveryTemplate = this.mapArrays(item);
                    deliveryTemplate.push(_itemSingleDeliveryTemplate);
                    break;
                case this.templateDataType.MULTI_SELECT:
                    const _itemMultiple = this.mapArrays(item);
                    multiple.push(_itemMultiple);
                    break;
                case this.templateDataType.DOCUMENT:
                    this.imageArray.push(item);
                    break;
                default:
                    this.otherArray.push(item);
            }
        });
        this.optionsArray = [...single, ...multiple,...deliveryTemplate];
    }

    protected mapArrays(element) {
        let sel = [];
        if (element.value !== '' && typeof element.value === 'string') {
            sel = element.option.filter(ele => element.value === ele.text)
        } else if (element.value && element.value.length > 0) {
            element.value.forEach(obj => {
                sel.push(...element.option.filter(ele => ele.text === obj));
            });
        } else {
            sel = []
        }
        element.selected_values = sel;
        return element;
    }

    goToSummary() {
        this.closeComponent.next(true);
    }
}

