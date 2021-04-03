import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryMergeComponent } from './inventory-merge.component';

describe('InventoryMergeComponent', () => {
  let component: InventoryMergeComponent;
  let fixture: ComponentFixture<InventoryMergeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventoryMergeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryMergeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
