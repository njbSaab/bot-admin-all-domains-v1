import { Component, OnInit } from '@angular/core';
import { NewsBotService } from '../../../../shared/services/news-bot.service';
import { NewsCategory } from '../../../../interfaces/news-category.interface';
import { NewsCategoryService } from '../../../../shared/services/news-category.service';
import { NewsBot } from '../../../../interfaces/news-bot.interface';
import { UrlValidationService } from '../../../../shared/services/url-validation.service';

@Component({
  selector: 'app-news-bot',
  templateUrl: './news-bot.component.html',
  styleUrls: ['./news-bot.component.scss']
})
export class NewsBotComponent implements OnInit {
  newsItems: (NewsBot & { isEditing?: boolean })[] = [];
  categories: NewsCategory[] = [];
  loading: boolean = true;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  isOpen: boolean = false;

  // Переменные для создания новой новости
  newNews: Partial<NewsBot> = {
    post_title: '',
    post_content: '',
    post_image_url: '',
    news_url: '',
    isActive: true,
  };

  // Переменная для хранения выбранного ID категории
  newNewsCategoryId: number | null = null;

  // Сортировка
  ascending: boolean = false; // false: новые → старые, true: старые → новые

  constructor(
    private newsBotService: NewsBotService,
    private newsCategoryService: NewsCategoryService,
    public urlValidationService: UrlValidationService 
  ) {}

  ngOnInit(): void {
    // Восстанавливаем выбор сортировки из localStorage
    const savedSort = localStorage.getItem('newsSortOrder');
    this.ascending = savedSort ? JSON.parse(savedSort) : false;

    this.loadNews();
    this.loadCategories();
  }

  loadNews(): void {
    this.newsBotService.getNews().subscribe({
      next: (data) => {
        this.newsItems = data.map(news => ({ ...news, isEditing: false }));
        this.loading = false;
        console.log("NEWS", data);
      },
      error: (err) => {
        console.error('Ошибка при загрузке новостей:', err);
        this.errorMessage = 'Ошибка при загрузке новостей';
        this.loading = false;
      }
    });
  }

  loadCategories(): void {
    this.newsCategoryService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
        console.log('Category', data);
      },
      error: (err) => {
        console.error('Ошибка при загрузке категорий:', err);
        this.errorMessage = 'Ошибка при загрузке категорий';
      }
    });
  }

  createNews(): void {
    if (!this.newNews.post_title || !this.newNews.post_content || !this.newNewsCategoryId) {
      this.errorMessage = 'Пожалуйста, заполните обязательные поля (заголовок, контент, категория)';
      return;
    }
    // Формируем поле category как объект с выбранным ID
    this.newNews.category = { id: this.newNewsCategoryId } as any;
    
    this.newsBotService.createNews(this.newNews).subscribe({
      next: (news) => {
        this.newsItems.push({ ...news, isEditing: false });
        this.successMessage = 'Новость успешно создана!';
        // Очищаем форму
        this.newNews = { post_title: '', post_content: '', post_image_url: '', news_url: '', isActive: true };
        this.newNewsCategoryId = null;
        setTimeout(() => this.closeSuccessMessage(), 3000);
      },
      error: (err) => {
        console.error('Ошибка при создании новости:', err);
        this.errorMessage = 'Ошибка при создании новости';
        setTimeout(() => this.closeErrorMessage(), 3000);
      }
    });
  }

  deleteNews(newsId: number): void {
    this.newsBotService.deleteNews(newsId).subscribe({
      next: () => {
        this.newsItems = this.newsItems.filter(news => news.id !== newsId);
        this.successMessage = 'Новость успешно удалена!';
        setTimeout(() => this.closeSuccessMessage(), 3000);
      },
      error: (err) => {
        console.error('Ошибка при удалении новости:', err);
        this.errorMessage = 'Ошибка при удалении новости';
        setTimeout(() => this.closeErrorMessage(), 3000);
      }
    });
  }

  toggleEdit(news: NewsBot & { isEditing?: boolean }): void {
    news.isEditing = !news.isEditing;
    this.clearMessages();
  }

  saveChanges(news: NewsBot & { isEditing?: boolean }): void {
    const updateData: Partial<NewsBot> = {
      post_title: news.post_title,
      post_content: news.post_content,
      post_image_url: news.post_image_url,
      category: news.category,
      isActive: news.isActive,
      news_url: news.news_url,
    };

    this.newsBotService.updateNews(news.id, updateData).subscribe({
      next: (updatedNews) => {
        news.isEditing = false;
        this.successMessage = 'Изменения сохранены успешно!';
        setTimeout(() => this.closeSuccessMessage(), 3000);
      },
      error: (err) => {
        console.error('Ошибка при сохранении новости:', err);
        this.errorMessage = 'Ошибка при сохранении изменений';
        setTimeout(() => this.closeErrorMessage(), 3000);
      }
    });
  }

  closeSuccessMessage(): void {
    this.successMessage = null;
  }

  closeErrorMessage(): void {
    this.errorMessage = null;
  }

  clearMessages(): void {
    this.successMessage = null;
    this.errorMessage = null;
  }

  openCreateModal(): void {
    this.isOpen = !this.isOpen;
  }

  toggleSortOrder(): void {
    this.ascending = !this.ascending;
    // Сохраняем выбор в localStorage
    localStorage.setItem('newsSortOrder', JSON.stringify(this.ascending));
  }
}