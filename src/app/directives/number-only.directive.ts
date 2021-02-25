import { Directive, Input, ElementRef, Renderer2, Output, EventEmitter, HostListener } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Directive({
    selector: '[appNumberOnly]',
    // host: {
        // '(keydown)': 'checkNumber($event)',
        // '(click)': 'selectedContent($event)',
        // '(keyup)': 'cardStatus($event)'
    // }

})
export class NumberOnlyDirective {
    @Input('limit') limit: number;
    @Input('control') control: AbstractControl;
    @Input('focusId') focusId: string;
    @Input('blurId') blurId: string;
    @Input('allowedEnter') allowedEnter: string;
    @Input('backId') backId: string;
    @Input('card') card: string;
    @Output() update: EventEmitter<string> = new EventEmitter<string>();
    constructor(private el: ElementRef, private renderer: Renderer2) {

    }
  @HostListener('keyup', ['$event']) onKeyUp() {
        if (this.card) {
            const length = this.el.nativeElement.value.length;
            const string = this.el.nativeElement.value.substring(0, 2);
            if (this.el.nativeElement.value.length === 3) {
              this.el.nativeElement.value = string + ' / ' + this.el.nativeElement.value.substring(2, this.el.nativeElement.value.length);
            } else if (this.el.nativeElement.value.length < 6 && this.el.nativeElement.value.length > 2) {
              this.el.nativeElement.value = string;
            }
        }
    }
    @HostListener('keydown', ['$event']) onKeyDown(event) {
        if (event.key !== 'Enter') {
            if (this.limit && Number(this.limit) < 2) {
                if (event.key === 'Backspace' || event.key === 'Tab') {
                    if (event.key === 'Backspace' && this.backId && !event.currentTarget.value) {
                        document.getElementById(this.backId).focus();
                    }
                    return;
                } else if (this.validateNumber(event.key)) {
                    this.el.nativeElement.value = event.key;
                    if (this.control) {
                      this.control.setValue(event.key);
                    }
                    if (this.focusId) {
                      this.focus();
                    }
                    if (this.blurId) {
                      this.blur();
                    }
                    event.preventDefault();
                } else {
                  event.preventDefault();
                }
            } else if (!this.validateNumber(event.key) && event.key !== 'Backspace' && event.key !== 'Tab') {
              event.preventDefault();
            } else {
              this.el.nativeElement.value = event.currentTarget.value;
            }
        }
        if (this.allowedEnter && event.key === 'Enter') {
          this.update.emit();
        }
        if (event.code === 'Space') {
          event.preventDefault();
        }
    }
    validateNumber(value) {
        const regexp = /^[0-9 ]*$/;
        if (regexp.test(value)) {
          return true;
        } else {
          return false;
        }
    }
   @HostListener('click', ['$event']) onClick(event) {
        event.currentTarget.select();
    }
    focus() {
        const element = document.getElementById(this.focusId);
        element.focus();

    }
    blur() {
        const element = document.getElementById(this.blurId);
        element.blur();
    }
}
