import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogueAuthComponent } from './dialogue-auth.component';

describe('DialogueAuthComponent', () => {
  let component: DialogueAuthComponent;
  let fixture: ComponentFixture<DialogueAuthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogueAuthComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogueAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
