import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstimateFilterComponent } from './estimate-filter.component';

describe('EstimateFilterComponent', () => {
  let component: EstimateFilterComponent;
  let fixture: ComponentFixture<EstimateFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EstimateFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EstimateFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
