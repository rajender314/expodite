import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteLineItemComponent } from './delete-line-item.component';

describe('DeleteLineItemComponent', () => {
  let component: DeleteLineItemComponent;
  let fixture: ComponentFixture<DeleteLineItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteLineItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteLineItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
