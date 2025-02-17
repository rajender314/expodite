import { ComponentFixture, TestBed } from "@angular/core/testing";

import { MatAutocomplete } from "@angular/material/autocomplete";
import { POCreateComponent } from "./po-create.component";

describe("POCreateComponent", () => {
  let component: POCreateComponent;
  let fixture: ComponentFixture<POCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [POCreateComponent, MatAutocomplete],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(POCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
