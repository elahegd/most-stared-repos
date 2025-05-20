import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'DaysAgo',
  standalone: true
})
export class DaysAgoPipe implements PipeTransform {
  transform(value: string | Date): string {
    const now = new Date();
    const date = new Date(value);
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    const intervals: { [key: string]: number } = {
      day: 86400,
      hour: 3600,
      minute: 60,
      second: 1,
    };

    for (const key in intervals) {
      const interval = Math.floor(seconds / intervals[key]);
      if (interval >= 1) {
        return `${interval} ${key}${interval > 1 ? 's' : ''} ago`;
      }
    }

    return 'just now';
  }
}