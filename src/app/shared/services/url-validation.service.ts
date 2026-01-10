import { Injectable } from '@angular/core';
import { environment } from './../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class UrlValidationService {
  isValidImageUrl(url: string | undefined): boolean {
    // Если строка пустая или не задана — считаем, что проверка пройдена
    if (!url || url.trim() === '') {
      return true;
    }
    return url.startsWith(environment.auth.baseUrl);
  }
}
