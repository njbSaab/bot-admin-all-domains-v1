import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { EventsSitesService } from '../../../shared/services/events-sites.service';
import { EventsLandingsService } from '../../../shared/services/events-land.services';
import { SiteUsersService } from '../../../shared/services/site-users.service';
import { EmailMessage } from '../../../shared/services/users-emails.service';
import { EmailTemplatesService } from '../../../shared/services/email-template.services';
import { SiteUsers } from '../../../interfaces/users.interface';
import { UrlValidationService } from '../../../shared/services/url-validation.service';
import { Subscription, interval } from 'rxjs';
import { forkJoin } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {EventsSites} from './interfaces/events-sites.interface'
import {EventsLandings} from './interfaces/events-landings'
import {dataSports} from './data/sports'
import {dataSportBackgrounds} from './data/sportsBackgrounds'
import { NewEvent, defaultNewEvent } from './types/new-event.type';
import { EventUsersFilterService } from '../../../shared/services/event-users-filter.service';

@Component({
  selector: 'app-events-sites',
  templateUrl: './events-sites.component.html',
  styleUrls: ['./events-sites.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventsSitesComponent implements OnInit, OnDestroy {
  loading: boolean = true;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  events: EventsSites[] = [];
  landings: EventsLandings[] = [];
  siteUsers: SiteUsers[] = [];
  emailMessages: EmailMessage[] = [];
  templates: { id: number; name: string; instance: any }[] = [];
  selectedWinTemplateId: number | null = null;
  selectedLoseTemplateId: number | null = null;
  selectedLandingUrl: string | null = null;
  uniqueLandingUrls: string[] = [];
  isCreatingEvent: boolean = false;
  isSending: boolean = false;
  selectedGroup: { [eventId: number]: 'all' | 'win' | 'lose' } = {};
  uniqueLatestLandings: EventsLandings[] = [];
  selectedSubject: string = '';
  imageUrl = environment.auth.imageUrl;
  sports: string[] = dataSports;
  sportBackgrounds = dataSportBackgrounds
  newEvent: NewEvent = defaultNewEvent();

  private timerInterval: any;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private eventsSitesService: EventsSitesService,
    private landingsService: EventsLandingsService,
    private siteUsersService: SiteUsersService,
    private emailTemplatesService: EmailTemplatesService,
    public urlValidationService: UrlValidationService,
    private cdr: ChangeDetectorRef,
    private eventUsersFilter: EventUsersFilterService
  ) {}

  ngOnInit(): void {
    this.loadSelectedLandingUrl();
    this.newEvent.landing_url = this.selectedLandingUrl || '';
    this.loadData();
    this.subscriptions.add(
      interval(15 * 60 * 1000).subscribe(() => this.loadData())
    );
  }

  private resetNewEvent(): void {
    this.newEvent = {
      name: '',
      type: '',
      endAt: '',
      memberA: '',
      memberB: '',
      imageMemberA: null,
      imageMemberB: null,
      imageBgDesk: null,
      imageBgMob: null,
      grandPrize: null,
      everyoneForPrize: null,
      landing_url: this.selectedLandingUrl || '',
      status: 'active',
      result: null,
    };
  }

  ngOnDestroy(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    this.subscriptions.unsubscribe();
  }

  onSportChange(): void {
    if (this.newEvent.name && this.sports.includes(this.newEvent.name)) {
      const backgrounds = this.sportBackgrounds[this.newEvent.name];
      this.newEvent.imageBgDesk = backgrounds.imageBgDesk;
      this.newEvent.imageBgMob = backgrounds.imageBgMob;
    } else {
      this.newEvent.imageBgDesk = null;
      this.newEvent.imageBgMob = null;
    }
    this.cdr.markForCheck();
  }

  get filteredEvents(): EventsSites[] {
    let filtered = this.selectedLandingUrl
      ? this.events.filter(event => event.landing_url === this.selectedLandingUrl)
      : this.events;

    // Sort events: active first, then inactive/ended sorted by createdAt (newest first)
    return filtered.sort((a, b) => {
      if (a.status === 'active' && b.status !== 'active') return -1;
      if (b.status === 'active' && a.status !== 'active') return 1;
      if (a.status !== 'active' && b.status !== 'active') {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA; // Newest first
      }
      return 0;
    });
  }

  get selectedLanding(): EventsLandings | undefined {
    return this.landings.find(landing => landing.url === this.selectedLandingUrl);
  }

  private loadSelectedLandingUrl(): void {
    const savedLandingUrl = localStorage.getItem('eventLandingUrlFilter');
    this.selectedLandingUrl = savedLandingUrl === 'null' ? null : savedLandingUrl;
  }

  // Обновление кэша в loadData
  private loadData(): void {
    this.loading = true;
    const sub = forkJoin({
      landings: this.landingsService.getLandings(),
      events: this.eventsSitesService.getAdminEvents(),
      templates: this.emailTemplatesService.getTemplates(),
      users: this.siteUsersService.getSiteUsers(),
    }).subscribe({
      next: ({ landings, events, templates, users }) => {
        this.landings = landings;

        // ← ВАЖНО: вызываем ДО присвоения events
        this.updateUniqueLandingUrls();

        this.events = events.map(event => ({
          ...event,
          isEditing: false,
          // countdown теперь не нужен — таймер сам считает
          landing_url: event.landing_url,
          result: event.result ?? null,
          status: event.status || 'active',
        }));

        this.templates = templates;
        console.log('tempates', this.templates)
        this.siteUsers = [...users.filter(user => user.email && user.email.trim().length > 0)];

        this.eventUsersFilter.clearCache();

        this.loading = false;
        this.isCreatingEvent = this.canCreateEvent();
        this.successMessage = 'Данные успешно загружены';
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.errorMessage = `Ошибка загрузки данных: ${err.message}`;
        this.cdr.markForCheck();
        this.loading = false;

        // ← Даже при ошибке (например, 404 на events) — лендинги могут быть загружены
        // Попробуем обновить список лендингов
        if (this.landings.length > 0) {
          this.updateUniqueLandingUrls();
          this.cdr.markForCheck();
        }
      },
    });
    this.subscriptions.add(sub);
  }

  private updateUniqueLandingUrls(): void {
    const latestLandingsMap = new Map<string, EventsLandings>();

    this.landings.forEach(landing => {
      if (!landing.url) return;
      const existing = latestLandingsMap.get(landing.url);
      if (!existing || new Date(landing.createdAt).getTime() > new Date(existing.createdAt).getTime()) {
        latestLandingsMap.set(landing.url, landing);
      }
    });

    const extractNumberFromUrl = (url: string): number => {
      const match = url.match(/\/vote\/(\d+)/);
      return match ? Number(match[1]) : Infinity;
    };

    const newUniqueLatestLandings = Array.from(latestLandingsMap.values())
      .sort((a, b) => extractNumberFromUrl(a.url) - extractNumberFromUrl(b.url));

    // Сравниваем по длине и содержимому (надёжно)
    const hasChanged =
      this.uniqueLatestLandings.length !== newUniqueLatestLandings.length ||
      this.uniqueLatestLandings.some((old, i) => old.url !== newUniqueLatestLandings[i].url);

    if (hasChanged) {
      this.uniqueLatestLandings = newUniqueLatestLandings;

      // Если сохранённый URL больше не существует — сбрасываем
      if (this.selectedLandingUrl && !this.uniqueLatestLandings.some(l => l.url === this.selectedLandingUrl)) {
        this.selectedLandingUrl = null;
        localStorage.setItem('eventLandingUrlFilter', 'null');
      }

      // Если ничего не выбрано и есть лендинги — выбираем первый
      if (!this.selectedLandingUrl && this.uniqueLatestLandings.length > 0) {
        this.selectedLandingUrl = this.uniqueLatestLandings[0].url;
        localStorage.setItem('eventLandingUrlFilter', this.selectedLandingUrl);
      }

      this.isCreatingEvent = this.canCreateEvent();
      this.cdr.markForCheck();
    }
  }

  onLandingUrlFilterChange(): void {
    localStorage.setItem('eventLandingUrlFilter', this.selectedLandingUrl === null ? 'null' : this.selectedLandingUrl);
    this.isCreatingEvent = this.canCreateEvent();
    this.newEvent.landing_url = this.selectedLandingUrl || '';
    this.cdr.markForCheck();
  }

  toggleCreateEvent(): void {
    if (!this.canCreateEvent()) {
      this.errorMessage = 'Нельзя создать новое событие, пока лендинг не имеет статус "inactive"';
      this.cdr.markForCheck();
      return;
    }
    this.isCreatingEvent = !this.isCreatingEvent;
    if (!this.isCreatingEvent) {
      this.resetNewEvent();
    } else {
      this.newEvent.landing_url = this.selectedLandingUrl || '';
    }
    this.clearMessages();
    this.cdr.markForCheck();
  }

  cancelCreateEvent(): void {
    this.isCreatingEvent = false;
    this.resetNewEvent();
    this.clearMessages();
    this.cdr.markForCheck();
  }

  canCreateEvent(): boolean {
    const landing = this.landings.find(l => l.url === this.selectedLandingUrl);
    return landing?.status === '0' || !this.selectedLandingUrl;
  }

  hasAnyEvent(landingUrl: string): boolean {
    return this.events.some(event => event.landing_url === landingUrl);
  }

  hasActiveEvent(landingUrl: string = this.selectedLandingUrl || ''): boolean {
    return this.events.some(event => 
      event.landing_url === landingUrl && 
      event.status === 'active' && 
      event.endAt &&
      new Date(event.endAt).getTime() > Date.now()
    );
  }

  getActiveEventTypeEventId(landingUrl: string): string | null | undefined {
    const event = this.events.find(event => 
      event.landing_url === landingUrl && 
      event.status === 'active' && 
      event.endAt &&
      new Date(event.endAt).getTime() > Date.now()
    );
    return event ? event.typeEventId : null;
  }

  createEvent(): void {
    if (this.hasActiveEvent(this.newEvent.landing_url!)) {
      this.errorMessage = 'На этом лендинге уже есть активное событие';
      this.cdr.markForCheck();
      return;
    }

    if (
      !this.newEvent.name ||
      !this.sports.includes(this.newEvent.name) ||
      !this.newEvent.type ||
      !this.newEvent.endAt ||
      !this.newEvent.memberA ||
      !this.newEvent.memberB ||
      !this.newEvent.landing_url ||
      (this.newEvent.imageMemberA && !this.urlValidationService.isValidImageUrl(this.newEvent.imageMemberA)) ||
      (this.newEvent.imageMemberB && !this.urlValidationService.isValidImageUrl(this.newEvent.imageMemberB))
    ) {
      this.errorMessage = 'Пожалуйста, заполните все обязательные поля корректно и выберите вид спорта из списка';
      this.cdr.markForCheck();
      return;
    }

    const endAtDate = new Date(this.newEvent.endAt!).toISOString().slice(0, 10).replace(/-/g, '');
    const typeEventId = `${this.newEvent.type!.toLowerCase().replace(/\s+/g, '-')}-${this.newEvent.name!.toLowerCase().replace(/\s+/g, '-')}-${endAtDate}-${this.newEvent.memberA!.toLowerCase().replace(/\s+/g, '-')}-${this.newEvent.memberB!.toLowerCase().replace(/\s+/g, '-')}`;

    const checkSub = this.eventsSitesService.getAdminEvents().subscribe({
      next: (events) => {
        if (events.some(event => event.typeEventId === typeEventId)) {
          this.errorMessage = `Событие с typeEventId "${typeEventId}" уже существует`;
          this.cdr.markForCheck();
          return;
        }

        const eventData: Partial<EventsSites> = {
          typeEventId,
          name: this.newEvent.name,
          type: this.newEvent.type,
          endAt: new Date(this.newEvent.endAt!).toISOString(),
          memberA: this.newEvent.memberA,
          memberB: this.newEvent.memberB,
          imageMemberA: this.newEvent.imageMemberA || null,
          imageMemberB: this.newEvent.imageMemberB || null,
          imageBgDesk: this.newEvent.imageBgDesk || null,
          imageBgMob: this.newEvent.imageBgMob || null,
          grandPrize: this.newEvent.grandPrize || null,
          everyoneForPrize: this.newEvent.everyoneForPrize || null,
          landing_url: this.newEvent.landing_url,
          status: 'active',
          result: null,
        };

        const createSub = this.eventsSitesService.createEvent(eventData).subscribe({
          next: (newEvent) => {
            const landing = this.landings.find(l => l.url === newEvent.landing_url);
            if (landing) {
              this.landingsService.updateLanding(landing.id, { status: 'active' }).subscribe({
                next: () => {
                  this.successMessage = 'Событие создано, и статус лендинга обновлён на active!';
                  landing.status = 'active';
                  this.isCreatingEvent = false;
                  this.resetNewEvent();
                  this.loadData();
                  setTimeout(() => {
                    this.closeMessages();
                  }, 3000);
                },
                error: (err: any) => {
                  this.errorMessage = `Ошибка при обновлении статуса лендинга: ${err.message}`;
                  this.cdr.markForCheck();
                },
              });
            } else {
              this.successMessage = 'Событие успешно создано!';
              this.isCreatingEvent = false;
              this.resetNewEvent();
              this.loadData();
              setTimeout(() => {
                this.closeMessages();
              }, 3000);
            }
          },
          error: (err) => {
            this.errorMessage = `Ошибка при создании события: ${err.message}`;
            this.cdr.markForCheck();
          },
        });
        this.subscriptions.add(createSub);
      },
      error: (err) => {
        this.errorMessage = `Ошибка при проверке typeEventId: ${err.message}`;
        this.cdr.markForCheck();
      },
    });
    this.subscriptions.add(checkSub);
  }

  toggleEdit(event: EventsSites): void {
    if (event.status === 'inactive') {
      this.errorMessage = 'Редактирование завершённых или неактивных событий запрещено';
      this.cdr.markForCheck();
      return;
    }
    event.isEditing = !event.isEditing;
    if (!event.isEditing) {
      this.loadData();
    }
    this.clearMessages();
    this.cdr.markForCheck();
  }

  saveChanges(event: EventsSites): void {
    console.log('Starting saveChanges for event:', JSON.stringify(event, null, 2));
  
    if (event.result !== null && ![1, 2, 3].includes(Number(event.result))) {
      this.errorMessage = 'Некорректный результат события. Выберите 1, 2 или 3';
      console.log('Invalid result value:', event.result);
      this.cdr.markForCheck();
      return;
    }
  
    const updateData: Partial<EventsSites> = {
    name: event.name,
    type: event.type,
    endAt: event.endAt ? new Date(event.endAt).toISOString() : undefined,
    memberA: event.memberA,
    memberB: event.memberB,
    imageMemberA: event.imageMemberA,
    imageMemberB: event.imageMemberB,
    imageBgDesk: event.imageBgDesk,
    imageBgMob: event.imageBgMob,
    grandPrize: event.grandPrize,
    everyoneForPrize: event.everyoneForPrize,
    status: event.status,
    result: event.result !== null ? Number(event.result) : null,
    };
  
    console.log('Update data being sent:', JSON.stringify(updateData, null, 2));
  
    console.log('Attempting to send PATCH request for event:', event.typeEventId);
    const sub = this.eventsSitesService.updateEventById(event.id, updateData).subscribe({
        next: (updatedEvent) => {
          Object.assign(event, updatedEvent, { isEditing: false });
          this.successMessage = 'Событие успешно обновлено!';
          this.loadData();
          this.cdr.markForCheck();
        },
        error: (err) => {
          this.errorMessage = `Ошибка: ${err.message}`;
          this.cdr.markForCheck();
        }
      });
        this.subscriptions.add(sub);
  }

  onResultChange(newResult: number | null, event: EventsSites): void {
    console.log('Result changed for event:', event.typeEventId, 'New result:', newResult);
    event.result = newResult !== null ? Number(newResult) : null;
    this.saveChanges(event);
  }
  refreshImage(event: Partial<EventsSites>): void {
    this.clearMessages();
    this.cdr.markForCheck();
  }
  loadTemplates(): void {
    const sub = this.emailTemplatesService.getTemplates().subscribe({
      next: (templates) => {
        this.templates = templates;
        if (templates.length > 0) {
          this.selectedWinTemplateId = templates[0].id;
          this.selectedLoseTemplateId = templates[0].id;
        }
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.errorMessage = 'Ошибка при загрузке шаблонов';
        this.cdr.markForCheck();
      },
    });
    this.subscriptions.add(sub);
  }
  loadSiteUsers(): void {
    const sub = this.siteUsersService.getSiteUsers().subscribe({
      next: (data) => {
        this.siteUsers = data.filter(user => user.email && user.email.trim().length > 0);
        console.log('Loaded site users in loadSiteUsers:', JSON.stringify(this.siteUsers, null, 2));
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.errorMessage = 'Ошибка при загрузке пользователей сайта';
        this.cdr.markForCheck();
      },
    });
    this.subscriptions.add(sub);
  }
  getUsersForEvent(landingUrl: string, eventId?: number): SiteUsers[] {
    return this.eventUsersFilter.getUsersForEvent(this.siteUsers, landingUrl, eventId);
  }
  getFilteredUsersForEvent(
    landingUrl: string | undefined,
    eventId: number,
    result: number | null,
    group: 'all' | 'win' | 'lose' = 'all'
  ): SiteUsers[] {
    if (!landingUrl) return [];
    return this.eventUsersFilter.getFilteredUsersForEvent(
      this.siteUsers,
      landingUrl,
      eventId,
      result ?? null,
      group
    );
  }
  
  closeMessages(): void {
    this.successMessage = null;
    this.errorMessage = null;
    this.cdr.markForCheck();
  }
  clearMessages(): void {
    this.successMessage = null;
    this.errorMessage = null;
    this.cdr.markForCheck();
  }
}
