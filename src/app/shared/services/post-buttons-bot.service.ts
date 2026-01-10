import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MenuPostButton } from '../../interfaces/menu-post-button.interface';

@Injectable({
  providedIn: 'root'
})
export class PostButtonsBotService {
  private apiUrl = environment.auth.apiUrl;

  constructor(private http: HttpClient) {}

  getPostButtons(): Observable<MenuPostButton[]> {
    return this.http.get<MenuPostButton[]>(`${this.apiUrl}menu/post-buttons`);
  }
}