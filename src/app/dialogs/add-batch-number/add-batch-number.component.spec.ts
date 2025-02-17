import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBatchNumberComponent } from './add-batch-number.component';

describe('AddBatchNumberComponent', () => {
  let component: AddBatchNumberComponent;
  let fixture: ComponentFixture<AddBatchNumberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddBatchNumberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBatchNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
