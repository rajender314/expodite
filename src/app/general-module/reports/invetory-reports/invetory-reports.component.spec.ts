import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvetoryReportsComponent } from './invetory-reports.component';

describe('InvetoryReportsComponent', () => {
  let component: InvetoryReportsComponent;
  let fixture: ComponentFixture<InvetoryReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvetoryReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvetoryReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
