import { Pipe, PipeTransform } from '@angular/core';
import { MenuPost } from '../../interfaces/menu-post.interface';

@Pipe({
  name: 'filterByParentMenuId'
})
export class FilterByParentMenuIdPipe implements PipeTransform {
  transform(posts: MenuPost[], parentMenuId: number | null): MenuPost[] {
    if (!posts) {
      return [];
    }
    // Если фильтр не указан, возвращаем все посты
    if (parentMenuId === null) {
      return posts;
    }
    // Если выбран фильтр 3, показываем посты, у которых parent_menu.id равен 4 или 5
    if (parentMenuId === 3) {
      return posts.filter(post => post.parent_menu && (post.parent_menu.id === 4 || post.parent_menu.id === 5));
    }
    // Для остальных вариантов фильтруем по точному совпадению
    return posts.filter(post => post.parent_menu && post.parent_menu.id === parentMenuId);
  }
}