/**
 * Created by cl-macmini-51 on 28/09/18.
 */
import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'search'
})
export class SearchFilterPipe implements PipeTransform {
  transform(items: any[], searchText: string): any[] {
    if(!items) return [];
    if(!searchText) return items;
    searchText = searchText.toLowerCase();
    return items.filter( it => {
      if (it.label.toLowerCase().includes(searchText) || it.address.toLowerCase().includes(searchText) || it.flat_no.toLowerCase().includes(searchText) || it.landmark.toLowerCase().includes(searchText)) {
        return true;
      }
    });
  }
}
