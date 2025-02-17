import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewLayoutOrderDetailsComponent } from './new-layout-order-details.component';

describe('NewLayoutOrderDetailsComponent', () => {
  let component: NewLayoutOrderDetailsComponent;
  let fixture: ComponentFixture<NewLayoutOrderDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewLayoutOrderDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewLayoutOrderDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
