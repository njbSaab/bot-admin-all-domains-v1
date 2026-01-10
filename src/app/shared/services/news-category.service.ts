import { environment } from './../../../environments/environment.prod';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface NewsCategory {
  id: number;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

@Injectable({
  providedIn: 'root',
})
export class NewsCategoryService {
  // private apiUrl = 'http://localhost:3101/categories'; // URL для получения категорий AUTH_API_URL=http://194.36.179.168:3101/api/

  private apiUrl = `${environment.auth.baseUrl}/categories`; // URL для получения категорий AUTH_API_URL=http://194.36.179.168:3101/api/


  constructor(private http: HttpClient) {}

  getCategories(): Observable<NewsCategory[]> {
    return this.http.get<NewsCategory[]>(this.apiUrl);
  }
}