import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAutoAttibuteComponent } from './add-auto-attibute.component';

describe('AddAutoAttibuteComponent', () => {
  let component: AddAutoAttibuteComponent;
  let fixture: ComponentFixture<AddAutoAttibuteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddAutoAttibuteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAutoAttibuteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
