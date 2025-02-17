import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstimatePaymentsComponent } from './estimate-payments.component';

describe('EstimatePaymentsComponent', () => {
  let component: EstimatePaymentsComponent;
  let fixture: ComponentFixture<EstimatePaymentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EstimatePaymentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EstimatePaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
