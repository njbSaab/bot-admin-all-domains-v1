import { Injectable } from "@angular/core";
import { SiteUsers } from "../../interfaces/users.interface";

@Injectable({ providedIn: 'root' })
export class EventUsersFilterService {
  private cachedUsers: { [key: string]: SiteUsers[] } = {};
  private cachedFiltered: { [key: string]: SiteUsers[] } = {};

  private normalizeUrl(url: string | undefined | null): string {
    if (!url) return '';
    return url
      .trim()
      .replace(/\/+$/, '') // убираем слеши в конце
      .toLowerCase();
  }

  getUsersForEvent(
    allUsers: SiteUsers[],
    landingUrl: string,
    eventId?: number
  ): SiteUsers[] {
    const normalized = this.normalizeUrl(landingUrl);
    const key = eventId != null ? `${normalized}_${eventId}` : normalized;

    if (!this.cachedUsers[key]) {
      this.cachedUsers[key] = allUsers.filter(user => {
        // 1. Совпадение по URL лендинга
        let matchesUrl = false;
        try {
          const eventPath = new URL(landingUrl || '').pathname.replace(/\/$/, '');
          const userPath = new URL(user.site_url || '').pathname.replace(/\/$/, '');
          matchesUrl = eventPath === userPath;
        } catch (e) {
          matchesUrl = false;
        }

        // 2. Есть голос
        const hasVote = !!user.user_submit_data?.['selected_option'];

        // 3. Проверка по eventId
        let matchesEvent = true;
        if (eventId != null && hasVote) {
          const data = user.user_submit_data;
          const eventObj = data?.['event'];

          let storedEventId: number | undefined;

          if (eventObj && typeof eventObj === 'object') {
            storedEventId = (eventObj as any).id ?? (eventObj as any)['eventId'];
          }

          if (storedEventId === undefined) {
            storedEventId = (data as any)?.['eventId'];
          }

          matchesEvent = storedEventId !== undefined ? storedEventId === eventId : false;
        }

        return matchesUrl && hasVote && matchesEvent;
      });
    }

    return this.cachedUsers[key];
  }

  getFilteredUsersForEvent(
    allUsers: SiteUsers[],
    landingUrl: string,
    eventId: number,
    result: number | null,
    group: 'all' | 'win' | 'lose' = 'all'
  ): SiteUsers[] {
    const normalizedLandingUrl = this.normalizeUrl(landingUrl);
    const key = `${normalizedLandingUrl}_${eventId}_${result}_${group}`;

    if (!this.cachedFiltered[key]) {
      const users = this.getUsersForEvent(allUsers, landingUrl, eventId);

      if (group === 'all' || result === null) {
        this.cachedFiltered[key] = users;
      } else {
        this.cachedFiltered[key] = users.filter(user => {
          const selected = Number(user.user_submit_data!['selected_option']);
          const isWinner = selected === result;
          return group === 'win' ? isWinner : !isWinner;
        });
      }
    }

    return this.cachedFiltered[key];
  }

  getUsersForLandingOnly(allUsers: SiteUsers[], landingUrl: string): SiteUsers[] {
  const normalized = this.normalizeUrl(landingUrl);
  const key = `landing_${normalized}`;

  if (!this.cachedUsers[key]) {
    this.cachedUsers[key] = allUsers.filter(user => {
      let matchesUrl = false;
      try {
        const eventPath = new URL(landingUrl || '').pathname.replace(/\/$/, '');
        const userPath = new URL(user.site_url || '').pathname.replace(/\/$/, '');
        matchesUrl = eventPath === userPath;
      } catch (e) {
        matchesUrl = false;
      }

      const hasVote = !!user.user_submit_data?.['selected_option'];

      return matchesUrl && hasVote;
    });
  }

  return this.cachedUsers[key];
}

  clearCache(): void {
    this.cachedUsers = {};
    this.cachedFiltered = {};
  }
}