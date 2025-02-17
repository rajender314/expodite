import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BankDeleteComponent } from './bank-delete.component';

describe('BankDeleteComponent', () => {
  let component: BankDeleteComponent;
  let fixture: ComponentFixture<BankDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BankDeleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BankDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
