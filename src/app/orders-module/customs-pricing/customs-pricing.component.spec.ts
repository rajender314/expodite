import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomsPricingComponent } from './customs-pricing.component';

describe('CustomsPricingComponent', () => {
  let component: CustomsPricingComponent;
  let fixture: ComponentFixture<CustomsPricingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomsPricingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomsPricingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
