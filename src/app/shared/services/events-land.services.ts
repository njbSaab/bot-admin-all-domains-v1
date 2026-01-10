
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { EventsLandings } from '../../interfaces/events-sites.interface';

@Injectable({
  providedIn: 'root',
})
export class EventsLandingsService {
  private apiUrl = environment.auth.apiUrlEventLandings; 
  secret = environment.auth.secret
  
  // Например, http://forecast-server.najib-saab.workers.dev/vietget-admin/events

  constructor(private http: HttpClient) {}

  // Получение всех событий (админ, с X-Admin-Secret)
  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'X-Admin-Secret': this.secret,
      'Content-Type': 'application/json',
    });
  }

  // Получение всех лендингов
  getLandings(): Observable<EventsLandings[]> {
    return this.http.get<EventsLandings[]>(this.apiUrl, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  // Получение лендинга по ID
  getLandingById(id: number): Observable<EventsLandings> {
    return this.http.get<EventsLandings>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  // Создание лендинга
  createLanding(landingData: Partial<EventsLandings>): Observable<EventsLandings> {
    return this.http.post<EventsLandings>(this.apiUrl, landingData, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  // Обновление лендинга
  updateLanding(id: number, updateData: Partial<EventsLandings>): Observable<EventsLandings> {
    return this.http.patch<EventsLandings>(`${this.apiUrl}/${id}`, updateData, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  // Удаление лендинга
  deleteLanding(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Произошла ошибка';
    if (error.status === 401) {
      errorMessage = 'Нет доступа: недопустимый ключ администратора';
    } else if (error.status === 400) {
      errorMessage = `Неверный запрос: ${error.error?.message || error.message}`;
    } else if (error.status === 404) {
      errorMessage = 'Лендинг не найден';
    } else if (error.error instanceof ErrorEvent) {
      errorMessage = `Ошибка: ${error.error.message}`;
    } else {
      errorMessage = `Сервер вернул код ${error.status}: ${error.message}`;
    }
    console.error('Ошибка в LandingsService:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}