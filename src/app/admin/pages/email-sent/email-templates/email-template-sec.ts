import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
export class EmailTemplateSec {
  // Контент шаблона
  templateHeader: string = 'Enter your header text here';
  templateBody: string = `Enter your body text here. Enter your body text here. Enter your body text here. 
  Enter your body text here. Enter your body text here. Enter your body text here. 
  Enter your body text here.`;
  templateSecondHeader: string = 'Enter your second header text here';
  templateButtonText: string = 'Click Me';
  templateButtonLink: string = 'https://www.example.com';
  templateLogo: string = 'https://i.ibb.co/NdFQjKMs/x-logo-bg.png';
  templateMainImage: string = 'https://i.ibb.co/hFvg6bYJ/ball-letter.png';
  templateWaveImage: string = 'https://i.ibb.co/yBFYmQPs/wave.png';
  templateFooterText: string = 'If you do not wish to receive emails from us, please write to this address 1111@gmail.com.';

  // Стили шаблона
  bodyStyle: string = '#eaeef3';
  wrapperBg: string = 'linear-gradient(180deg, #14a0ff 34.77%, #fff 50.69%)';
  logoWrappWidth: string = '100%';
  logoBg: string = '#14a0ff';
  logoRadius: string = '0';
  logoFloat: string = 'center';
  logoMarginT: string = '20px';
  logoMarginB: string = '0';
  logoWidth: string = '150px';
  headerTitleBg: string = '#14a0ff';
  headercolorText: string = '#ffffff';
  headerTitleFontSize: string = '28px';
  headerTitleStyle: string = 'normal';
  headerTitleWeight: string = 'bold';
  headerTitleMarginTop: string = '0';
  headerTitleMarginBottom: string = '0';
  headerTitleAlign: string = 'center';
  headerRadius: string = '0';
  headerWidth: string = '100%';
  headerMarginT: string = '35px';
  headerMarginB: string = '35px';
  headerDecoration: string = 'none';
  buttonColor: string = '#ffffff';
  buttonTextColor: string = '#14a0ff';
  buttonBorderRadius: string = '31px';
  buttonWidth: string = '80%';
  buttonTextSize: string = '18px';
  buttonRadius: string = '31px';
  buttonfontWeight: string = 'bold';
  buttonPaddingX: string = '20px';
  buttonPaddingY: string = '16px';
  buttonMarginY: string = '0px';
  buttonBoxShadow: string = '0px -5px 8.3px 0px rgba(0, 0, 0, 0.25) inset';
  buttonDropShadow: string = 'drop-shadow(0px 4px 16.1px rgba(0, 0, 0, 0.25))';
  buttonWrapperBg: string = '#14a0ff';
  buttonWrappPaddingY: string = '20px';
  imgW: string = '100%';
  imgBg: string = 'transparent';
  imgWrapRadius: string = '0';
  imgWidth: string = '300px';
  imgRadius: string = '0';
  imgFloat: string = 'center';
  imgCenter: string = 'auto';
  imgMrTop: string = '0';
  imgMrBottom: string = '0';
  waveImageWidth: string = '100%';
  h2TitleAlign: string = 'center';
  h2TitleColor: string = '#002a5d';
  h2TitleStyle: string = 'normal';
  h2TitleSize: string = '25px';
  h2TitleWeight: string = '500';
  h2TitleMarginTop: string = '10px';
  h2TitleMarginBottom: string = '10px';
  h2TextDecoration: string = 'none';
  h2Bg: string = 'transparent';
  h2Radius: string = '0';
  textColor: string = '#ffffff';
  textAlign: string = 'center';
  textBg: string = 'transparent';
  textPdLeft: string = '0px';
  textPdRight: string = '0px';
  textRadius: string = '0';
  textDescrAlign: string = 'center';
  textDescrColor: string = '#ffffff';
  textDescrFont: string = '16px';
  textDescrWeight: string = 'normal';
  textDescrStyle: string = 'normal';
  textDescr: string = 'none';
  textWrapperBg: string = '#14a0ff';
  textWrapperRadius: string = '0px';
  textPadX: string = '10px';
  textPadY: string = '10px';
  footerBg: string = '#14a0ff';
  footerTextColor: string = '#ffffff';
  footerTextFontSize: string = '12px';
  footerTextPaddingX: string = '10px';
  footerTextPaddingY: string = '10px';
  socialIconWidth: string = '32px';

  // Свойства для управления отображением
  isLogoActive: boolean = true;
  isHeaderActive: boolean = true;
  isMainImageActive: boolean = true;
  isWaveImageActive: boolean = true;
  isSecondHeaderActive: boolean = true;
  isBodyActive: boolean = true;
  isButtonActive: boolean = true;
  isFooterActive: boolean = true;
  isSocialLinksActive: boolean = true;

  logoDisplay: string = 'table-row';
  headerDisplay: string = 'table-row';
  mainImageDisplay: string = 'table-row';
  waveImageDisplay: string = 'table-row';
  secondHeaderDisplay: string = 'block';
  bodyDisplay: string = 'block';
  buttonDisplay: string = 'block';
  footerDisplay: string = 'table-row';
  socialLinksDisplay: string = 'table-row';
  imgCenterLogo: string = 'auto';

  constructor(private sanitizer: DomSanitizer) {
    this.updateDisplays();
  }

  // Обновление всех значений display
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

  // Обработчики изменения состояния для каждого блока
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
  .btn-wrapper{ width: 100%; background: ${this.buttonWrapperBg}; padding-top: ${this.buttonWrappPaddingY}; padding-bottom: ${this.buttonWrappPaddingY}; }
  .btn-wrapper a { border: none; background: ${this.buttonColor}; padding: ${this.buttonPaddingY} ${this.buttonPaddingX}; display: block; width: ${this.buttonWidth}; border-radius: ${this.buttonBorderRadius}; color: ${this.buttonTextColor}; margin-left: auto; margin-right: auto; margin-top: ${this.buttonMarginY}; margin-bottom: ${this.buttonMarginY}; text-align: center; font-size: ${this.buttonTextSize}; font-weight: ${this.buttonfontWeight}; text-decoration: none; box-shadow: ${this.buttonBoxShadow}; filter: ${this.buttonDropShadow}; }
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
  @media only screen and (max-width: 600px) {
    .es-content table, .es-header table, .es-footer table, .es-content, .es-footer, .es-header { width: 100% !important; max-width: 600px !important; }
    .esd-block-image img { width: 100% !important; max-width: 350px; height: auto !important; }
    .header-title h1 { font-size: 24px; text-align: center; }
    .h2-title { font-size: 20px; padding-left: 10px; font-weight: 500; padding-right: 10px; }
    .text-wrapper p { font-size: 14px; }
    .btn-wrapper a { font-size: 16px !important; padding: 10px 20px !important; }
    .footer { font-size: 10px; }
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
                                        <div class="wave-image-display">
                                          <div width="600" align="center" class="esd-container-frame">
                                            <img class="wave-img" src="${this.templateWaveImage}" alt="Wave Image" />
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
</html
    `;
  }

  get safeHtmlTemplate(): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(this.htmlTemplate);
  }

  resetTemplate(): void {
    this.templateHeader = 'Enter your header text here';
    this.templateBody = `Enter your body text here. Enter your body text here. Enter your body text here. 
    Enter your body text here. Enter your body text here. Enter your body text here. 
    Enter your body text here.`;
    this.templateSecondHeader = 'Enter your second header text here';
    this.templateButtonText = 'Click Me';
    this.templateButtonLink = 'https://www.example.com';
    this.templateLogo = 'https://i.ibb.co/NdFQjKMs/x-logo-bg.png';
    this.templateMainImage = 'https://i.ibb.co/hFvg6bYJ/ball-letter.png';
    this.templateWaveImage = 'https://i.ibb.co/yBFYmQPs/wave.png';
    this.templateFooterText = 'If you do not wish to receive emails from us, please write to this address 1111@gmail.com.';
    this.isLogoActive = true;
    this.isHeaderActive = true;
    this.isMainImageActive = true;
    this.isWaveImageActive = true;
    this.isSecondHeaderActive = true;
    this.isBodyActive = true;
    this.isButtonActive = true;
    this.isFooterActive = true;
    this.isSocialLinksActive = true;
    this.updateDisplays();
  }
}