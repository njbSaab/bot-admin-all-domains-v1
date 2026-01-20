export interface QuizAnswer {
  text: string;
  isCorrect?: boolean;
  weight?: number;
  points?: number;
}

export interface QuizQuestion {
  id: number;
  text: string;
  image?: string;
  answers: QuizAnswer[];
  points?: number;
  timeLimit?: number;
}

// Интерфейс для отправки на сервер (questions — строка JSON)
// src/app/admin/pages/quiz/interfaces/quiz-form.interface.ts
export interface QuizServerPayload extends Omit<QuizFormData, 'questions'> {
  questions: QuizQuestion[];  // ← массив, а не строка!
}

// Тип с сервера (questions — строка)
export interface QuizServerData {
  id: number;
  typeQuizId: string;
  name: string;
  nameAdm: string | null;
  description: string;
  descriptionAdm: string | null;
  theme: string | null;
  isActive: boolean;
  endAt: string;
  questions: string;              // ← строка JSON
  quizInfo: string | null;
  result: string | null;
  resultsStats: string | null;
  imageBgDesk: string | null;
  imageBgMob: string | null;
  imageHero: string | null;
  grandPrize: string | null;
  prizeForEveryOne: string | null;
  type: 'byScore' | 'byWeight';
  status: 'active' | 'inactive';
  geo: string;
  createdAt: string;
  rating: number;
  landingId: number;
}

// Тип для формы (questions — массив)
export interface QuizFormData {
  id?: number;
  typeQuizId: string;
  name: string;
  nameAdm?: string | null;
  description?: string;
  descriptionAdm?: string | null;
  theme?: string | null;
  isActive: boolean;
  endAt: string;
  questions: QuizQuestion[];      // ← массив!
  quizInfo?: string | null;
  result?: string | null;
  resultsStats?: string | null;
  imageBgDesk?: string | null;
  imageBgMob?: string | null;
  imageHero?: string | null;
  grandPrize?: string | null;
  prizeForEveryOne?: string | null;
  type: 'byScore' | 'byWeight';
  status: 'active' | 'inactive';
  geo: string;
  rating: number;
  landingId: number;
}
