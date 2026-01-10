import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class GetImagesService {
  private imageAddedSubject = new Subject<void>();

  constructor(private http: HttpClient) {}

  /**
   * Получает список изображений с сервера.
   * @returns Observable с массивом путей изображений.
   */
  getImages(): Observable<string[]> {
    return this.http.get<string[]>(`${environment.auth.baseUrl}/images`);
  }

  /**
   * Удаляет изображение по имени файла.
   * @param filename Имя файла (например, 'image-1234567890-123.png').
   * @returns Observable для обработки ответа сервера.
   */
  deleteImage(filename: string): Observable<void> {
    return this.http.delete<void>(`${environment.auth.baseUrl}/images/${filename}`);
  }

  /**
   * Уведомляет о добавлении нового изображения.
   */
  notifyImageAdded(): void {
    this.imageAddedSubject.next();
  }

  /**
   * Подписка на событие добавления изображения.
   */
  onImageAdded(): Observable<void> {
    return this.imageAddedSubject.asObservable();
  }
}