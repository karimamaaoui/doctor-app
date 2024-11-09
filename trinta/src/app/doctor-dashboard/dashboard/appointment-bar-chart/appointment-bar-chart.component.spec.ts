import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentBarChartComponent } from './appointment-bar-chart.component';

describe('AppointmentBarChartComponent', () => {
  let component: AppointmentBarChartComponent;
  let fixture: ComponentFixture<AppointmentBarChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppointmentBarChartComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AppointmentBarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
