import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentDueComponent } from './payment-due.component';

describe('PaymentDueComponent', () => {
  let component: PaymentDueComponent;
  let fixture: ComponentFixture<PaymentDueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentDueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentDueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
