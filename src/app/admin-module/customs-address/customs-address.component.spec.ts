import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomsAddressComponent } from './customs-address.component';

describe('CustomsAddressComponent', () => {
  let component: CustomsAddressComponent;
  let fixture: ComponentFixture<CustomsAddressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomsAddressComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomsAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
