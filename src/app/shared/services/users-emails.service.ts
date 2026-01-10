// src/app/shared/services/users-emails.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from './../../../environments/environment.prod';

export interface EmailMessage {
  email: string;
  subject: string;
  content: string;
  status: 'pending' | 'sent' | 'failed';
  isSent: boolean;
  sentAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsersEmailsService {
  private apiUrlEmail = environment.auth.baseUrl + '/users';

  constructor(private http: HttpClient) {}

  sendBulkEmails(emails: string[], subject: string, content: string, isHtml: boolean = true): Observable<any> {
    return this.http.post(`${this.apiUrlEmail}/email/send-bulk`, {
      emails,
      subject,
      content,
      isHtml  
    }).pipe(
      tap((response) => {
        console.log('Raw server response:', response);
      }),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Произошла ошибка:', error);
    let errorMessage = 'Ошибка на сервере, попробуйте позже';
    if (error.status === 0) {
      errorMessage = 'Не удалось подключиться к серверу. Проверьте сеть или CORS-политику.';
    } else if (error.status >= 400) {
      errorMessage = `Ошибка сервера: ${error.status} ${error.statusText}`;
    }
    return throwError(errorMessage);
  }
}