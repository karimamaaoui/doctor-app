import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteSpecialityDialogComponent } from './delete-speciality-dialog.component';

describe('DeleteSpecialityDialogComponent', () => {
  let component: DeleteSpecialityDialogComponent;
  let fixture: ComponentFixture<DeleteSpecialityDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteSpecialityDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteSpecialityDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
