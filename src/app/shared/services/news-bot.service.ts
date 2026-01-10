import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { NewsBot } from '../../interfaces/news-bot.interface';

@Injectable({
  providedIn: 'root',
})
export class NewsBotService {
  // Предполагаем, что environment.auth.apiUrl = 'http://localhost:3101/api/'
  private apiUrl = environment.auth.apiUrl; 
  
  constructor(private http: HttpClient) {}

  // Получение всех новостей
  getNews(): Observable<NewsBot[]> {
    return this.http.get<NewsBot[]>(`${this.apiUrl}news`);
  }

  // Обновление новости
  updateNews(id: number, updateData: Partial<NewsBot>): Observable<NewsBot> {
    return this.http.put<NewsBot>(`${this.apiUrl}news/${id}`, updateData);
  }

  // Создание новости
  createNews(newsData: Partial<NewsBot>): Observable<NewsBot> {
    return this.http.post<NewsBot>(`${this.apiUrl}news`, newsData);
  }

  // Удаление новости
  deleteNews(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}news/${id}`);
  }

}