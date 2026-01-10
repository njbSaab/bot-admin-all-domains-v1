import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';
import { MainEmail, TemplateContent, TemplateStyles, DisplayFlags, SocialLink } from '../../admin/pages/email-sent/email-templates/main-email';
import { environment } from '../../../environments/environment';

export interface TemplateData {
  id: number;
  name: string;
  templateData: string; // JSON-строка в базе
  created_at: string;
  updated_at: string;
}

@Injectable({
  providedIn: 'root',
})
export class EmailTemplatesService {
  private apiUrl = `${environment.auth.baseUrl}/email-templates`;

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {}

  getTemplates(): Observable<{ id: number; name: string; instance: MainEmail }[]> {
    return this.http.get<TemplateData[]>(this.apiUrl).pipe(
      map(templates => {
        return templates.map(template => {
          let data;
try {
  let raw = template.templateData.trim();

  // Важно: если в базе хранится JSON как строка в кавычках (точно твой случай)
  if (raw.startsWith('"') && raw.endsWith('"')) {
    raw = raw.slice(1, -1); // убираем внешние кавычки
  }

  // Только заменяем экранированные кавычки внутри строки
  raw = raw.replace(/\\"/g, '"');

  // НЕ ТРОГАЕМ \\n, \\r и т.д. — JSON.parse сам их обработает правильно!
  // raw = raw.replace(/\\n/g, '\n')  ← УДАЛИТЬ ЭТУ СТРОКУ И ВСЕ ПОХОЖИЕ!

  data = JSON.parse(raw);

  // console.log('Успешно загрузили шаблон:', template.name);
  // console.log('templateBody (первые 200 символов):', data.content?.templateBody?.substring(0, 200));
} catch (e) {
  console.error('Критическая ошибка парсинга шаблона:', template.name, e);
  // console.log('Raw templateData из базы:', template.templateData);
  data = {};
}
  
          // Проверяем структуру данных
          const contentData = data.content || data; // Для старых шаблонов данные могут быть на верхнем уровне
          const stylesData = data.styles || data;
          const displayFlagsData = data.displayFlags || data;
  
          // Формируем объект контента
          const content: Partial<TemplateContent> = {
            templateHeader: contentData.templateHeader || 'Enter your header text here',
            templateBody: contentData.templateBody || 'Enter your body text here.',
            templateSecondHeader: contentData.templateSecondHeader || 'Enter your second header text here',
            templateButtonText: contentData.templateButtonText || 'Click Me',
            templateButtonLink: contentData.templateButtonLink || 'https://www.example.com',
            templateLogo: contentData.templateLogo || 'https://i.ibb.co/NdFQjKMs/x-logo-bg.png',
            templateMainImage: contentData.templateMainImage || 'https://i.ibb.co/hFvg6bYJ/ball-letter.png',
            templateWaveImage: contentData.templateWaveImage || 'https://i.ibb.co/yBFYmQPs/wave.png',
            templateFooterText: contentData.templateFooterText || 'If you do not wish to receive emails from us, please write to this address 1111@gmail.com.',
            templateSocialLinks: contentData.templateSocialLinks || [
              {
                href: 'https://www.facebook.com/example',
                src: 'https://i.ibb.co/NdFQjKMs/x-logo-bg.png',
                alt: 'Facebook',
                title: 'Facebook',
              },
            ],
          };
  
          // Формируем объект стилей
          const styles: Partial<TemplateStyles> = {
            bodyStyle: stylesData.bodyStyle || '#ffffff',
            wrapperBg: stylesData.wrapperBg || '#ffffff',
            logoWrappWidth: stylesData.logoWrappWidth || '100%',
            logoBg: stylesData.logoBg || '#ffffff',
            logoRadius: stylesData.logoRadius || '0',
            logoFloat: stylesData.logoFloat || 'center',
            logoMarginT: stylesData.logoMarginT || '15px',
            logoMarginB: stylesData.logoMarginB || '15px',
            logoWidth: stylesData.logoWidth || '150px',
            headerTitleBg: stylesData.headerTitleBg || '#ffffff',
            headercolorText: stylesData.headercolorText || '#000000',
            headerTitleFontSize: stylesData.headerTitleFontSize || '25px',
            headerTitleStyle: stylesData.headerTitleStyle || 'normal',
            headerTitleWeight: stylesData.headerTitleWeight || 'bold',
            headerTitleMarginTop: stylesData.headerTitleMarginTop || '0',
            headerTitleMarginBottom: stylesData.headerTitleMarginBottom || '0',
            headerTitleAlign: stylesData.headerTitleAlign || 'center',
            headerRadius: stylesData.headerRadius || '0',
            headerWidth: stylesData.headerWidth || '100%',
            headerMarginT: stylesData.headerMarginT || '10px',
            headerMarginB: stylesData.headerMarginB || '10px',
            headerDecoration: stylesData.headerDecoration || 'none',
            buttonColor: stylesData.buttonColor || '#00416D',
            buttonTextColor: stylesData.buttonTextColor || '#ffffff',
            buttonBorderRadius: stylesData.buttonBorderRadius || '30px',
            buttonWidth: stylesData.buttonWidth || '80%',
            buttonTextSize: stylesData.buttonTextSize || '22px',
            buttonRadius: stylesData.buttonRadius || '30px',
            buttonfontWeight: stylesData.buttonfontWeight || 'bold',
            buttonPaddingX: stylesData.buttonPaddingX || '8px',
            buttonPaddingY: stylesData.buttonPaddingY || '16px',
            buttonMarginY: stylesData.buttonMarginY || '0px',
            buttonWrapperBg: stylesData.buttonWrapperBg || '#ffffff',
            buttonWrappPaddingY: stylesData.buttonWrappPaddingY || '20px',
            buttonBoxShadow: stylesData.buttonBoxShadow || '',
            buttonDropShadow: stylesData.buttonDropShadow || '',
            imgW: stylesData.imgW || '100%',
            imgBg: stylesData.imgBg || '#ffffff',
            imgWrapRadius: stylesData.imgWrapRadius || '0',
            imgWidth: stylesData.imgWidth || '100%',
            imgRadius: stylesData.imgRadius || '0',
            imgFloat: stylesData.imgFloat || 'center',
            imgCenter: stylesData.imgCenter || 'auto',
            imgMrTop: stylesData.imgMrTop || '0',
            imgMrBottom: stylesData.imgMrBottom || '0',
            waveImageWidth: stylesData.waveImageWidth || '100%',
            h2TitleAlign: stylesData.h2TitleAlign || 'center',
            h2TitleColor: stylesData.h2TitleColor || '#000000',
            h2TitleStyle: stylesData.h2TitleStyle || 'normal',
            h2TitleSize: stylesData.h2TitleSize || '22px',
            h2TitleWeight: stylesData.h2TitleWeight || 'bold',
            h2TitleMarginTop: stylesData.h2TitleMarginTop || '10px',
            h2TitleMarginBottom: stylesData.h2TitleMarginBottom || '10px',
            h2TextDecoration: stylesData.h2TextDecoration || 'none',
            h2Bg: stylesData.h2Bg || '#ffffff',
            h2Radius: stylesData.h2Radius || '0',
            textColor: stylesData.textColor || '#000000',
            textAlign: stylesData.textAlign || 'left',
            textBg: stylesData.textBg || '#ffffff',
            textPdLeft: stylesData.textPdLeft || '0',
            textPdRight: stylesData.textPdRight || '0',
            textRadius: stylesData.textRadius || '0',
            textDescrAlign: stylesData.textDescrAlign || 'left',
            textDescrColor: stylesData.textDescrColor || '#000000',
            textDescrFont: stylesData.textDescrFont || '16px',
            textDescrWeight: stylesData.textDescrWeight || 'normal',
            textDescrStyle: stylesData.textDescrStyle || 'normal',
            textDescr: stylesData.textDescr || 'none',
            textWrapperBg: stylesData.textWrapperBg || '#ffffff',
            textWrapperRadius: stylesData.textWrapperRadius || '0',
            textPadX: stylesData.textPadX || '20px',
            textPadY: stylesData.textPadY || '20px',
            footerBg: stylesData.footerBg || '#ffffff',
            footerTextColor: stylesData.footerTextColor || '#000000',
            footerTextFontSize: stylesData.footerTextFontSize || '14px',
            footerTextPaddingLeft: stylesData.footerTextPaddingLeft || '10px',
            footerTextPaddingRight: stylesData.footerTextPaddingRight || '10px',
            footerTextPaddingX: stylesData.footerTextPaddingX || '10px',
            footerTextPaddingY: stylesData.footerTextPaddingY || '10px',
            socialIconWidth: stylesData.socialIconWidth || '32px',
            mainTextColor: stylesData.mainTextColor || '#000000',
            mainTextAlign: stylesData.mainTextAlign || 'left',
            mainTextBg: stylesData.mainTextBg || '#ffffff',
            mainTextPdLeft: stylesData.mainTextPdLeft || '0px',
            mainTextPdRight: stylesData.mainTextPdRight || '0',
            mainTextSize: stylesData.mainTextSize || '18px',
            mainTextWeight: stylesData.mainTextWeight || 'normal',
          };
  
          // Формируем объект флагов отображения
          const displayFlags: Partial<DisplayFlags> = {
            isLogoActive: displayFlagsData.isLogoActive ?? true,
            isHeaderActive: displayFlagsData.isHeaderActive ?? true,
            isMainImageActive: displayFlagsData.isMainImageActive ?? true,
            isWaveImageActive: displayFlagsData.isWaveImageActive ?? false,
            isSecondHeaderActive: displayFlagsData.isSecondHeaderActive ?? true,
            isBodyActive: displayFlagsData.isBodyActive ?? true,
            isButtonActive: displayFlagsData.isButtonActive ?? true,
            isFooterActive: displayFlagsData.isFooterActive ?? true,
            isSocialLinksActive: displayFlagsData.isSocialLinksActive ?? true,
          };
  
          // console.log(`Загружен шаблон ${template.name} (ID: ${template.id}):`, { content, styles, displayFlags }); // Лог для отладки
  
          const instance = new MainEmail(this.sanitizer, { content, styles, displayFlags });
          return { id: template.id, name: template.name, instance };
        });
      })
    );
  }
  
  saveTemplate(name: string, templateData: { content: TemplateContent, styles: TemplateStyles, displayFlags: DisplayFlags }): Observable<TemplateData> {
    return this.http.get<TemplateData[]>(this.apiUrl).pipe(
      switchMap(templates => {
        const nameExists = templates.some(t => t.name.toLowerCase() === name.toLowerCase());
        if (nameExists) {
          throw new Error('Шаблон с таким именем уже существует');
        }
        return this.http.post<TemplateData>(this.apiUrl, { name, templateData: JSON.stringify(templateData) });
      })
    );
  }

  updateTemplate(id: number, name: string, templateData: { content: TemplateContent, styles: TemplateStyles, displayFlags: DisplayFlags }): Observable<TemplateData> {
    return this.http.put<TemplateData>(`${this.apiUrl}/${id}`, { name, templateData: JSON.stringify(templateData) });
  }

  deleteTemplate(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}