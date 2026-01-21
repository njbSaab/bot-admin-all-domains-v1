// src/app/admin/pages/quiz/ui/email-template-editor/email-template-editor.component.ts

import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { 
  EmailTemplateConfig, 
  EmailTemplateVariables, 
  DEFAULT_EMAIL_CONFIG 
} from '../../interfaces/email-template.interface';

@Component({
  selector: 'app-quiz-email-template-editor',
  templateUrl: './email-template-editor.component.html',
  styleUrls: ['./email-template-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuizEmailTemplateEditorComponent implements OnInit, OnChanges {
  @Input() quizName: string = '';
  @Input() grandPrize: string = '';
  @Input() prizeForEveryOne: string = '';
  @Input() initialConfig: Partial<EmailTemplateConfig> | null = null;
  @Input() mode: 'create' | 'edit' = 'create';
  
  @Output() configChange = new EventEmitter<EmailTemplateConfig>();
  @Output() htmlChange = new EventEmitter<string>();

  config$ = new BehaviorSubject<EmailTemplateConfig>({ ...DEFAULT_EMAIL_CONFIG });

  // Placeholder строки с переменными шаблона (Angular не будет их интерполировать)
  readonly subjectPlaceholder = 'Chúc mừng {{name}}! Bạn đạt {{score}}% điểm';
  readonly scorePlaceholder = 'Bạn đã đạt được {{score}}% điểm!';

  previewVariables: EmailTemplateVariables = {
    name: 'Nguyen',
    score: 85,
    code: '123456',
    quizName: 'Quiz Demo',
    grandPrize: '1000 Freespins',
    prizeForEveryOne: '+10 FS',
    year: new Date().getFullYear()
  };

  activeSection: 'colors' | 'content' | 'advanced' = 'content';

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    console.log('[Editor] ngOnInit, mode:', this.mode);
    console.log('[Editor] ngOnInit, initialConfig:', this.initialConfig);
    this.initConfig();
  }

  // FIX: Теперь initialConfig применяется и в edit, и в create режиме
  ngOnChanges(changes: SimpleChanges): void {
    console.log('[Editor] ngOnChanges called');
    
    if (changes['quizName'] || changes['grandPrize'] || changes['prizeForEveryOne']) {
      this.updatePreviewVariables();
    }

    // Логируем изменение initialConfig
    if (changes['initialConfig']) {
      console.log('[Editor] initialConfig changed:');
      console.log('[Editor]   previousValue:', changes['initialConfig'].previousValue);
      console.log('[Editor]   currentValue:', changes['initialConfig'].currentValue);
      console.log('[Editor]   firstChange:', changes['initialConfig'].firstChange);
    }

    // Применяем initialConfig когда он приходит (и в edit, и в create)
    if (changes['initialConfig'] && this.initialConfig) {
      const newConfig = { ...DEFAULT_EMAIL_CONFIG, ...this.initialConfig };
      console.log('[Editor] Applying new config:', newConfig);
      console.log('[Editor]   greeting:', newConfig.greeting);
      console.log('[Editor]   titleText:', newConfig.titleText);
      console.log('[Editor]   logoUrl:', newConfig.logoUrl);
      
      this.config$.next(newConfig);
      this.emitChanges(newConfig);
      this.cdr.markForCheck();
    }
  }

  private initConfig(): void {
    console.log('[Editor] initConfig, mode:', this.mode);
    
    if (this.mode === 'edit') {
      // В edit ждём реальных данных из [initialConfig]
      if (this.initialConfig) {
        console.log('[Editor] initConfig: edit mode with initialConfig');
        this.config$.next({ ...DEFAULT_EMAIL_CONFIG, ...this.initialConfig });
      } else {
        console.log('[Editor] initConfig: edit mode WITHOUT initialConfig, using defaults');
        this.config$.next({ ...DEFAULT_EMAIL_CONFIG });
      }
      return;
    }

    // create
    const config = this.initialConfig 
      ? { ...DEFAULT_EMAIL_CONFIG, ...this.initialConfig }
      : { ...DEFAULT_EMAIL_CONFIG };
    
    console.log('[Editor] initConfig: create mode, config:', config);
    this.config$.next(config);
    this.emitChanges(config);
  }

  private updatePreviewVariables(): void {
    this.previewVariables = {
      ...this.previewVariables,
      quizName: this.quizName || 'Quiz Demo',
      grandPrize: this.grandPrize || '1000 Freespins',
      prizeForEveryOne: this.prizeForEveryOne || '+10 FS'
    };
  }

  // Обновление текстовых полей
  updateConfig(key: keyof EmailTemplateConfig, value: string): void {
    const current = this.config$.value;
    const updated = { ...current, [key]: value };
    this.config$.next(updated);
    this.emitChanges(updated);
  }

  // Обновление boolean полей (чекбоксы)
  updateConfigBool(key: keyof EmailTemplateConfig, value: boolean): void {
    const current = this.config$.value;
    const updated = { ...current, [key]: value };
    this.config$.next(updated);
    this.emitChanges(updated);
  }

  updateColor(key: keyof EmailTemplateConfig, event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.value) {
      this.updateConfig(key, input.value);
    }
  }

  private emitChanges(config: EmailTemplateConfig): void {
    this.configChange.emit(config);
    this.htmlChange.emit(this.generateHtml(config));
  }

  toggleBlock(key: keyof EmailTemplateConfig): void {
    const current = this.config$.value;
    const updated = { ...current, [key]: !current[key] };
    this.config$.next(updated);
    this.emitChanges(updated);
  }

  generateHtml(config: EmailTemplateConfig): string {
    return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Quiz Result</title>
  <style>
    body { font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f6f9; margin: 0; padding: 0; color: #333; }
    .container { max-width: 600px; margin: 20px auto; background-color: ${config.bgColor}; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, ${config.headerBgStart} 0%, ${config.headerBgEnd} 100%); color: white; padding: 30px 20px; text-align: center; }
    .header img { height: 60px; margin-bottom: 15px; }
    .header h1 { margin: 0; font-size: 24px; font-weight: 600; }
    .content { padding: 30px 25px; }
    .greeting { font-size: 18px; margin-bottom: 20px; color: ${config.textColor}; }
    .highlight-box { background: ${config.cardBgColor}; padding: 20px; border-radius: 10px; text-align: center; margin: 20px 0; border-left: 5px solid ${config.primaryColor}; }
    .score { font-size: 32px; font-weight: 700; color: ${config.primaryColor}; margin: 8px 0; }
    .prize-box { font-size: 17px; color: #e74c3c; background: #fff5f5; padding: 18px; border-radius: 12px; border-left: 5px solid #e74c3c; margin: 25px 0; }
    .description { font-size: 16px; line-height: 1.7; color: #34495e; margin: 25px 0; }
    .cta-box { background: #f0f2ff; padding: 25px; border-radius: 16px; text-align: center; margin: 25px 0; border-left: 5px solid ${config.accentColor}; }
    .btn { display: inline-block; padding: 18px 50px; background: linear-gradient(135deg, ${config.btnBgStart}, ${config.btnBgEnd}); color: ${config.btnTextColor}; font-weight: 700; font-size: 19px; border-radius: 16px; text-decoration: none; box-shadow: 0 8px 25px rgba(59, 130, 246, 0.5); }
    .footer { background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 14px; color: ${config.textSecondaryColor}; }
    .footer a { color: ${config.primaryColor}; text-decoration: none; }
    @media (max-width: 480px) { .container { margin: 10px; } .header { padding: 20px 15px; } .content { padding: 20px 15px; } }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="${config.logoUrl}" alt="Logo" />
      <h1>${config.titleText || 'Chúc mừng bạn!'}</h1>
    </div>

    <div class="content">
      <p class="greeting">${config.greeting}, <strong>{{name}}</strong>! {{quizTitle}}</p>

      ${config.showHighlight ? `
      <div class="highlight-box">
        <div>Điểm số của bạn</div>
        <div class="score">{{score}}%</div>
        <div>${config.highlightText}</div>
      </div>
      ` : ''}

      ${config.showPrize && config.prizeText ? `
      <div class="prize-box">
        <strong>Chú ý!</strong> ${config.prizeText}
      </div>
      ` : ''}

      ${config.showDescription && config.descriptionText ? `
      <div class="description">${config.descriptionText}</div>
      ` : ''}

      ${config.showCTA && config.callToAction ? `
      <div class="cta-box">
        <p style="margin: 0; font-weight: 600;">${config.callToAction}</p>
      </div>
      ` : ''}

      ${config.showButton ? `
      <div style="text-align: center; margin: 40px 0;">
        <a href="${config.btnLink}" class="btn">${config.btnText}</a>
      </div>
      ` : ''}
    </div>

    <div class="footer">
      <p>${config.footerText}</p>
      <p>&copy; {{year}} VoteVibe. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`;
  }

  resetToDefault(): void {
    if (confirm('Сбросить все настройки к значениям по умолчанию?')) {
      this.config$.next({ ...DEFAULT_EMAIL_CONFIG });
      this.emitChanges(DEFAULT_EMAIL_CONFIG);
      this.cdr.markForCheck();
    }
  }

  setActiveSection(section: 'colors' | 'content' | 'advanced'): void {
    this.activeSection = section;
    this.cdr.markForCheck();
  }
}