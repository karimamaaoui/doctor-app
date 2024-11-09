import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToDoAppointmentComponent } from './to-do-appointment.component';

describe('ToDoAppointmentComponent', () => {
  let component: ToDoAppointmentComponent;
  let fixture: ComponentFixture<ToDoAppointmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToDoAppointmentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ToDoAppointmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
