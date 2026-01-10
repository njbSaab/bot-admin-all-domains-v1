import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppCountdownTimerComponent } from './app-countdown-timer.component';

describe('AppCountdownTimerComponent', () => {
  let component: AppCountdownTimerComponent;
  let fixture: ComponentFixture<AppCountdownTimerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppCountdownTimerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppCountdownTimerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
