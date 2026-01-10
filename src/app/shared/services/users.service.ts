import { Injectable } from '@angular/core';
import { User } from '../../interfaces/users.interface';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from './../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private apiUrl = environment.auth.baseUrl + '/users';

  constructor(private http: HttpClient) {}

  /**
   * Получает список всех пользователей.
   * @returns Observable с массивом пользователей.
   */
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  /**
   * Удаляет пользователя по ID.
   * @param userId ID пользователя.
   * @returns Observable для обработки ответа сервера.
   */
  deleteUser(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${userId}`);
  }
}