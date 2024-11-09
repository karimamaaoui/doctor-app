import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsDemandComponent } from './details-demand.component';

describe('DetailsDemandComponent', () => {
  let component: DetailsDemandComponent;
  let fixture: ComponentFixture<DetailsDemandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailsDemandComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DetailsDemandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
