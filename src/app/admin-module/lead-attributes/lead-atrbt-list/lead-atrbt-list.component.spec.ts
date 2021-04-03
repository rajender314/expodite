import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadAtrbtListComponent } from './lead-atrbt-list.component';

describe('LeadAtrbtListComponent', () => {
  let component: LeadAtrbtListComponent;
  let fixture: ComponentFixture<LeadAtrbtListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeadAtrbtListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadAtrbtListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
