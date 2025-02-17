import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FircReportsComponent } from './firc-reports.component';

describe('FircReportsComponent', () => {
  let component: FircReportsComponent;
  let fixture: ComponentFixture<FircReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FircReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FircReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
