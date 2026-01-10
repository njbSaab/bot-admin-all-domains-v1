import { Injectable } from '@angular/core';
import { SiteUsers } from '../../interfaces/users.interface';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from './../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class SiteUsersService {
  private apiUrl = environment.auth.baseUrl + "/users-sites";

  constructor(private http: HttpClient) {}

  getSiteUsers(): Observable<SiteUsers[]> {
    return this.http.get<SiteUsers[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  deleteSiteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred';
    if (error.status === 404) {
      errorMessage = `User not found`;
    } else if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Server returned code ${error.status}: ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }
}