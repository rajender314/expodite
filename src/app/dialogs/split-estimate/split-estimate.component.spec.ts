import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SplitEstimateComponent } from './split-estimate.component';

describe('CreateOrderComponent', () => {
  let component: SplitEstimateComponent;
  let fixture: ComponentFixture<SplitEstimateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SplitEstimateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SplitEstimateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
