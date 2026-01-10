import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MenuTable } from '../../interfaces/menu-table.interface';

@Injectable({
  providedIn: 'root'
})
export class MainButtonsMenuService {
  private apiUrl = environment.auth.apiUrl;

  constructor(private http: HttpClient) {}


  getMenuTables(): Observable<MenuTable[]> {
    return this.http.get<MenuTable[]>(`${this.apiUrl}menu/tables`);
  }

  updateMenuTable(id: number, data: Partial<MenuTable>): Observable<MenuTable> {
    return this.http.put<MenuTable>(`${this.apiUrl}menu/tables/${id}`, data);
  }
}