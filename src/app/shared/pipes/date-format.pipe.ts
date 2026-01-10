import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFormat'
})
export class DateFormatPipe implements PipeTransform {
  transform(value: string | Date | undefined): string {
    // Проверяем, есть ли значение и является ли оно допустимым
    if (!value || (typeof value === 'string' && !value.trim())) {
      return ''; // Возвращаем пустую строку для undefined или пустой строки
    }

    const date = new Date(value); // Преобразуем в объект Date

    // Проверяем, является ли дата корректной
    if (isNaN(date.getTime())) {
      return ''; // Возвращаем пустую строку для некорректной даты
    }

    // Получаем компоненты даты
    const hours = this.padZero(date.getHours());
    const minutes = this.padZero(date.getMinutes());
    const seconds = this.padZero(date.getSeconds());
    const day = this.padZero(date.getDate());
    const month = this.padZero(date.getMonth() + 1); // Месяцы начинаются с 0
    const year = date.getFullYear();

    // Формируем строку в формате HH:MM:SS DD.MM.YYYY
    return `${hours}:${minutes}:${seconds} ${day}.${month}.${year}`;
  }

  // Вспомогательная функция для добавления ведущего нуля
  private padZero(num: number): string {
    return num < 10 ? `0${num}` : num.toString();
  }
}