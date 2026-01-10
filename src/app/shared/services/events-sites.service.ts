import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { EventsSites } from '../../interfaces/events-sites.interface';

@Injectable({
  providedIn: 'root',
})
export class EventsSitesService {
  private apiUrl = environment.auth.apiUrlEvents;
  secret = environment.auth.secret
  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'X-Admin-Secret': this.secret,
      'Content-Type': 'application/json',
    });
  }

  getAdminEvents(): Observable<EventsSites[]> {
    return this.http.get<EventsSites[]>(this.apiUrl, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  getAdminEventById(id: number): Observable<EventsSites> {
    return this.http.get<EventsSites>(`${this.apiUrl}/by-id/${id}`, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  updateEvents(typeEventId: string, updateData: Partial<EventsSites>): Observable<EventsSites> {
    console.log('Sending update request to:', `${this.apiUrl}/${typeEventId}`, 'Data:', updateData);
    return this.http.patch<{ message: string; event: EventsSites }>(
      `${this.apiUrl}/${typeEventId}`,
      updateData,
      { headers: this.getHeaders() }
    ).pipe(
      tap(response => console.log('Update response:', response)),
      map(response => response.event),
      catchError((error: HttpErrorResponse) => {
        console.error('Update request failed:', error);
        return this.handleError(error);
      })
    );
  }

  createEvent(eventData: Partial<EventsSites>): Observable<EventsSites> {
    console.log('Sending create request to:', this.apiUrl, 'Data:', eventData);
    return this.http.post<{ message: string; event: EventsSites }>(
      this.apiUrl,
      eventData,
      { headers: this.getHeaders() }
    ).pipe(
      tap(response => console.log('Create response:', response)),
      map(response => response.event),
      catchError(this.handleError)
    );
  }

  updateEventById(id: number, updateData: Partial<EventsSites>): Observable<EventsSites> {
  return this.http.patch<{ message: string; event: EventsSites }>(
    `${this.apiUrl}/by-id/${id}`,
    updateData,
    { headers: this.getHeaders() }
  ).pipe(
    map(response => response.event),
    catchError(this.handleError)
  );
}

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Произошла ошибка';
    if (error.status === 401) {
      errorMessage = 'Нет доступа: недопустимый ключ администратора';
    } else if (error.status === 400) {
      errorMessage = `Неверный запрос: ${error.error?.error?.message || error.message}`;
    } else if (error.status === 404) {
      errorMessage = 'Событие не найдено';
    } else if (error.error instanceof ErrorEvent) {
      errorMessage = `Ошибка: ${error.error.message}`;
    } else {
      errorMessage = `Сервер вернул код ${error.status}: ${error.message}`;
    }
    console.error('Ошибка в EventsSitesService:', errorMessage, 'Full error:', error);
    return throwError(() => new Error(errorMessage));
  }
}