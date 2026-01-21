// src/app/shared/services/email-template.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { 
  EmailTemplateData, 
  EmailTemplateConfig,
  ChainTemplate,
  ChainSettings,
  ChainType,
  ChainEmailStep,
  DEFAULT_EMAIL_CONFIG,
} from '../../admin/pages/quiz/interfaces/email-template.interface';

@Injectable({
  providedIn: 'root'
})
export class EmailTemplateService {
  private apiUrl = environment.auth.emailServiceUrl || 'http://localhost:3500';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }

  // ==================== STANDARD TEMPLATES (code/result) ====================

  getTemplates(domain: string, app?: string, quizId?: number): Observable<EmailTemplateData[]> {
    let url = `${this.apiUrl}/api/templates?domain=${encodeURIComponent(domain)}`;
    if (app) url += `&app=${encodeURIComponent(app)}`;
    if (quizId) url += `&quiz_id=${encodeURIComponent(quizId)}`;

    return this.http.get<any>(url, { headers: this.getHeaders() }).pipe(
      map(response => response.templates || []),
      catchError(err => {
        console.error('Ошибка загрузки шаблонов:', err);
        return of([]);
      })
    );
  }

  getTemplateById(id: number): Observable<EmailTemplateData | null> {
    return this.http.get<any>(`${this.apiUrl}/api/templates/${id}`, { headers: this.getHeaders() }).pipe(
      map(response => response.template || null),
      catchError(err => {
        console.error(`Ошибка загрузки шаблона #${id}:`, err);
        return of(null);
      })
    );
  }

  createTemplate(data: {
    domain: string;
    app?: string;
    quiz_id?: number;  
    type: 'code' | 'result';
    subject: string;
    html: string;
  }): Observable<{ success: boolean; id?: number; error?: string }> {
    return this.http.post<any>(`${this.apiUrl}/api/templates`, data, { headers: this.getHeaders() }).pipe(
      map(response => ({ success: response.success, id: response.id })),
      catchError(err => of({ success: false, error: err.error?.error || err.message }))
    );
  }

  updateTemplate(id: number, data: { subject?: string; html?: string }): Observable<{ success: boolean; error?: string }> {
    return this.http.put<any>(`${this.apiUrl}/api/templates/${id}`, data, { headers: this.getHeaders() }).pipe(
      map(response => ({ success: response.success })),
      catchError(err => of({ success: false, error: err.error?.error || err.message }))
    );
  }

  updateTemplateByClient(data: {
    domain: string;
    app?: string;
    quiz_id?: number;
    type: 'code' | 'result';
    subject?: string;
    html?: string;
  }): Observable<{ success: boolean; action?: 'created' | 'updated'; id?: number; error?: string }> {
    return this.http.put<any>(`${this.apiUrl}/api/templates/by-client`, data, { headers: this.getHeaders() }).pipe(
      map(response => ({ success: response.success, action: response.action, id: response.id })),
      catchError(err => of({ success: false, error: err.error?.error || err.message }))
    );
  }

  deleteTemplate(id: number): Observable<{ success: boolean; error?: string }> {
    return this.http.delete<any>(`${this.apiUrl}/api/templates/${id}`, { headers: this.getHeaders() }).pipe(
      map(response => ({ success: response.success })),
      catchError(err => of({ success: false, error: err.error?.error || err.message }))
    );
  }

  // ==================== CHAIN TEMPLATES ====================

  /**
   * Получить шаблоны цепочки для квиза
   */
  getChainTemplates(
    app: string, 
    quizId: number,
    chainType?: ChainType
  ): Observable<ChainTemplate[]> {
    let url = `${this.apiUrl}/api/chain/templates?app=${encodeURIComponent(app)}&quizId=${encodeURIComponent(quizId)}`;
    
    if (chainType) {
      url += `&chainType=${encodeURIComponent(chainType)}`;
    }

    console.log('Fetching chain templates:', url);

    return this.http.get<any>(url, { headers: this.getHeaders() }).pipe(
      map(response => {
        const templates = response.templates || [];
        console.log('Received chain templates:', templates);
        return templates.map((t: any) => this.mapChainTemplate(t));
      }),
      catchError(err => {
        console.error('Ошибка загрузки шаблонов цепочки:', err);
        return of([]);
      })
    );
  }

  /**
   * Получить шаблон цепочки по ID
   */
  getChainTemplateById(id: number): Observable<ChainTemplate | null> {
    return this.http.get<any>(`${this.apiUrl}/api/chain/templates/${id}`, { headers: this.getHeaders() }).pipe(
      map(response => response.template ? this.mapChainTemplate(response.template) : null),
      catchError(err => {
        console.error(`Ошибка загрузки шаблона цепочки #${id}:`, err);
        return of(null);
      })
    );
  }

  /**
   * Создать шаблон цепочки
   */
  createChainTemplate(data: {
    domain: string;
    app?: string;
    chainType: ChainType;
    quizId?: number | null;
    step: number;
    delayMinutes?: number;
    subject: string;
    html: string;
  }): Observable<{ success: boolean; id?: number; error?: string }> {
    return this.http.post<any>(`${this.apiUrl}/api/chain/templates`, data, { headers: this.getHeaders() }).pipe(
      map(response => ({ success: response.success, id: response.id })),
      catchError(err => of({ success: false, error: err.error?.error || err.message }))
    );
  }

  /**
   * Обновить шаблон цепочки по ID
   */
  updateChainTemplate(id: number, data: {
    delayMinutes?: number;
    subject?: string;
    html?: string;
    active?: boolean;
  }): Observable<{ success: boolean; error?: string }> {
    return this.http.put<any>(`${this.apiUrl}/api/chain/templates/${id}`, data, { headers: this.getHeaders() }).pipe(
      map(response => ({ success: response.success })),
      catchError(err => of({ success: false, error: err.error?.error || err.message }))
    );
  }

  /**
   * Upsert один шаблон цепочки по domain + app + quizId + chainType + step
   */
  upsertChainTemplate(data: {
    domain: string;
    app?: string;
    chainType: ChainType;
    quizId?: number | null;
    step: number;
    delayMinutes?: number;
    subject: string;
    html: string;
  }): Observable<{ success: boolean; action?: 'created' | 'updated'; id?: number; error?: string }> {
    return this.http.put<any>(`${this.apiUrl}/api/chain/templates/by-client`, data, { headers: this.getHeaders() }).pipe(
      map(response => ({ success: response.success, action: response.action, id: response.id })),
      catchError(err => of({ success: false, error: err.error?.error || err.message }))
    );
  }

  /**
   * Bulk upsert всей цепочки
   */
  upsertChainTemplatesBulk(data: {
  app: string;
  quizId: number;
  chainType: ChainType;
  templates: Array<{
    step: number;
    delayMinutes?: number;
    subject: string;
    html: string;
  }>;
  domain?: string;  // Опционально
}): Observable<{ success: boolean; created?: number; updated?: number; ids?: number[]; error?: string }> {
  return this.http.put<any>(`${this.apiUrl}/api/chain/templates/bulk`, data, { headers: this.getHeaders() }).pipe(
    map(response => ({
      success: response.success,
      created: response.created,
      updated: response.updated,
      ids: response.ids,
    })),
    catchError(err => of({ success: false, error: err.error?.error || err.message }))
  );
}

  /**
   * Удалить шаблон цепочки
   */
  deleteChainTemplate(id: number): Observable<{ success: boolean; error?: string }> {
    return this.http.delete<any>(`${this.apiUrl}/api/chain/templates/${id}`, { headers: this.getHeaders() }).pipe(
      map(response => ({ success: response.success })),
      catchError(err => of({ success: false, error: err.error?.error || err.message }))
    );
  }

  // ==================== CHAIN SETTINGS ====================

  /**
   * Получить настройки цепочки
   */
  getChainSettings(domain: string, app?: string): Observable<ChainSettings | null> {
    let url = `${this.apiUrl}/api/chain/settings?domain=${encodeURIComponent(domain)}`;
    if (app) url += `&app=${encodeURIComponent(app)}`;

    return this.http.get<any>(url, { headers: this.getHeaders() }).pipe(
      map(response => {
        if (!response.settings) return null;
        return this.mapChainSettings(response.settings);
      }),
      catchError(err => {
        console.error('Ошибка загрузки настроек цепочки:', err);
        return of(null);
      })
    );
  }

  /**
   * Обновить настройки цепочки
   */
  updateChainSettings(data: {
    domain: string;
    app?: string;
    defaultDelays?: number[];
    mergeWindowMinutes?: number;
    minQuizzesForGeneral?: number;
    enabled?: boolean;
  }): Observable<{ success: boolean; error?: string }> {
    return this.http.put<any>(`${this.apiUrl}/api/chain/settings`, data, { headers: this.getHeaders() }).pipe(
      map(response => ({ success: response.success })),
      catchError(err => of({ success: false, error: err.error?.error || err.message }))
    );
  }

  // ==================== HELPERS ====================

  private mapChainTemplate(raw: any): ChainTemplate {
    return {
      id: raw.id,
      clientId: raw.client_id,
      chainType: raw.chain_type,
      quizId: raw.quiz_id,
      app: raw.app,
      step: raw.step,
      delayMinutes: raw.delay_minutes,
      subject: raw.subject,
      html: raw.html,
      active: Boolean(raw.active),
      createdAt: raw.created_at,
      updatedAt: raw.updated_at,
    };
  }

  private mapChainSettings(raw: any): ChainSettings {
    return {
      id: raw.id,
      clientId: raw.client_id,
      defaultDelays: Array.isArray(raw.default_delays) 
        ? raw.default_delays 
        : JSON.parse(raw.default_delays || '[1440, 2880, 8640]'),
      mergeWindowMinutes: raw.merge_window_minutes,
      minQuizzesForGeneral: raw.min_quizzes_for_general,
      enabled: Boolean(raw.enabled),
    };
  }

  /**
   * Генерировать HTML из конфигурации
   */
  generateHtmlFromConfig(config: EmailTemplateConfig): string {
    return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Arial, sans-serif; background-color: #f5f5f5;">
  <div style="max-width: 600px; margin: 20px auto; background: ${config.bgColor}; border-radius: 20px; overflow: hidden; box-shadow: 0 15px 40px rgba(0,0,0,0.1);">
    
    <div style="background: linear-gradient(135deg, ${config.headerBgStart} 0%, ${config.headerBgEnd} 100%); padding: 25px 20px; text-align: center;">
      <img src="${config.logoUrl}" alt="Logo" style="height: 60px;" />
    </div>

    <div style="padding: 35px 30px; color: ${config.textColor};">
      <p style="font-size: 22px; font-weight: 700; margin: 0 0 15px; text-align: center;">
        ${config.greeting}, <span style="color: ${config.primaryColor};">{{name}}</span>!
      </p>

      ${config.titleText ? `<div style="font-size: 26px; font-weight: 800; color: ${config.primaryColor}; line-height: 1.3; margin: 10px 0; text-align: center;">${config.titleText}</div>` : ''}

      ${config.highlightText ? `<div style="font-size: 18px; font-weight: 600; color: ${config.textColor}; background: ${config.cardBgColor}; padding: 20px; border-radius: 12px; border-left: 6px solid ${config.primaryColor}; margin: 25px 0;">${config.highlightText}</div>` : ''}

      ${config.prizeText ? `<div style="font-size: 17px; color: #e74c3c; background: #fff5f5; padding: 18px; border-radius: 12px; border-left: 5px solid #e74c3c; margin: 25px 0;"><strong>Chú ý!</strong> ${config.prizeText}</div>` : ''}

      ${config.descriptionText ? `<div style="font-size: 16px; line-height: 1.7; color: #34495e; margin: 25px 0;">${config.descriptionText}</div>` : ''}

      ${config.callToAction ? `<div style="background: #f0f2ff; padding: 25px; border-radius: 16px; text-align: center; margin: 0; border-left: 5px solid ${config.accentColor};"><p style="font-size: 18px; font-weight: 600; color: ${config.textColor}; margin: 0;">${config.callToAction}</p></div>` : ''}

      <div style="text-align: center; margin: 40px 0;">
        <a href="${config.btnLink}" style="display: inline-block; padding: 18px 50px; background: linear-gradient(135deg, ${config.btnBgStart}, ${config.btnBgEnd}); color: ${config.btnTextColor}; font-weight: 700; font-size: 19px; border-radius: 16px; text-decoration: none; box-shadow: 0 8px 25px rgba(59, 130, 246, 0.5);">
          ${config.btnText}
        </a>
      </div>

      <div style="margin-top: 50px; padding-top: 25px; border-top: 2px solid #eee; color: ${config.textSecondaryColor}; font-size: 14px; text-align: center; line-height: 1.6;">
        ${config.footerText}
        <br><br>
        © {{year}} VoteVibe. All rights reserved.
      </div>
    </div>
  </div>
</body>
</html>`.trim();
  }
}