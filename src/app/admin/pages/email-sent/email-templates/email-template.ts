import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MainEmail } from './main-email';


export class EmailTemplate {
  // Контент шаблона
  templateHeader: string = 'Enter your header text here';
  templateBody: string = `Etner your body text here. 
  You can add multiple lines and they will be displayed correctly in the email.

  You can also add links and images html tags.
    <a href="https://www.1xbet.com/" style="color:deepskyblue; text-decoration: underline;" target="_blank">Click Here</a>
    <img style="display: block; margin: 10px auto; border-radius: 22px;" src="https://agbrief.com/wp-content/uploads/2023/11/1xBet-Sports-partners.webp" alt="Image" />`;
  templateSecondHeader: string = 'Enter your second header text here';
  templateButtonText: string = 'Click Me';
  templateButtonLink: string = 'https://www.1xbet.com/';
  templateImage1: string = 'https://images.mlssoccer.com/image/private/t_q-best/mls-rsl/ajicz3w4j4hbjyj5cgdk.jpg';
  templateImage2: string = 'https://i.ibb.co/My9h6JB9/1xbet-logo.png';

  // Стили шаблона (без изменений)
  bodyStyle: string = '#ffffff';
  logoWrappWidth: string = '100%';
  logoBg: string = '#4f45e5';
  logoRadius: string = '30px';
  logoFloat: string = 'center';
  logoMarginT: string = '15px';
  logoMarginB: string = '15px';
  logoWidth: string = '150px';
  headerTitleBg: string = '#ffffff';
  headercolorText: string = 'black';
  headerTitleFontSize: string = '25px';
  headerTitleStyle: string = 'normal';
  headerTitleWeight: string = 'bold';
  headerTitleMarginTop: string = '0';
  headerTitleMarginBottom: string = '0';
  headerTitleAlign: string = 'center';
  headerRadius: string = '10px';
  headerWidth: string = '100%';
  headerMarginT: string = '10px';
  headerMarginB: string = '10px';
  headerDecoration: string = 'auto';
  buttonColor: string = '#4f45e5';
  buttonTextColor: string = 'whitesmoke';
  buttonBorderRadius: string = '30px';
  buttonWidth: string = '80%';
  buttonTextSize: string = '22px';
  buttonRadius: string = '10px';
  buttonfontWeight: string = 'bold';
  buttonPaddingX: string = '8px';
  buttonPaddingY: string = '16px';
  buttonMarginY: string = '20px';
  imgW: string = '100%';
  imgBg: string = '#ffffff';
  imgWrapRadius: string = '20px';
  imgWidth: string = '100%';
  imgRadius: string = '20px';
  imgFloat: string = 'left';
  imgCenter: string = 'auto';
  imgMrTop: string = '0px';
  imgMrBottom: string = '0px';
  h2TitleAlign: string = 'center';
  h2TitleColor: string = '#002a5d';
  h2TitleStyle: string = 'normal';
  h2TitleSize: string = '22px';
  h2TitleWeight: string = 'bold';
  h2TitleMarginTop: string = '10px';
  h2TitleMarginBottom: string = '10px';
  h2TextDecoration: string = 'underline';
  h2Bg: string = '#ffffff';
  h2Radius: string = '0';
  textColor: string = '#002245';
  textAlign: string = 'left';
  textBg: string = '#ffffff';
  textPdLeft: string = '0';
  textPdRight: string = '0';
  textRadius: string = '20px';
  textDescrAlign: string = 'left';
  textDescrColor: string = 'white';
  textDescrFont: string = '16px';
  textDescrWeight: string = 'normal';
  textDescrStyle: string = 'italic';
  textDescr: string = 'auto';
  textWrapperBg: string = '#4f45e5';
  textWrapperRadius: string = '20px';
  textPadX: string = '20px';
  textPadY: string = '20px';

  // Свойства для управления отображением
  isLogoActive: boolean = true;
  isHeaderActive: boolean = true;
  isImage1Active: boolean = true;
  isSecondHeaderActive: boolean = true;
  isBodyActive: boolean = true;
  isButtonActive: boolean = true;

  logoDisplay: string = 'table-row';
  headerDisplay: string = 'table-row';
  image1Display: string = 'table-row';
  secondHeaderDisplay: string = 'block';
  bodyDisplay: string = 'block';
  buttonDisplay: string = 'block';
  imgCenterLogo: string = 'auto';

  constructor(private sanitizer: DomSanitizer) {
    this.updateDisplays();
  }

  // Обновление всех значений display
  private updateDisplays(): void {
    this.logoDisplay = this.isLogoActive ? 'table-row' : 'none';
    this.headerDisplay = this.isHeaderActive ? 'table-row' : 'none';
    this.image1Display = this.isImage1Active ? 'table-row' : 'none';
    this.secondHeaderDisplay = this.isSecondHeaderActive ? 'block' : 'none';
    this.bodyDisplay = this.isBodyActive ? 'block' : 'none';
    this.buttonDisplay = this.isButtonActive ? 'block' : 'none';
  }

  // Обработчики изменения состояния для каждого блока
  onLogoActiveChange(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    this.isLogoActive = checkbox.checked;
    this.updateDisplays();
  }

  // В main-email.ts
  clone(): MainEmail {
    const data = this.getTemplateData();
    return new MainEmail(this.sanitizer, data);
  }

  selectTemplate(template: MainEmail, id: number): void {
    this.selectedTemplate = template.clone(); // Клонируем шаблон
    this.selectedTemplateId = id;
  }
  
  onHeaderActiveChange(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    this.isHeaderActive = checkbox.checked;
    this.updateDisplays();
  }

  onImage1ActiveChange(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    this.isImage1Active = checkbox.checked;
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
<style type="text/css">
  .body-style { background: ${this.bodyStyle}; }
  .btn-wrapper a { border: none; background: ${this.buttonColor}; padding: ${this.buttonPaddingY} ${this.buttonPaddingX}; display: block; width: ${this.buttonWidth}; border-radius: ${this.buttonBorderRadius}; color: ${this.buttonTextColor}; margin-left: auto; margin-right: auto; margin-top: ${this.buttonMarginY}; margin-bottom: ${this.buttonMarginY}; text-align: center; font-size: ${this.buttonTextSize}; font-weight: ${this.buttonfontWeight}; text-decoration: none; }
  .logo-wrapper { width: ${this.logoWrappWidth}; background: ${this.logoBg}; height: 100%; border-radius: ${this.logoRadius}; }
  .logo-img { float: ${this.logoFloat}; margin-top: ${this.logoMarginT}; margin-bottom: ${this.logoMarginB}; width: ${this.logoWidth}; height: auto; margin-left: auto; margin-right: auto; }
  .header-title { background: ${this.headerTitleBg}; color: ${this.headercolorText}; border-radius: ${this.headerRadius}; font-weight: ${this.headerTitleWeight}; font-style: ${this.headerTitleStyle}; width: ${this.headerWidth}; text-align: ${this.headerTitleAlign}; text-decoration: ${this.headerDecoration}; }
  .header-title h1 { margin-top: ${this.headerMarginT}; margin-bottom: ${this.headerMarginB}; font-size: ${this.headerTitleFontSize}; }
  .letter-img-wrapper { width: ${this.imgW}; background: ${this.imgBg}; }
  .letter-img { width: ${this.imgWidth} !important; height: auto; border-radius: ${this.imgWrapRadius}; float: ${this.imgFloat}; margin: 0 ${this.imgCenter}; margin-top: ${this.imgMrTop}; margin-bottom: ${this.imgMrBottom}; margin-left: auto; margin-right: auto; }
  .color-text { color: ${this.textColor}; text-align: ${this.textAlign}; background: ${this.textBg}; padding-left: ${this.textPdLeft}; padding-right: ${this.textPdRight}; border-radius: ${this.textRadius}; }
  .h2-title { text-align: ${this.h2TitleAlign}; color: ${this.h2TitleColor}; font-size: ${this.h2TitleSize}; font-weight: ${this.h2TitleWeight}; font-style: ${this.h2TitleStyle}; text-decoration: ${this.h2TextDecoration}; background: ${this.h2Bg}; border-radius: ${this.h2Radius}; }
  .h2-title-text { padding-top: ${this.h2TitleMarginTop}; padding-bottom: ${this.h2TitleMarginBottom}; }
  .text-wrapper { text-align: ${this.textDescrAlign}; color: ${this.textDescrColor}; font-size: ${this.textDescrFont}; font-weight: ${this.textDescrWeight}; font-style: ${this.textDescrStyle}; text-decoration: ${this.textDescr}; background: ${this.textWrapperBg}; border-radius: ${this.textWrapperRadius}; padding: ${this.textPadY} ${this.textPadX}; }
  .logo-display { display: ${this.logoDisplay}; }
  .header-display { display: ${this.headerDisplay}; }
  .image1-display { display: ${this.image1Display}; }
  .second-header-display { display: ${this.secondHeaderDisplay}; }
  .body-display { display: ${this.bodyDisplay}; }
  .button-display { display: ${this.buttonDisplay}; }
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
              <tr>
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
                                      <tr class="logo-display">
                                        <td align="center" height="40" class="esd-block-spacer logo-wrapper">
                                          <img class="logo-img" src="${this.templateImage2}" alt="Logo" />
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
          <table cellspacing="0" cellpadding="0" align="center" class="es-content">
            <tbody>
              <tr>
                <td align="center" class="esd-stripe">
                  <table width="600" cellspacing="0" cellpadding="0" align="center" class="es-content-body" style="background-color: transparent">
                    <tbody>
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
                      <tr class="image1-display">
                        <td align="left" bgcolor="#ffffff" class="esd-structure" style="background-color: #ffffff">
                          <table cellpadding="0" cellspacing="0" width="100%">
                            <tbody>
                              <tr>
                                <td width="600" align="center" valign="top" class="esd-container-frame">
                                  <table cellpadding="0" cellspacing="0" width="100%">
                                    <tbody>
                                      <tr>
                                        <td class="letter-img-wrapper">
                                          <img class="letter-img" src="${this.templateImage1}" alt="Main Image" style="display: block" />
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
                      <tr>
                        <td align="left" class="esd-structure es-p25t es-p10b es-p25r es-p25l bg-cust">
                          <table width="100%" cellspacing="0" cellpadding="0">
                            <tbody>
                              <tr>
                                <td width="550" valign="top" align="center" class="esd-container-frame">
                                  <table width="100%" cellspacing="0" cellpadding="0">
                                    <tbody>
                                      <tr>
                                        <td align="left" class="esd-block-text es-p10t px-10 color-text">
                                          <div class="second-header-display">
                                            <div class="h2-title">
                                              <h2 class="h2-title-text">${this.templateSecondHeader}</h2>
                                            </div>
                                          </div>
                                          <div class="body-display">
                                            <div class="text-wrapper">
                                              ${this.templateBody.split('\n').map(line => `<p class="main-text">${line.trim()}</p>`).join('')}
                                            </div>
                                          </div>
                                          <div class="button-display">
                                            <div class="btn-wrapper">
                                              <a href="${this.templateButtonLink}" target="_blank">${this.templateButtonText}</a>
                                            </div>
                                          </div>
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
    this.templateBody = `Etner your body text here. 
    You can add multiple lines and they will be displayed correctly in the email.
    You can also add links and images html tags.
      <a href="https://www.1xbet.com/" style="color:deepskyblue; text-decoration: underline;" target="_blank">Click Here</a>
      <img style="display: block; margin: 10px auto; border-radius: 22px;" src="https://agbrief.com/wp-content/uploads/2023/11/1xBet-Sports-partners.webp" alt="Image" />`;
      this.templateSecondHeader = 'Enter your second header text here';
     this.templateButtonText = 'Click Me';
     this.templateButtonLink = 'https://www.1xbet.com/';
     this.templateImage1 = 'https://images.mlssoccer.com/image/private/t_q-best/mls-rsl/ajicz3w4j4hbjyj5cgdk.jpg';
     this.templateImage2 = 'https://i.ibb.co/My9h6JB9/1xbet-logo.png';
  }
}