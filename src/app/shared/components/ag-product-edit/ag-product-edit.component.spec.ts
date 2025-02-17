import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgProductEditComponent } from './ag-product-edit.component';

describe('AgProductEditComponent', () => {
  let component: AgProductEditComponent;
  let fixture: ComponentFixture<AgProductEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgProductEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgProductEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
