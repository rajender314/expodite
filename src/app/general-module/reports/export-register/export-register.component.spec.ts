import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportRegisterComponent } from './export-register.component';

describe('ExportRegisterComponent', () => {
  let component: ExportRegisterComponent;
  let fixture: ComponentFixture<ExportRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExportRegisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
