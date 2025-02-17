import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersShipmentDetailsComponent } from './orders-shipment-details.component';

describe('OrdersShipmentDetailsComponent', () => {
  let component: OrdersShipmentDetailsComponent;
  let fixture: ComponentFixture<OrdersShipmentDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrdersShipmentDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdersShipmentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
