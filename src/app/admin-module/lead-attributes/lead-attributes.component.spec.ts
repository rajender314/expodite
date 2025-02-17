import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadAttributesComponent } from './lead-attributes.component';

describe('LeadAttributesComponent', () => {
  let component: LeadAttributesComponent;
  let fixture: ComponentFixture<LeadAttributesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeadAttributesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadAttributesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
