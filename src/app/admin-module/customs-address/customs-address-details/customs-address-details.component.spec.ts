import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomsAddressDetailsComponent } from './customs-address-details.component';

describe('CustomsAddressDetailsComponent', () => {
  let component: CustomsAddressDetailsComponent;
  let fixture: ComponentFixture<CustomsAddressDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomsAddressDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomsAddressDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
