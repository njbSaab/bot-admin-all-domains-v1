import { Pipe, PipeTransform } from '@angular/core';
import { EmailMessage } from '../services/users-emails.service'; // Путь к вашему интерфейсу

@Pipe({
  name: 'sort',
  pure: false // Устанавливаем pure: false, чтобы пайп обновлялся при изменении данных
})
export class SortPipe implements PipeTransform {
  transform(
    items: EmailMessage[],
    sortBy: keyof EmailMessage | '',
    ascending: boolean = true
  ): EmailMessage[] {
    if (!items || !sortBy) {
      return items;
    }

    return [...items].sort((a, b) => {
      let valueA = a[sortBy];
      let valueB = b[sortBy];

      // Обработка отсутствующих значений (например, email или sentAt)
      if (valueA === undefined || valueA === null) valueA = '';
      if (valueB === undefined || valueB === null) valueB = '';

      // Сравнение дат
      if (sortBy === 'sentAt') {
        const dateA = valueA ? new Date(valueA as string).getTime() : 0;
        const dateB = valueB ? new Date(valueB as string).getTime() : 0;
        return ascending ? dateA - dateB : dateB - dateA;
      }

      // Сравнение строк (email, subject, header)
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return ascending
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }

      return 0; // Если значения не сравнимы, оставляем как есть
    });
  }
}