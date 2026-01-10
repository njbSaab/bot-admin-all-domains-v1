import { Component } from '@angular/core';
import { GetImagesService } from '../../../shared/services/get-images.service';


@Component({
  selector: 'app-images',
  templateUrl: './images.component.html',
  styleUrls: ['./images.component.scss']
})
export class ImagesComponent {
  uploadedImages: string[] = [];

  constructor(private imageService: GetImagesService) {}

  onImageUploaded(imageUrl: string): void {
    this.uploadedImages.push(imageUrl);
    this.imageService.notifyImageAdded(); // Уведомляем о добавлении изображения
  }
}