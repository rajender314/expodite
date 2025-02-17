import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgCustomHeaderComponent } from './ag-custom-header.component';

describe('AgCustomHeaderComponent', () => {
  let component: AgCustomHeaderComponent;
  let fixture: ComponentFixture<AgCustomHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgCustomHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgCustomHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
