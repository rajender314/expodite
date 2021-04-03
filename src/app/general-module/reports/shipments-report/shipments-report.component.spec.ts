import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipmentsReportComponent } from './shipments-report.component';

describe('ShipmentsReportComponent', () => {
  let component: ShipmentsReportComponent;
  let fixture: ComponentFixture<ShipmentsReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShipmentsReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShipmentsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
