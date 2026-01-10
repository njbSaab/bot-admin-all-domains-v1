import { Component, OnInit } from '@angular/core';
import { GreetingBotService } from '../../../../shared/services/greeting-bot.service';
import { GreetingBot } from '../../../../interfaces/greeting-bot.interface';
import { environment } from '../../../../../environments/environment';
@Component({
  selector: 'app-greeting-bot',
  templateUrl: './greeting-bot.component.html',
  styleUrls: ['./greeting-bot.component.scss'],
})
export class GreetingBotComponent implements OnInit {
  greetings: (GreetingBot & { isEditing?: boolean })[] = []; // Добавляем поле isEditing
  loading: boolean = true; // Флаг для состояния загрузки
  successMessage: string | null = null; // Сообщение об успешном действии
  errorMessage: string | null = null; // Сообщение об ошибке
  baseUrl = environment.auth.baseUrl;
  constructor(private greetingBotService: GreetingBotService) {}

  ngOnInit(): void {
    this.loadGreetings();
  }

  // Метод для загрузки данных
  loadGreetings(): void {
    this.greetingBotService.getGreetings().subscribe({
      next: (data) => {
        // Добавляем флаг isEditing в каждый объект
        this.greetings = data.map((greeting) => ({
          ...greeting,
          isEditing: false, // Изначально не редактируется
        }));
        this.loading = false;
        console.log('Загружено успешно', this.greetings);
      },
      error: (err) => {
        console.error('Ошибка при загрузке данных:', err);
        this.errorMessage = 'Ошибка при загрузке данных'; // Сообщение об ошибке
        this.loading = false;
      },
    });
  }

  // Метод для переключения режима редактирования
  toggleEdit(greeting: GreetingBot & { isEditing?: boolean }): void {
    greeting.isEditing = !greeting.isEditing;
    this.clearMessages(); // Очищаем сообщения при переключении режима
  }

  // Метод для сохранения изменений
  saveChanges(greeting: GreetingBot & { isEditing?: boolean }): void {
    this.greetingBotService
      .updateGreeting(greeting.id, {
        greeting_text: greeting.greeting_text,
        image_url: greeting.image_url,
      })
      .subscribe({
        next: (updatedGreeting) => {
          // console.log('Сохранено успешно:', updatedGreeting);
          greeting.isEditing = false; // Выключаем режим редактирования
          this.successMessage = 'Изменения сохранены успешно!'; // Устанавливаем сообщение об успехе
          setTimeout(() => {
            this.closeSuccessMessage();
          }, 3000);   

        },
        error: (err) => {
          console.error('Ошибка при сохранении:', err);
          this.errorMessage = 'Ошибка при сохранении изменений'; // Устанавливаем сообщение об ошибке
          setTimeout(() => {
            this.closeErrorMessage();
          }, 3000);  
        },
      });
  }

  // Метод для обновления изображения при изменении ссылки
  refreshImage(greeting: GreetingBot & { isEditing?: boolean }): void {
    console.log('URL изображения обновлено:', greeting.image_url);
    this.clearMessages(); // Очищаем сообщения при изменении
  }

  // Метод для закрытия сообщения об успехе
  closeSuccessMessage(): void {
    this.successMessage = null;
  }

  // Метод для закрытия сообщения об ошибке
  closeErrorMessage(): void {
    this.errorMessage = null;
  }

  // Очистить все сообщения
  clearMessages(): void {
    this.successMessage = null;
    this.errorMessage = null;
  }

  isValidImageUrl(url: string | undefined): boolean {
    // Если строка пустая или не задана — считаем, что проверка пройдена
    if (!url || url.trim() === '') {
      return true;
    }
    return url.startsWith(this.baseUrl);
  }
}