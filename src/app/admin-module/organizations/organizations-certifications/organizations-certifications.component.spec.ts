import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationsCertificationsComponent } from './organizations-certifications.component';

describe('OrganizationsCertificationsComponent', () => {
  let component: OrganizationsCertificationsComponent;
  let fixture: ComponentFixture<OrganizationsCertificationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrganizationsCertificationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationsCertificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
