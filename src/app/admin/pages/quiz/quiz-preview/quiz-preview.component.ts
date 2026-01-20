// quiz-preview.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { QuizPreview } from '../interfaces/quiz-preview.interface';

@Component({
  selector: 'app-quiz-preview',
  templateUrl: './quiz-preview.component.html',
  styleUrls: ['./quiz-preview.component.scss']
})
export class QuizPreviewComponent {
  @Input() quiz!: QuizPreview;
  @Output() onEdit = new EventEmitter<QuizPreview>(); 

  isFutureDate(dateStr: string): boolean {
    return new Date(dateStr).getTime() > Date.now();
  }
}