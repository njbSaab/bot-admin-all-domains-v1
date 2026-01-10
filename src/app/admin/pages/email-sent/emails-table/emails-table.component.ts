import { Component, Input } from '@angular/core';
import { EmailMessage } from '../../../../shared/services/users-emails.service';

@Component({
  selector: 'app-emails-table',
  templateUrl: './emails-table.component.html',
  styleUrls: ['./emails-table.component.scss']
})
export class EmailsTableComponent {
  private _emailMessages: EmailMessage[] = [];

  @Input() set emailMessages(value: EmailMessage[]) {
    this._emailMessages = value || [];
    this.sortMessages(); // Сортируем при получении данных
  }

  get emailMessages(): EmailMessage[] {
    return this._emailMessages;
  }

  sortBy: keyof EmailMessage | '' = 'sentAt'; // Начальная сортировка по дате
  ascending: boolean = false; // По убыванию (от нового к старому)

  // Метод для переключения сортировки
  toggleSort(field: keyof EmailMessage) {
    if (this.sortBy === field) {
      this.ascending = !this.ascending; // Меняем направление
    } else {
      this.sortBy = field;
      this.ascending = true; // Сбрасываем на возрастание
    }
    this.sortMessages();
  }

  // Метод сортировки
  private sortMessages() {
    if (!this.sortBy || !this._emailMessages.length) {
      this._emailMessages = [...this._emailMessages]; // Копируем массив
      return;
    }
  }
}