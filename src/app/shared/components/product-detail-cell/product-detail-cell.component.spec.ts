import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDetailCellComponent } from './product-detail-cell.component';

describe('ProductDetailCellComponent', () => {
  let component: ProductDetailCellComponent;
  let fixture: ComponentFixture<ProductDetailCellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductDetailCellComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductDetailCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
