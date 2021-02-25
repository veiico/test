import { Directive, Input, ElementRef, Renderer2, OnInit, HostListener } from '@angular/core';

@Directive({
    selector: '[appBs]'
    // host: {
    //    '(mouseenter)': 'onHover()',
    //    '(mouseleave)': 'onBlur()',
    // }
})
export class BoxShadowDirective {
   constructor(private el: ElementRef, private renderer: Renderer2) {

    }
  @HostListener('mouseenter') onMouseEnter() {
        this.renderer.setStyle(this.el.nativeElement, 'boxShadow', '0 3px 6px 0 rgba(0,0,0,.3)');
    }
  @HostListener('mouseleave') onMouseLeave() {
        this.renderer.removeStyle(this.el.nativeElement, 'boxShadow');

    }
}
