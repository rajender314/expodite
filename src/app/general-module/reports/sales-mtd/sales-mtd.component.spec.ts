import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesMtdComponent } from './sales-mtd.component';

describe('SalesMtdComponent', () => {
  let component: SalesMtdComponent;
  let fixture: ComponentFixture<SalesMtdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesMtdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesMtdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
