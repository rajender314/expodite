import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorDelteInstrnsComponent } from './vendor-delte-instrns.component';

describe('VendorDelteInstrnsComponent', () => {
  let component: VendorDelteInstrnsComponent;
  let fixture: ComponentFixture<VendorDelteInstrnsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorDelteInstrnsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorDelteInstrnsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
