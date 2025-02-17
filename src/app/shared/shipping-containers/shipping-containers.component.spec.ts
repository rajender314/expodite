import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShippingContainersComponent } from './shipping-containers.component';

describe('ShippingContainersComponent', () => {
  let component: ShippingContainersComponent;
  let fixture: ComponentFixture<ShippingContainersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShippingContainersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShippingContainersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
