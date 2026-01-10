import { Component, Input, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { calculateCountdown, Countdown } from '../../../../../shared/utils/countdown.util';

@Component({
  selector: 'app-countdown-timer',
  template: `
    <span class="countdown font-mono text-lg text-gray-400 items-end">
      <span
        class="countdown font-mono text-2xl text-black"
        style="--value: {{ countdown.days }}"
        aria-live="polite"
      >
        {{ countdown.days }}
      </span>
      days
    </span>
    <span class="countdown font-mono text-2xl pl-2">
      <span style="--value: {{ countdown.hours }}" aria-live="polite">
        {{ countdown.hours | number: '2.0' }}
      </span>:
      <span style="--value: {{ countdown.minutes }}" aria-live="polite">
        {{ countdown.minutes | number: '2.0' }}
      </span>:
      <span style="--value: {{ countdown.seconds }}" aria-live="polite">
        {{ countdown.seconds | number: '2.0' }}
      </span>
    </span>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CountdownTimerComponent implements OnInit, OnDestroy {
  @Input({ required: true }) endAt?: string;
  @Input({ required: true }) status?: string;

  countdown: Countdown = { days: 0, hours: 0, minutes: 0, seconds: 0 };

  private intervalId: any;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.updateCountdown();
    this.intervalId = setInterval(() => {
      this.updateCountdown();
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  private updateCountdown(): void {
    // Если endAt или status не пришли — показываем 0
    if (!this.endAt || !this.status) {
      this.countdown = { days: 0, hours: 0, minutes: 0, seconds: 0 };
    } else {
      this.countdown = calculateCountdown(this.endAt, this.status);
    }
    this.cdr.markForCheck();
  }
}