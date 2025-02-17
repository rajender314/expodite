import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstimateSpecificationComponent } from './estimate-specification.component';

describe('EstimateSpecificationComponent', () => {
  let component: EstimateSpecificationComponent;
  let fixture: ComponentFixture<EstimateSpecificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EstimateSpecificationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EstimateSpecificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
