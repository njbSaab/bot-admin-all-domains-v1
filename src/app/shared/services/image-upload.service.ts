import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class ImageUploadService {
  public url = environment.auth.baseUrl;
  private uploadUrl = `${this.url}/upload`;

  constructor(private http: HttpClient) {}

  uploadImage(file: File, type: string, name: string = ''): Observable<any> {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('type', type);
    if (name) {
      formData.append('name', name);  // передаём только если заполнено
    }
    return this.http.post(this.uploadUrl, formData);
  }
}