import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorInstructionsComponent } from './vendor-instructions.component';

describe('VendorInstructionsComponent', () => {
  let component: VendorInstructionsComponent;
  let fixture: ComponentFixture<VendorInstructionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorInstructionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorInstructionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
