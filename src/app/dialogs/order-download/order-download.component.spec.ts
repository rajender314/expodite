import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderDownloadComponent } from './order-download.component';

describe('OrderDownloadComponent', () => {
  let component: OrderDownloadComponent;
  let fixture: ComponentFixture<OrderDownloadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderDownloadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
