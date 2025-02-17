import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewOrderCreateComponent } from './new-order-create.component';

describe('NewOrderCreateComponent', () => {
  let component: NewOrderCreateComponent;
  let fixture: ComponentFixture<NewOrderCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewOrderCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewOrderCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
