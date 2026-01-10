import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBtnMainComponent } from './edit-btn-main.component';

describe('EditBtnMainComponent', () => {
  let component: EditBtnMainComponent;
  let fixture: ComponentFixture<EditBtnMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditBtnMainComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditBtnMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
