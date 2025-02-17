import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { CancelPoComponent } from "./cancel-po.component";

describe("CancelPoComponent", () => {
  let component: CancelPoComponent;
  let fixture: ComponentFixture<CancelPoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CancelPoComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelPoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
