import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MenuPost } from '../../interfaces/menu-post.interface';
import { MenuPostButton } from '../../interfaces/menu-post-button.interface';

@Injectable({
  
  providedIn: 'root'
})
export class PostBotService {
  private apiUrl = environment.auth.apiUrl;

  constructor(private http: HttpClient) {}

  getPosts(): Observable<MenuPost[]> {
    return this.http.get<MenuPost[]>(`${this.apiUrl}menu/posts`);
    // return this.http.get<MenuPost[]>(`${this.apiUrl}posts`);
  }

  updatePost(id: number, updateData: Partial<MenuPost>): Observable<MenuPost> {
    return this.http.put<MenuPost>(`${this.apiUrl}posts/${id}`, updateData);
  }

  updatePostButton(buttonId: number, buttonData: Partial<MenuPostButton>): Observable<MenuPostButton> {
    return this.http.put<MenuPostButton>(`${this.apiUrl}post-buttons/${buttonId}`, buttonData);
  }
  
}