import { Pipe, PipeTransform } from '@angular/core';
import { NewsBot } from '../../interfaces/news-bot.interface';

@Pipe({
  name: 'sortNews',
  pure: false // Обновляется при изменении данных
})
export class SortNewsPipe implements PipeTransform {
  transform(items: NewsBot[], ascending: boolean = true): NewsBot[] {
    if (!items || !items.length) {
      return items;
    }

    return [...items].sort((a, b) => {
      const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
      return ascending ? dateA - dateB : dateB - dateA;
    });
  }
}