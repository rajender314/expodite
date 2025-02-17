import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherOrderDetailsComponent } from './other-order-details.component';

describe('OtherOrderDetailsComponent', () => {
  let component: OtherOrderDetailsComponent;
  let fixture: ComponentFixture<OtherOrderDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OtherOrderDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OtherOrderDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
