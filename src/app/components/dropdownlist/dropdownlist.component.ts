import { Component, Input, Output, ElementRef, EventEmitter, OnInit, AfterViewInit } from '@angular/core';
import { DropDownListService } from './dropdownlist.service';

@Component({
    selector: 'app-drop-down-list',
    template: `<div class="parentdrop">
                    <div class="select-cc" (click)="showChild($event)"><span class="filter-option pull-left">
                    <span>{{countryCode}}</span></span>&nbsp;<span class="caret"></span></div>
                    <div class="cc-child" [hidden]="childStatus">
                        <div *ngFor='let item of list;let i = index;' style="padding: 5px;"
                        (click)="changeValue(item,i)" [class.selected]="selectedChild == i">
                        <span>{{item}}</span>
                        </div>
                    </div>
                </div>`,
    styleUrls: ['./dropdownlist.scss']
})
export class DropDownListComponent implements OnInit, AfterViewInit {
    @Input() list: any;
    @Input() childStatus: boolean;
    @Output() updateValue: EventEmitter<string> = new EventEmitter<string>();
    countryCode: string;
    element: Element;

    selectedChild: number;
    constructor(private dropdown: DropDownListService, private el: ElementRef) {
        this.countryCode = '+91';
        this.selectedChild = 40;
    }
    ngOnInit() {
        this.dropdown.currentStatus.subscribe(code => {
            if (code) {
                this.countryCode = code;
            }
            this.childStatus = true;
        });
    }
    ngAfterViewInit() {
        this.childStatus = true;
    }
    changeValue(countryCode: string, index: number) {
        this.countryCode = countryCode;
        this.childStatus = true;
        this.selectedChild = index;
        this.updateValue.emit(countryCode);
    }
    showChild(event: any) {
        event.stopPropagation();
        this.childStatus = !this.childStatus;
        if (!this.childStatus) {
            setTimeout(() => this.setScroll(), 0);
        }
    }
    setCountryCode(countryCode, index) {
        this.countryCode = countryCode;
        this.selectedChild = index;
    }
    setScroll() {
        const countryCode = Number(this.countryCode.split('+')[1]);
        const index = this.list.indexOf(countryCode);
        this.selectedChild = index;
        const element = document.getElementsByClassName('cc-child')[0];
        const child: any = element.children[this.selectedChild];
        const scroll = child.offsetTop;
        element.scrollTop = scroll;

    }

}
