import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersDuebyClientsComponent } from './orders-dueby-clients.component';

describe('OrdersDuebyClientsComponent', () => {
  let component: OrdersDuebyClientsComponent;
  let fixture: ComponentFixture<OrdersDuebyClientsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrdersDuebyClientsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdersDuebyClientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
