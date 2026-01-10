import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MenuPostButton } from '../../interfaces/menu-post-button.interface';

@Injectable({
  providedIn: 'root'
})
export class InlineButtonsMenuIndexService {
  private apiUrl = `${environment.auth.apiUrl}post-buttons/`;

  constructor(private http: HttpClient) {}

  getPostButtons(): Observable<MenuPostButton[]> {
    return this.http.get<MenuPostButton[]>(this.apiUrl);
  }

  getPostButtonById(id: number): Observable<MenuPostButton> {
    return this.http.get<MenuPostButton>(`${this.apiUrl}${id}`);
  }

  updatePostButton(id: number, updateData: Partial<MenuPostButton>): Observable<MenuPostButton> {
    return this.http.put<MenuPostButton>(`${this.apiUrl}${id}`, updateData);
  }
}