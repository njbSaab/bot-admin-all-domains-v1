// src/app/shared/services/draft.service.ts
import { Injectable } from '@angular/core';
import { QuizFormData } from '../../admin/pages/quiz/interfaces/quiz-form.interface';

@Injectable({
  providedIn: 'root'
})
export class DraftService {

  private readonly PREFIX = 'quiz-draft-';

  saveDraft(key: string, data: Partial<QuizFormData>): void {
    const fullKey = this.PREFIX + key;
    const draft = {
      ...data,
      // Не сохраняем id (для create он undefined, для edit — не нужен в черновике)
      id: undefined,
      // timestamp для отладки
      savedAt: new Date().toISOString()
    };
    localStorage.setItem(fullKey, JSON.stringify(draft));
    console.log(`Черновик сохранён: ${fullKey}`);
  }

  loadDraft(key: string): Partial<QuizFormData> | null {
    const fullKey = this.PREFIX + key;
    const saved = localStorage.getItem(fullKey);
    if (!saved) return null;

    try {
      const draft = JSON.parse(saved) as Partial<QuizFormData>;
      console.log(`Черновик загружен: ${fullKey}`);
      return draft;
    } catch (e) {
      console.error(`Ошибка загрузки черновика ${fullKey}:`, e);
      this.clearDraft(key);
      return null;
    }
  }

  clearDraft(key: string): void {
    const fullKey = this.PREFIX + key;
    localStorage.removeItem(fullKey);
    console.log(`Черновик очищен: ${fullKey}`);
  }

  // Удобный метод для create-режима
  getCreateDraftKey(): string {
    return 'create';
  }

  // Если позже захочешь черновик для edit по id
  getEditDraftKey(quizId: number | string): string {
    return `edit-${quizId}`;
  }
}