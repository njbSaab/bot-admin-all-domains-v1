import { Component, OnInit } from '@angular/core';
import { MenuButtonService } from '../../../../shared/services/menu-button.service';
import { MenuButton } from '../../../../interfaces/menu-button.interface';

// Расширяем тип для поддержки редактирования
type EditableMenuButton = MenuButton & { isEditing?: boolean };

@Component({
  selector: 'app-inline-buttons',
  templateUrl: './inline-buttons.component.html',
  styleUrls: ['./inline-buttons.component.scss']
})
export class InlineButtonsComponent implements OnInit {
  buttons: EditableMenuButton[] = []; // Используем расширенный тип
  loading: boolean = true;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(private menuButtonService: MenuButtonService) {}

  ngOnInit(): void {
    this.loadButtons();
  }

  // Загрузка кнопок
  loadButtons(): void {
    this.loading = true;
    this.menuButtonService.getButtons().subscribe({
      next: (data: MenuButton[]) => {
        // Преобразуем данные в массив с добавлением свойства isEditing
        this.buttons = data.map((button) => ({ ...button, isEditing: false }));
        this.loading = false;
        console.log('✅ Загружено успешно кнопки inline', this.buttons);
      },
      error: (err) => {
        console.error('Ошибка при загрузке данных:', err);
        this.errorMessage = 'Ошибка при загрузке данных';
        this.loading = false;
      },
    });
  }

  // Переключение режима редактирования
  toggleEdit(button: EditableMenuButton): void {
    button.isEditing = !button.isEditing;
    this.clearMessages();
  }

  // Сохранение изменений
  saveChanges(button: EditableMenuButton): void {
    this.menuButtonService.updateButton(button.id, {
      name: button.name,
      url: button.url,
      order: button.order
    }).subscribe({
      next: (updatedButton) => {
        console.log('Сохранено успешно:', updatedButton);
        button.isEditing = false;
        this.successMessage = 'Изменения сохранены успешно!';
        setTimeout(() => {
          this.closeSuccessMessage();
        }, 3000);
        this.loadButtons(); // Обновляем список после сохранения
      },
      error: (err) => {
        console.error('Ошибка при сохранении:', err);
        this.errorMessage = 'Ошибка при сохранении изменений';
        setTimeout(() => {
          this.closeErrorMessage();
        }, 3000);
      },
    });
  }

  // Отмена редактирования
  cancelEdit(button: EditableMenuButton): void {
    button.isEditing = false;
    this.loadButtons(); // Перезагружаем данные для отмены изменений
    this.clearMessages();
  }

  // Очистка сообщений
  clearMessages(): void {
    this.successMessage = null;
    this.errorMessage = null;
  }

  // Закрытие сообщения об успехе
  closeSuccessMessage(): void {
    this.successMessage = null;
  }

  // Закрытие сообщения об ошибке
  closeErrorMessage(): void {
    this.errorMessage = null;
  }
}