import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../../shared/services/users.service';
import { User } from '../../../interfaces/users.interface';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  isLoading = false;
  error = '';
  sortBy: keyof User = 'updated_at';
  ascending: boolean = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(private usersService: UsersService) {}

  ngOnInit(): void {
    const savedSortBy = localStorage.getItem('userSortBy') as keyof User | null;
    const savedAscending = localStorage.getItem('userSortAscending');

    if (savedSortBy && Object.keys(this.users[0] || {}).includes(savedSortBy)) {
      this.sortBy = savedSortBy;
    }
    if (savedAscending !== null) {
      this.ascending = savedAscending === 'true';
    }

    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.usersService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.isLoading = false;
        this.sortUsers();
      },
      error: (err) => {
        console.error('Ошибка при загрузке пользователей:', err);
        this.error = 'Ошибка при загрузке пользователей';
        this.errorMessage = 'Ошибка при загрузке пользователей';
        this.isLoading = false;
        this.clearMessagesAfterDelay();
      }
    });
  }

  toggleSort(field: keyof User) {
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

  get sortedUsers(): User[] {
    if (!this.users.length) {
      return [...this.users];
    }

    return [...this.users].sort((a, b) => {
      const aValue = a[this.sortBy] ?? '';
      const bValue = b[this.sortBy] ?? '';

      if (this.sortBy === 'updated_at') {
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

  deleteUser(userId: number, userName: string): void {
    if (!confirm(`Удалить пользователя ${userName || userId}?`)) return;
    this.usersService.deleteUser(userId).subscribe({
      next: () => {
        console.log(`Пользователь ${userId} успешно удален`);
        this.users = this.users.filter(user => user.id !== userId);
        this.successMessage = `Пользователь ${userName || userId} успешно удален`;
        this.clearMessagesAfterDelay();
      },
      error: (err: any) => {
        console.error('Ошибка удаления пользователя:', err);
        const msg = err.status === 404 ? 'Пользователь не найден' :
                    err.status === 400 ? 'Недопустимый ID пользователя' :
                    'Ошибка удаления пользователя';
        this.errorMessage = msg;
        this.clearMessagesAfterDelay();
      }
    });
  }

  clearMessages(): void {
    this.successMessage = null;
    this.errorMessage = null;
  }

  clearMessagesAfterDelay(): void {
    setTimeout(() => this.clearMessages(), 3000);
  }
}