import { Directive, Input, ElementRef, HostListener } from '@angular/core';
import * as $ from 'jquery';

@Directive({
    selector: '[appTapEffect]',
    // host: {
    //     '(click)': 'onClick($event)',
    // }
})
export class TapEffectDirective {

    @Input('ripplecolor') ripplecolor: string;
    @Input('rippleContainer') rippleContainer: string;
    constructor(private el: ElementRef) {

    }
  @HostListener('click', ['$event']) onClick(event: any) {
        const element = this.el.nativeElement;
        const $div = document.createElement('div');

        if ( this.ripplecolor ) {
            $div.style.backgroundColor = this.ripplecolor;
        }

        if ( this.rippleContainer && this.rippleContainer === 'circle' ) {

            $div.classList.add('cripple-effect');
            // $div.style.height = '5px';
            // $div.style.width = '5px';
            $div.style.left = (element.clientWidth / 2 - (2.5)) + 'px';
            $div.style.top = (element.clientHeight / 2 - 2.5) + 'px';
            $div.style.borderRadius = '50%';
            element.appendChild($div);
        } else {
            $div.classList.add('ripple-effect');

            if ( element.clientWidth > 50 && element.clientHeight > 50) {
                $div.style.left = (element.clientWidth / 2 - 25) + 'px';
                $div.style.top = (element.clientHeight - 25) + 'px';
                element.appendChild($div);
            } else {
                $div.style.height = '10px';
                $div.style.width = '10px';
                $div.style.left = (element.clientWidth / 2 - 5) + 'px';
                $div.style.top = (element.clientHeight - 5) + 'px';
                element.appendChild($div);
                // $div.style.left = (element.clientWidth / 2) + 'px';
                // $div.style.top = (element.clientHeight / 2) + 'px';
            }
        }
        setTimeout(() => $div.remove(), 1000);
    }
}
