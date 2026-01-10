import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { EventsSites } from '../../interfaces/events-sites.interface';
import { SiteUsers } from '../../../../../interfaces/users.interface';
import { EventEmailPushService } from '../../../../../shared/services/event-email-push.service';
import { EventUsersFilterService } from '../../../../../shared/services/event-users-filter.service';

@Component({
  selector: 'app-event-email-push',
  templateUrl: './event-email-push.component.html',
  styleUrls: ['./event-email-push.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventEmailPushComponent implements OnChanges, OnInit {
  @Input() event!: EventsSites;
  @Input() templates: { id: number; name: string; instance: any }[] = [];
  @Input() siteUsers: SiteUsers[] = [];
  sendSuccess: boolean = false;
  sendError: boolean = false;
  sendReport: string = '';

  selectedWinTemplateId: number | null = null;
  selectedLoseTemplateId: number | null = null;
  selectedSubject: string = '';
  isSending = false;

  constructor(
    private emailPushService: EventEmailPushService,
    private eventUsersFilter: EventUsersFilterService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
      this.initDefaultTemplates();
    }

    ngOnChanges(changes: SimpleChanges): void {
      this.initDefaultTemplates();

      if (changes['siteUsers'] || changes['event'] || changes['templates']) {
        this.cdr.markForCheck();
      }
    }
    // Метод для подсчёта пользователей
  get usersCount(): number {
    const filtered = this.eventUsersFilter.getUsersForEvent(
      this.siteUsers,
      this.event.landing_url || '',
      this.event.id 
    );

    return filtered.length;
  }

  // ← Выносим логику в отдельный метод
  private initDefaultTemplates(): void {
    if (this.templates.length > 0) {
      // Устанавливаем только если ещё не выбрано
      if (this.selectedWinTemplateId === null) {
        this.selectedWinTemplateId = this.templates[0].id;
      }
      if (this.selectedLoseTemplateId === null) {
        this.selectedLoseTemplateId = this.templates[0].id;
      }
    }
  }

  getFilteredUsersForEvent(group: 'all' | 'win' | 'lose' = 'all'): SiteUsers[] {
    const users = this.eventUsersFilter.getUsersForEvent(
      this.siteUsers,
      this.event.landing_url || '',
      this.event.id
    );

    if (group === 'all' || this.event.result === null) {
      return users;
    }

    return users.filter(user => {
      const selected = Number(user.user_submit_data!['selected_option']);
      const isWinner = selected === this.event.result;
      return group === 'win' ? isWinner : !isWinner;
    });
  }
  // Просто логируем смену шаблона (можно убрать, если не нужен)
  onTemplateChange(type: 'win' | 'lose', value: string | number): void {
    const numValue = Number(value);

    if (type === 'win') {
      this.selectedWinTemplateId = isNaN(numValue) ? null : numValue;
    } else {
      this.selectedLoseTemplateId = isNaN(numValue) ? null : numValue;
    }

    console.log(`Template changed for ${type}:`, this.selectedWinTemplateId || this.selectedLoseTemplateId);
    this.cdr.markForCheck();
  }

async sendPush(): Promise<void> {
  if (this.isSending || !this.event.result) return;
  if (!this.selectedWinTemplateId || !this.selectedLoseTemplateId) return;

  const winTemplate = this.templates.find(t => t.id === this.selectedWinTemplateId);
  const loseTemplate = this.templates.find(t => t.id === this.selectedLoseTemplateId);

  if (!winTemplate || !loseTemplate) {
    this.showError('Шаблон не найден');
    return;
  }

  if (!winTemplate.instance?.htmlTemplate || !loseTemplate.instance?.htmlTemplate) {
    this.showError('У шаблона отсутствует HTML');
    return;
  }

  this.isSending = true;
  this.sendSuccess = false;
  this.sendError = false;
  this.cdr.markForCheck();

  try {
    await this.emailPushService.sendPush(
      this.event,
      this.siteUsers,
      this.selectedWinTemplateId,
      this.selectedLoseTemplateId,
      winTemplate.instance.htmlTemplate,
      loseTemplate.instance.htmlTemplate,
      this.selectedSubject
    );

    // Успех — Promise выполнился без ошибки
    const totalUsers = this.usersCount;
    this.showSuccess(`Успешно отправлено ${totalUsers} писем!`);

  } catch (err: any) {
    this.showError(err?.message || 'Ошибка при отправке email');
  } finally {
    this.isSending = false;
    this.cdr.markForCheck();

    // Автозакрытие через 5 сек
    setTimeout(() => {
      this.sendSuccess = false;
      this.sendError = false;
      this.cdr.markForCheck();
    }, 10000);
  }
}
  private showSuccess(message: string): void {
    this.sendSuccess = true;
    this.sendError = false;
    this.sendReport = message;
  }

  private showError(message: string): void {
    this.sendSuccess = false;
    this.sendError = true;
    this.sendReport = message;
  }
}