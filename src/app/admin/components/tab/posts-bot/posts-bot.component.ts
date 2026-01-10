import { Component, OnInit } from '@angular/core';
import { MenuPost } from '../../../../interfaces/menu-post.interface';
import { PostBotService } from '../../../../shared/services/post-bot.service';
import { MenuButtonService } from '../../../../shared/services/menu-button.service';
import { UrlValidationService } from '../../../../shared/services/url-validation.service';

// Тип для редактируемых постов
export interface EditableMenuPost extends MenuPost {
  isEditing?: boolean;
}

@Component({
  selector: 'app-posts-bot',
  templateUrl: './posts-bot.component.html',
  styleUrls: ['./posts-bot.component.scss'],
})
export class PostsBotComponent implements OnInit {
  selectedParentMenuId: number | null = null; // По умолчанию показываем все посты
  posts: EditableMenuPost[] = [];
  successMessage: string | null = null;
  errorMessage: string | null = null;
  loading: boolean = true;
  isEditing: boolean = false;
  isActive: boolean = false;
  constructor(
    private postService: PostBotService,
    private menuButtonService: MenuButtonService,
    public urlValidationService: UrlValidationService 
  )
     {}

  ngOnInit(): void {
    this.loadPosts();
  }

  // Загрузка постов
  loadPosts(): void {
    this.postService.getPosts().subscribe({
      next: (data) => {
        this.posts = data.map((post) => ({ ...post, isEditing: false }));
        this.loading = false;
        console.log("загрузке постов в компоненте ПОСТ:",this.posts);
      },

      error: () => {
        this.errorMessage = 'Ошибка при загрузке постов';
        this.loading = false;
      },
    });
  }

  // Переключение режима редактирования
  toggleEdit(post: EditableMenuPost): void {
    post.isEditing = !post.isEditing;
    this.clearMessages(); // Очистка сообщений при редактировании
  }

  // Сохранение изменений
  saveChanges(post: EditableMenuPost): void {
    this.postService
      .updatePost(post.id, {
        post_title: post.post_title,
        post_content: post.post_content,
        post_image_url: post.post_image_url,
      })
      .subscribe({
        next: () => {
          this.successMessage = 'Пост успешно обновлен!';
          post.isEditing = false;
            setTimeout(() => {
              this.closeMessages();
            }, 3000);     
        },
        error: () => {
          this.errorMessage = 'Ошибка при обновлении поста';
        },
      });
  }
  // Переключение режима редактирования для кнопки
  toggleButtonEdit(buttonWrapper: any): void {
    console.log(buttonWrapper);
    this.isEditing = !this.isEditing;
    this.clearMessages(); // если необходимо
  }

  isClickActive(){
    this.isActive = !this.isActive
  }

// Сохранение изменений для кнопки
saveButtonChanges(post: EditableMenuPost, buttonWrapper: any): void {
  if (buttonWrapper.button && buttonWrapper.button.name) {
    this.menuButtonService.updateButton(buttonWrapper.button.id, {
      name: buttonWrapper.button.name,
      url: buttonWrapper.button.url,
      order: buttonWrapper.button.order,
    }).subscribe({
      next: () => {
        this.successMessage = 'Кнопка успешно обновлена!';
        buttonWrapper.isEditing = false;
        setTimeout(() => {
          this.closeMessages();
        }, 3000);
      },
      error: () => {
        this.errorMessage = 'Ошибка при обновлении кнопки';
      },
    });
  }
}

  // Обновление изображения при изменении URL
  refreshImage(post: EditableMenuPost): void {
    console.log('URL изображения обновлено:', post.post_image_url);
    this.clearMessages();
  }

  // Закрытие сообщений об успехе и ошибках
  closeMessages(): void {
    this.successMessage = null;
    this.errorMessage = null;
  }
  // Очистка сообщений
  clearMessages(): void {
    this.successMessage = null;
    this.errorMessage = null;
  }
}   