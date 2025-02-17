import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenPackageGridComponent } from './open-package-grid.component';

describe('OpenPackageGridComponent', () => {
  let component: OpenPackageGridComponent;
  let fixture: ComponentFixture<OpenPackageGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpenPackageGridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenPackageGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
