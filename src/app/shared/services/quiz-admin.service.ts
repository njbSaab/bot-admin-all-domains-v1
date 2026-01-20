import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { QuizPreview } from '../../admin/pages/quiz/interfaces/quiz-preview.interface';
import { QuizLandingPreview } from '../../admin/pages/quiz/interfaces/quiz-landing-preview.interface';

@Injectable({
  providedIn: 'root'
})
export class QuizAdminService {
  private apiUrl = environment.auth.localQuiz + '/admin/quizzes';
  private secret = environment.auth.adminSecretQuiz;
  private geo = environment.auth.geo
  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'X-Admin-Secret': this.secret,
      'X-Geo': this.geo,           
      'Content-Type': 'application/json'
    });
  }
  getAllQuizzes(): Observable<QuizPreview[]> {
    return this.http.get<any>(this.apiUrl, { headers: this.getHeaders() }).pipe(
      map(response => response.data || []),
      map(quizzes => quizzes.map((q: any) => ({
        id: q.id,
        typeQuizId: q.typeQuizId,
        name: q.name,
        nameAdm: q.nameAdm ?? null,
        description: q.description ?? '',
        descriptionAdm: q.descriptionAdm ?? null,
        theme: q.theme ?? null,
        isActive: q.isActive ?? false,
        endAt: q.endAt,
        questions: q.questions ?? '[]',         
        quizInfo: q.quizInfo ?? null,
        result: q.result ?? null,
        resultsStats: q.resultsStats ?? null,
        imageBgDesk: q.imageBgDesk ?? null,
        imageBgMob: q.imageBgMob ?? null,
        imageHero: q.imageHero ?? null,
        grandPrize: q.grandPrize ?? null,
        prizeForEveryOne: q.prizeForEveryOne ?? null,
        type: q.type ?? 'byScore',
        status: q.status ?? 'active',
        geo: q.geo ?? 'vn',
        createdAt: q.createdAt,
        rating: q.rating ?? 0,
        landing: q.landing || { id: q.landingId, url: 'unknown', name: 'Лендинг' },
        questionsCount: JSON.parse(q.questions || '[]').length
      }))),
      catchError(err => {
        console.error('Ошибка загрузки квизов:', err);
        return throwError(() => new Error('Не удалось загрузить квизы'));
      })
    );
  }
  getAllLandings(): Observable<QuizLandingPreview[]> {
    const url = environment.auth.localQuiz + '/admin/landings';
    return this.http.get<any>(url, { headers: this.getHeaders() }).pipe(
      map(response => response || []), // предполагаем, что приходит массив сразу
      map(landings => landings.map((l: any) => ({
        id: l.id,
        url: l.url,
        name: l.name,
        status: l.status,
        createdAt: l.createdAt,
        quizCount: l.quizCount
      }))),
      catchError(err => {
        console.error('Ошибка загрузки лендингов:', err);
        return throwError(() => new Error('Не удалось загрузить лендинги'));
      })
    );
  }
  getQuizzesByLanding(landingId: number | null): Observable<QuizPreview[]> {
    let url = environment.auth.localQuiz + '/admin/quizzes';

    if (landingId !== null) {
      url = `${environment.auth.localQuiz}/admin/landings/${landingId}/quizzes`;
    }

    return this.http.get<any>(url, { headers: this.getHeaders() }).pipe(
      map(response => response || []),
      map(quizzes =>
        quizzes.map((q: any) => ({
          id: q.id,
          typeQuizId: q.typeQuizId,
          name: q.name,
          nameAdm: q.nameAdm ?? null,
          description: q.description ?? '',
          descriptionAdm: q.descriptionAdm ?? null,
          theme: q.theme ?? null,
          isActive: q.isActive ?? false,
          endAt: q.endAt,
          questions: q.questions ?? '[]',         
          quizInfo: q.quizInfo ?? null,
          result: q.result ?? null,
          resultsStats: q.resultsStats ?? null,
          imageBgDesk: q.imageBgDesk ?? null,
          imageBgMob: q.imageBgMob ?? null,
          imageHero: q.imageHero ?? null,
          grandPrize: q.grandPrize ?? null,
          prizeForEveryOne: q.prizeForEveryOne ?? null,
          type: q.type ?? 'byScore',
          status: q.status ?? 'active',
          geo: q.geo ?? 'vn',
          createdAt: q.createdAt,
          rating: q.rating ?? 0,
          landing: q.landing || { id: q.landingId, url: 'unknown', name: 'Без лендинга' },
          questionsCount: q.questions ? JSON.parse(q.questions).length : 0
        }))
      ),
      catchError(err => {
        console.error('Ошибка загрузки квизов:', err);
        return throwError(() => new Error('Не удалось загрузить квизы'));
      })
    );
  }
  getQuizById(id: number): Observable<any> {  
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<any>(url, { headers: this.getHeaders() }).pipe(
        map(response => response.data || response),
        map(q => ({
            id: q.id,
            typeQuizId: q.typeQuizId,
            name: q.name,
            nameAdm: q.nameAdm ?? null,
            description: q.description ?? '',
            descriptionAdm: q.descriptionAdm ?? null,
            theme: q.theme ?? null,
            isActive: q.isActive ?? false,
            endAt: q.endAt,
            questions: q.questions ?? '[]',         
            quizInfo: q.quizInfo ?? null,
            result: q.result ?? null,
            resultsStats: q.resultsStats ?? null,
            imageBgDesk: q.imageBgDesk ?? null,
            imageBgMob: q.imageBgMob ?? null,
            imageHero: q.imageHero ?? null,
            grandPrize: q.grandPrize ?? null,
            prizeForEveryOne: q.prizeForEveryOne ?? null,
            type: q.type ?? 'byScore',
            status: q.status ?? 'active',
            geo: q.geo ?? 'vn',
            createdAt: q.createdAt,
            rating: q.rating ?? 0,
            landingId: q.landingId ?? q.landing?.id ?? 0
        })),
        catchError(err => {
            console.error(`Ошибка загрузки квиза #${id}:`, err);
            return throwError(() => new Error('Не удалось загрузить квиз'));
        })
    );
  }
  updateQuiz(id: number, updateData: any): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    
    return this.http.patch<any>(
      url,
      updateData,
      { headers: this.getHeaders() }
    ).pipe(
      map(response => response.data || response), // сервер возвращает {success: true, data: {...}}
      catchError(err => {
        console.error(`Ошибка обновления квиза #${id}:`, err);
        throw new Error(err.error?.message || 'Не удалось обновить квиз');
      })
    );
  }
  createQuiz(createData: any): Observable<any> {
    console.log('Что отправляем на сервер:', JSON.stringify(createData, null, 2));
    return this.http.post<any>(
      this.apiUrl,
      createData,
      { headers: this.getHeaders() }
    ).pipe(
      map(response => response.data || response), // сервер возвращает {success: true, data: {...}}
      catchError(err => {
        console.error('Ошибка создания квиза:', err);
        throw new Error(err.error?.message || 'Не удалось создать квиз');
      })
    );
  }
}