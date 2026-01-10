import { Component, EventEmitter, Output } from '@angular/core';
import { ImageUploadService } from '../../../../shared/services/image-upload.service';

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss']
})
export class ImageUploadComponent {
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  isDragOver: boolean = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  selectedType: string = 'image';
  imageName: string = '';

  @Output() imageUploaded = new EventEmitter<string>();

  constructor(private imageUploadService: ImageUploadService) {}
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = true;
  }
  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
  }
  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      this.selectedFile = event.dataTransfer.files[0];
      this.previewFile(this.selectedFile);
      event.dataTransfer.clearData();
    }
  }
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.previewFile(this.selectedFile);
    }
  }
  previewFile(file: File): void {
    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl = reader.result;
    };
    reader.readAsDataURL(file);
  }
  triggerFileInput(): void {
    const fileInput = document.querySelector('input[type="file"]') as HTMLElement;
    fileInput.click();
  }
  uploadFile(): void {
    if (!this.selectedFile) {
      this.errorMessage = 'Выберите файл для загрузки';
      return;
    }
    console.log('Отправляем файл:', this.selectedFile.name);
    console.log('Выбранный тип:', this.selectedType);
    this.imageUploadService.uploadImage(
      this.selectedFile,
      this.selectedType,
      this.imageName.trim()  
      ).subscribe({  // Добавьте selectedType
      next: (response) => {
        console.log('Изображение успешно загружено', response);
        this.imageUploaded.emit(response.path);
        this.successMessage = 'Изображение успешно загружено';
        // Сброс полей
        this.selectedFile = null;
        this.previewUrl = null;
        this.imageName = '';
        this.selectedType = 'image';
      },
      error: (err) => {
        console.error('Ошибка загрузки изображения', err);
        this.errorMessage = 'Ошибка загрузки изображения';
      }
    });
  }
  get canUpload(): boolean {
    return !!(
      this.selectedFile &&
      this.imageName?.trim().length > 0 &&
      this.selectedType?.length > 0
    );
  }
  clearMessages(): void {
    this.successMessage = null;
    this.errorMessage = null;
  }
  closeMessages(): void {
    this.successMessage = null;
    this.errorMessage = null;
  }
}