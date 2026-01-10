import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MenuButton } from '../../interfaces/menu-button.interface'; // Correct path to your interface
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MenuButtonService {
  private apiUrl = `${environment.auth.apiUrl}menu-buttons-inline`; // Correct API URL

  constructor(private http: HttpClient) {}

  getButtons(): Observable<MenuButton[]> { // <-- Return an array of MenuButton
    return this.http.get<MenuButton[]>(this.apiUrl);
  }

  getButtonById(id: number): Observable<MenuButton> {
    return this.http.get<MenuButton>(`${this.apiUrl}/${id}`);
  }

  createButton(button: MenuButton): Observable<MenuButton> {
    return this.http.post<MenuButton>(this.apiUrl, button);
  }

  updateButton(id: number, button: Partial<MenuButton>): Observable<MenuButton> {
    return this.http.put<MenuButton>(`${this.apiUrl}/${id}`, button);
  }

  deleteButton(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}