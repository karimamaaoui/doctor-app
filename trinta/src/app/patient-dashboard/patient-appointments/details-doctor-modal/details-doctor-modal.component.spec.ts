import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsDoctorModalComponent } from './details-doctor-modal.component';

describe('DetailsDoctorModalComponent', () => {
  let component: DetailsDoctorModalComponent;
  let fixture: ComponentFixture<DetailsDoctorModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailsDoctorModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DetailsDoctorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
