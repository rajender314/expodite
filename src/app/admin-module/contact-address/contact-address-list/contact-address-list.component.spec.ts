import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactAddressListComponent } from './contact-address-list.component';

describe('ContactAddressListComponent', () => {
  let component: ContactAddressListComponent;
  let fixture: ComponentFixture<ContactAddressListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactAddressListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactAddressListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
