import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsurancePercentageComponent } from './insurance-percentage.component';

describe('InsurancePercentageComponent', () => {
  let component: InsurancePercentageComponent;
  let fixture: ComponentFixture<InsurancePercentageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsurancePercentageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsurancePercentageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
