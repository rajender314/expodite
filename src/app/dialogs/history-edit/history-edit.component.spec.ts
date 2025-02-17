import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryEditComponent } from './history-edit.component';

describe('HistoryEditComponent', () => {
  let component: HistoryEditComponent;
  let fixture: ComponentFixture<HistoryEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistoryEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
