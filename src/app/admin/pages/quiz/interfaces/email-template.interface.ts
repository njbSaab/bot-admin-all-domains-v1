// src/app/admin/pages/quiz/interfaces/email-template.interface.ts

// ==================== БАЗОВЫЕ ИНТЕРФЕЙСЫ ====================

// src/app/admin/pages/quiz/interfaces/email-template.interface.ts

export interface EmailTemplateConfig {
  // Цвета
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  textColor: string;
  textSecondaryColor: string;
  bgColor: string;
  cardBgColor: string;
  headerBgStart: string;
  headerBgEnd: string;
  btnBgStart: string;
  btnBgEnd: string;
  btnTextColor: string;
  
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
  
  // NEW: Тема письма
  subject: string;

  showHighlight: boolean;
  showPrize: boolean;
  showDescription: boolean;
  showCTA: boolean;
  showButton: boolean;
}

export interface EmailTemplateVariables {
  name: string;
  score: number;
  code: string;
  quizName?: string;
  quizTitle?: string;
  grandPrize?: string;
  prizeForEveryOne?: string;
  year: number;
  correct?: number;
  total?: number;
  progress?: number;
}

export interface EmailTemplateData {
  id: number;
  client_id: number;
  quiz_id: number | null;
  app: string | null;
  type: 'code' | 'result';
  subject: string;
  html: string;
}

export const DEFAULT_EMAIL_CONFIG: EmailTemplateConfig = {
  // Цвета
  primaryColor: '#667eea',
  secondaryColor: '#764ba2',
  accentColor: '#3b82f6',
  textColor: '#2c3e50',
  textSecondaryColor: '#777777',
  bgColor: '#ffffff',
  cardBgColor: '#f8f9fa',
  headerBgStart: '#667eea',
  headerBgEnd: '#764ba2',
  btnBgStart: '#667eea',
  btnBgEnd: '#764ba2',
  btnTextColor: '#ffffff',
  
  // Контент
  logoUrl: 'https://via.placeholder.com/150x60/667eea/ffffff?text=LOGO',
  greeting: 'Xin chào',
  titleText: 'Chúc mừng bạn!',
  highlightText: 'Bạn đã đạt được {{score}}% điểm!',
  prizeText: '',
  descriptionText: 'Cảm ơn bạn đã tham gia bài kiểm tra của chúng tôi.',
  callToAction: 'Nhận phần thưởng của bạn ngay!',
  btnText: 'Nhận thưởng',
  btnLink: 'https://example.com',
  footerText: 'Cảm ơn bạn đã tham gia!',
  
  // NEW: Тема письма по умолчанию
  subject: 'Chúc mừng {{name}}! Bạn đạt {{score}}% điểm',

  showHighlight: true,
  showPrize: true,
  showDescription: true,
  showCTA: true,
  showButton: true,
};
// ==================== CHAIN TEMPLATES ====================

export type ChainType = 'PERSONAL' | 'GENERAL';

export interface ChainTemplate {
  id?: number;
  clientId?: number;
  chainType: ChainType;
  quizId: number | null;
  app: string | null;
  step: number;
  delayMinutes: number;
  subject: string;
  html: string;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ChainSettings {
  id?: number;
  clientId?: number;
  defaultDelays: number[];
  mergeWindowMinutes: number;
  minQuizzesForGeneral: number;
  enabled: boolean;
}

// Для редактора цепочки
export interface ChainEmailStep {
  step: number;
  delayMinutes: number;
  delayLabel: string;  // "24 часа", "48 часов" и т.д.
  subject: string;
  html: string;
  config: EmailTemplateConfig;
  isExpanded: boolean;
  isDirty: boolean;
}

// Дефолтные шаги цепочки
export const DEFAULT_CHAIN_STEPS: ChainEmailStep[] = [
  {
    step: 1,
    delayMinutes: 1440,  // 24 часа
    delayLabel: '24 часа',
    subject: 'Nhắc nhở: Bạn có phần thưởng đang chờ!',
    html: '',
    config: {
      ...DEFAULT_EMAIL_CONFIG,
      titleText: 'Đừng bỏ lỡ phần thưởng của bạn!',
      highlightText: 'Bạn đã hoàn thành quiz nhưng chưa nhận thưởng',
      descriptionText: 'Phần thưởng của bạn vẫn đang chờ. Hãy nhận ngay!',
      callToAction: 'Nhận phần thưởng ngay hôm nay!',
    },
    isExpanded: true,
    isDirty: false,
  },
  {
    step: 2,
    delayMinutes: 2880,  // 48 часов
    delayLabel: '48 часов',
    subject: 'Cơ hội cuối: Phần thưởng sắp hết hạn!',
    html: '',
    config: {
      ...DEFAULT_EMAIL_CONFIG,
      titleText: 'Cơ hội cuối cùng!',
      highlightText: 'Phần thưởng của bạn sắp hết hạn',
      descriptionText: 'Đây là lần nhắc nhở cuối cùng. Đừng bỏ lỡ cơ hội nhận thưởng!',
      callToAction: 'Nhận ngay trước khi hết hạn!',
      primaryColor: '#e74c3c',
      headerBgStart: '#e74c3c',
      headerBgEnd: '#c0392b',
    },
    isExpanded: false,
    isDirty: false,
  },
  {
    step: 3,
    delayMinutes: 8640,  // 6 дней
    delayLabel: '6 дней',
    subject: 'Chúng tôi nhớ bạn! Quay lại nhận thưởng',
    html: '',
    config: {
      ...DEFAULT_EMAIL_CONFIG,
      titleText: 'Chúng tôi nhớ bạn!',
      highlightText: 'Đã lâu không gặp bạn',
      descriptionText: 'Hãy quay lại và khám phá thêm nhiều quiz thú vị với phần thưởng hấp dẫn!',
      callToAction: 'Khám phá quiz mới!',
      primaryColor: '#9b59b6',
      headerBgStart: '#9b59b6',
      headerBgEnd: '#8e44ad',
    },
    isExpanded: false,
    isDirty: false,
  },
];

// Хелпер для конвертации минут в label
export function delayMinutesToLabel(minutes: number): string {
  if (minutes < 60) return `${minutes} минут`;
  if (minutes < 1440) return `${Math.round(minutes / 60)} часов`;
  const days = Math.round(minutes / 1440);
  if (days === 1) return '1 день';
  if (days < 5) return `${days} дня`;
  return `${days} дней`;
}

// Хелпер для конвертации label в минуты
export function labelToDelayMinutes(label: string): number {
  const match = label.match(/(\d+)\s*(минут|час|день|дн)/i);
  if (!match) return 1440;
  
  const value = parseInt(match[1], 10);
  const unit = match[2].toLowerCase();
  
  if (unit.startsWith('минут')) return value;
  if (unit.startsWith('час')) return value * 60;
  if (unit.startsWith('ден') || unit.startsWith('дн')) return value * 1440;
  
  return 1440;
}

// Preset задержки
export const DELAY_PRESETS = [
  { label: '1 час', minutes: 60 },
  { label: '6 часов', minutes: 360 },
  { label: '12 часов', minutes: 720 },
  { label: '24 часа', minutes: 1440 },
  { label: '48 часов', minutes: 2880 },
  { label: '3 дня', minutes: 4320 },
  { label: '6 дней', minutes: 8640 },
  { label: '7 дней', minutes: 10080 },
];