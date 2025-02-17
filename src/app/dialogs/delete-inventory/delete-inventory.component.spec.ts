import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteInventoryComponent } from './delete-inventory.component';

describe('DeleteInventoryComponent', () => {
  let component: DeleteInventoryComponent;
  let fixture: ComponentFixture<DeleteInventoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteInventoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
