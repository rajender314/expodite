import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { AddVendorDialogComponent } from "./add-vendor.component";

describe("AddVendorDialogComponent", () => {
  let component: AddVendorDialogComponent;
  let fixture: ComponentFixture<AddVendorDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddVendorDialogComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddVendorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
