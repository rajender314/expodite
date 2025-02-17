import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmountHistoryComponent } from './amount-history.component';

describe('AmountHistoryComponent', () => {
  let component: AmountHistoryComponent;
  let fixture: ComponentFixture<AmountHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmountHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmountHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
