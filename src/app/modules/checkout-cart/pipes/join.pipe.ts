import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'join'
})
export class JoinPipe implements PipeTransform {

  transform(value: any[], joinUsing: string = ',', key: string = null, ): any {
    if (!key) {
      return value.join(joinUsing);
    }
    else {
      return value.map(e => e[key]).join(joinUsing);
    }
  }

}
