import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationsContactsComponent } from './organizations-contacts.component';

describe('OrganizationsContactsComponent', () => {
  let component: OrganizationsContactsComponent;
  let fixture: ComponentFixture<OrganizationsContactsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrganizationsContactsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationsContactsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
