import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShippingBillFormComponent } from './shipping-bill-form.component';

describe('ShippingBillFormComponent', () => {
  let component: ShippingBillFormComponent;
  let fixture: ComponentFixture<ShippingBillFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShippingBillFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShippingBillFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
