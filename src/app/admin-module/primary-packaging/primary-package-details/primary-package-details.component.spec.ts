import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrimaryPackageDetailsComponent } from './primary-package-details.component';

describe('PrimaryPackageDetailsComponent', () => {
  let component: PrimaryPackageDetailsComponent;
  let fixture: ComponentFixture<PrimaryPackageDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrimaryPackageDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrimaryPackageDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
