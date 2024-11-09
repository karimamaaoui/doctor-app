import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSpecialityDialogComponent } from './edit-speciality-dialog.component';

describe('EditSpecialityDialogComponent', () => {
  let component: EditSpecialityDialogComponent;
  let fixture: ComponentFixture<EditSpecialityDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditSpecialityDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditSpecialityDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
