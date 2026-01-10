import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { GreetingBot } from '../../interfaces/greeting-bot.interface';

@Injectable({
  providedIn: 'root',
})
export class GreetingBotService {
  private apiUrl = environment.auth.apiUrl;

  constructor(private http: HttpClient) {}

  // Получение всех приветствий
  getGreetings(): Observable<GreetingBot[]> {
    return this.http.get<GreetingBot[]>(`${this.apiUrl}greetings`);
  }

  // Обновление приветствия
  updateGreeting(id: number, updateData: Partial<GreetingBot>): Observable<GreetingBot> {
    return this.http.put<GreetingBot>(`${this.apiUrl}greetings/${id}`, updateData);
  }
}