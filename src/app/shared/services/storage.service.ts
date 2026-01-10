import { Injectable } from '@angular/core';

export interface EmailSettings {
  sendMode: 'manual' | 'all' | null;
  useTemplate: boolean;
  selectedTemplateIndex: number;
}

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly STORAGE_KEY = 'emailSettings';

  saveEmailSettings(settings: EmailSettings): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Ошибка при сохранении настроек в localStorage:', error);
    }
  }

  getEmailSettings(): EmailSettings | null {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Ошибка при чтении настроек из localStorage:', error);
      return null;
    }
  }

  clearEmailSettings(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error('Ошибка при очистке localStorage:', error);
    }
  }
}