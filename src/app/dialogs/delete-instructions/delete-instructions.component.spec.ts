import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteInstructionsComponent } from './delete-instructions.component';

describe('DeleteInstructionsComponent', () => {
  let component: DeleteInstructionsComponent;
  let fixture: ComponentFixture<DeleteInstructionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteInstructionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteInstructionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
