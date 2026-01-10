import { Component, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { MainEmail } from '../../email-sent/email-templates/main-email';

@Component({
  selector: 'app-email-template-editor',
  templateUrl: './email-template-editor.component.html',
  styleUrl: './email-template-editor.component.scss'
})
export class EmailTemplateEditorComponent {
  @Input() emailTemplate: MainEmail | null = null;
  @Input() isSending: boolean = false;
  @Output() emailTemplateChange = new EventEmitter<MainEmail>();

  br = '<br>'
  // Вызывается при любых изменениях через ngModel
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['emailTemplate']) {
      console.log('emailTemplate изменился:', {
        templateHeader: this.emailTemplate?.templateHeader,
        templateBody: this.emailTemplate?.templateBody,
        templateSecondHeader: this.emailTemplate?.templateSecondHeader,
      });
    }
  }

  onModelChange() {
    if (this.emailTemplate) {
      console.log('Editor emitted changes:', {
        templateHeader: this.emailTemplate.templateHeader,
        templateBody: this.emailTemplate.templateBody,
        templateSecondHeader: this.emailTemplate.templateSecondHeader,
        bodyStyle: this.emailTemplate.bodyStyle,
        isLogoActive: this.emailTemplate.isLogoActive,
      });
      this.emailTemplateChange.emit(this.emailTemplate);
    }
  }
  // Обработчики для флагов активности
  onLogoActiveChange(event: Event) {
    if (this.emailTemplate) {
      this.emailTemplate.isLogoActive = (event.target as HTMLInputElement).checked;
      console.log('Logo active changed:', this.emailTemplate.isLogoActive);
      this.onModelChange(); // Используем общий метод
    }
  }

  onHeaderActiveChange(event: Event) {
    if (this.emailTemplate) {
      this.emailTemplate.isHeaderActive = (event.target as HTMLInputElement).checked;
      console.log('Header active changed:', this.emailTemplate.isHeaderActive);
      this.onModelChange();
    }
  }

  onMainImageActiveChange(event: Event) {
    if (this.emailTemplate) {
      this.emailTemplate.isMainImageActive = (event.target as HTMLInputElement).checked;
      console.log('Main image active changed:', this.emailTemplate.isMainImageActive);
      this.onModelChange();
    }
  }

  onWaveImageActiveChange(event: Event) {
    if (this.emailTemplate) {
      this.emailTemplate.isWaveImageActive = (event.target as HTMLInputElement).checked;
      console.log('Wave image active changed:', this.emailTemplate.isWaveImageActive);
      this.onModelChange();
    }
  }

  onSecondHeaderActiveChange(event: Event) {
    if (this.emailTemplate) {
      this.emailTemplate.isSecondHeaderActive = (event.target as HTMLInputElement).checked;
      console.log('Second header active changed:', this.emailTemplate.isSecondHeaderActive);
      this.onModelChange();
    }
  }

  onBodyActiveChange(event: Event) {
    if (this.emailTemplate) {
      this.emailTemplate.isBodyActive = (event.target as HTMLInputElement).checked;
      console.log('Body active changed:', this.emailTemplate.isBodyActive);
      this.onModelChange();
    }
  }

  onButtonActiveChange(event: Event) {
    if (this.emailTemplate) {
      this.emailTemplate.isButtonActive = (event.target as HTMLInputElement).checked;
      console.log('Button active changed:', this.emailTemplate.isButtonActive);
      this.onModelChange();
    }
  }

  onFooterActiveChange(event: Event) {
    if (this.emailTemplate) {
      this.emailTemplate.isFooterActive = (event.target as HTMLInputElement).checked;
      console.log('Footer active changed:', this.emailTemplate.isFooterActive);
      this.onModelChange();
    }
  }

  onSocialLinksActiveChange(event: Event) {
    if (this.emailTemplate) {
      this.emailTemplate.isSocialLinksActive = (event.target as HTMLInputElement).checked;
      console.log('Social links active changed:', this.emailTemplate.isSocialLinksActive);
      this.onModelChange();
    }
  }
}