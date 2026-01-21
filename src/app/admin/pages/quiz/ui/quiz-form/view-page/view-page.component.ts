import { Component, Input, OnChanges, SimpleChanges, ChangeDetectionStrategy, Renderer2, ElementRef } from '@angular/core';
import { QuizFormData } from '../../../interfaces/quiz-form.interface';

@Component({
  selector: 'app-view-page',
  templateUrl: './view-page.component.html',
  styleUrls: ['./view-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewPageComponent implements OnChanges {
  @Input() quizData: QuizFormData | null = null;
  themeColors: { [key: string]: string } = {};
  currentQuestionIndex = 0;

  private styleElement: HTMLStyleElement | null = null;

  constructor(private renderer: Renderer2, private el: ElementRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['quizData'] && this.quizData) {
      this.currentQuestionIndex = 0;
      this.applyTheme();
      this.parseThemeColors(this.quizData?.quizInfo || this.quizData?.theme || '');
      // console.log('Предпросмотр обновлён:', this.quizData);
    }
  }

  private parseThemeColors(rawTheme: string): void {
    this.themeColors = {};

    if (!rawTheme.trim()) return;

    // Разбиваем по ; и чистим
    const lines = rawTheme
      .split(/[\r\n;]/)
      .map(line => line.trim())
      .filter(line => line.startsWith('--') && line.includes(':'));

    lines.forEach(line => {
      const [key, value] = line.split(':').map(part => part.trim());
      if (key && value) {
        this.themeColors[key] = value.replace(';', '');
      }
    });

    // console.log('Извлечённые цвета:', this.themeColors);
  }

  private applyTheme(): void {
    // Удаляем старый <style>
    if (this.styleElement) {
      this.renderer.removeChild(document.head, this.styleElement);
    }

    const rawTheme = this.quizData?.theme || '';

    // console.log('[THEME] Исходная строка quizInfo/theme:', rawTheme);

    if (!rawTheme.trim()) {
      // console.log('[THEME] Тема пустая — применяем дефолтные цвета');
      return;
    }

    // 1. Убираем \r\n и лишние пробелы, нормализуем
    let normalized = rawTheme
      .replace(/\r\n|\r|\n/g, ';')     // все переносы → точка с запятой
      .replace(/\s+/g, ' ')            // множественные пробелы → один
      .replace(/;\s*;/g, ';')          // двойные ;; → ;
      .trim();

    // console.log('[THEME] После нормализации:', normalized);

    // 2. Разделяем на отдельные темы по "--primary:" (каждый новый набор начинается с него)
    const themes = normalized.split(/--primary:/);

    // Берём последний непустой набор
    let lastThemePart = '';
    for (let i = themes.length - 1; i >= 0; i--) {
      if (themes[i].trim()) {
        lastThemePart = themes[i].trim();
        break;
      }
    }

    // Добавляем обратно --primary: к последнему куску
    if (lastThemePart && !lastThemePart.startsWith('--primary:')) {
      lastThemePart = '--primary:' + lastThemePart;
    }

    // console.log('[THEME] Последний найденный набор переменных:', lastThemePart);

    // 3. Формируем финальный CSS
    const cssContent = `:root { ${lastThemePart} }`;

    // 4. Создаём и добавляем <style>
    this.styleElement = this.renderer.createElement('style');
    this.renderer.setProperty(this.styleElement, 'type', 'text/css');
    this.renderer.appendChild(this.styleElement, this.renderer.createText(cssContent));
    this.renderer.appendChild(document.head, this.styleElement);

    // console.log('[THEME] Применён CSS в :root →', cssContent);
  }

  get currentQuestion() {
    return this.quizData?.questions?.[this.currentQuestionIndex];
  }

  get hasQuestions() {
    return (this.quizData?.questions?.length || 0) > 0;
  }

  get questionCount() {
    return this.quizData?.questions?.length || 0;
  }

  selectQuestion(index: number): void {
    if (index >= 0 && index < this.questionCount) {
      this.currentQuestionIndex = index;
    }
  }
}