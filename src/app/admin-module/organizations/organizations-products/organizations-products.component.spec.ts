import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationsProductsComponent } from './organizations-products.component';

describe('OrganizationsProductsComponent', () => {
  let component: OrganizationsProductsComponent;
  let fixture: ComponentFixture<OrganizationsProductsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrganizationsProductsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationsProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
