import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorCertificationsComponent } from './vendor-certifications.component';

describe('VendorCertificationsComponent', () => {
  let component: VendorCertificationsComponent;
  let fixture: ComponentFixture<VendorCertificationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorCertificationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorCertificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
