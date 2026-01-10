// src/app/pages/email-sent/email-sent.component.ts
import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../../shared/services/users.service';
import { SiteUsersService } from '../../../shared/services/site-users.service';
import { UsersEmailsService, EmailMessage } from '../../../shared/services/users-emails.service';
import { EmailTemplatesService } from '../../../shared/services/email-template.services';
import { User, SiteUsers } from '../../../interfaces/users.interface';
import { DomSanitizer } from '@angular/platform-browser';
import { MainEmail } from '../email-sent/email-templates/main-email';
import { TableColumn } from './components/users-table/users-table.component';
import {dataTelegramColumns, dataSiteColumns} from './data/table-columns';

type SendMode = 'manual' | 'telegram' | 'site';
@Component({
  selector: 'app-email-sent',
  templateUrl: './email-sent.component.html',
  styleUrls: ['./email-sent.component.scss'],
})
export class EmailSentComponent implements OnInit {
  sendMode: 'manual' | 'telegram' | 'site' | null = null;
  emailSubject: string = '';
  emailContent: string = '';
  isSending: boolean = false;
  resultMessage: string = '';
  users: User[] = [];
  siteUsers: SiteUsers[] = [];
  emailMessages: EmailMessage[] = [];
  useTemplate: boolean = false;
  whoSent: string[] = [];
  telegramUsersEmails: string[] = [];
  siteUsersEmails: string[] = [];
  selectedSiteUrl: string | null = null;

  templates: { id: number; name: string; instance: MainEmail }[] = [];
  selectedTemplate: MainEmail | null = null;
  selectedTemplateId: number | null = null;
  telegramColumns: TableColumn[] = dataTelegramColumns;
  siteColumns: TableColumn[] = dataSiteColumns;

  constructor(
    private usersService: UsersService,
    private siteUsersService: SiteUsersService,
    private usersEmailsService: UsersEmailsService,
    private emailTemplatesService: EmailTemplatesService,
    private sanitizer: DomSanitizer
  ) {}

ngOnInit(): void {
  // Восстанавливаем сохранённый режим (по умолчанию — manual)
  const savedSendMode = localStorage.getItem('emailSendMode') as SendMode | null;
  this.sendMode = savedSendMode || 'manual'; // дефолт — manual

  const savedSiteUrl = localStorage.getItem('emailSiteUrlFilter');
  if (savedSiteUrl && savedSiteUrl !== 'null') {
    this.selectedSiteUrl = savedSiteUrl;
  }

  this.loadUsers();
  this.loadTemplates();

  const savedChoice = localStorage.getItem('emailContentChoice');
  this.useTemplate = savedChoice === 'template';
}

setSendMode(mode: 'manual' | 'telegram' | 'site'): void {
  this.sendMode = mode;
  localStorage.setItem('emailSendMode', mode); // сохраняем выбор

  if (mode === 'telegram' || mode === 'site') {
    this.whoSent = [];
  }
}

  loadUsers(): void {
    this.usersService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.telegramUsersEmails = data
          .filter((user) => !!user.email && user.email.trim().length > 0)
          .map((user) => user.email as string);
      },
      error: (err) => {
        console.error('Ошибка при загрузке Telegram пользователей:', err);
        this.resultMessage = 'Ошибка при загрузке Telegram пользователей';
      },
    });

    this.siteUsersService.getSiteUsers().subscribe({
      next: (data) => {
        this.siteUsers = data;
        this.updateSiteUsersEmails();
        if (this.selectedSiteUrl && !this.uniqueSiteUrls.includes(this.selectedSiteUrl)) {
          this.selectedSiteUrl = null;
          localStorage.setItem('emailSiteUrlFilter', 'null');
        }
        if (!this.selectedSiteUrl && this.uniqueSiteUrls.length > 0) {
          this.selectedSiteUrl = this.uniqueSiteUrls[0];
          localStorage.setItem('emailSiteUrlFilter', this.selectedSiteUrl);
          this.updateSiteUsersEmails();
        }
      },
      error: (err) => {
        console.error('Ошибка при загрузке Site пользователей:', err);
        this.resultMessage = 'Ошибка при загрузке Site пользователей';
      },
    });
  }

  updateSiteUsersEmails(): void {
    this.siteUsersEmails = this.siteUsers
      .filter((user) => {
        return (
          !!user.email &&
          user.email.trim().length > 0 &&
          (!this.selectedSiteUrl || user.site_url === this.selectedSiteUrl)
        );
      })
      .map((user) => user.email as string);
  }

  get filteredSiteUsers(): SiteUsers[] {
    return this.siteUsers.filter(
      (user) => !this.selectedSiteUrl || user.site_url === this.selectedSiteUrl
    );
  }

  get uniqueSiteUrls(): string[] {
    return [...new Set(this.siteUsers.map((user) => user.site_url))].filter(
      (url) => url !== undefined && url !== null
    ) as string[];
  }

  onSiteUrlFilterChange(): void {
    localStorage.setItem('emailSiteUrlFilter', this.selectedSiteUrl === null ? 'null' : this.selectedSiteUrl);
    this.updateSiteUsersEmails();
  }

  loadTemplates(): void {
    this.emailTemplatesService.getTemplates().subscribe({
      next: (templates) => {
        this.templates = templates;
        console.log('Загруженные шаблоны:', this.templates);
        if (templates.length > 0) {
          const templateToSelect = this.selectedTemplateId
            ? templates.find((t) => t.id === this.selectedTemplateId) || templates[0]
            : templates[0];
          this.selectTemplate(templateToSelect.instance, templateToSelect.id);
        } else {
          this.selectedTemplate = null;
          this.selectedTemplateId = null;
          this.resultMessage = this.resultMessage || 'Шаблоны не найдены';
        }
      },
      error: (err) => {
        console.error('Ошибка при загрузке шаблонов:', err);
        this.resultMessage = 'Ошибка при загрузки шаблонов';
      },
    });
  }


  sendEmails(): void {
    if (!this.emailSubject.trim()) {
      this.resultMessage = 'Введите тему письма';
      return;
    }

    if (!this.useTemplate && !this.emailContent.trim()) {
      this.resultMessage = 'Введите содержимое письма';
      return;
    }

    let emailsToSend: string[] = [];
    if (this.sendMode === 'telegram') {
      emailsToSend = [...new Set(this.telegramUsersEmails)];
    } else if (this.sendMode === 'site') {
      if (!this.selectedSiteUrl) {
        this.resultMessage = 'Выберите конкретный сайт для отправки';
        return;
      }
      emailsToSend = [...new Set(this.siteUsersEmails)];
    } else if (this.sendMode === 'manual') {
      emailsToSend = [...new Set(this.whoSent)];
    }

    if (emailsToSend.length === 0) {
      this.resultMessage = 'Нет email для отправки';
      return;
    }

    this.isSending = true;
    this.resultMessage = '';

    if (this.useTemplate && !this.selectedTemplate) {
      this.resultMessage = 'Шаблон не выбран';
      this.isSending = false;
      return;
    }

    const contentToSend = this.useTemplate ? this.selectedTemplate?.htmlTemplate ?? '' : this.emailContent;
    const isHtml = this.useTemplate; // если шаблон — 100% HTML

    const sendAttempt = (emails: string[], attempt = 1, maxAttempts = 3) => {
      this.usersEmailsService.sendBulkEmails(emails, this.emailSubject, contentToSend,isHtml).subscribe({
        next: (response) => {
          console.log('Ответ сервера при отправке писем:', response);
          // Успех, если запрос завершился с 200 OK
          const message = response?.message || 'Письма успешно отправлены';
          // Используем emails из запроса, так как сервер может не возвращать sentEmails
          const sentEmails = response?.sentEmails?.length ? response.sentEmails : emails;

          this.resultMessage = message;
          // Формируем массив сообщений для таблицы
          const emailMessages: EmailMessage[] = sentEmails.map((email: string) => ({
            email,
            subject: this.emailSubject,
            content: contentToSend,
            status: 'sent' as const,
            isSent: true,
            sentAt: new Date().toISOString(),
          }));

          // Добавляем сообщения в массив для отображения в таблице
          this.emailMessages = [...this.emailMessages, ...emailMessages];

          this.isSending = false;
          this.emailSubject = '';
          this.emailContent = '';
          this.whoSent = [];
        },
        error: (err) => {
          console.error('Ошибка при отправке писем:', err);
          this.resultMessage = err || 'Ошибка при отправке писем';
          this.isSending = false;

          // Добавляем emails в таблицу с статусом 'failed'
          const emailMessages: EmailMessage[] = emails.map((email: string) => ({
            email,
            subject: this.emailSubject,
            content: contentToSend,
            status: 'failed' as const,
            isSent: false,
            sentAt: new Date().toISOString(),
          }));
          this.emailMessages = [...this.emailMessages, ...emailMessages];

          // Если ошибка связана с CORS, но письма отправлены, логируем
          if (err.includes('CORS')) {
            console.warn('CORS-ошибка, но запрос может быть успешен. Проверьте серверные логи.');
          }
        },
      });
    };

    sendAttempt(emailsToSend);
  }

  createNewTemplate(): void {
    const name = prompt('Введите имя нового шаблона:', 'New Template');
    if (!name) {
      this.resultMessage = 'Имя шаблона не указано';
      return;
    }
    const newTemplate = new MainEmail(this.sanitizer);
    this.templates.push({ id: 0, name, instance: newTemplate });
    this.selectTemplate(newTemplate, 0);
    this.resultMessage = 'Новый шаблон создан';
  }

  saveTemplate(): void {
    if (!this.selectedTemplate) {
      this.resultMessage = 'Выберите шаблон для сохранения';
      return;
    }

    const name = prompt('Введите имя шаблона:', 'New Template');
    if (!name) {
      this.resultMessage = 'Имя шаблона не указано';
      return;
    }

    if (confirm(`Создать новый шаблон с именем "${name}"?`)) {
      const templateData = this.selectedTemplate.getTemplateData();
      // console.log('Данные перед сохранением:', JSON.stringify(templateData, null, 2));
      this.emailTemplatesService.saveTemplate(name, templateData).subscribe({
        next: (response) => {
          // console.log('Ответ сервера:', response);
          this.resultMessage = `Новый шаблон "${name}" успешно сохранен`;
          this.selectedTemplateId = response.id;
          this.loadTemplates();
        },
        error: (err) => {
          console.error('Ошибка при сохранении шаблона:', err);
          this.resultMessage = err.message || 'Ошибка при сохранении шаблона';
        },
      });
    }
  }
  updateTemplate(): void {
    if (!this.selectedTemplate || !this.selectedTemplateId || this.selectedTemplateId === 0) {
      this.resultMessage = 'Выберите сохранённый шаблон для обновления';
      return;
    }

    const currentName = this.templates.find(t => t.id === this.selectedTemplateId)?.name || 'Неизвестно';

    if (!confirm(`Обновить шаблон "${currentName}"?`)) {
      return;
    }

    const templateData = this.selectedTemplate.getTemplateData();

    this.emailTemplatesService.updateTemplate(this.selectedTemplateId, currentName, templateData).subscribe({
      next: (response) => {
        console.log('Шаблон успешно обновлён:', response);
        this.resultMessage = `Шаблон "${currentName}" успешно обновлён`;
        this.loadTemplates(); // перезагружаем список
      },
      error: (err) => {
        console.error('Ошибка при обновлении шаблона:', err);
        this.resultMessage = err.error?.message || 'Ошибка при обновлении шаблона';
      }
    });
  }
  deleteTemplate(id: number, name: string, event: Event): void {
    event.stopPropagation(); // чтобы не срабатывал выбор шаблона

    if (!confirm(`Вы уверены, что хотите удалить шаблон "${name}"? Это действие нельзя отменить.`)) {
      return;
    }

    this.emailTemplatesService.deleteTemplate(id).subscribe({
      next: () => {
        console.log('Шаблон удалён:', id);
        this.resultMessage = `Шаблон "${name}" удалён`;

        // Удаляем из локального массива
        this.templates = this.templates.filter(t => t.id !== id);

        // Если удалён текущий выбранный — сбрасываем
        if (this.selectedTemplateId === id) {
          this.selectedTemplate = null;
          this.selectedTemplateId = null;
          if (this.templates.length > 0) {
            this.selectTemplate(this.templates[0].instance, this.templates[0].id);
          }
        }
      },
      error: (err) => {
        console.error('Ошибка при удалении шаблона:', err);
        this.resultMessage = err.error?.message || 'Ошибка при удалении шаблона';
      }
    });
  }
  selectTemplate(template: MainEmail, id: number): void {
    this.selectedTemplate = template.clone();
    this.selectedTemplateId = id;
  }
  get whoSentStr(): string {
    return this.whoSent.join(', ');
  }

  set whoSentStr(value: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Разбиваем на отдельные email'ы, убираем пробелы и пустые строки
    const inputEmails = value
      .split(',')
      .map(email => email.trim())
      .filter(email => email.length > 0);

    // Обновляем массив только с валидными email'ами
    this.whoSent = inputEmails.filter(email => emailRegex.test(email));

    // Показываем ошибку ТОЛЬКО если:
    // - пользователь что-то ввёл (есть непустые части)
    // - но ни один email не валидный
    if (inputEmails.length > 0 && this.whoSent.length === 0) {
      this.resultMessage = 'Введены некорректные email-адреса';
    } else {
      // Если поле пустое или есть хотя бы один валидный email — убираем ошибку
      this.resultMessage = '';
    }
  }

  toggleContentChoice(event: Event): void {
    this.useTemplate = (event.target as HTMLInputElement).checked;
    localStorage.setItem('emailContentChoice', this.useTemplate ? 'template' : 'text');
    if (this.useTemplate && !this.selectedTemplate && this.templates.length > 0) {
      this.selectTemplate(this.templates[0].instance, this.templates[0].id);
    }
  }

  cancelMessage(): void {
    this.resultMessage = '';
  }
}