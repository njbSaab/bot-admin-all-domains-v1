import { Component, Input } from '@angular/core';

export interface TableColumn {
  header: string;
  key: string;                    // ключ свойства в объекте
  pipe?: 'date';                  // опционально: применить date pipe
  pipeFormat?: string;            // формат для date pipe
  class?: string;                 // дополнительный класс для td
}

@Component({
  selector: 'app-users-table',
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.scss']
})
export class UsersTableComponent {
  @Input() users: any[] = [];
  @Input() columns: TableColumn[] = [];
  @Input() title: string = '';
  @Input() totalCount: number = 0;
  @Input() extraContent: boolean = false; // например, select для фильтра сайта
}