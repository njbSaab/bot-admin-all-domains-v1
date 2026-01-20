// interfaces/quiz-preview.interface.ts
export interface QuizPreview {
  id: number;
  typeQuizId: string;
  name: string;
  description: string;
  descriptionAdm: string | null;
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
  landing: {
    id: number;
    url: string;
    name: string;
  };
  questionsCount: number;
  isEditing?: boolean;    
  nameAdm?: string;
  theme?: string;
  endAtLocal?: string
  landingId?: number;  
}