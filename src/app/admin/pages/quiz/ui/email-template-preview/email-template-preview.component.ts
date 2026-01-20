// src/app/admin/pages/quiz/components/email-template-preview/email-template-preview.component.ts

import { 
  Component, 
  Input, 
  OnChanges, 
  SimpleChanges, 
  ChangeDetectionStrategy, 
  ViewChild, 
  ElementRef,
  AfterViewInit
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { EmailTemplateConfig, EmailTemplateVariables, DEFAULT_EMAIL_CONFIG } from '../../interfaces/email-template.interface';

@Component({
  selector: 'app-email-template-preview',
  templateUrl: './email-template-preview.component.html',
  styleUrls: ['./email-template-preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmailTemplatePreviewComponent implements OnChanges, AfterViewInit {
  @Input() config: EmailTemplateConfig = { ...DEFAULT_EMAIL_CONFIG };
  @Input() variables: EmailTemplateVariables = {
    name: 'Nguyen',
    score: 85,
    code: '123456',
    year: new Date().getFullYear()
  };
  @Input() html: string = '';

  @ViewChild('previewFrame') previewFrame!: ElementRef<HTMLIFrameElement>;

  renderedHtml: SafeHtml = '';
  viewMode: 'desktop' | 'mobile' = 'desktop';

  constructor(private sanitizer: DomSanitizer) {}

  ngAfterViewInit(): void {
    this.updatePreview();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['config'] || changes['variables'] || changes['html']) {
      this.updatePreview();
    }
  }

  private updatePreview(): void {
    const htmlContent = this.html || this.generateDefaultHtml();
    const processedHtml = this.replaceVariables(htmlContent);
    
    // Для iframe
    if (this.previewFrame?.nativeElement) {
      const iframe = this.previewFrame.nativeElement;
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (doc) {
        doc.open();
        doc.write(processedHtml);
        doc.close();
      }
    }

    // Для fallback
    this.renderedHtml = this.sanitizer.bypassSecurityTrustHtml(processedHtml);
  }

  private replaceVariables(html: string): string {
    let result = html;
    
    // Заменяем все переменные
    Object.entries(this.variables).forEach(([key, value]) => {
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
      result = result.replace(regex, String(value));
    });

    return result;
  }

  private generateDefaultHtml(): string {
    const c = this.config;
    
    return `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin: 0; padding: 0; font-family: 'Segoe UI', Arial, sans-serif; background-color: #f5f5f5; }
    * { box-sizing: border-box; }
  </style>
</head>
<body>
  <div style="max-width: 600px; margin: 20px auto; background: ${c.bgColor}; border-radius: 20px; overflow: hidden; box-shadow: 0 15px 40px rgba(0,0,0,0.1);">
    
    <!-- Header -->
    <div style="background: linear-gradient(135deg, ${c.headerBgStart} 0%, ${c.headerBgEnd} 100%); padding: 25px 20px; text-align: center;">
      <img src="${c.logoUrl}" alt="Logo" style="height: 60px;" />
    </div>

    <div style="padding: 35px 30px; color: ${c.textColor};">

      <!-- Greeting -->
      <p style="font-size: 22px; font-weight: 700; margin: 0 0 15px; text-align: center;">
        ${c.greeting}, <span style="color: ${c.primaryColor};">{{name}}</span>!
      </p>

      <!-- Title -->
      ${c.titleText ? `
        <div style="font-size: 26px; font-weight: 800; color: ${c.primaryColor}; line-height: 1.3; margin: 10px 0; text-align: center;">
          ${c.titleText}
        </div>
      ` : ''}

      <!-- Highlight -->
      ${c.highlightText ? `
        <div style="font-size: 18px; font-weight: 600; color: ${c.textColor}; background: ${c.cardBgColor}; padding: 20px; border-radius: 12px; border-left: 6px solid ${c.primaryColor}; margin: 25px 0;">
          ${c.highlightText}
        </div>
      ` : ''}

      <!-- Prize -->
      ${c.prizeText ? `
        <div style="font-size: 17px; color: #e74c3c; background: #fff5f5; padding: 18px; border-radius: 12px; border-left: 5px solid #e74c3c; margin: 25px 0;">
          <strong>Chú ý!</strong> ${c.prizeText}
        </div>
      ` : ''}

      <!-- Description -->
      ${c.descriptionText ? `
        <div style="font-size: 16px; line-height: 1.7; color: #34495e; margin: 25px 0;">
          ${c.descriptionText}
        </div>
      ` : ''}

      <!-- Call to Action -->
      ${c.callToAction ? `
        <div style="background: #f0f2ff; padding: 25px; border-radius: 16px; text-align: center; margin: 0; border-left: 5px solid ${c.accentColor};">
          <p style="font-size: 18px; font-weight: 600; color: ${c.textColor}; margin: 0;">
            ${c.callToAction}
          </p>
        </div>
      ` : ''}

      <!-- Button -->
      <div style="text-align: center; margin: 40px 0;">
        <a href="${c.btnLink}" style="display: inline-block; padding: 18px 50px; background: linear-gradient(135deg, ${c.btnBgStart}, ${c.btnBgEnd}); color: ${c.btnTextColor}; font-weight: 700; font-size: 19px; border-radius: 16px; text-decoration: none; box-shadow: 0 8px 25px rgba(59, 130, 246, 0.5);">
          ${c.btnText}
        </a>
      </div>

      <!-- Footer -->
      <div style="margin-top: 50px; padding-top: 25px; border-top: 2px solid #eee; color: ${c.textSecondaryColor}; font-size: 14px; text-align: center; line-height: 1.6;">
        ${c.footerText}
        <br><br>
        © {{year}} VoteVibe. All rights reserved.
      </div>
    </div>
  </div>
</body>
</html>`.trim();
  }

  toggleViewMode(): void {
    this.viewMode = this.viewMode === 'desktop' ? 'mobile' : 'desktop';
  }
}