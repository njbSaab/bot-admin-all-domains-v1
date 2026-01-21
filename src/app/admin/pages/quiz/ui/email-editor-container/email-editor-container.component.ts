// src/app/admin/pages/quiz/components/email-editor-container/email-editor-container.component.ts

import { 
  Component, 
  Input, 
  Output, 
  EventEmitter, 
  OnInit, 
  OnChanges, 
  SimpleChanges, 
  ChangeDetectionStrategy, 
  ChangeDetectorRef 
} from '@angular/core';
import { 
  EmailTemplateConfig, 
  EmailTemplateVariables, 
  DEFAULT_EMAIL_CONFIG,
  ChainEmailStep,
  ChainTemplate,
  ChainType,
  delayMinutesToLabel,
} from '../../interfaces/email-template.interface';
import { EmailTemplateService } from '../../../../../shared/services/email-template.service';
import { environment } from '../../../../../../environments/environment';

type EditorMode = 'single' | 'chain';

@Component({
  selector: 'app-email-editor-container',
  templateUrl: './email-editor-container.component.html',
  styleUrls: ['./email-editor-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmailEditorContainerComponent implements OnInit, OnChanges {
  @Input() quizName: string = '';
  @Input() quizId: number | null = null;
  @Input() grandPrize: string = '';
  @Input() prizeForEveryOne: string = '';
  @Input() initialConfig: Partial<EmailTemplateConfig> | null = null;
  @Input() mode: 'create' | 'edit' = 'create';
  
  // NEW: Принимаем существующие шаблоны цепочки из родителя
  @Input() existingChainTemplates: ChainTemplate[] = [];

  @Output() configChange = new EventEmitter<EmailTemplateConfig>();
  @Output() htmlChange = new EventEmitter<string>();
  @Output() chainStepsChange = new EventEmitter<ChainEmailStep[]>();
  @Output() close = new EventEmitter<void>();
  
  // Режим редактора
  editorMode: EditorMode = 'single';
  
  // Для одиночного письма
  currentSubject: string = '';
  currentHtml: string = '';
  currentConfig: EmailTemplateConfig = { ...DEFAULT_EMAIL_CONFIG };
  templateType: 'code' | 'result' = 'result';      
  codeTemplate: { subject: string; html: string; config: EmailTemplateConfig } | null = null;
  resultTemplate: { subject: string; html: string; config: EmailTemplateConfig } | null = null;   
  
  // Для цепочки
  chainSteps: ChainEmailStep[] = [];
  chainType: ChainType = 'PERSONAL';
  
  // Для превью
  previewHtml: string = '';
  activeChainStep: number = 0;
  savingSingle = false; 

  previewVariables: EmailTemplateVariables = {
    name: 'Nguyen',
    score: 85,
    code: '123456',
    quizName: 'Quiz Demo',
    grandPrize: '1000 Freespins',
    prizeForEveryOne: '+10 FS',
    year: new Date().getFullYear()
  };

  // Loading state
  loading = false;
  saving = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private cdr: ChangeDetectorRef,
    private emailService: EmailTemplateService
  ) {}

  ngOnInit(): void {
    console.log('[Container] ngOnInit, mode:', this.mode, 'quizId:', this.quizId);
    this.updatePreviewVariables();
    this.initFromExistingTemplates();
    this.loadSingleTemplates();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['quizName'] || changes['grandPrize'] || changes['prizeForEveryOne']) {
      this.updatePreviewVariables();
    }
    
    // NEW: Если пришли новые existingChainTemplates
    if (changes['existingChainTemplates'] && this.existingChainTemplates.length > 0) {
      this.initFromExistingTemplates();
    }
  }

  /**
   * NEW: Инициализация из существующих шаблонов
   */
  private initFromExistingTemplates(): void {
    if (this.existingChainTemplates.length > 0) {
      console.log('Initializing from existing chain templates:', this.existingChainTemplates);
      
      // НЕ переключаемся автоматически на chain mode - оставляем single по умолчанию
      // this.editorMode = 'chain';
      
      // Конвертируем в ChainEmailStep (данные готовы, но режим остаётся single)
      this.chainSteps = this.existingChainTemplates
        .sort((a, b) => a.step - b.step)
        .map((tmpl, index) => this.chainTemplateToStep(tmpl, index === 0));
      
      this.cdr.markForCheck();
    }
  }

  /**
   * Конвертировать ChainTemplate в ChainEmailStep
   */
  private chainTemplateToStep(tmpl: ChainTemplate, isFirst: boolean): ChainEmailStep {
    return {
      step: tmpl.step,
      delayMinutes: tmpl.delayMinutes,
      delayLabel: delayMinutesToLabel(tmpl.delayMinutes),
      subject: tmpl.subject,
      html: tmpl.html,
      config: this.extractConfigFromHtml(tmpl.html),
      isExpanded: isFirst,  // Первый раскрыт
      isDirty: false,
    };
  }

  /**
   * Извлечь config из HTML
   */
  private extractConfigFromHtml(html: string): EmailTemplateConfig {
    const config = { ...DEFAULT_EMAIL_CONFIG };
    
    // ========== BOOLEAN FIELDS (проверяем наличие блоков) ==========
    // Сначала ставим все в false, потом включаем если найден блок
    config.showHighlight = false;
    config.showPrize = false;
    config.showDescription = false;
    config.showCTA = false;
    config.showButton = false;

    // Проверяем наличие highlight-box
    if (html.includes('class="highlight-box"') || html.includes("class='highlight-box'")) {
      config.showHighlight = true;
      // Извлекаем highlightText
      const highlightMatch = html.match(/<div[^>]*class="highlight-box"[^>]*>[\s\S]*?<div>([^<]+)<\/div>\s*<\/div>/i);
      if (highlightMatch) {
        config.highlightText = highlightMatch[1].trim();
      }
    }

    // Проверяем наличие prize-box
    if (html.includes('class="prize-box"') || html.includes("class='prize-box'")) {
      config.showPrize = true;
      // Извлекаем prizeText
      const prizeMatch = html.match(/<div[^>]*class="prize-box"[^>]*>.*?<strong>[^<]*<\/strong>\s*([^<]+)/is);
      if (prizeMatch) {
        config.prizeText = prizeMatch[1].trim();
      }
    }

    // Проверяем наличие description
    if (html.includes('class="description"') || html.includes("class='description'")) {
      config.showDescription = true;
      // Извлекаем descriptionText
      const descMatch = html.match(/<div[^>]*class="description"[^>]*>([^<]+)/i);
      if (descMatch) {
        config.descriptionText = descMatch[1].trim();
      }
    }

    // Проверяем наличие cta-box
    if (html.includes('class="cta-box"') || html.includes("class='cta-box'")) {
      config.showCTA = true;
      // Извлекаем callToAction
      const ctaMatch = html.match(/<div[^>]*class="cta-box"[^>]*>.*?<p[^>]*>([^<]+)/is);
      if (ctaMatch) {
        config.callToAction = ctaMatch[1].trim();
      }
    }

    // Проверяем наличие кнопки
    if (html.includes('class="btn"') || html.includes("class='btn'")) {
      config.showButton = true;
      // Извлекаем btnText
      const btnMatch = html.match(/<a[^>]*class="btn"[^>]*>([^<]+)<\/a>/i);
      if (btnMatch) {
        config.btnText = btnMatch[1].trim();
      }
      // Извлекаем btnLink
      const btnLinkMatch = html.match(/<a[^>]*href="([^"]+)"[^>]*class="btn"/i);
      if (btnLinkMatch) {
        config.btnLink = btnLinkMatch[1];
      }
    }

    // ========== STRING FIELDS ==========
    
    // Извлекаем greeting
    const greetingMatch = html.match(/<p[^>]*class="greeting"[^>]*>([^,<]+),/i);
    if (greetingMatch) {
      config.greeting = greetingMatch[1].trim();
    }

    // Извлекаем titleText из h1
    const titleMatch = html.match(/<h1[^>]*>([^<]+)<\/h1>/i);
    if (titleMatch) {
      config.titleText = titleMatch[1].trim();
    }

    // Извлекаем headerBg gradient
    const headerBgMatch = html.match(/linear-gradient\(135deg,\s*(#[0-9a-fA-F]{6})\s*0%,\s*(#[0-9a-fA-F]{6})/i);
    if (headerBgMatch) {
      config.headerBgStart = headerBgMatch[1];
      config.headerBgEnd = headerBgMatch[2];
    }

    // Извлекаем logoUrl
    const logoMatch = html.match(/<img[^>]*src="([^"]+)"[^>]*alt="Logo"/i);
    if (logoMatch) {
      config.logoUrl = logoMatch[1];
    }

    // Извлекаем footerText
    const footerMatch = html.match(/<div[^>]*class="footer"[^>]*>.*?<p>([^<©]+)/is);
    if (footerMatch) {
      config.footerText = footerMatch[1].trim();
    }

    console.log('[Container] extractConfigFromHtml result:', {
      showHighlight: config.showHighlight,
      showPrize: config.showPrize,
      showDescription: config.showDescription,
      showCTA: config.showCTA,
      showButton: config.showButton,
      greeting: config.greeting,
      titleText: config.titleText,
    });
    
    return config;
  }

  private updatePreviewVariables(): void {
    this.previewVariables = {
      ...this.previewVariables,
      quizName: this.quizName || 'Quiz Demo',
      grandPrize: this.grandPrize || '1000 Freespins',
      prizeForEveryOne: this.prizeForEveryOne || '+10 FS'
    };
  }

  // В loadSingleTemplates (или в reloadTemplates)
  private loadSingleTemplates(): void {
    if (!this.quizId) {
      console.log('[Container] loadSingleTemplates: no quizId, skipping');
      return;
    }

    const domain = this.getDomain();
    const app = this.getApp();
    if (!app) {
      console.log('[Container] loadSingleTemplates: no app, skipping');
      return;
    }

    console.log('[Container] loadSingleTemplates: loading for quizId:', this.quizId);
    this.loading = true;
    this.cdr.markForCheck();

    this.emailService.getTemplates(domain, app, this.quizId).subscribe(templates => {
      this.loading = false;
      console.log('[Container] loadSingleTemplates: received templates:', templates);

      const code = templates.find((t: any) => t.type === 'code');
      const result = templates.find((t: any) => t.type === 'result');

      if (code) {
        this.codeTemplate = {
          subject: code.subject,
          html: code.html,
          config: this.extractConfigFromHtml(code.html)
        };
        console.log('[Container] codeTemplate loaded:', this.codeTemplate);
      }

      if (result) {
        this.resultTemplate = {
          subject: result.subject,
          html: result.html,
          config: this.extractConfigFromHtml(result.html)
        };
        console.log('[Container] resultTemplate loaded:', this.resultTemplate);
      }

      // Устанавливаем текущие значения
      this.switchTemplateType(this.templateType);
      
      this.cdr.markForCheck();
    });
  }

  // Переключение типа
  switchTemplateType(type: 'code' | 'result'): void {
    console.log('[Container] switchTemplateType called with:', type);
    this.templateType = type;

    const tpl = type === 'code' ? this.codeTemplate : this.resultTemplate;
    console.log('[Container] selected template:', tpl);

    if (tpl) {
      this.currentSubject = tpl.subject;
      this.currentHtml = tpl.html;
      this.currentConfig = { ...tpl.config };  // копия
      this.previewHtml = tpl.html;
      
      console.log('[Container] after switch - currentConfig:', this.currentConfig);
      console.log('[Container] after switch - currentConfig.greeting:', this.currentConfig.greeting);
      console.log('[Container] after switch - currentConfig.titleText:', this.currentConfig.titleText);
      console.log('[Container] after switch - currentConfig.logoUrl:', this.currentConfig.logoUrl);
    } else {
      console.log('[Container] no template found, using defaults');
      this.currentSubject = type === 'code' 
        ? 'Mã xác nhận của bạn là {{code}}' 
        : 'Kết quả kịch bản của bạn';
      this.currentHtml = '';
      this.currentConfig = { ...DEFAULT_EMAIL_CONFIG };
      this.previewHtml = this.emailService.generateHtmlFromConfig(this.currentConfig);
    }

    this.cdr.markForCheck();
  }

  // ==================== MODE SWITCHING ====================

  switchEditorMode(mode: EditorMode): void {
    this.editorMode = mode;
    
    if (mode === 'chain') {
      if (this.chainSteps.length > 0) {
        this.previewHtml = this.chainSteps[0].html;
      }
    } else {
      this.previewHtml = this.currentHtml;
    }
    
    this.cdr.markForCheck();
  }

  // ==================== SINGLE EMAIL HANDLERS ====================

  onConfigChange(config: EmailTemplateConfig): void {
    console.log('[Container] onConfigChange received:', config);
    this.currentConfig = { ...config };  // копия
    this.configChange.emit(this.currentConfig);
    this.cdr.markForCheck();
  }

  onHtmlChange(html: string): void {
    this.currentHtml = html;
    this.htmlChange.emit(html);
    
    if (this.editorMode === 'single') {
      this.previewHtml = html;
    }
    
    this.cdr.markForCheck();
  }

  // ==================== SAVE SINGLE ====================

  async saveSingleTemplate(): Promise<void> {
    if (this.quizId === null) {
      this.errorMessage = 'Quiz ID не задан';
      this.autoCloseMessage();
      return;
    }

    if (!this.currentHtml) {
      this.errorMessage = 'Нет содержимого письма';
      this.autoCloseMessage();
      return;
    }

    this.savingSingle = true;
    this.errorMessage = null;
    this.successMessage = null;
    this.cdr.markForCheck();

    const domain = this.getDomain();
    const app = this.getApp();

    if (!app) {
      this.errorMessage = 'App не задан в конфигурации';
      this.autoCloseMessage();
      this.savingSingle = false;
      return;
    }

    try {
      const data = {
        domain,
        app,
        quiz_id: this.quizId,
        type: this.templateType,             
        subject: this.currentConfig.greeting 
          ? `${this.currentConfig.greeting}, {{name}}!`
          : 'Результаты квиза',
        html: this.currentHtml
      };

      const result = await this.emailService.updateTemplateByClient(data).toPromise();

      if (result?.success) {
        this.successMessage = result.action === 'created' 
          ? 'Письмо успешно создано' 
          : 'Письмо успешно обновлено';
        
        await this.reloadTemplates();           
        this.autoCloseMessage();
      } else {
        this.errorMessage = result?.error || 'Ошибка сохранения письма';
        this.autoCloseMessage();
      }
    } catch (err: any) {
      this.errorMessage = err.message || 'Ошибка сохранения письма';
      this.autoCloseMessage();
    } finally {
      this.savingSingle = false;
      this.cdr.markForCheck();
    }
  }

  // ==================== CHAIN HANDLERS ====================

  onChainStepsChange(steps: ChainEmailStep[]): void {
    this.chainSteps = steps;
    this.chainStepsChange.emit(steps);
    
    // Обновляем превью
    if (steps[this.activeChainStep]) {
      this.previewHtml = steps[this.activeChainStep].html;
    }
    
    this.cdr.markForCheck();
  }

  onChainStepSelect(index: number): void {
    this.activeChainStep = index;
    
    if (this.chainSteps[index]) {
      this.previewHtml = this.chainSteps[index].html;
    }
    
    this.cdr.markForCheck();
  }

  // ==================== SAVE ====================

  async saveChainTemplates(): Promise<void> {
    if (this.quizId === null) {
      this.errorMessage = 'Quiz ID не задан';
      this.autoCloseMessage();
      return;
    }

    if (this.chainSteps.length === 0) {
      this.errorMessage = 'Добавьте хотя бы одно письмо в цепочку';
      this.autoCloseMessage();
      return;
    }

    this.saving = true;
    this.errorMessage = null;
    this.cdr.markForCheck();

    const domain = this.getDomain();
    const app = this.getApp();

    if (!app) {
      this.errorMessage = 'App не задан в конфигурации';
      this.autoCloseMessage();
      this.saving = false;
      return;
    }

    try {
      const templates = this.chainSteps.map(step => ({
        step: step.step,
        delayMinutes: step.delayMinutes,
        subject: step.subject,
        html: step.html,
      }));

      const result = await this.emailService.upsertChainTemplatesBulk({
        domain,
        app,
        chainType: this.chainType,
        quizId: this.quizId,
        templates,
      }).toPromise();

      if (result?.success) {
        this.successMessage = `Сохранено: ${result.created} создано, ${result.updated} обновлено`;
        
        // Сбрасываем isDirty
        this.chainSteps.forEach(s => s.isDirty = false);
        
        // Эмитим обновлённые steps наверх
        this.chainStepsChange.emit(this.chainSteps);
        await this.reloadTemplates();

        this.autoCloseMessage();
      } else {
        this.errorMessage = result?.error || 'Ошибка сохранения';
        this.autoCloseMessage();
      }
    } catch (err: any) {
      this.errorMessage = err.message || 'Ошибка сохранения';
      this.autoCloseMessage();
    } finally {
      this.saving = false;
      this.cdr.markForCheck();
    }
  }

  // ==================== Rerender ====================

  private async reloadTemplates(): Promise<void> {
    if (!this.quizId) return;

    const app = this.getApp();
    if (!app) return;

    try {
      // Для single — загружаем обычные шаблоны
      if (this.editorMode === 'single') {
        const domain = this.getDomain();
        this.emailService.getTemplates(domain, app, this.quizId).subscribe(templates => {
          const tpl = templates.find((t: any) => t.type === this.templateType);
          if (tpl) {
            this.currentHtml = tpl.html;
            this.currentConfig = this.extractConfigFromHtml(tpl.html);
            this.currentSubject = tpl.subject;
            this.previewHtml = tpl.html;
            this.cdr.markForCheck();
          }
        });
      }

      // Для chain — загружаем цепочку
      if (this.editorMode === 'chain') {
        this.emailService.getChainTemplates(app, this.quizId).subscribe(templates => {
          this.existingChainTemplates = templates;
          
          // Пересоздаём chainSteps на основе свежих данных
          this.chainSteps = templates
            .sort((a, b) => a.step - b.step)
            .map((tmpl, index) => this.chainTemplateToStep(tmpl, index === 0));
          
          // Обновляем превью
          if (this.chainSteps.length > 0) {
            this.previewHtml = this.chainSteps[0].html;
          }
          
          this.cdr.markForCheck();
        });
      }
    } catch (err) {
      console.error('Ошибка перезагрузки шаблонов:', err);
    }
  }

  // ==================== Preview ====================

  onChainPreviewChange(html: string): void {
    this.previewHtml = html;
    this.cdr.markForCheck();
  }

  // ==================== HELPERS ====================
  private getDomain(): string {
    return environment.auth.emailDomein || 'localhost';
  }

  private getApp(): string | undefined {
    return environment.auth.app;
  }

  private autoCloseMessage(): void {
    setTimeout(() => {
      this.errorMessage = null;
      this.successMessage = null;
      this.cdr.markForCheck();
    }, 3000);
  }

  onClose(): void {
    const hasUnsaved = this.chainSteps.some(s => s.isDirty);
    
    if (hasUnsaved) {
      if (!confirm('Есть несохранённые изменения. Закрыть без сохранения?')) {
        return;
      }
    }
    
    this.close.emit();
  }

  get hasDirtySteps(): boolean {
    return this.chainSteps.some(s => s.isDirty);
  }
}