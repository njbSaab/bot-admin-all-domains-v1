// src/app/admin/pages/quiz/components/quiz-form/quiz-form.component.ts

import { Component, EventEmitter, Input, Output, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { QuizFormData, QuizQuestion, QuizAnswer, QuizServerPayload } from '../../interfaces/quiz-form.interface';
import { DraftService } from '../../../../../shared/services/draft-quiz.service';
import { 
  EmailTemplateConfig, 
  ChainEmailStep,
  ChainTemplate,
  delayMinutesToLabel,
  DEFAULT_EMAIL_CONFIG,
} from '../../interfaces/email-template.interface';
import { EmailTemplateService } from '../../../../../shared/services/email-template.service';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'app-quiz-form',
  templateUrl: './quiz-form.component.html',
  styleUrls: ['./quiz-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuizFormComponent implements OnInit, OnDestroy {
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() initialData: Partial<QuizFormData> | null = null;
  @Input() landings: { id: number; name: string; url: string }[] = [];
  @Input() isEditLoad: boolean = false;  
  @Output() save = new EventEmitter<QuizServerPayload>();
  @Output() cancel = new EventEmitter<void>();
  
  quizNumericId: number | null = null;
  showEmailEditor = false;
  emailConfig: EmailTemplateConfig | null = null;
  emailHtml: string = '';
  existingTemplates: any[] = [];
  
  // Загруженный шаблон result из БД
  loadedResultTemplate: { html: string; subject: string } | null = null;

  // NEW: Цепочка писем
  existingChainTemplates: ChainTemplate[] = [];
  chainSteps: ChainEmailStep[] = [];
  chainLoading = false;

  form$ = new BehaviorSubject<QuizFormData>(this.getDefaultForm());

  errorMessage: string | null = null;
  loading = false;
  selectedType: 'byScore' | 'byWeight' = 'byScore';

  resultMessage = '';

  private autoSaveInterval: any;

  constructor(
    private cdr: ChangeDetectorRef,
    private draftService: DraftService,
    private emailTemplateService: EmailTemplateService
  ) {}

  ngOnInit(): void {
    let initialForm: QuizFormData;

    if (this.initialData) {
      let parsedQuestions: QuizQuestion[] = [];
      this.quizNumericId = (this.initialData as any).id || null;

      if (typeof this.initialData.questions === 'string') {
        try {
          parsedQuestions = JSON.parse(this.initialData.questions) || [];
        } catch (e) {
          console.error('Ошибка парсинга questions:', e);
          parsedQuestions = [];
        }
      } else if (Array.isArray(this.initialData.questions)) {
        parsedQuestions = this.initialData.questions;
      }

      initialForm = {
        ...this.getDefaultForm(),
        ...this.initialData,
        questions: parsedQuestions.length > 0 ? parsedQuestions : [this.getEmptyQuestion()]
      };

      // Загружаем существующие email шаблоны для этого квиза
      if (this.quizNumericId) {
        this.loadEmailTemplates(this.quizNumericId);
        this.loadChainTemplates(this.quizNumericId);  // NEW: Загружаем цепочку
      }
    } else {
      const draft = this.draftService.loadDraft(this.draftService.getCreateDraftKey());
      if (draft) {
        initialForm = {
          ...this.getDefaultForm(),
          ...draft,
          questions: Array.isArray(draft.questions) && draft.questions.length > 0
            ? draft.questions
            : [this.getEmptyQuestion()]
        };
      } else {
        initialForm = {
          ...this.getDefaultForm(),
          questions: [this.getEmptyQuestion()]
        };
      }

      this.startAutoSave();
    }

    this.form$.next(initialForm);
    this.selectedType = initialForm.type || 'byScore';
    this.cdr.markForCheck();
  }

  /**
   * Загрузить существующие email шаблоны для квиза (result)
   */
  private loadEmailTemplates(quizId: number): void {
    const domain = this.getDomain();
    const app = this.getApp();

    this.emailTemplateService.getTemplates(domain, app, quizId).subscribe(templates => {
      this.existingTemplates = templates;
      // console.log('Загружены email шаблоны для квиза:', templates);

      const resultTemplate = templates.find((t: any) => t.type === 'result');
      if (resultTemplate) {
        this.loadedResultTemplate = {
          html: resultTemplate.html,
          subject: resultTemplate.subject
        };
        this.emailHtml = resultTemplate.html;
        // console.log('Найден result шаблон:', this.loadedResultTemplate);
      }

      this.cdr.markForCheck();
    });
  }

  /**
   * NEW: Загрузить цепочку писем для квиза
   */
private loadChainTemplates(quizId: number): void {
  const app = this.getApp();
  
  if (!app) {
    console.warn('App не задан, цепочка писем не будет загружена');
    return;
  }

  this.chainLoading = true;
  this.cdr.markForCheck();

  // УПРОЩЁННЫЙ запрос: только app + quizId
  this.emailTemplateService.getChainTemplates(app, quizId)
    .subscribe({
      next: (templates) => {
        this.existingChainTemplates = templates;
        // console.log('Загружены chain шаблоны:', templates);

        if (templates.length > 0) {
          this.chainSteps = templates
            .sort((a, b) => a.step - b.step)
            .map(tmpl => this.chainTemplateToStep(tmpl));
          // console.log('Конвертированные chain steps:', this.chainSteps);
        }

        this.chainLoading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Ошибка загрузки chain шаблонов:', err);
        this.chainLoading = false;
        this.cdr.markForCheck();
      }
    });
}


  /**
   * NEW: Конвертировать ChainTemplate из БД в ChainEmailStep для редактора
   */
  private chainTemplateToStep(tmpl: ChainTemplate): ChainEmailStep {
    return {
      step: tmpl.step,
      delayMinutes: tmpl.delayMinutes,
      delayLabel: delayMinutesToLabel(tmpl.delayMinutes),
      subject: tmpl.subject,
      html: tmpl.html,
      config: this.extractConfigFromHtml(tmpl.html),
      isExpanded: false,
      isDirty: false,
    };
  }

  /**
   * Базовое извлечение config из HTML (можно расширить)
   */
  private extractConfigFromHtml(html: string): EmailTemplateConfig {
    // Пока возвращаем дефолт, но можно парсить цвета из HTML
    const config = { ...DEFAULT_EMAIL_CONFIG };
    
    // Попытка извлечь некоторые значения из HTML
    const titleMatch = html.match(/<div[^>]*style="[^"]*font-size:\s*26px[^"]*"[^>]*>([^<]+)<\/div>/i);
    if (titleMatch) {
      config.titleText = titleMatch[1].trim();
    }

    const greetingMatch = html.match(/font-size:\s*22px[^>]*>([^,<]+),/i);
    if (greetingMatch) {
      config.greeting = greetingMatch[1].trim();
    }

    // Извлекаем цвет из header gradient
    const headerBgMatch = html.match(/linear-gradient\(135deg,\s*(#[0-9a-fA-F]{6})\s*0%,\s*(#[0-9a-fA-F]{6})/i);
    if (headerBgMatch) {
      config.headerBgStart = headerBgMatch[1];
      config.headerBgEnd = headerBgMatch[2];
    }

    // Извлекаем primary color
    const primaryMatch = html.match(/color:\s*(#[0-9a-fA-F]{6})[^>]*>\{\{name\}\}/i);
    if (primaryMatch) {
      config.primaryColor = primaryMatch[1];
    }

    return config;
  }

  /**
   * Получить домен из environment
   */
  private getDomain(): string {
    return environment.auth.emailDomein || 'localhost';
  }

  /**
   * Получить app из environment
   */
  private getApp(): string | undefined {
    return environment.auth.app;
  }
  
  private getDefaultForm(): QuizFormData {
    return {
      typeQuizId: `quiz-${Date.now()}`,
      name: '',
      nameAdm: '',
      description: '',
      descriptionAdm: '',
      theme: '',
      isActive: false,
      endAt: '',
      questions: [],
      quizInfo: '{}',
      result: '{}',
      resultsStats: '{}',
      imageBgDesk: '',
      imageBgMob: '',
      imageHero: '',
      grandPrize: '',
      prizeForEveryOne: '',
      type: 'byScore',
      status: 'active',
      geo: 'vn',
      rating: 0,
      landingId: 0
    };
  }

  getEmptyQuestion(): QuizQuestion {
    return {
      id: Date.now(),
      text: '',
      image: '',
      answers: [this.getEmptyAnswer()],
      points: 10,
      timeLimit: 30
    };
  }

  getEmptyAnswer(): QuizAnswer {
    return this.selectedType === 'byScore'
      ? { text: '', isCorrect: false, points: 0 }
      : { text: '', weight: 1 };
  }

  updateForm(): void {
    this.form$.next({ ...this.form$.value });
  }

  addQuestion(): void {
    const current = this.form$.value;
    this.form$.next({
      ...current,
      questions: [...current.questions, this.getEmptyQuestion()]
    });
    this.saveDraftNow();
  }

  getColorValue(varName: string): string {
    const form = this.form$.value;
    const themeString = form?.theme || form?.quizInfo || '';

    const regex = new RegExp(
      `--${varName}\\s*:\\s*(#[0-9a-fA-F]{3,8})(?=[;\\s]|$)`,
      'i'
    );
    const match = themeString.match(regex);

    const found = match ? match[1] : '#000000';
    return found;
  }

  updateColor(varName: string, event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input?.value) return;

    const newColor = input.value;
    const current = this.form$.value;
    let theme = current.theme || current.quizInfo || '';

    const regex = new RegExp(`(--${varName}\\s*:\\s*)#[0-9a-fA-F]{3,8}`, 'i');

    if (theme.match(regex)) {
      theme = theme.replace(regex, `$1${newColor}`);
    } else {
      theme = theme.trim();
      if (theme && !theme.endsWith(';')) theme += ';';
      theme += `--${varName}: ${newColor};`;
    }

    this.form$.next({
      ...current,
      theme: theme
    });

    this.saveDraftNow();
  }

  removeQuestion(index: number): void {
    if (!confirm('Удалить вопрос?')) return;
    const current = this.form$.value;
    const updated = current.questions.filter((_, i) => i !== index);
    this.form$.next({
      ...current,
      questions: updated.length > 0 ? updated : [this.getEmptyQuestion()]
    });
    this.saveDraftNow();
  }

  addAnswer(qIndex: number): void {
    const current = this.form$.value;
    const questions = [...current.questions];
    questions[qIndex] = {
      ...questions[qIndex],
      answers: [...questions[qIndex].answers, this.getEmptyAnswer()]
    };
    this.form$.next({ ...current, questions });
    this.saveDraftNow();
  }

  removeAnswer(qIndex: number, aIndex: number): void {
    if (!confirm('Удалить ответ?')) return;
    const current = this.form$.value;
    const questions = [...current.questions];
    questions[qIndex] = {
      ...questions[qIndex],
      answers: questions[qIndex].answers.filter((_, i) => i !== aIndex)
    };
    this.form$.next({ ...current, questions });
    this.saveDraftNow();
  }

  switchType(type: 'byScore' | 'byWeight'): void {
    const current = this.form$.value;
    const questions = current.questions.map(q => ({
      ...q,
      answers: q.answers.map(a => type === 'byScore'
        ? { text: a.text, isCorrect: (a as any).isCorrect ?? false, points: (a as any).points ?? 0 }
        : { text: a.text, weight: (a as any).weight ?? 1 })
    }));
    this.form$.next({ ...current, type, questions });
    this.selectedType = type;
    this.saveDraftNow();
  }

  private startAutoSave(): void {
    this.autoSaveInterval = setInterval(() => this.saveDraftNow(), 30000);
  }

  private saveDraftNow(): void {
    if (this.mode === 'create') {
      this.draftService.saveDraft(this.draftService.getCreateDraftKey(), this.form$.value);
    }
  }

  private clearDraft(): void {
    if (this.mode === 'create') {
      this.draftService.clearDraft(this.draftService.getCreateDraftKey());
    }
  }

  ngOnDestroy(): void {
    if (this.autoSaveInterval) clearInterval(this.autoSaveInterval);
    if (this.mode === 'create') this.saveDraftNow();
  }

  onCancel(): void {
    this.clearDraft();
    this.cancel.emit();
  }

  updateQuestionText(index: number, text: string): void {
    const current = this.form$.value;
    const updatedQuestions = [...current.questions];
    updatedQuestions[index] = { ...updatedQuestions[index], text };

    this.form$.next({
      ...current,
      questions: updatedQuestions
    });
    this.saveDraftNow();
  }

  onSubmit(): void {
    const form = this.form$.value;
    if (!this.validateForm(form)) return;

    this.loading = true;
    this.errorMessage = null;
    this.cdr.markForCheck();

    // Сохраняем email шаблоны и цепочку параллельно
    Promise.all([
      this.saveEmailTemplates(form),
      this.saveChainTemplates(),  // NEW: Сохраняем цепочку
    ]).then(() => {
      this.submitQuiz(form);
    }).catch(err => {
      console.error('Ошибка сохранения шаблонов:', err);
      this.errorMessage = 'Ошибка сохранения email шаблонов';
      this.loading = false;
      this.cdr.markForCheck();
    });
  }

  /**
   * Сохранить email шаблоны для квиза (result)
   */
  private async saveEmailTemplates(form: QuizFormData): Promise<void> {
    if (!this.emailConfig || !this.emailHtml) return;
    
    if (!this.quizNumericId) {
      console.warn('Нет числового ID квиза, шаблоны будут сохранены после создания квиза');
      return;
    }

    const domain = this.getDomain();
    const app = this.getApp();

    const templateData = {
      domain,
      app,
      quiz_id: this.quizNumericId,
      type: 'result' as const,
      subject: this.emailConfig.greeting || 'Результаты квиза',
      html: this.emailHtml
    };

    // console.log('Saving result template with data:', templateData);

    return new Promise((resolve, reject) => {
      this.emailTemplateService.updateTemplateByClient(templateData).subscribe(result => {
        // console.log('Save result template:', result);
        if (result.success) {
          resolve();
        } else {
          reject(new Error(result.error || 'Ошибка сохранения шаблона'));
        }
      });
    });
  }

  /**
   * NEW: Сохранить цепочку писем
   */
private async saveChainTemplates(): Promise<void> {
  if (this.chainSteps.length === 0) {
    // console.log('Нет chain steps для сохранения');
    return;
  }

  const dirtySteps = this.chainSteps.filter(s => s.isDirty);
  if (dirtySteps.length === 0 && this.existingChainTemplates.length > 0) {
    // console.log('Нет изменений в chain steps');
    return;
  }

  if (!this.quizNumericId) {
    console.warn('Нет ID квиза, цепочка не будет сохранена');
    return;
  }

  const app = this.getApp();
  if (!app) {
    console.warn('App не задан, цепочка не будет сохранена');
    return;
  }

  const templates = this.chainSteps.map(step => ({
    step: step.step,
    delayMinutes: step.delayMinutes,
    subject: step.subject,
    html: step.html,
  }));

  // console.log('Saving chain templates:', { app, quizId: this.quizNumericId, templates });

  return new Promise((resolve, reject) => {
    this.emailTemplateService.upsertChainTemplatesBulk({
      app,
      quizId: this.quizNumericId!,
      chainType: 'PERSONAL',
      templates,
      domain: this.getDomain(),  // Для создания новых
    }).subscribe(result => {
      // console.log('Save chain templates result:', result);
      if (result.success) {
        this.chainSteps.forEach(s => s.isDirty = false);
        resolve();
      } else {
        reject(new Error(result.error || 'Ошибка сохранения цепочки'));
      }
    });
  });
}


  /**
   * Отправить данные квиза
   */
  private submitQuiz(form: QuizFormData): void {
    const submitData: QuizServerPayload = {
      ...form,
      questions: form.questions,
      landingId: Number(form.landingId)
    };

    this.save.emit(submitData);
    this.clearDraft();

    this.resultMessage = 'Квиз успешно сохранён!';
    this.loading = false;
    this.autoCloseMessage();
    this.cdr.markForCheck();
  }

  private validateForm(form: QuizFormData): boolean {
    this.errorMessage = null;

    if (!form.name?.trim()) {
      this.errorMessage = 'Название квиза обязательно';
      this.autoCloseErrorMessage();
      return false;
    }

    if (!form.typeQuizId?.trim()) {
      this.errorMessage = 'Уникальный ID квиза обязателен';
      this.autoCloseErrorMessage();
      return false;
    }

    if (form.landingId === 0) {
      this.errorMessage = 'Выберите лендинг';
      this.autoCloseErrorMessage();
      return false;
    }

    if (!form.endAt) {
      this.errorMessage = 'Укажите дату окончания';
      this.autoCloseErrorMessage();
      return false;
    }

    if (!form.questions?.length) {
      this.errorMessage = 'Добавьте хотя бы один вопрос';
      this.autoCloseErrorMessage();
      return false;
    }

    for (const [i, q] of form.questions.entries()) {
      if (!q.text?.trim()) {
        this.errorMessage = `Вопрос ${i + 1}: текст обязателен`;
        this.autoCloseErrorMessage();
        return false;
      }
      if (!q.answers?.length) {
        this.errorMessage = `Вопрос ${i + 1}: нужен хотя бы один ответ`;
        this.autoCloseErrorMessage();
        return false;
      }
      for (const [j, a] of q.answers.entries()) {
        if (!a.text?.trim()) {
          this.errorMessage = `Вопрос ${i + 1}, ответ ${j + 1}: текст обязателен`;
          this.autoCloseErrorMessage();
          return false;
        }
      }
    }

    return true;
  }

  private autoCloseErrorMessage(): void {
    setTimeout(() => {
      this.errorMessage = null;
      this.cdr.markForCheck();
    }, 3000);
  }

  onEmailConfigChange(config: EmailTemplateConfig): void {
    this.emailConfig = config;
  }

  onEmailHtmlChange(html: string): void {
    this.emailHtml = html;
  }

  /**
   * NEW: Обработчик изменений цепочки из редактора
   */
  onChainStepsChange(steps: ChainEmailStep[]): void {
    this.chainSteps = steps;
    // console.log('Chain steps updated from editor:', steps);
  }
  
  autoCloseMessage(): void {
    setTimeout(() => {
      this.resultMessage = '';
      this.cdr.markForCheck();
    }, 3000);
  }

  cancelMessage(): void {
    this.resultMessage = '';
    this.cdr.markForCheck();
  }
}