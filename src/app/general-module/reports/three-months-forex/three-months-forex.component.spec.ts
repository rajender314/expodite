import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreeMonthsForexComponent } from './three-months-forex.component';

describe('ThreeMonthsForexComponent', () => {
  let component: ThreeMonthsForexComponent;
  let fixture: ComponentFixture<ThreeMonthsForexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThreeMonthsForexComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThreeMonthsForexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
