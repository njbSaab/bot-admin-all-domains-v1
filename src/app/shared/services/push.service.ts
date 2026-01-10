// src/app/shared/services/push.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './../../../environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class PushService {
  private messageUrl = `${environment.auth.baseUrl}/push`;
  private pollUrl = `${environment.auth.baseUrl}/push/poll`;
  private pollResultsUrl = `${environment.auth.baseUrl}/push/poll-results`;

  constructor(private http: HttpClient) {}

  sendPush(payload: {
    imageUrl?: string;
    text?: string;
    buttonName?: string;
    buttonUrl?: string;
    categoryIds?: number[];
  }): Observable<any> {
    let url = this.messageUrl;
    if (payload.categoryIds && payload.categoryIds.length > 0) {
      url += `?categoryId=${payload.categoryIds[0]}`;
    }
    return this.http.post(url, payload);
  }

  sendPoll(payload: {
    question: string;
    options: string[];
    isAnonymous: boolean;
    allowsMultipleAnswers: boolean;
    isQuiz: boolean;
    correctOptionId?: number;
    categoryIds?: number[];
  }): Observable<any> {
    let url = this.pollUrl;
    if (payload.categoryIds && payload.categoryIds.length > 0) {
      url += `?categoryId=${payload.categoryIds[0]}`;
    }
    return this.http.post(url, payload);
  }

  getPollResults(pollId: string): Observable<any> {
    return this.http.get(`${this.pollResultsUrl}/${pollId}`);
  }
  getAllResults(): Observable<any> {
    return this.http.get(`${this.pollResultsUrl}`);
  }
}