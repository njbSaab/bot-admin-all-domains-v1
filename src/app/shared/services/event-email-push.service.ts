import { Injectable } from '@angular/core';
import { UsersEmailsService, EmailMessage } from './users-emails.service';
import { EventUsersFilterService } from './event-users-filter.service';
import { EventsSites } from '../../admin/pages/events-sites/interfaces/events-sites.interface';
import { SiteUsers } from '../../interfaces/users.interface';

@Injectable({
  providedIn: 'root'
})
export class EventEmailPushService {
  isSending = false;
  emailMessages: EmailMessage[] = [];

  constructor(
    private usersEmailsService: UsersEmailsService,
    private eventUsersFilter: EventUsersFilterService
  ) {}

  async sendPush(
    event: EventsSites,
    siteUsers: SiteUsers[],
    winTemplateId: number,
    loseTemplateId: number,
    winContent: string,
    loseContent: string,
    subject: string = ''
  ): Promise<void> {
    if (this.isSending) return;

    this.isSending = true;
    this.emailMessages = [];

    const finalSubject = subject.trim() || `Результат события "${event.name}"`;

    const winUsers = this.eventUsersFilter.getFilteredUsersForEvent(
      siteUsers,
      event.landing_url || '',
      event.id,
      event.result ?? null,
      'win'
    ).map(u => u.email as string)
     .filter((email, i, arr) => arr.indexOf(email) === i);

    const loseUsers = this.eventUsersFilter.getFilteredUsersForEvent(
      siteUsers,
      event.landing_url || '',
      event.id,
      event.result ?? null,
      'lose'
    ).map(u => u.email as string)
     .filter((email, i, arr) => arr.indexOf(email) === i);

    const send = async (emails: string[], content: string): Promise<{ message: string; sentEmails: string[] }> => {
      if (emails.length === 0) {
        return { message: 'Нет получателей', sentEmails: [] };
      }
      return await this.usersEmailsService.sendBulkEmails(emails, finalSubject, content, true).toPromise();
    };

    try {
      const [winRes, loseRes] = await Promise.all([
        send(winUsers, winContent),
        send(loseUsers, loseContent)
      ]);

      this.emailMessages = [
        ...this.processResponse(winRes, winUsers, winContent),
        ...this.processResponse(loseRes, loseUsers, loseContent)
      ];
    } catch (err: any) {
      const failed = (emails: string[], content: string) => emails.map(email => ({
        email,
        subject: finalSubject,
        content,
        status: 'failed' as const,
        isSent: false,
        sentAt: new Date().toISOString(),
      }));

      this.emailMessages = [
        ...failed(winUsers, winContent),
        ...failed(loseUsers, loseContent)
      ];
    } finally {
      this.isSending = false;
    }
  }

  private processResponse(
    res: { message: string; sentEmails: string[] } | undefined,
    emails: string[],
    content: string
  ): EmailMessage[] {
    if (!res?.sentEmails?.length) {
      return emails.map(email => ({
        email,
        subject: '',
        content,
        status: 'failed' as const,
        isSent: false,
        sentAt: new Date().toISOString(),
      }));
    }

    return res.sentEmails.map(email => ({
      email,
      subject: '',
      content,
      status: 'sent' as const,
      isSent: true,
      sentAt: new Date().toISOString(),
    }));
  }

  clearMessages(): void {
    this.emailMessages = [];
  }
}