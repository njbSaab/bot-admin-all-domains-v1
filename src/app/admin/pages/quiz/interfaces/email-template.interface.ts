// src/app/admin/pages/quiz/interfaces/email-template.interface.ts

export interface EmailTemplateData {
  id?: number;
  clientId?: number;
  type: 'code' | 'result';
  subject: string;
  html: string;
}

export interface EmailTemplateVariables {
  name: string;
  score: number;
  code?: string;
  quizName?: string;
  grandPrize?: string;
  prizeForEveryOne?: string;
  year: number;
  [key: string]: any;
}

export interface EmailTemplateConfig {
  // Основные цвета
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  
  // Текст
  textColor: string;
  textSecondaryColor: string;
  
  // Фон
  bgColor: string;
  cardBgColor: string;
  
  // Кнопка
  btnBgStart: string;
  btnBgEnd: string;
  btnTextColor: string;
  
  // Header
  headerBgStart: string;
  headerBgEnd: string;
  
  // Контент
  logoUrl: string;
  greeting: string;
  titleText: string;
  highlightText: string;
  prizeText: string;
  descriptionText: string;
  callToAction: string;
  btnText: string;
  btnLink: string;
  footerText: string;
}

// Дефолтная конфигурация
export const DEFAULT_EMAIL_CONFIG: EmailTemplateConfig = {
  primaryColor: '#667eea',
  secondaryColor: '#764ba2',
  accentColor: '#00cfbd',
  
  textColor: '#2c3e50',
  textSecondaryColor: '#95a5a6',
  
  bgColor: '#ffffff',
  cardBgColor: '#f8f9fa',
  
  btnBgStart: '#00cfbd',
  btnBgEnd: '#00b3f0',
  btnTextColor: '#ffffff',
  
  headerBgStart: '#667eea',
  headerBgEnd: '#764ba2',
  
  logoUrl: 'https://i.ibb.co/QF0sMsFF/6.png',
  greeting: 'Xin chào',
  titleText: 'Chúc mừng bạn đã hoàn thành quiz!',
  highlightText: 'Bạn đã đạt được {{score}} điểm',
  prizeText: '',
  descriptionText: 'Cảm ơn bạn đã tham gia. Hãy tiếp tục khám phá thêm nhiều quiz thú vị!',
  callToAction: 'Nhận phần thưởng của bạn ngay!',
  btnText: 'Nhận phần thưởng',
  btnLink: 'https://votevibe.club',
  footerText: 'Cảm ơn bạn đã tham gia!'
};