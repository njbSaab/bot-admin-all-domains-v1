import { Component, Input, Output, EventEmitter } from '@angular/core';

type SendMode = 'manual' | 'telegram' | 'site';

@Component({
  selector: 'app-send-mode-tabs',
  templateUrl: './send-mode-tabs.component.html',
  styleUrls: ['./send-mode-tabs.component.scss']
})
export class SendModeTabsComponent {
  @Input() currentMode: SendMode | null = null;
  @Input() telegramCount: number = 0;
  @Input() siteCount: number = 0;

  @Output() modeChange = new EventEmitter<SendMode>();

  setMode(mode: SendMode): void {
    this.modeChange.emit(mode);
  }

  isActive(mode: SendMode): boolean {
    return this.currentMode === mode;
  }
}