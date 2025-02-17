import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportRegisterFormComponent } from './export-register-form.component';

describe('ExportRegisterFormComponent', () => {
  let component: ExportRegisterFormComponent;
  let fixture: ComponentFixture<ExportRegisterFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExportRegisterFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportRegisterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
