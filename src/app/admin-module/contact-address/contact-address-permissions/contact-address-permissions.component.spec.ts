import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactAddressPermissionsComponent } from './contact-address-permissions.component';

describe('ContactAddressPermissionsComponent', () => {
  let component: ContactAddressPermissionsComponent;
  let fixture: ComponentFixture<ContactAddressPermissionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactAddressPermissionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactAddressPermissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
