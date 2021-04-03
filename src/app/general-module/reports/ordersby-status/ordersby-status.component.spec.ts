import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersbyStatusComponent } from './ordersby-status.component';

describe('OrdersbyStatusComponent', () => {
  let component: OrdersbyStatusComponent;
  let fixture: ComponentFixture<OrdersbyStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrdersbyStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdersbyStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
