import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'Sanitize'
})
export class Sanitize implements PipeTransform {

  constructor(private domSanitizer: DomSanitizer) { }

  transform(value: any, args?: any): any {
    
    switch (args) {

      case 'HTML':
        return this.domSanitizer.bypassSecurityTrustHtml(value);
      default:
        return this.domSanitizer.bypassSecurityTrustHtml(value);
    }

  }

}