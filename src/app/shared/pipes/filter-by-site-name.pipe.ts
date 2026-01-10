import { Pipe, PipeTransform } from '@angular/core';
import { SiteUsers } from '../../interfaces/users.interface';

@Pipe({
  name: 'filterBySiteName'
})
export class FilterBySiteNamePipe implements PipeTransform {
  transform(users: SiteUsers[], siteName: string | null): SiteUsers[] {
    if (!users) {
      return [];
    }
    // Если фильтр не выбран, возвращаем всех пользователей
    if (siteName === null) {
      return users;
    }
    // Фильтруем по site_name
    return users.filter(user => user.site_name === siteName);
  }
}