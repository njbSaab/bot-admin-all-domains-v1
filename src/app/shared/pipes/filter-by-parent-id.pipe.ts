import { Pipe, PipeTransform } from '@angular/core';
import { MenuTable } from '../../interfaces/menu-table.interface';

@Pipe({
  name: 'filterByParentId'
})
export class FilterByParentIdPipe implements PipeTransform {
  transform(menuTables: MenuTable[], parentId: number | null): MenuTable[] {
    return menuTables.filter(table => table.parentId === parentId);
  }
}