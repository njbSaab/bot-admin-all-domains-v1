import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { NewEvent } from '../../types/new-event.type';
import { UrlValidationService } from '../../../../../shared/services/url-validation.service';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'app-event-create',
  templateUrl: './event-create.component.html',
  styleUrls: ['./event-create.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventCreateComponent {
  @Input({ required: true }) newEvent!: NewEvent;
  @Input({ required: true }) sports: string[] = [];
  @Input({ required: true }) sportBackgrounds: any = {};
  @Input({ required: true }) landingUrl!: string | null;
  @Input({ required: true }) hasActiveEvent: boolean = false;

  imageUrl = environment.auth.imageUrl;

  @Output() sportChange = new EventEmitter<void>();
  @Output() create = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  constructor(public urlValidationService: UrlValidationService) {}

  // Этот метод вызывается из шаблона
  onSportChange(): void {
    this.sportChange.emit();
  }

  refreshImage(): void {
    // Просто для обновления превью
  }

  get isCreateDisabled(): boolean {
    return !this.newEvent.name ||
      !this.sports.includes(this.newEvent.name) ||
      !this.newEvent.type ||
      !this.newEvent.endAt ||
      !this.newEvent.memberA ||
      !this.newEvent.memberB ||
      !this.landingUrl ||
      (this.newEvent.imageMemberA && !this.urlValidationService.isValidImageUrl(this.newEvent.imageMemberA)) ||
      (this.newEvent.imageMemberB && !this.urlValidationService.isValidImageUrl(this.newEvent.imageMemberB)) ||
      this.hasActiveEvent;
  }

  // Эти методы вызываются из шаблона
  onCreate(): void {
    this.create.emit(); // ← правильно emit'им событие
  }

  onCancel(): void {
    this.cancel.emit();
  }
}