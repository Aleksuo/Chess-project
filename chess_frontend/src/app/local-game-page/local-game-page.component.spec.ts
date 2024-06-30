import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalGamePageComponent } from './local-game-page.component';

describe('LocalGamePageComponent', () => {
  let component: LocalGamePageComponent;
  let fixture: ComponentFixture<LocalGamePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocalGamePageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LocalGamePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
