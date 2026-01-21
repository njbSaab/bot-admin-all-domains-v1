// src/app/admin/pages/quiz/components/chain-email-editor/chain-email-editor.component.ts

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
import { BehaviorSubject } from 'rxjs';
import {
  ChainEmailStep,
  ChainTemplate,
  ChainType,
  EmailTemplateConfig,
  DEFAULT_EMAIL_CONFIG,
  DEFAULT_CHAIN_STEPS,
  DELAY_PRESETS,
  delayMinutesToLabel,
} from '../../interfaces/email-template.interface';
import { EmailTemplateService } from '../../../../../shared/services/email-template.service';

@Component({
  selector: 'app-chain-email-editor',
  templateUrl: './chain-email-editor.component.html',
  styleUrls: ['./chain-email-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChainEmailEditorComponent implements OnInit, OnChanges {
  @Input() quizName: string = '';
  @Input() quizId: number | null = null;
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() chainType: ChainType = 'PERSONAL';
  @Input() existingTemplates: ChainTemplate[] = [];

  @Output() stepsChange = new EventEmitter<ChainEmailStep[]>();
  @Output() stepSelect = new EventEmitter<number>();
  @Output() save = new EventEmitter<ChainEmailStep[]>();
  @Output() previewHtmlChange = new EventEmitter<string>();

  steps$ = new BehaviorSubject<ChainEmailStep[]>([]);
  
  delayPresets = DELAY_PRESETS;
  
 previewHtml: string = '';         
 activeStepIndex = 0;

  private initialized = false;

  constructor(
    private cdr: ChangeDetectorRef,
    private emailService: EmailTemplateService
  ) {}

  ngOnInit(): void {
    this.initSteps();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Если пришли existingTemplates и мы ещё не инициализировались
    if (changes['existingTemplates'] && this.existingTemplates.length > 0 && !this.initialized) {
      // console.log('ChainEmailEditor: received existingTemplates', this.existingTemplates);
      this.loadExistingTemplates();
      this.initialized = true;
    }
  }

  private initSteps(): void {
    // Если edit mode и есть существующие шаблоны — загружаем их
    if (this.existingTemplates.length > 0) {
      this.loadExistingTemplates();
      this.initialized = true;
    } else if (this.mode === 'create') {
      // Create mode — используем дефолтные шаги
      const defaultSteps = DEFAULT_CHAIN_STEPS.map(step => ({
        ...step,
        html: this.emailService.generateHtmlFromConfig(step.config),
      }));
      this.steps$.next(defaultSteps);
      this.emitChanges();
      this.updatePreview();
    }
  }

  private loadExistingTemplates(): void {
    // console.log('Loading existing templates into editor:', this.existingTemplates);
    
    const steps: ChainEmailStep[] = this.existingTemplates
      .sort((a, b) => a.step - b.step)
      .map((tmpl, index) => ({
        step: tmpl.step,
        delayMinutes: tmpl.delayMinutes,
        delayLabel: delayMinutesToLabel(tmpl.delayMinutes),
        subject: tmpl.subject,
        html: tmpl.html,
        config: this.extractConfigFromHtml(tmpl.html),
        isExpanded: index === 0,  // Первый раскрыт
        isDirty: false,
      }));

    // Если шагов нет — используем дефолтные
    if (steps.length === 0) {
      const defaultSteps = DEFAULT_CHAIN_STEPS.map(step => ({
        ...step,
        html: this.emailService.generateHtmlFromConfig(step.config),
      }));
      this.steps$.next(defaultSteps);
    } else {
      this.steps$.next(steps);
    }

    this.emitChanges();
    this.updatePreview();
    this.cdr.markForCheck();
  }

  /**
   * Извлечь config из HTML
   */
  private extractConfigFromHtml(html: string): EmailTemplateConfig {
    const config = { ...DEFAULT_EMAIL_CONFIG };
    
    // Извлекаем greeting
    const greetingMatch = html.match(/font-size:\s*22px[^>]*>([^,<]+),/i);
    if (greetingMatch) {
      config.greeting = greetingMatch[1].trim();
    }

    // Извлекаем titleText
    const titleMatch = html.match(/font-size:\s*26px[^"]*font-weight:\s*800[^>]*>([^<]+)</i);
    if (titleMatch) {
      config.titleText = titleMatch[1].trim();
    }

    // Извлекаем headerBg gradient
    const headerBgMatch = html.match(/linear-gradient\(135deg,\s*(#[0-9a-fA-F]{6})\s*0%,\s*(#[0-9a-fA-F]{6})/i);
    if (headerBgMatch) {
      config.headerBgStart = headerBgMatch[1];
      config.headerBgEnd = headerBgMatch[2];
    }

    // Извлекаем primary color
    const primaryMatch = html.match(/color:\s*(#[0-9a-fA-F]{6})[^>]*>\{\{name\}\}/i);
    if (primaryMatch) {
      config.primaryColor = primaryMatch[1];
    }

    // Извлекаем highlightText из блока с border-left
    const highlightMatch = html.match(/border-left:\s*6px[^>]*padding:\s*20px[^>]*>([^<]+)</i);
    if (highlightMatch) {
      config.highlightText = highlightMatch[1].trim();
    }

    // Извлекаем descriptionText
    const descMatch = html.match(/line-height:\s*1\.7[^>]*color:\s*#34495e[^>]*>([^<]+)</i);
    if (descMatch) {
      config.descriptionText = descMatch[1].trim();
    }

    // Извлекаем callToAction
    const ctaMatch = html.match(/border-left:\s*5px\s+solid[^>]*accentColor[^>]*>.*?<p[^>]*>([^<]+)</is);
    if (ctaMatch) {
      config.callToAction = ctaMatch[1].trim();
    }

    // Извлекаем btnText
    const btnMatch = html.match(/border-radius:\s*16px[^>]*text-decoration:\s*none[^>]*>([^<]+)<\/a>/i);
    if (btnMatch) {
      config.btnText = btnMatch[1].trim();
    }

    // Извлекаем btnLink
    const btnLinkMatch = html.match(/href="([^"]+)"[^>]*style="[^"]*border-radius:\s*16px/i);
    if (btnLinkMatch) {
      config.btnLink = btnLinkMatch[1];
    }

    // Извлекаем logoUrl
    const logoMatch = html.match(/<img[^>]*src="([^"]+)"[^>]*alt="Logo"/i);
    if (logoMatch) {
      config.logoUrl = logoMatch[1];
    }

    // Извлекаем footerText
    const footerMatch = html.match(/border-top:\s*2px\s+solid[^>]*>([^<©]+)/i);
    if (footerMatch) {
      config.footerText = footerMatch[1].trim();
    }

    return config;
  }

  // ==================== STEP MANAGEMENT ====================

  addStep(): void {
    const steps = this.steps$.value;
    const newStepNumber = steps.length + 1;
    
    const newStep: ChainEmailStep = {
      step: newStepNumber,
      delayMinutes: 1440 * newStepNumber,
      delayLabel: delayMinutesToLabel(1440 * newStepNumber),
      subject: `Nhắc nhở #${newStepNumber}`,
      html: '',
      config: { ...DEFAULT_EMAIL_CONFIG },
      isExpanded: true,
      isDirty: true,
    };
    
    newStep.html = this.emailService.generateHtmlFromConfig(newStep.config);
    
    steps.forEach(s => s.isExpanded = false);
    
    this.steps$.next([...steps, newStep]);
    this.activeStepIndex = steps.length;
    this.emitChanges();
    this.updatePreview();
  }

  removeStep(index: number): void {
    if (!confirm(`Удалить письмо #${index + 1}?`)) return;
    
    const steps = this.steps$.value.filter((_, i) => i !== index);
    
    steps.forEach((s, i) => {
      s.step = i + 1;
      s.isDirty = true;  // Помечаем как изменённые, т.к. изменились номера
    });
    
    this.steps$.next(steps);
    
    if (this.activeStepIndex >= steps.length) {
      this.activeStepIndex = Math.max(0, steps.length - 1);
    }
    
    this.emitChanges();
    this.updatePreview();
  }

  // ==================== STEP UPDATES ====================

  updateStepSubject(index: number, subject: string): void {
  const steps = [...this.steps$.value];
  steps[index] = { ...steps[index], subject, isDirty: true };
  this.steps$.next(steps);
  this.emitChanges();

  if (index === this.activeStepIndex) {
    this.updatePreview();          // ← важно!
  }
}

updateStepDelay(index: number, minutes: number): void {
  const steps = [...this.steps$.value];
  steps[index] = {
    ...steps[index],
    delayMinutes: minutes,
    delayLabel: delayMinutesToLabel(minutes),
    isDirty: true
  };
  this.steps$.next(steps);
  this.emitChanges();
  // delay не влияет на html → превью не трогаем
}

updateStepConfig(index: number, key: keyof EmailTemplateConfig, value: string): void {
  const steps = [...this.steps$.value];
  const updatedConfig = { ...steps[index].config, [key]: value };
  const updatedHtml  = this.emailService.generateHtmlFromConfig(updatedConfig);

  steps[index] = {
    ...steps[index],
    config: updatedConfig,
    html: updatedHtml,
    isDirty: true
  };

  this.steps$.next(steps);
  this.emitChanges();

  if (index === this.activeStepIndex) {
    this.updatePreview();          // ← КЛЮЧЕВОЕ место
  }
}

updateStepColor(index: number, key: keyof EmailTemplateConfig, event: Event): void {
  const input = event.target as HTMLInputElement;
  if (input?.value) {
    this.updateStepConfig(index, key, input.value);
  }
}

// ───────────────────────────────────────────────
// Переключение / выбор шага
// ───────────────────────────────────────────────

selectStep(index: number): void {
  this.activeStepIndex = index;

  const steps = [...this.steps$.value];
  steps.forEach((s, i) => s.isExpanded = i === index);
  this.steps$.next(steps);

  this.stepSelect.emit(index);
  this.updatePreview();           // ← обязательно!
  this.cdr.markForCheck();
}

toggleStep(index: number): void {
  const steps = [...this.steps$.value];
  const wasExpanded = steps[index].isExpanded;

  // Закрываем все, открываем только выбранный
  steps.forEach(s => s.isExpanded = false);
  steps[index].isExpanded = !wasExpanded;

  this.steps$.next(steps);

  if (steps[index].isExpanded) {
    this.activeStepIndex = index;
    this.stepSelect.emit(index);
    this.updatePreview();         // ← здесь тоже
  }

  this.cdr.markForCheck();
}

  // ==================== PREVIEW ====================
  private updatePreview(): void {
    const step = this.steps$.value[this.activeStepIndex];
    if (step) {
      this.previewHtml = step.html || '';
      this.previewHtmlChange.emit(this.previewHtml);  
    }
    this.cdr.markForCheck();
  }


  // ==================== EMIT ====================

  private emitChanges(): void {
    this.stepsChange.emit(this.steps$.value);
  }

  onSave(): void {
    this.save.emit(this.steps$.value);
  }

  // ==================== HELPERS ====================

  get currentStep(): ChainEmailStep | undefined {
    return this.steps$.value[this.activeStepIndex];
  }

  trackByStep(index: number, step: ChainEmailStep): number {
    return step.step;
  }
}