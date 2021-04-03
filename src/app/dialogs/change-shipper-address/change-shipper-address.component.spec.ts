import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeShipperAddressComponent } from './change-shipper-address.component';

describe('ChangeShipperAddressComponent', () => {
  let component: ChangeShipperAddressComponent;
  let fixture: ComponentFixture<ChangeShipperAddressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeShipperAddressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeShipperAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
