import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForexReportComponent } from './forex-report.component';

describe('ForexReportComponent', () => {
  let component: ForexReportComponent;
  let fixture: ComponentFixture<ForexReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ForexReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ForexReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
