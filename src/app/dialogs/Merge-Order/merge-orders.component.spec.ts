import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MergeOrderComponent } from './merge-orders.component';

describe('MergeOrderComponent', () => {
  let component: MergeOrderComponent;
  let fixture: ComponentFixture<MergeOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MergeOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MergeOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
