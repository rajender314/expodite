import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryInfoComponent } from './inventory-info.component';

describe('InventoryInfoComponent', () => {
  let component: InventoryInfoComponent;
  let fixture: ComponentFixture<InventoryInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventoryInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
