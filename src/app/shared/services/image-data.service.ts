import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageDataService {

   // BehaviorSubject для хранения списка URL изображений
   private imagesSubject = new BehaviorSubject<string[]>([]);
   // Observable для подписки
   images$ = this.imagesSubject.asObservable();
 
   // Метод для добавления нового URL изображения
   addImage(imageUrl: string): void {
     const currentImages = this.imagesSubject.getValue();
     this.imagesSubject.next([...currentImages, imageUrl]);
   }
 
   // (Опционально) Метод для сброса списка
   resetImages(): void {
     this.imagesSubject.next([]);
   }
}
