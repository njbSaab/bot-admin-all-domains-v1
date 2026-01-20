// src/app/admin/pages/quiz/components/email-editor-container/email-editor-container.component.ts

import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { EmailTemplateConfig, EmailTemplateVariables, DEFAULT_EMAIL_CONFIG } from '../../interfaces/email-template.interface';

@Component({
  selector: 'app-email-editor-container',
  templateUrl: './email-editor-container.component.html',
  styleUrls: ['./email-editor-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmailEditorContainerComponent implements OnInit, OnChanges {
  @Input() quizName: string = '';
  @Input() grandPrize: string = '';
  @Input() prizeForEveryOne: string = '';
  @Input() initialConfig: Partial<EmailTemplateConfig> | null = null;
  @Input() mode: 'create' | 'edit' = 'create';

  @Output() configChange = new EventEmitter<EmailTemplateConfig>();
  @Output() htmlChange = new EventEmitter<string>();
  @Output() close = new EventEmitter<void>();

  currentConfig: EmailTemplateConfig = { ...DEFAULT_EMAIL_CONFIG };
  currentHtml: string = '';

  previewVariables: EmailTemplateVariables = {
    name: 'Nguyen',
    score: 85,
    code: '123456',
    quizName: 'Quiz Demo',
    grandPrize: '1000 Freespins',
    prizeForEveryOne: '+10 FS',
    year: new Date().getFullYear()
  };

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.updatePreviewVariables();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['quizName'] || changes['grandPrize'] || changes['prizeForEveryOne']) {
      this.updatePreviewVariables();
    }
  }

  private updatePreviewVariables(): void {
    this.previewVariables = {
      ...this.previewVariables,
      quizName: this.quizName || 'Quiz Demo',
      grandPrize: this.grandPrize || '1000 Freespins',
      prizeForEveryOne: this.prizeForEveryOne || '+10 FS'
    };
  }

  onConfigChange(config: EmailTemplateConfig): void {
    this.currentConfig = config;
    this.configChange.emit(config);
    this.cdr.markForCheck();
  }

  onHtmlChange(html: string): void {
    this.currentHtml = html;
    this.htmlChange.emit(html);
    this.cdr.markForCheck();
  }

  onClose(): void {
    this.close.emit();
  }
}