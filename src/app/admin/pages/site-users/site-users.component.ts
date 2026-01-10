import { Component, OnInit } from '@angular/core';
import { SiteUsers } from '../../../interfaces/users.interface';
import { SiteUsersService } from '../../../shared/services/site-users.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-site-users',
  templateUrl: './site-users.component.html',
  styleUrls: ['./site-users.component.scss']
})
export class SiteUsersComponent implements OnInit {
  users: SiteUsers[] = [];
  isLoading = false;
  error = '';
  sortBy: keyof SiteUsers = 'updated_at';
  ascending: boolean = false;
  selectedSiteName: string | null = null;
  baseUrl = environment.auth.domenUrl;
  constructor(private siteUserService: SiteUsersService) {}

  ngOnInit(): void {
    const savedSortBy = localStorage.getItem('userSortBy') as keyof SiteUsers | null;
    const savedAscending = localStorage.getItem('userSortAscending');
    const savedSiteName = localStorage.getItem('userSiteNameFilter');

    if (savedSortBy) {
      this.sortBy = savedSortBy;
    }
    if (savedAscending !== null) {
      this.ascending = savedAscending === 'true';
    }
    if (savedSiteName !== null) {
      this.selectedSiteName = savedSiteName === 'null' ? null : savedSiteName;
    }

    this.loadSiteUsers();
  }

  loadSiteUsers(): void {
    this.isLoading = true;
    this.error = '';
    this.siteUserService.getSiteUsers().subscribe({
      next: (data) => {
        // Нормализуем site_name на основе site_url
        this.users = data.map(user => ({
          ...user,
          site_name: this.extractSiteName(user.site_url) || user.site_name || ''
        }));
        console.log('Normalized site users:', this.users.map(u => ({
          id: u.id,
          email: u.email,
          site_url: u.site_url,
          site_name: u.site_name
        })));

        // Проверяем, что selectedSiteName валиден
        if (this.selectedSiteName && !this.uniqueSiteNames.includes(this.selectedSiteName)) {
          this.selectedSiteName = null;
          localStorage.setItem('userSiteNameFilter', 'null');
        }
        // Устанавливаем первый сайт по умолчанию, если ничего не выбрано
        if (!this.selectedSiteName && this.uniqueSiteNames.length > 0) {
          this.selectedSiteName = this.uniqueSiteNames[0];
          localStorage.setItem('userSiteNameFilter', this.selectedSiteName);
        }

        this.isLoading = false;
        this.sortUsers();
      },
      error: (err) => {
        this.error = err.message;
        this.isLoading = false;
      }
    });
  }

  // Извлекаем site_name из site_url
  private extractSiteName(siteUrl: string | undefined): string | undefined {
    if (!siteUrl || !siteUrl.startsWith(this.baseUrl)) {
      return undefined;
    }
    const path = siteUrl.replace(this.baseUrl, '').replace(/\/$/, '');
    return path || undefined;
  }

  deleteUser(id: number, email: string): void {
    if (confirm(`Вы уверены, что хотите удалить пользователя с email ${email}?`)) {
      this.isLoading = true;
      this.error = '';
      this.siteUserService.deleteSiteUser(id).subscribe({
        next: () => {
          this.users = this.users.filter(user => user.id !== id);
          if (this.selectedSiteName && !this.uniqueSiteNames.includes(this.selectedSiteName)) {
            this.selectedSiteName = null;
            localStorage.setItem('userSiteNameFilter', 'null');
          }
          this.isLoading = false;
          this.sortUsers();
        },
        error: (err) => {
          this.error = err.message;
          this.isLoading = false;
        }
      });
    }
  }

  toggleSort(field: keyof SiteUsers) {
    if (this.sortBy === field) {
      this.ascending = !this.ascending;
    } else {
      this.sortBy = field;
      this.ascending = field === 'updated_at' ? false : true;
    }
    this.sortUsers();
    localStorage.setItem('userSortBy', this.sortBy);
    localStorage.setItem('userSortAscending', this.ascending.toString());
  }

  get sortedUsers(): SiteUsers[] {
    if (!this.users.length) {
      return [...this.users];
    }

    return [...this.users].sort((a, b) => {
      const aValue = a[this.sortBy] ?? '';
      const bValue = b[this.sortBy] ?? '';

      if (['updated_at', 'last_active'].includes(this.sortBy)) {
        const aDate = new Date(aValue as string).getTime();
        const bDate = new Date(bValue as string).getTime();
        return this.ascending ? aDate - bDate : bDate - aDate;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return this.ascending
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return this.ascending ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });
  }

  private sortUsers() {
    this.users = this.sortedUsers;
  }

  getUserSubmitDataKeys(userSubmitData: any): string[] {
    console.log('User submit data:', userSubmitData);
    return userSubmitData ? Object.keys(userSubmitData) : [];
  }
// Безопасно отображаем значение, заменяя объекты на что-то осмысленное
displayValue(value: any): string {
  if (value === null || value === undefined) return '-';
  if (typeof value === 'object') {
    // Если это объект event — обработаем отдельно в другом методе
    // А здесь просто заглушка, чтобы не было [object Object]
    return '-';
  }
  return String(value);
}

// Специально для event — достаём typeEventId или name
getEventTitle(eventObj: any): string {
  if (!eventObj) return '-';

  if (eventObj.typeEventId) {
    return eventObj.typeEventId;
  }

  if (eventObj.name) {
    return eventObj.name;
  }

  return 'Unknown Event';
}
  formatKey(key: string): string {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .replace('Id ', 'ID ')
      .replace('Fb', 'Facebook')
      .replace('Ig', 'Instagram')
      .replace('Tt', 'TikTok')
      .replace('Tw', 'Twitter')
      .replace('Yt', 'YouTube');
  }

  isUrl(value: any): boolean {
    if (typeof value !== 'string') return false;
    return value.startsWith('http://') || value.startsWith('https://');
  }

  get uniqueSiteNames(): string[] {
    const siteNames = [...new Set(this.users.map(user => user.site_name))].filter(
      name => name !== undefined && name !== null && name !== ''
    ) as string[];
    console.log('Unique site names:', siteNames);
    return siteNames.sort(); // Сортируем для удобства
  }

  onSiteNameFilterChange(): void {
    console.log('Selected site name changed to:', this.selectedSiteName);
    localStorage.setItem('userSiteNameFilter', this.selectedSiteName === null ? 'null' : this.selectedSiteName);
  }
}