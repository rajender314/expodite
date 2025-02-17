import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomsAddressListComponent } from './customs-address-list.component';

describe('CustomsAddressListComponent', () => {
  let component: CustomsAddressListComponent;
  let fixture: ComponentFixture<CustomsAddressListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomsAddressListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomsAddressListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
