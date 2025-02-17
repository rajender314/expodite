import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { DescriptionUpload } from "./add-description.component";

describe("DescriptionUpload", () => {
  let component: DescriptionUpload;
  let fixture: ComponentFixture<DescriptionUpload>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DescriptionUpload],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DescriptionUpload);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
