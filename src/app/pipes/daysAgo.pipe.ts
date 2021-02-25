/**
 * Created by cl-macmini-51 on 27/07/18.
 */
import { Pipe } from '@angular/core';

@Pipe({
  name: 'daysAgo'
})
export class DaysAgoPipe {
  transform(value: string): string {
    const current = new Date();
    const valueDate = new Date(value);
    let timeDiff = Math.abs(current.getTime() - valueDate.getTime());

    if (timeDiff >= 86400000) {
      let diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
      return diffDays + ' days ago';
    } else if (timeDiff >= 3600000 && timeDiff < 86400000) {
      let diffDays = Math.ceil(timeDiff / (1000 * 3600));
      return diffDays + ' hours ago';
    } else if (timeDiff >= 60000 && timeDiff < 3600000) {
      let diffDays = Math.ceil(timeDiff / (1000 * 60));
      return diffDays + ' minutes ago';
    } else if (timeDiff >= 1000 && timeDiff < 60000) {
      let diffDays = Math.ceil(timeDiff / (1000));
      return diffDays + ' seconds ago';
    }

  }
}
