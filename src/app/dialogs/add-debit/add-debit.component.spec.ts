import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDebitComponent } from './add-debit.component';

describe('AddDebitComponent', () => {
  let component: AddDebitComponent;
  let fixture: ComponentFixture<AddDebitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddDebitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDebitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
