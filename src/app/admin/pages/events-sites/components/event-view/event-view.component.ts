import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef, OnChanges, SimpleChanges } from '@angular/core';
import { EventsSites } from '../../interfaces/events-sites.interface';

@Component({
  selector: 'app-event-view',
  templateUrl: './event-view.component.html',
  styleUrls: ['./event-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventViewComponent {
  @Input({ required: true }) event!: EventsSites;

  @Output() edit = new EventEmitter<void>();

  constructor() {} // можно даже убрать cdr

  onEdit(): void {
    this.edit.emit();
  }
}