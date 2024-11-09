import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailabilityCalenderComponent } from './availability-calender.component';

describe('AvailabilityCalenderComponent', () => {
  let component: AvailabilityCalenderComponent;
  let fixture: ComponentFixture<AvailabilityCalenderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvailabilityCalenderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AvailabilityCalenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
