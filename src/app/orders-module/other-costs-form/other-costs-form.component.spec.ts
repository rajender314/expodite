import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherCostsFormComponent } from './other-costs-form.component';

describe('OtherCostsFormComponent', () => {
  let component: OtherCostsFormComponent;
  let fixture: ComponentFixture<OtherCostsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OtherCostsFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OtherCostsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
