import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorclientProductsComponent } from './vendorclient-products.component';

describe('VendorclientProductsComponent', () => {
  let component: VendorclientProductsComponent;
  let fixture: ComponentFixture<VendorclientProductsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorclientProductsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorclientProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
