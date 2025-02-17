import { ComponentFixture, TestBed } from "@angular/core/testing";

import { PODetailsComponent } from "./po-details.component";

describe("PODetailsComponent", () => {
  let component: PODetailsComponent;
  let fixture: ComponentFixture<PODetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PODetailsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PODetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
