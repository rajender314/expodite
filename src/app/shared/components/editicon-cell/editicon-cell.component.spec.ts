import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditiconCellComponent } from './editicon-cell.component';

describe('EditiconCellComponent', () => {
  let component: EditiconCellComponent;
  let fixture: ComponentFixture<EditiconCellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditiconCellComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditiconCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
