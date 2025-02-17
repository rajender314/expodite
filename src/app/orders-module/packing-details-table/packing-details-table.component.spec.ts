import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackingDetailsTableComponent } from './packing-details-table.component';

describe('PackingDetailsTableComponent', () => {
  let component: PackingDetailsTableComponent;
  let fixture: ComponentFixture<PackingDetailsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PackingDetailsTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PackingDetailsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
