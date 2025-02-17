import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CHALetterComponent } from './cha-letter.component';

describe('CHALetterComponent', () => {
  let component: CHALetterComponent;
  let fixture: ComponentFixture<CHALetterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CHALetterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CHALetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
