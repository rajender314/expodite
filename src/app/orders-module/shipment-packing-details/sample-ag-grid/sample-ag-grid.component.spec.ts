import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SampleAgGridComponent } from './sample-ag-grid.component';

describe('SampleAgGridComponent', () => {
  let component: SampleAgGridComponent;
  let fixture: ComponentFixture<SampleAgGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SampleAgGridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SampleAgGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
