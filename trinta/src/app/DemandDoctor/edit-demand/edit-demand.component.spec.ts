import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDemandComponent } from './edit-demand.component';

describe('EditDemandComponent', () => {
  let component: EditDemandComponent;
  let fixture: ComponentFixture<EditDemandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditDemandComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditDemandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
