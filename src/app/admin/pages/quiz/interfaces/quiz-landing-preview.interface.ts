// interfaces/quiz-landing-preview.interface.ts
export interface QuizLandingPreview {
  id: number;
  name: string;        
  url: string;
  status?: string;
  createdAt?: string;
  quizCount?: number;
}