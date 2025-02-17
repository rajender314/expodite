import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipmentPackingDetailsComponent } from './shipment-packing-details.component';

describe('ShipmentPackingDetailsComponent', () => {
  let component: ShipmentPackingDetailsComponent;
  let fixture: ComponentFixture<ShipmentPackingDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShipmentPackingDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShipmentPackingDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
