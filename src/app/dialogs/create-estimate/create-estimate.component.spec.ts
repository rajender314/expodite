import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEstimateComponent } from './create-estimate.component';

describe('CreateOrderComponent', () => {
  let component: CreateEstimateComponent;
  let fixture: ComponentFixture<CreateEstimateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateEstimateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEstimateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
