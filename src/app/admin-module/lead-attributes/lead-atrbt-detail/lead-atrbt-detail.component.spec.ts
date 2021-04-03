import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadAtrbtDetailComponent } from './lead-atrbt-detail.component';

describe('LeadAtrbtDetailComponent', () => {
  let component: LeadAtrbtDetailComponent;
  let fixture: ComponentFixture<LeadAtrbtDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeadAtrbtDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadAtrbtDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
