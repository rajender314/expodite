import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderShippingDetailsComponent } from './order-shipping-details.component';

describe('OrderShippingDetailsComponent', () => {
  let component: OrderShippingDetailsComponent;
  let fixture: ComponentFixture<OrderShippingDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderShippingDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderShippingDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
