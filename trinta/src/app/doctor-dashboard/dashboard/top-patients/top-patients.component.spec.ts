import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopPatientsComponent } from './top-patients.component';

describe('TopPatientsComponent', () => {
  let component: TopPatientsComponent;
  let fixture: ComponentFixture<TopPatientsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopPatientsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TopPatientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
