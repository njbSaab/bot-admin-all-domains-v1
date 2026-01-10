import { Injectable } from '@angular/core';
import { CanLoad, Route, UrlSegment, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanLoad {
  constructor(private router: Router) {}

  canLoad(route: Route, segments: UrlSegment[]): boolean {
    console.log('AuthGuard проверяет доступ');
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

    if (!isAuthenticated) {
      console.log('Пользователь не аутентифицирован, перенаправление на главную страницу');
      this.router.navigate(['/']);
      return false;
    }

    console.log('Доступ разрешен');
    return true;
  }
}
