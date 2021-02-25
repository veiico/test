import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pathBreadcrumb'
})
export class PathBreadcrumbPipe implements PipeTransform {

  transform(data: any[], args?: any): any {
    if (data && data.length) {
      return data.map(el => ({ label: el.name }));
    }
    return [];
  }

}
