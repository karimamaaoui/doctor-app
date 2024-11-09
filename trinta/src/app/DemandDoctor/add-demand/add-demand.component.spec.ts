import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDemandComponent } from './add-demand.component';

describe('AddDemandComponent', () => {
  let component: AddDemandComponent;
  let fixture: ComponentFixture<AddDemandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddDemandComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddDemandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
