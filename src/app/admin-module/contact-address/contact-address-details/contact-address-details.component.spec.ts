import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactAddressDetailsComponent } from './contact-address-details.component';

describe('ContactAddressDetailsComponent', () => {
  let component: ContactAddressDetailsComponent;
  let fixture: ComponentFixture<ContactAddressDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactAddressDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactAddressDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
