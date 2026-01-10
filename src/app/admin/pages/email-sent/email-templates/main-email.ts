import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

export interface SocialLink {
  href: string;
  src: string;
  alt: string;
  title: string;
}

export interface TemplateContent {
  templateHeader: string;
  templateBody: string;
  templateSecondHeader: string;
  templateButtonText: string;
  templateButtonLink: string;
  templateLogo: string;
  templateMainImage: string;
  templateWaveImage: string;
  templateFooterText: string;
  templateSocialLinks: SocialLink[];
}

export interface TemplateStyles {
  bodyStyle: string;
  wrapperBg: string;
  logoWrappWidth: string;
  logoBg: string;
  logoRadius: string;
  logoFloat: string;
  logoMarginT: string;
  logoMarginB: string;
  logoWidth: string;
  headerTitleBg: string;
  headercolorText: string;
  headerTitleFontSize: string;
  headerTitleStyle: string;
  headerTitleWeight: string;
  headerTitleMarginTop: string;
  headerTitleMarginBottom: string;
  headerTitleAlign: string;
  headerRadius: string;
  headerWidth: string;
  headerMarginT: string;
  headerMarginB: string;
  headerDecoration: string;
  buttonColor: string;
  buttonTextColor: string;
  buttonBorderRadius: string;
  buttonWidth: string;
  buttonTextSize: string;
  buttonRadius: string;
  buttonfontWeight: string;
  buttonPaddingX: string;
  buttonPaddingY: string;
  buttonMarginY: string;
  buttonWrapperBg: string;
  buttonWrappPaddingY: string;
  buttonBoxShadow?: string;
  buttonDropShadow?: string;
  imgW: string;
  imgBg: string;
  imgWrapRadius: string;
  imgWidth: string;
  imgRadius: string;
  imgFloat: string;
  imgCenter: string;
  imgMrTop: string;
  imgMrBottom: string;
  waveImageWidth: string;
  h2TitleAlign: string;
  h2TitleColor: string;
  h2TitleStyle: string;
  h2TitleSize: string;
  h2TitleWeight: string;
  h2TitleMarginTop: string;
  h2TitleMarginBottom: string;
  h2TextDecoration: string;
  h2Bg: string;
  h2Radius: string;
  textColor: string;
  textAlign: string;
  textBg: string;
  textPdLeft: string;
  textPdRight: string;
  textRadius: string;
  textDescrAlign: string;
  textDescrColor: string;
  textDescrFont: string;
  textDescrWeight: string;
  textDescrStyle: string;
  textDescr: string;
  textWrapperBg: string;
  textWrapperRadius: string;
  textPadX: string;
  textPadY: string;
  footerBg: string;
  footerTextColor: string;
  footerTextFontSize: string;
  footerTextPaddingLeft?: string;
  footerTextPaddingRight?: string;
  footerTextPaddingX?: string;
  footerTextPaddingY?: string;
  socialIconWidth: string;
  mainTextColor?: string;
  mainTextAlign?: string;
  btnAlign?: string;
  mainTextBg?: string;
  mainTextPdLeft?: string;
  mainTextPdRight?: string;
  mainTextSize?: string;
  mainTextWeight?: string;
}

export interface DisplayFlags {
  isLogoActive: boolean;
  isHeaderActive: boolean;
  isMainImageActive: boolean;
  isWaveImageActive: boolean;
  isSecondHeaderActive: boolean;
  isBodyActive: boolean;
  isButtonActive: boolean;
  isFooterActive: boolean;
  isSocialLinksActive: boolean;
}

export class MainEmail {
  // Контент шаблона
  templateHeader: string = 'Enter your header text here';
  templateBody: string = 'Enter your body text here.';
  templateSecondHeader: string = 'Enter your second header text here';
  templateButtonText: string = 'Click Me';
  templateButtonLink: string = 'https://www.example.com';
  templateLogo: string = 'https://i.ibb.co/NdFQjKMs/x-logo-bg.png';
  templateMainImage: string = 'https://i.ibb.co/hFvg6bYJ/ball-letter.png';
  templateWaveImage: string = 'https://i.ibb.co/yBFYmQPs/wave.png';
  templateFooterText: string = 'If you do not wish to receive emails from us, please write to this address 1111@gmail.com.';
  templateSocialLinks: SocialLink[] = [
    {
      href: 'https://www.facebook.com/example',
      src: 'https://i.ibb.co/NdFQjKMs/x-logo-bg.png',
      alt: 'Facebook',
      title: 'Facebook',
    },
  ];

  // Стили шаблона
  bodyStyle: string = '#ffffff';
  wrapperBg: string = '#ffffff';
  logoWrappWidth: string = '100%';
  logoBg: string = '#ffffff';
  logoRadius: string = '0';
  logoFloat: string = 'center';
  logoMarginT: string = '15px';
  logoMarginB: string = '15px';
  logoWidth: string = '150px';
  headerTitleBg: string = '#ffffff';
  headercolorText: string = '#000000';
  headerTitleFontSize: string = '25px';
  headerTitleStyle: string = 'normal';
  headerTitleWeight: string = 'bold';
  headerTitleMarginTop: string = '0';
  headerTitleMarginBottom: string = '0';
  headerTitleAlign: string = 'center';
  headerRadius: string = '0';
  headerWidth: string = '100%';
  headerMarginT: string = '10px';
  headerMarginB: string = '10px';
  headerDecoration: string = 'none';
  buttonColor: string = '#00416D';
  buttonTextColor: string = '#ffffff';
  buttonBorderRadius: string = '30px';
  buttonWidth: string = '80%';
  buttonTextSize: string = '22px';
  buttonRadius: string = '30px';
  buttonfontWeight: string = 'bold';
  buttonPaddingX: string = '8px';
  buttonPaddingY: string = '16px';
  buttonMarginY: string = '0px';
  buttonWrapperBg: string = '#ffffff';
  buttonWrappPaddingY: string = '20px';
  buttonBoxShadow: string = '';
  buttonDropShadow: string = '';
  imgW: string = '100%';
  imgBg: string = '#ffffff';
  imgWrapRadius: string = '0';
  imgWidth: string = '100%';
  imgRadius: string = '0';
  imgFloat: string = 'center';
  imgCenter: string = 'auto';
  imgMrTop: string = '0';
  imgMrBottom: string = '0';
  waveImageWidth: string = '100%';
  h2TitleAlign: string = 'center';
  h2TitleColor: string = '#000000';
  h2TitleStyle: string = 'normal';
  h2TitleSize: string = '22px';
  h2TitleWeight: string = 'bold';
  h2TitleMarginTop: string = '10px';
  h2TitleMarginBottom: string = '10px';
  h2TextDecoration: string = 'none';
  h2Bg: string = '#ffffff';
  h2Radius: string = '0';
  textColor: string = '#000000';
  textAlign: string = 'left';
  textBg: string = '#ffffff';
  textPdLeft: string = '0';
  textPdRight: string = '0';
  textRadius: string = '0';
  textDescrAlign: string = 'left';
  textDescrColor: string = '#000000';
  textDescrFont: string = '16px';
  textDescrWeight: string = 'normal';
  textDescrStyle: string = 'normal';
  textDescr: string = 'none';
  textWrapperBg: string = '#ffffff';
  textWrapperRadius: string = '0';
  textPadX: string = '20px';
  textPadY: string = '20px';
  footerBg: string = '#ffffff';
  footerTextColor: string = '#000000';
  footerTextFontSize: string = '14px';
  footerTextPaddingLeft: string = '10px';
  footerTextPaddingRight: string = '10px';
  footerTextPaddingX: string = '10px';
  footerTextPaddingY: string = '10px';
  socialIconWidth: string = '32px';
  mainTextColor: string = '#000000';
  mainTextAlign: string = 'center';
  btnAlign: string = 'center';
  mainTextBg: string = '#ffffff';
  mainTextPdLeft: string = '0px';
  mainTextPdRight: string = '0';
  mainTextSize: string = '18px';
  mainTextWeight: string = 'normal';

  // Свойства для управления отображением
  isLogoActive: boolean = true;
  isHeaderActive: boolean = true;
  isMainImageActive: boolean = true;
  isWaveImageActive: boolean = false;
  isSecondHeaderActive: boolean = true;
  isBodyActive: boolean = true;
  isButtonActive: boolean = true;
  isFooterActive: boolean = true;
  isSocialLinksActive: boolean = true;

  logoDisplay: string = 'table-row';
  headerDisplay: string = 'table-row';
  mainImageDisplay: string = 'table-row';
  waveImageDisplay: string = 'none';
  secondHeaderDisplay: string = 'block';
  bodyDisplay: string = 'block';
  buttonDisplay: string = 'block';
  footerDisplay: string = 'table-row';
  socialLinksDisplay: string = 'table-row';
  imgCenterLogo: string = 'auto';

  constructor(private sanitizer: DomSanitizer, data?: { content?: Partial<TemplateContent>, styles?: Partial<TemplateStyles>, displayFlags?: Partial<DisplayFlags> }) {
    if (data) {
      this.setTemplateData(data);
    }
    this.updateDisplays();
  }

  private updateDisplays(): void {
    this.logoDisplay = this.isLogoActive ? 'table-row' : 'none';
    this.headerDisplay = this.isHeaderActive ? 'table-row' : 'none';
    this.mainImageDisplay = this.isMainImageActive ? 'table-row' : 'none';
    this.waveImageDisplay = this.isWaveImageActive ? 'table-row' : 'none';
    this.secondHeaderDisplay = this.isSecondHeaderActive ? 'block' : 'none';
    this.bodyDisplay = this.isBodyActive ? 'block' : 'none';
    this.buttonDisplay = this.isButtonActive ? 'block' : 'none';
    this.footerDisplay = this.isFooterActive ? 'table-row' : 'none';
    this.socialLinksDisplay = this.isSocialLinksActive ? 'table-row' : 'none';
  }
  clone(): MainEmail {
    const data = this.getTemplateData();
    return new MainEmail(this.sanitizer, data);
  }
  // Обработчики изменения состояния
  onLogoActiveChange(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    this.isLogoActive = checkbox.checked;
    this.updateDisplays();
  }

  onHeaderActiveChange(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    this.isHeaderActive = checkbox.checked;
    this.updateDisplays();
  }

  onMainImageActiveChange(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    this.isMainImageActive = checkbox.checked;
    this.updateDisplays();
  }

  onWaveImageActiveChange(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    this.isWaveImageActive = checkbox.checked;
    this.updateDisplays();
  }

  onSecondHeaderActiveChange(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    this.isSecondHeaderActive = checkbox.checked;
    this.updateDisplays();
  }

  onBodyActiveChange(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    this.isBodyActive = checkbox.checked;
    this.updateDisplays();
  }

  onButtonActiveChange(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    this.isButtonActive = checkbox.checked;
    this.updateDisplays();
  }

  onFooterActiveChange(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    this.isFooterActive = checkbox.checked;
    this.updateDisplays();
  }

  onSocialLinksActiveChange(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    this.isSocialLinksActive = checkbox.checked;
    this.updateDisplays();
  }

  getTemplateData(): { content: TemplateContent, styles: TemplateStyles, displayFlags: DisplayFlags } {
    return {
      content: {
        templateHeader: this.templateHeader,
        templateBody: this.templateBody,
        templateSecondHeader: this.templateSecondHeader,
        templateButtonText: this.templateButtonText,
        templateButtonLink: this.templateButtonLink,
        templateLogo: this.templateLogo,
        templateMainImage: this.templateMainImage,
        templateWaveImage: this.templateWaveImage,
        templateFooterText: this.templateFooterText,
        templateSocialLinks: this.templateSocialLinks,
      },
      styles: {
        bodyStyle: this.bodyStyle,
        wrapperBg: this.wrapperBg,
        logoWrappWidth: this.logoWrappWidth,
        logoBg: this.logoBg,
        logoRadius: this.logoRadius,
        logoFloat: this.logoFloat,
        logoMarginT: this.logoMarginT,
        logoMarginB: this.logoMarginB,
        logoWidth: this.logoWidth,
        headerTitleBg: this.headerTitleBg,
        headercolorText: this.headercolorText,
        headerTitleFontSize: this.headerTitleFontSize,
        headerTitleStyle: this.headerTitleStyle,
        headerTitleWeight: this.headerTitleWeight,
        headerTitleMarginTop: this.headerTitleMarginTop,
        headerTitleMarginBottom: this.headerTitleMarginBottom,
        headerTitleAlign: this.headerTitleAlign,
        headerRadius: this.headerRadius,
        headerWidth: this.headerWidth,
        headerMarginT: this.headerMarginT,
        headerMarginB: this.headerMarginB,
        headerDecoration: this.headerDecoration,
        buttonColor: this.buttonColor,
        buttonTextColor: this.buttonTextColor,
        buttonBorderRadius: this.buttonBorderRadius,
        buttonWidth: this.buttonWidth,
        buttonTextSize: this.buttonTextSize,
        buttonRadius: this.buttonRadius,
        buttonfontWeight: this.buttonfontWeight,
        buttonPaddingX: this.buttonPaddingX,
        buttonPaddingY: this.buttonPaddingY,
        buttonMarginY: this.buttonMarginY,
        buttonWrapperBg: this.buttonWrapperBg,
        buttonWrappPaddingY: this.buttonWrappPaddingY,
        buttonBoxShadow: this.buttonBoxShadow,
        buttonDropShadow: this.buttonDropShadow,
        imgW: this.imgW,
        imgBg: this.imgBg,
        imgWrapRadius: this.imgWrapRadius,
        imgWidth: this.imgWidth,
        imgRadius: this.imgRadius,
        imgFloat: this.imgFloat,
        imgCenter: this.imgCenter,
        imgMrTop: this.imgMrTop,
        imgMrBottom: this.imgMrBottom,
        waveImageWidth: this.waveImageWidth,
        h2TitleAlign: this.h2TitleAlign,
        h2TitleColor: this.h2TitleColor,
        h2TitleStyle: this.h2TitleStyle,
        h2TitleSize: this.h2TitleSize,
        h2TitleWeight: this.h2TitleWeight,
        h2TitleMarginTop: this.h2TitleMarginTop,
        h2TitleMarginBottom: this.h2TitleMarginBottom,
        h2TextDecoration: this.h2TextDecoration,
        h2Bg: this.h2Bg,
        h2Radius: this.h2Radius,
        textColor: this.textColor,
        textAlign: this.textAlign,
        textBg: this.textBg,
        textPdLeft: this.textPdLeft,
        textPdRight: this.textPdRight,
        textRadius: this.textRadius,
        textDescrAlign: this.textDescrAlign,
        textDescrColor: this.textDescrColor,
        textDescrFont: this.textDescrFont,
        textDescrWeight: this.textDescrWeight,
        textDescrStyle: this.textDescrStyle,
        textDescr: this.textDescr,
        textWrapperBg: this.textWrapperBg,
        textWrapperRadius: this.textWrapperRadius,
        textPadX: this.textPadX,
        textPadY: this.textPadY,
        footerBg: this.footerBg,
        footerTextColor: this.footerTextColor,
        footerTextFontSize: this.footerTextFontSize,
        footerTextPaddingLeft: this.footerTextPaddingLeft,
        footerTextPaddingRight: this.footerTextPaddingRight,
        footerTextPaddingX: this.footerTextPaddingX,
        footerTextPaddingY: this.footerTextPaddingY,
        socialIconWidth: this.socialIconWidth,
        mainTextColor: this.mainTextColor,
        mainTextAlign: this.mainTextAlign,
        btnAlign: this.btnAlign,
        mainTextBg: this.mainTextBg,
        mainTextPdLeft: this.mainTextPdLeft,
        mainTextPdRight: this.mainTextPdRight,
        mainTextSize: this.mainTextSize,
        mainTextWeight: this.mainTextWeight,
      },
      displayFlags: {
        isLogoActive: this.isLogoActive,
        isHeaderActive: this.isHeaderActive,
        isMainImageActive: this.isMainImageActive,
        isWaveImageActive: this.isWaveImageActive,
        isSecondHeaderActive: this.isSecondHeaderActive,
        isBodyActive: this.isBodyActive,
        isButtonActive: this.isButtonActive,
        isFooterActive: this.isFooterActive,
        isSocialLinksActive: this.isSocialLinksActive,
      },
    };
  }

  setTemplateData(data: { content?: Partial<TemplateContent>, styles?: Partial<TemplateStyles>, displayFlags?: Partial<DisplayFlags> }): void {
    // console.log('Установка данных шаблона:', data); // Лог для отладки
    if (data.content) {
      Object.assign(this, data.content);
    }
    if (data.styles) {
      Object.assign(this, data.styles);
    }
    if (data.displayFlags) {
      Object.assign(this, data.displayFlags);
    }
    this.updateDisplays();
    // console.log('Шаблон после установки:', {
    //   templateHeader: this.templateHeader,
    //   templateBody: this.templateBody,
    //   templateSecondHeader: this.templateSecondHeader,
    //   isLogoActive: this.isLogoActive,
    // }); // Лог для проверки
  }

  get htmlTemplate(): string {
    return `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html dir="ltr" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="ru">
<head>
<meta charset="UTF-8" />
<meta content="width=device-width, initial-scale=1" name="viewport" />
<meta name="x-apple-disable-message-reformatting" />
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<meta content="telephone=no" name="format-detection" />
<link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,500;1,600;1,700;1,800&display=swap" rel="stylesheet" />
<style type="text/css">
  .rollover:hover .rollover-first { max-height: 0px !important; display: none !important; }
  .rollover:hover .rollover-second { max-height: none !important; display: block !important; }
  .rollover span { font-size: 0px; }
  u + .body img ~ div div { display: none; }
  #outlook a { padding: 0; }
  span.MsoHyperlink, span.MsoHyperlinkFollowed { color: inherit; mso-style-priority: 99; }
  a.es-button { mso-style-priority: 100 !important; text-decoration: none !important; }
  a[x-apple-data-detectors], #MessageViewBody a { color: inherit !important; text-decoration: none !important; font-size: inherit !important; font-family: inherit !important; font-weight: inherit !important; line-height: inherit !important; }
  .es-desk-hidden { display: none; float: left; overflow: hidden; width: 0; max-height: 0; line-height: 0; mso-hide: all; }
  .body-style { background: ${this.bodyStyle}; font-family: "Montserrat", sans-serif; }
  .es-wrapper-color { background: ${this.wrapperBg}; border-radius: ${this.textWrapperRadius}; overflow: hidden; max-width: 600px; margin: 0 auto; }
  .btn-wrapper { width: 100%; background: ${this.buttonWrapperBg}; padding-top: ${this.buttonWrappPaddingY}; padding-bottom: ${this.buttonWrappPaddingY}; }
  .btn-wrapper a { border: none; background: ${this.buttonColor}; padding: ${this.buttonPaddingY} ${this.buttonPaddingX}; display: block; width: ${this.buttonWidth}; border-radius: ${this.buttonBorderRadius}; color: ${this.buttonTextColor}; margin-left: auto; margin-right: auto; margin-top: ${this.buttonMarginY}; margin-bottom: ${this.buttonMarginY}; text-align: center; font-size: ${this.buttonTextSize}; font-weight: ${this.buttonfontWeight}; text-decoration: none; ${this.buttonBoxShadow ? `box-shadow: ${this.buttonBoxShadow};` : ''} ${this.buttonDropShadow ? `filter: ${this.buttonDropShadow};` : ''} }
  .logo-wrapper { width: ${this.logoWrappWidth}; background: ${this.logoBg}; height: 100%; border-radius: ${this.logoRadius}; }
  .logo-img { float: ${this.logoFloat}; margin-top: ${this.logoMarginT}; margin-bottom: ${this.logoMarginB}; width: ${this.logoWidth}; height: auto; margin-left: auto; margin-right: auto; }
  .header-title { background: ${this.headerTitleBg}; color: ${this.headercolorText}; border-radius: ${this.headerRadius}; font-weight: ${this.headerTitleWeight}; font-style: ${this.headerTitleStyle}; width: ${this.headerWidth}; text-align: ${this.headerTitleAlign}; text-decoration: ${this.headerDecoration}; }
  .header-title h1 { margin-top: ${this.headerMarginT}; margin-bottom: ${this.headerMarginB}; font-size: ${this.headerTitleFontSize}; }
  .letter-img-wrapper { width: ${this.imgW}; background: ${this.imgBg}; }
  .letter-img { width: ${this.imgWidth} !important; height: auto; border-radius: ${this.imgWrapRadius}; float: ${this.imgFloat}; margin: 0 ${this.imgCenter}; margin-top: ${this.imgMrTop}; margin-bottom: ${this.imgMrBottom}; margin-left: auto; margin-right: auto; }
  .wave-img { width: ${this.waveImageWidth} !important; height: auto; display: block; margin-left: auto; margin-right: auto; transform: translateY(5px); }
  .color-text { color: ${this.textColor}; text-align: ${this.textAlign}; background: ${this.textBg}; padding-left: ${this.textPdLeft}; padding-right: ${this.textPdRight}; border-radius: ${this.textRadius}; }
  .h2-title { text-align: ${this.h2TitleAlign}; color: ${this.h2TitleColor}; font-size: ${this.h2TitleSize}; font-weight: ${this.h2TitleWeight}; font-style: ${this.h2TitleStyle}; text-decoration: ${this.h2TextDecoration}; background: ${this.h2Bg}; border-radius: ${this.h2Radius}; }
  .h2-title-text { padding-top: ${this.h2TitleMarginTop}; padding-bottom: ${this.h2TitleMarginBottom}; }
  .text-wrapper { text-align: ${this.textDescrAlign}; color: ${this.textDescrColor}; font-size: ${this.textDescrFont}; font-weight: ${this.textDescrWeight}; font-style: ${this.textDescrStyle}; text-decoration: ${this.textDescr}; background: ${this.textWrapperBg}; border-radius: ${this.textWrapperRadius}; padding: ${this.textPadY} ${this.textPadX}; }
  .footer { background: ${this.footerBg}; color: ${this.footerTextColor}; font-size: ${this.footerTextFontSize}; padding: ${this.footerTextPaddingY} ${this.footerTextPaddingX}; text-align: center; }
  .social-links { display: flex; justify-content: center; gap: 10px; }
  .social-link img { width: ${this.socialIconWidth}; height: auto; }
  .logo-display { display: ${this.logoDisplay}; }
  .header-display { display: ${this.headerDisplay}; }
  .main-image-display { display: ${this.mainImageDisplay}; }
  .wave-image-display { display: ${this.waveImageDisplay}; }
  .second-header-display { display: ${this.secondHeaderDisplay}; }
  .body-display { display: ${this.bodyDisplay}; }
  .button-display { display: ${this.buttonDisplay}; }
  .footer-display { display: ${this.footerDisplay}; }
  .social-links-display { display: ${this.socialLinksDisplay}; }
  .main-text { color: ${this.mainTextColor}; text-align: ${this.mainTextAlign}; background: ${this.mainTextBg}; padding-left: ${this.mainTextPdLeft}; padding-right: ${this.mainTextPdRight}; font-size: ${this.mainTextSize}; font-weight: ${this.mainTextWeight}; }
  @media only screen and (max-width: 600px) {
    .es-content table, .es-header table, .es-footer table, .es-content, .es-footer, .es-header { width: 100% !important; max-width: 600px !important; }
    .esd-block-image img { width: 100% !important; max-width: 350px; height: auto !important; }
    .header-title h1 { font-size: 20px; text-align: center; }
    .h2-title { font-size: 18px; }
    .text-wrapper p { font-size: 14px; }
    .btn-wrapper a { font-size: 18px !important; padding: 10px 20px !important; }
    .footer { font-size: 12px; }
  }
</style>
</head>
<body class="body body-style">
<div dir="ltr" class="es-wrapper-color">
  <table width="100%" cellspacing="0" cellpadding="0" class="es-wrapper">
    <tbody>
      <tr>
        <td valign="top" class="esd-email-paddings es-m-margin">
          <table cellspacing="0" cellpadding="0" align="center" class="esd-header-popover es-header">
            <tbody>
              <tr class="logo-display">
                <td align="center" class="esd-stripe">
                  <table width="600" cellspacing="0" cellpadding="0" align="center" class="es-header-body" style="background-color: transparent">
                    <tbody>
                      <tr>
                        <td align="left" class="esd-structure">
                          <table cellpadding="0" cellspacing="0" width="100%">
                            <tbody>
                              <tr>
                                <td width="600" align="center" valign="top" class="esd-container-frame">
                                  <table cellpadding="0" cellspacing="0" width="100%">
                                    <tbody>
                                      <tr>
                                        <td align="center" height="40" class="esd-block-spacer logo-wrapper">
                                          <img class="logo-img" src="${this.templateLogo}" alt="Logo" />
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
              <tr class="header-display">
                <td align="left" bgcolor="#ffffff" class="esd-structure es-p20" style="background-color: #ffffff">
                  <table cellpadding="0" cellspacing="0" width="100%">
                    <tbody>
                      <tr>
                        <td width="560" align="center" valign="top" class="esd-container-frame">
                          <table cellpadding="0" cellspacing="0" width="100%">
                            <tbody>
                              <tr>
                                <td align="center" class="esd-block-text header-title">
                                  <h1>${this.templateHeader}</h1>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
          <table cellspacing="0" cellpadding="0" align="center" class="es-content">
            <tbody>
              <tr>
                <td align="center" class="esd-stripe">
                  <table width="600" cellspacing="0" cellpadding="0" align="center" class="es-content-body" style="background-color: transparent">
                    <tbody>
                      <tr class="main-image-display">
                        <td align="left" class="esd-structure">
                          <table cellpadding="0" cellspacing="0" width="100%">
                            <tbody>
                              <tr>
                                <td width="600" align="center" valign="top" class="esd-container-frame">
                                  <table cellpadding="0" cellspacing="0" width="100%">
                                    <tbody>
                                      <tr>
                                        <td class="letter-img-wrapper">
                                          <img class="letter-img" src="${this.templateMainImage}" alt="Main Image" style="display: block" />
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                      <tr class="wave-image-display">
                        <td align="center" class="esd-structure">
                          <table cellpadding="0" cellspacing="0" width="100%">
                            <tbody>
                              <tr>
                                <td width="600" align="center" class="esd-container-frame">
                                  <img class="wave-img" src="${this.templateWaveImage}" alt="Wave Image" />
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td align="left" class="esd-structure es-p25t es-p10b es-p25r es-p25l" style="background-color: #ffffff;">
                          <table width="100%" cellspacing="0" cellpadding="0">
                            <tbody>
                              <tr>
                                <td width="550" align="center" valign="top" class="esd-container-frame">
                                  <table width="100%" cellspacing="0" cellpadding="0">
                                    <tbody>

                                      <tr style="display: ${this.secondHeaderDisplay};">
                                        <td align="${this.h2TitleAlign}" class="esd-block-text h2-title" style="padding: 10px 20px; display: inline-block; width: 100%;">
                                          <h2 style="margin: ${this.h2TitleMarginTop} 0 ${this.h2TitleMarginBottom} 0; 
                                                    font-size: ${this.h2TitleSize}; 
                                                    font-weight: ${this.h2TitleWeight}; 
                                                    color: ${this.h2TitleColor}; 
                                                    text-decoration: ${this.h2TextDecoration};
                                                    line-height: 1.2;">
                                            ${this.templateSecondHeader}
                                          </h2>
                                        </td>
                                      </tr>

                                      <tr style="display: ${this.bodyDisplay};">
                                        <td align="${this.mainTextAlign}" 
                                            style="padding: 20px; 
                                                  color: ${this.mainTextColor}; 
                                                  font-size: ${this.mainTextSize}; 
                                                  line-height: 1.8; 
                                                  font-weight: ${this.mainTextWeight};">
                                          ${this.templateBody
                                              .replace(/\r\n/g, '\n')     // Windows → Unix
                                              .replace(/\n\n+/g, '<br><br>')  // несколько пустых строк → двойной br
                                              .replace(/\n/g, '<br>')
                                            }
                                        </td>
                                      </tr>

                                      <tr style="display: ${this.buttonDisplay}; width: 100%;">
                                        <td align="center" style="padding: 20px; display: block;">
                                          <a href="${this.templateButtonLink}" 
                                            target="_blank"
                                            style="background: ${this.buttonColor};
                                                    color: ${this.buttonTextColor};
                                                    padding: ${this.buttonPaddingY} ${this.buttonPaddingX};
                                                    font-size: ${this.buttonTextSize};
                                                    font-weight: ${this.buttonfontWeight};
                                                    text-decoration: none;
                                                    border-radius: ${this.buttonBorderRadius};
                                                    display: inline-block;
                                                    width: ${this.buttonWidth};
                                                    float: ${this.btnAlign};
                                                    margin-bottom: 10px;
                                                    "
                                                    >
                                            ${this.templateButtonText}
                                          </a>
                                        </td>
                                      </tr>

                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                      <tr class="footer-display">
                        <td align="center" class="esd-structure footer">
                          <table width="100%" cellspacing="0" cellpadding="0">
                            <tbody>
                              <tr>
                                <td width="600" align="center" class="esd-container-frame">
                                  <p>${this.templateFooterText}</p>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </tbody>
  </table>
</div>
</body>
</html>
    `;
  }

  get safeHtmlTemplate(): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(this.htmlTemplate);
  }

  resetTemplate(): void {
    this.templateHeader = 'Enter your header text here';
    this.templateBody = 'Enter your body text here.';
    this.templateSecondHeader = 'Enter your second header text here';
    this.templateButtonText = 'Click Me';
    this.templateButtonLink = 'https://www.example.com';
    this.templateLogo = 'https://i.ibb.co/NdFQjKMs/x-logo-bg.png';
    this.templateMainImage = 'https://i.ibb.co/hFvg6bYJ/ball-letter.png';
    this.templateWaveImage = 'https://i.ibb.co/yBFYmQPs/wave.png';
    this.templateFooterText = 'If you do not wish to receive emails from us, please write to this address 1111@gmail.com.';
    this.templateSocialLinks = [
      {
        href: 'https://www.facebook.com/example',
        src: 'https://i.ibb.co/NdFQjKMs/x-logo-bg.png',
        alt: 'Facebook',
        title: 'Facebook',
      },
    ];
    this.isLogoActive = true;
    this.isHeaderActive = true;
    this.isMainImageActive = true;
    this.isWaveImageActive = false;
    this.isSecondHeaderActive = true;
    this.isBodyActive = true;
    this.isButtonActive = true;
    this.isFooterActive = true;
    this.isSocialLinksActive = true;
    this.updateDisplays();
  }
}