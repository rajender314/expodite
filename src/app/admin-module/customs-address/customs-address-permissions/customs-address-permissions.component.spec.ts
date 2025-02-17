import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomsAddressPermissionsComponent } from './customs-address-permissions.component';

describe('CustomsAddressPermissionsComponent', () => {
  let component: CustomsAddressPermissionsComponent;
  let fixture: ComponentFixture<CustomsAddressPermissionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomsAddressPermissionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomsAddressPermissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
