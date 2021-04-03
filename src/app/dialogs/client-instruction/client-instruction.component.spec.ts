import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientInstructionComponent } from './client-instruction.component';

describe('ClientInstructionComponent', () => {
  let component: ClientInstructionComponent;
  let fixture: ComponentFixture<ClientInstructionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientInstructionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientInstructionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
