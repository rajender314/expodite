import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationsDetailsComponent } from './organizations-details.component';

describe('OrganizationsDetailsComponent', () => {
  let component: OrganizationsDetailsComponent;
  let fixture: ComponentFixture<OrganizationsDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrganizationsDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
