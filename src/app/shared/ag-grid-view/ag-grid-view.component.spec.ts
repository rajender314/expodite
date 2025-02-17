import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgGridViewComponent } from './ag-grid-view.component';

describe('AgGridViewComponent', () => {
  let component: AgGridViewComponent;
  let fixture: ComponentFixture<AgGridViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgGridViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgGridViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
