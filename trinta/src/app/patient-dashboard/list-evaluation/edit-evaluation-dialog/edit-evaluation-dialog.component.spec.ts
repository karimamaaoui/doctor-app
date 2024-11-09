import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEvaluationDialogComponent } from './edit-evaluation-dialog.component';

describe('EditEvaluationDialogComponent', () => {
  let component: EditEvaluationDialogComponent;
  let fixture: ComponentFixture<EditEvaluationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditEvaluationDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditEvaluationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
