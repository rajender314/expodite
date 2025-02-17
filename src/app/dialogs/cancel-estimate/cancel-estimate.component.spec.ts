import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelEstimateComponent } from './cancel-estimate.component';

describe('CancelEstimateComponent', () => {
  let component: CancelEstimateComponent;
  let fixture: ComponentFixture<CancelEstimateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CancelEstimateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelEstimateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
