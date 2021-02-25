/**
 * Created by cl-macmini-51 on 25/05/18.
 */
import { Pipe } from '@angular/core';

@Pipe({
  name: 'truncate'
})
export class TruncatePipe {
  transform(value: string, args: number): string {
    const limit = args > 0 ? args : 10;
    const trail = args < value.length ? '...' : '';
    return value.length > limit ? value.substring(0, limit) + trail : value;
  }
}
