import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DutydrawbackReportComponent } from './dutydrawback-report.component';

describe('DutydrawbackReportComponent', () => {
  let component: DutydrawbackReportComponent;
  let fixture: ComponentFixture<DutydrawbackReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DutydrawbackReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DutydrawbackReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
