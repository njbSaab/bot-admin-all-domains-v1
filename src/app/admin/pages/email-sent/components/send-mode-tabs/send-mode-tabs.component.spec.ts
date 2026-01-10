import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendModeTabsComponent } from './send-mode-tabs.component';

describe('SendModeTabsComponent', () => {
  let component: SendModeTabsComponent;
  let fixture: ComponentFixture<SendModeTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SendModeTabsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SendModeTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
