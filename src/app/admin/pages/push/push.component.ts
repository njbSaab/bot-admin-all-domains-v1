import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { NewsCategoryService, NewsCategory } from '../../../shared/services/news-category.service';
import { PushService } from '../../../shared/services/push.service';
import { UrlValidationService } from '../../../shared/services/url-validation.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

interface PollResult {
  pollId: string;
  question: string;
  options: string[];
  results: { optionId: number; count: number; optionText: string; userIds: number[]; timestamp:string; }[];
  error?: string;
  createdAt: string;
}

interface PushStatus {
  userId?: number | null;
  message: string;
  success: boolean;
  successCount?: number;
  failCount?: number;
  Username?: string;
  pollId?: string;
  question?: string;
  options?: string[];
  categoryId?: number;
}

interface FormatTag {
  tag: string;
  content: string;
  description: string;
}

interface PollPayload {
  question: string;
  options: string[];
  isAnonymous: boolean;
  allowsMultipleAnswers: boolean;
  isQuiz: boolean;
  correctOptionId?: number;
}

@Component({
  selector: 'app-push',
  templateUrl: './push.component.html',
  styleUrls: ['./push.component.scss'],
})
export class PushComponent implements OnInit, OnDestroy {
  contentMode: 'message' | 'poll' = 'message';
  pollMode: 'regular' | 'quiz' = 'regular';
  imageUrl: string = '';
  pushText: string = '';
  buttonName: string = '';
  buttonUrl: string = '';
  pollPayload: PollPayload = {
    question: '',
    options: [''],
    isAnonymous: true,
    allowsMultipleAnswers: false,
    isQuiz: false,
    correctOptionId: 0,
  };
  sendToAll: boolean = false;
  isSending: boolean = false;
  resultMessage: string = '';
  successMessage: string | null = null;
  errorMessage: string | null = null;
  pollResultsError: string | null = null;
  emptyMessage: boolean = true;
  categories: NewsCategory[] = [];
  selectedCategoryIds: number[] = [];
  pushStatuses: PushStatus[] = [];
  pollResults: PollResult[] = [];
  selectedPoll: PollResult | null = null;
  viewMode: 'all' | 'single' = 'all';
  private eventSource: EventSource | null = null;
  copiedStates: boolean[] = [];
  baseUrl = environment.auth.baseUrl

  formatTags: FormatTag[] = [
    { tag: '[Name]', content: '[Name]', description: 'Вставка Тг Ник' },
    { tag: '[u]', content: 'текст', description: 'Подчёркнутый текст' },
    { tag: '[s]', content: 'текст', description: 'Зачёркнутый текст' },
    { tag: '[sp]', content: 'текст', description: 'Спойлер' },
    { tag: '[code]', content: 'текст', description: 'Моноширинный текст' },
    { tag: '[pre]', content: 'текст', description: 'Блок кода' },
    { tag: '[quote]', content: 'текст', description: 'Цитата' },
    { tag: '[spoiler]', content: 'текст', description: 'Скрытый текст' },
  ];

  get currentDate(): string {
    return new Date().toISOString().slice(0, 10);
  }

  get filteredPushStatuses(): PushStatus[] {
    const userStatuses: PushStatus[] = [];
    const systemStatuses: PushStatus[] = [];

    const statusMap = new Map<string | null, PushStatus>();

    this.pushStatuses
      .filter((status) => !status.pollId)
      .forEach((status) => {
        const key = status.userId && status.userId !== 0 ? status.userId.toString() : null;
        statusMap.set(key, status);
      });

    const seenKeys = new Set<string | null>();
    for (const status of this.pushStatuses) {
      if (status.pollId) continue;
      const key = status.userId && status.userId !== 0 ? status.userId.toString() : null;
      if (!seenKeys.has(key)) {
        const latestStatus = statusMap.get(key);
        if (latestStatus) {
          if (key === null || latestStatus.userId === 0) {
            systemStatuses.push(latestStatus);
          } else {
            userStatuses.push(latestStatus);
          }
        }
        seenKeys.add(key);
      }
    }

    return [...userStatuses, ...systemStatuses];
  }

  getPollResults(): PollResult[] {
    return this.pollResults;
  }

  // Новый метод для получения количества голосов по индексу варианта
  getOptionCount(poll: PollResult, optionIndex: number): number {
    const result = poll.results.find(r => r.optionId === optionIndex);
    return result ? result.count : 0;
  }

  constructor(
    private pushService: PushService,
    private newsCategoryService: NewsCategoryService,
    public urlValidationService: UrlValidationService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const savedStatuses = sessionStorage.getItem('pushStatuses');
    if (savedStatuses) {
      this.pushStatuses = JSON.parse(savedStatuses);
    }

    const savedFormData = localStorage.getItem('pushFormData');
    if (savedFormData) {
      const formData = JSON.parse(savedFormData);
      this.imageUrl = formData.imageUrl || '';
      this.pushText = formData.pushText || '';
      this.buttonName = formData.buttonName || '';
      this.buttonUrl = formData.buttonUrl || '';
      this.selectedCategoryIds = formData.selectedCategoryIds || [];
      this.pollPayload = formData.pollPayload || {
        question: '',
        options: [''],
        isAnonymous: true,
        allowsMultipleAnswers: false,
        isQuiz: false,
        correctOptionId: 0,
      };
      this.contentMode = formData.contentMode || 'message';
      this.pollMode = formData.pollMode || 'regular';
    }

    this.copiedStates = new Array(this.formatTags.length).fill(false);

    this.newsCategoryService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
        console.log('Получены категории:', this.categories);
      },
      error: (err) => {
        console.error('Ошибка при получении категорий:', err);
      },
    });

    this.setupEventSource();
    this.loadAllPollResults();
  }

  ngOnDestroy(): void {
    if (this.eventSource) {
      this.eventSource.close();
    }
  }

  setupEventSource(): void {
    this.eventSource = new EventSource(`${this.baseUrl}/push/status`);
    this.eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('Получены данные от EventSource:', data);
      this.pushStatuses = [...this.pushStatuses, data];
      sessionStorage.setItem('pushStatuses', JSON.stringify(this.pushStatuses));
      if (data.successCount !== undefined) {
        this.resultMessage = data.message;
        if (data.pollIds && data.pollIds.length > 0) {
          console.log('Получены pollIds:', data.pollIds);
          data.pollIds.forEach((pollId: string) => this.loadPollResult(pollId));
        }
      }
      this.cdr.markForCheck();
    };
    this.eventSource.onerror = () => {
      console.error('Ошибка EventSource');
      this.eventSource?.close();
      this.isSending = false;
      this.cdr.markForCheck();
    };
  }

  loadAllPollResults(): void {
    this.viewMode = 'all';
    this.selectedPoll = null;
    this.pushService.getAllResults().subscribe({
      next: (response) => {
        console.log('Получены результаты всех опросов:', response);
        this.pollResults = response.results || [];
        this.pollResultsError = null;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Ошибка при загрузке всех результатов опросов:', err);
        this.pollResultsError = 'Не удалось загрузить результаты опросов';
        this.cdr.markForCheck();
      },
    });
  }

  loadPollResult(pollId: string): void {
    console.log(`Запрос результатов для pollId: ${pollId}`);
    this.pushService.getPollResults(pollId).subscribe({
      next: (result) => {
        console.log(`Результаты для pollId ${pollId}:`, result);
        this.selectedPoll = result;
        this.viewMode = 'single';
        this.pollResultsError = null;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error(`Ошибка при загрузке результатов опроса ${pollId}:`, err);
        this.pollResultsError = `Не удалось загрузить результаты для опроса ${pollId}`;
        this.cdr.markForCheck();
      },
    });
  }

  showPollDetails(poll: PollResult): void {
    console.log(`Переход к деталям опроса: ${poll.pollId}`);
    this.loadPollResult(poll.pollId);
  }

  goBackToAllPolls(): void {
    console.log('Возврат к списку всех опросов');
    this.loadAllPollResults();
  }

  setContentMode(mode: 'message' | 'poll'): void {
    this.contentMode = mode;
    this.saveFormData();
    this.cdr.markForCheck();
  }

  setPollMode(mode: 'regular' | 'quiz'): void {
    this.pollMode = mode;
    this.pollPayload.isQuiz = mode === 'quiz';
    this.pollPayload.allowsMultipleAnswers =
      mode === 'regular' ? this.pollPayload.allowsMultipleAnswers : false;
    this.saveFormData();
    this.cdr.markForCheck();
  }

  checkFormValidity(): void {
    this.emptyMessage = !this.pushText?.trim() && !this.imageUrl?.trim();
    this.cdr.markForCheck();
  }

  checkPollValidity(): void {
    this.cdr.markForCheck();
  }

  isPollValid(): boolean | string {
    return (
      this.pollPayload.question.trim() &&
      this.pollPayload.options.length >= 2 &&
      this.pollPayload.options.every((option) => option.trim()) &&
      (this.pollMode !== 'quiz' || this.pollPayload.correctOptionId !== undefined)
    );
  }

  addPollOption(): void {
    if (this.pollPayload.options.length < 10) {
      this.pollPayload.options = [...this.pollPayload.options, ''];
    }
    this.saveFormData();
  }

  trackByOption(index: number, option: string): number {
    return index;
  }

  onSendToAllChange(): void {
    this.saveFormData();
  }

  onCategoryChange(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    const categoryId = parseInt(checkbox.value, 10);
    if (checkbox.checked) {
      if (!this.selectedCategoryIds.includes(categoryId)) {
        this.selectedCategoryIds.push(categoryId);
      }
    } else {
      this.selectedCategoryIds = this.selectedCategoryIds.filter(
        (id) => id !== categoryId
      );
    }
    console.log('Выбранные категории:', this.selectedCategoryIds);
    this.saveFormData();
  }

  saveFormData(): void {
    const formData = {
      imageUrl: this.imageUrl,
      pushText: this.pushText,
      buttonName: this.buttonName,
      buttonUrl: this.buttonUrl,
      selectedCategoryIds: this.selectedCategoryIds,
      pollPayload: this.pollPayload,
      contentMode: this.contentMode,
      pollMode: this.pollMode,
    };
    localStorage.setItem('pushFormData', JSON.stringify(formData));
  }

  refreshImage(): void {
    this.clearMessages();
    this.saveFormData();
  }

  copyTagContent(index: number): void {
    const tag = this.formatTags[index];
    const content =
      tag.tag === '[Name]'
        ? tag.tag
        : `${tag.tag}${tag.content}${tag.tag.replace('[', '[/')}`;
    navigator.clipboard.writeText(content).then(() => {
      this.copiedStates[index] = true;
      setTimeout(() => {
        this.copiedStates[index] = false;
        this.cdr.markForCheck();
      }, 3000);
    }).catch((err) => {
      console.error('Ошибка при копировании содержимого тега:', err);
    });
  }

  sendPush(): void {
    const payload = {
      imageUrl: this.imageUrl?.trim() || '',
      text: this.pushText?.trim() || '',
      buttonName: this.buttonName?.trim() || '',
      buttonUrl: this.buttonUrl?.trim() || '',
      categoryIds: this.selectedCategoryIds,
    };

    this.isSending = true;
    this.resultMessage = '';
    this.pushStatuses = [];
    sessionStorage.removeItem('pushStatuses');

    if (
      !payload.imageUrl &&
      !payload.text &&
      !payload.buttonName &&
      !payload.buttonUrl
    ) {
      this.resultMessage = 'Нужно ввести хотя бы текст, картинку или кнопку';
      this.isSending = false;
      return;
    }

    this.pushService.sendPush(payload).subscribe({
      next: (res) => {
        this.isSending = false;
        this.successMessage = res.message;
        this.imageUrl = '';
        this.pushText = '';
        this.buttonName = '';
        this.buttonUrl = '';
        this.selectedCategoryIds = [];
        localStorage.removeItem('pushFormData');
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Ошибка при отправке push уведомления', err);
        this.resultMessage = 'Ошибка при отправке уведомления';
        this.isSending = false;
        this.eventSource?.close();
        this.cdr.markForCheck();
      },
    });
  }

  sendPoll(): void {
    if (!this.isPollValid()) {
      alert(
        'Заполните вопрос, минимум два варианта ответа и, для викторины, выберите правильный ответ'
      );
      return;
    }

    const payload = {
      question: this.pollPayload.question.trim(),
      options: this.pollPayload.options
        .map((option) => option.trim())
        .filter((option) => option),
      isAnonymous: this.pollPayload.isAnonymous,
      allowsMultipleAnswers:
        this.pollMode === 'regular' ? this.pollPayload.allowsMultipleAnswers : false,
      isQuiz: this.pollMode === 'quiz',
      correctOptionId:
        this.pollMode === 'quiz' ? this.pollPayload.correctOptionId : undefined,
      categoryIds: this.selectedCategoryIds,
    };

    this.isSending = true;
    this.resultMessage = '';
    this.pushStatuses = [];
    sessionStorage.removeItem('pushStatuses');

    this.pushService.sendPoll(payload).subscribe({
      next: (res) => {
        this.isSending = false;
        this.successMessage = res.message;
        this.pollPayload.question = '';
        this.pollPayload.options = [''];
        this.pollPayload.correctOptionId = 0;
        this.selectedCategoryIds = [];
        localStorage.removeItem('pushFormData');
        this.cdr.markForCheck();
        this.loadAllPollResults();
      },
      error: (err) => {
        console.error('Ошибка при отправке опроса', err);
        this.resultMessage = 'Ошибка при отправке опроса';
        this.isSending = false;
        this.eventSource?.close();
        this.cdr.markForCheck();
      },
    });
  }

  clearStatuses(): void {
    this.pushStatuses = [];
    sessionStorage.removeItem('pushStatuses');
    this.cdr.markForCheck();
  }

  clearPollResults(): void {
    this.pollResults = [];
    this.pollResultsError = null;
    this.viewMode = 'all';
    this.selectedPoll = null;
    this.cdr.markForCheck();
  }

  cancelMessage(): void {
    this.resultMessage = '';
  }

  clearMessages(): void {
    this.successMessage = null;
    this.errorMessage = null;
    this.cdr.markForCheck();
  }
}