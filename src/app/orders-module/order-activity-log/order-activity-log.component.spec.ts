import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderActivityLogComponent } from './order-activity-log.component';

describe('OrderActivityLogComponent', () => {
  let component: OrderActivityLogComponent;
  let fixture: ComponentFixture<OrderActivityLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderActivityLogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderActivityLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
