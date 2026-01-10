import { Component, Input, OnInit } from '@angular/core';
import { GetImagesService } from '../../../../shared/services/get-images.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-images-table',
  templateUrl: './images-table.component.html',
  styleUrls: ['./images-table.component.scss']
})
export class ImagesTableComponent implements OnInit {
  allImages: string[] = [];          // все изображения с сервера
  displayedImages: string[] = [];    // то, что показываем сейчас (после фильтров)
  @Input() images: string[] = []; 
  activeTab: 'all' | 'logo' | 'image' = 'all';
  searchTerm: string = '';

  copiedStates: boolean[] = [];
  successMessage: string | null = null;
  errorMessage: string | null = null;

  baseUrl = environment.auth.baseUrl;

  constructor(private imageService: GetImagesService) {}

  ngOnInit(): void {
    this.fetchImages();
    this.imageService.onImageAdded().subscribe(() => {
      this.fetchImages();
    });
  }

  fetchImages(): void {
    this.imageService.getImages().subscribe({
      next: (images) => {
        this.allImages = images;
        this.applyFilters();
        this.copiedStates = new Array(this.displayedImages.length).fill(false);
      },
      error: (err) => {
        console.error('Ошибка получения изображений:', err);
        this.errorMessage = 'Ошибка загрузки списка изображений';
        this.clearMessagesAfterDelay();
      }
    });
  }

  // Применяем все фильтры
  applyFilters(): void {
    let filtered = [...this.allImages];

    // 1. Фильтр по типу (таб)
    if (this.activeTab === 'logo') {
      filtered = filtered.filter(img => img.includes('logo-'));
    } else if (this.activeTab === 'image') {
      filtered = filtered.filter(img => img.includes('image-') || !img.includes('logo-'));
    }

    // 2. Поиск по имени
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.trim().toLowerCase();
      filtered = filtered.filter(img => {
        const filename = img.split('/').pop()?.toLowerCase() || '';
        return filename.includes(term);
      });
    }

    // Сортировка по времени (новые сверху)
    this.displayedImages = filtered.sort((a, b) => {
      const tsA = this.extractTimestamp(a);
      const tsB = this.extractTimestamp(b);
      return tsB - tsA;
    });

    // Обновляем состояния копирования
    this.copiedStates = new Array(this.displayedImages.length).fill(false);
  }

  setTab(tab: 'all' | 'logo' | 'image'): void {
    this.activeTab = tab;
    this.applyFilters();
  }

  onSearch(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.applyFilters();
  }

  extractTimestamp(imagePath: string): number {
    const fileName = imagePath.split('/').pop() || '';
    const match = fileName.match(/-(\d+)-\d+\./);
    return match ? parseInt(match[1], 10) : 0;
  }

  getImageType(image: string): 'Лого' | 'Изображение' {
    return image.includes('logo-') ? 'Лого' : 'Изображение';
  }

  getImageName(image: string): string {
    const filename = image.split('/').pop() || '';
    // Берем всё до первого image- или logo-
    const parts = filename.split(/(image-|logo-)/);
    return parts[0] || '—';
  }

  copyImageUrl(image: string, index: number): void {
    const url = `${this.baseUrl}${image}`;
    navigator.clipboard.writeText(url).then(() => {
      this.copiedStates[index] = true;
      setTimeout(() => this.copiedStates[index] = false, 3000);
    }).catch(err => {
      console.error('Ошибка копирования:', err);
      this.errorMessage = 'Не удалось скопировать URL';
      this.clearMessagesAfterDelay();
    });
  }

  deleteImage(image: string, index: number): void {
    const filename = image.split('/').pop()!;
    this.imageService.deleteImage(filename).subscribe({
      next: () => {
        this.allImages = this.allImages.filter(i => i !== image);
        this.applyFilters();
        this.successMessage = `Изображение ${filename} удалено`;
        this.clearMessagesAfterDelay();
      },
      error: (err) => {
        this.errorMessage = err.status === 404 ? 'Файл не найден' : 'Ошибка удаления';
        this.clearMessagesAfterDelay();
      }
    });
  }

  clearMessagesAfterDelay(): void {
    setTimeout(() => {
      this.successMessage = null;
      this.errorMessage = null;
    }, 4000);
  }
}