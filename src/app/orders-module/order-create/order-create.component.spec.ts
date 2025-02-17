import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersCreateComponent } from './order-create.component';
import { MatAutocomplete } from '@angular/material/autocomplete';

describe('OrdersCreateComponent', () => {
  let component: OrdersCreateComponent;
  let fixture: ComponentFixture<OrdersCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrdersCreateComponent, MatAutocomplete ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdersCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
