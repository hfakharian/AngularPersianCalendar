import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HfPersianCalendarComponent } from './hf-persian-calendar.component';

describe('HfPersianCalendarComponent', () => {
  let component: HfPersianCalendarComponent;
  let fixture: ComponentFixture<HfPersianCalendarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HfPersianCalendarComponent]
    });
    fixture = TestBed.createComponent(HfPersianCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
