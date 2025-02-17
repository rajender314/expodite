import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiveAmountComponent } from './receive-amount.component';

describe('ReceiveAmountComponent', () => {
  let component: ReceiveAmountComponent;
  let fixture: ComponentFixture<ReceiveAmountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceiveAmountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiveAmountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
