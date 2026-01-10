import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBtnIconComponent } from './edit-btn-icon.component';

describe('EditBtnIconComponent', () => {
  let component: EditBtnIconComponent;
  let fixture: ComponentFixture<EditBtnIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditBtnIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditBtnIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
