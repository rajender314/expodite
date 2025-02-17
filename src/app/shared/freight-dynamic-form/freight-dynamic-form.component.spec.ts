import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FreightDynamicFormComponent } from './freight-dynamic-form.component';

describe('FreightDynamicFormComponent', () => {
  let component: FreightDynamicFormComponent;
  let fixture: ComponentFixture<FreightDynamicFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FreightDynamicFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FreightDynamicFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
