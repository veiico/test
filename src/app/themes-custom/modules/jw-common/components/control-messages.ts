import { Component, Input, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';

import { ValidationService } from '../../../../services/validation.service';

@Component({
    template: `<div *ngIf="errorMessage !== null" style="color: red" class="errorR">{{errorMessage}}</div>`,
    encapsulation: ViewEncapsulation.Emulated
})
export class DynamicControlMessagesComponent {
    @Input() control: FormControl;
    constructor(public ValidationService: ValidationService) { }
    get errorMessage() {
        if (this.control) {
            for (const propertyName in this.control.errors) {
                if (this.control.errors.hasOwnProperty(propertyName) && this.control.touched && this.control.dirty) {
                    return this.ValidationService.getValidatorErrorMessage(propertyName, this.control.errors[propertyName]);
                }
            }

        }
        return null;
    }
}
