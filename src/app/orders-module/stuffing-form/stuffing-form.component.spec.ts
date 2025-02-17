import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StuffingFormComponent } from './stuffing-form.component';

describe('StuffingFormComponent', () => {
  let component: StuffingFormComponent;
  let fixture: ComponentFixture<StuffingFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StuffingFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StuffingFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
