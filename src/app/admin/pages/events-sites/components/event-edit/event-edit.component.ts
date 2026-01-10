import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { EventsSites } from '../../interfaces/events-sites.interface';
import { UrlValidationService } from '../../../../../shared/services/url-validation.service';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'app-event-edit',
  templateUrl: './event-edit.component.html',
  styleUrls: ['./event-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventEditComponent {
  @Input({ required: true }) event!: EventsSites;

  imageUrl = environment.auth.imageUrl;

  @Output() save = new EventEmitter<EventsSites>();
  @Output() cancel = new EventEmitter<void>();

  constructor(public urlValidationService: UrlValidationService) {}

  // Обновление превью при blur — просто триггерит change detection
  refreshImage(): void {
    // Angular сам обновит картинку благодаря ngModel
  }

  // При смене результата — можно автосохранить или просто обновить модель
  onResultChange(newResult: number | null): void {
    this.event.result = newResult;
    // Если хочешь автосохранение при выборе результата — раскомментируй:
    this.save.emit(this.event);
  }

  saveChanges(): void {
    this.save.emit(this.event);
  }

  cancelEdit(): void {
    this.cancel.emit();
  }
}