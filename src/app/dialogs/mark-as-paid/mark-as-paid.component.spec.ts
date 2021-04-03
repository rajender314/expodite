import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkAsPaidComponent } from './mark-as-paid.component';

describe('MarkAsPaidComponent', () => {
  let component: MarkAsPaidComponent;
  let fixture: ComponentFixture<MarkAsPaidComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarkAsPaidComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarkAsPaidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
