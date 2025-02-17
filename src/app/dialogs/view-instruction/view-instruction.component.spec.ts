import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewInstructionComponent } from './view-instruction.component';

describe('ViewInstructionComponent', () => {
  let component: ViewInstructionComponent;
  let fixture: ComponentFixture<ViewInstructionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewInstructionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewInstructionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
